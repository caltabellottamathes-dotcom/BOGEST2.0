import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * Returns recent Instagram posts. Tries the synced InstagramPost entity first
 * — the daily sync (syncInstagramPosts, via the facebook_pages connector)
 * pulls media for ALL three linked Bogèst Instagram Business accounts and tags
 * each by location, so a single call returns posts from every account. The
 * optional `location` param filters to one vestiging. Falls back to the live
 * single connected Instagram account if the entity is empty.
 *
 * Response: { username, posts: [{ id, caption, media_url, permalink, timestamp, media_type, location }] }
 */
const LOCATION_MAP = [
  { match: ['borgloon'], location: 'borgloon' },
  { match: ['heusden', 'zolder'], location: 'heusden-zolder' },
  { match: ['hasselt'], location: 'hasselt' },
];

function locationFromUsername(name) {
  const lower = (name || '').toLowerCase();
  for (const entry of LOCATION_MAP) {
    if (entry.match.some((m) => lower.includes(m))) return entry.location;
  }
  return 'hasselt';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let location = '';
    try {
      const body = await req.json().catch(() => ({}));
      location = String(body?.location || '').toLowerCase();
    } catch {
      /* no body — return all */
    }

    // 1. Synced entity — covers all three accounts
    try {
      const filter = location ? { location_name: location } : {};
      const posts = await base44.asServiceRole.entities.InstagramPost.filter(filter, '-posted_at', 30);
      if (posts && posts.length) {
        return Response.json({
          username: posts[0].username || '',
          posts: posts.map((p) => ({
            id: p.instagram_id || p.id,
            caption: p.caption || '',
            media_url: p.media_url || '',
            permalink: p.permalink || '',
            timestamp: p.posted_at || '',
            media_type: p.media_type || 'IMAGE',
            location: p.location_name || '',
          })),
        });
      }
    } catch {
      /* entity read failed — fall through to live */
    }

    // 2. Fallback: live single connected Instagram account
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    if (!accessToken) {
      return Response.json({ error: 'Instagram not connected' }, { status: 400 });
    }

    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    const me = await meRes.json();
    if (!me.id) {
      return Response.json({ error: 'Failed to resolve Instagram user', details: me }, { status: 500 });
    }

    const mediaRes = await fetch(
      `https://graph.instagram.com/${me.id}/media?fields=id,caption,media_url,permalink,timestamp,media_type&limit=12&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();

    const loc = locationFromUsername(me.username);
    const posts = (mediaData.data || [])
      .map((p) => ({
        id: p.id,
        caption: p.caption || '',
        media_url: p.media_url || '',
        permalink: p.permalink || '',
        timestamp: p.timestamp || '',
        media_type: p.media_type || 'IMAGE',
        location: loc,
      }))
      .filter((p) => p.media_url && p.media_type !== 'VIDEO');

    return Response.json({ username: me.username || '', posts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});