import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * Returns recent Instagram posts (photos) from the connected Bogèst
 * Instagram Business account, using the Instagram Graph API
 * (graph.instagram.com). The connected account's OAuth token is retrieved via
 * the `instagram` shared connector.
 *
 * Response: { username, posts: [{ id, caption, media_url, permalink, timestamp, media_type }] }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('instagram');
    if (!accessToken) {
      return Response.json({ error: 'Instagram not connected' }, { status: 400 });
    }

    // Resolve the connected user's id + username
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );
    const me = await meRes.json();
    if (!me.id) {
      return Response.json({ error: 'Failed to resolve Instagram user', details: me }, { status: 500 });
    }

    // Fetch recent media
    const mediaRes = await fetch(
      `https://graph.instagram.com/${me.id}/media?fields=id,caption,media_url,permalink,timestamp,media_type&limit=12&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();

    const posts = (mediaData.data || [])
      .map((p) => ({
        id: p.id,
        caption: p.caption || '',
        media_url: p.media_url || '',
        permalink: p.permalink || '',
        timestamp: p.timestamp || '',
        media_type: p.media_type || 'IMAGE',
      }))
      // Only show image / carousel media in the chat (skip raw video files)
      .filter((p) => p.media_url && p.media_type !== 'VIDEO');

    return Response.json({ username: me.username || '', posts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});