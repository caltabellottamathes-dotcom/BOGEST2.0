import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const LOCATION_MAP = [
  { match: ['borgloon'], location: 'borgloon' },
  { match: ['heusden', 'zolder'], location: 'heusden-zolder' },
  { match: ['hasselt'], location: 'hasselt' },
];

function locationFromName(name) {
  const lower = (name || '').toLowerCase();
  for (const entry of LOCATION_MAP) {
    if (entry.match.some(m => lower.includes(m))) return entry.location;
  }
  return 'hasselt';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get Facebook Pages connection — one OAuth covers all managed Pages
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');
    if (!accessToken) {
      return Response.json({ error: 'Facebook Pages not connected' }, { status: 400 });
    }

    // List all managed Pages with their linked Instagram Business account
    const accountsRes = await fetch(
      `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&limit=100&access_token=${accessToken}`
    );
    const accountsData = await accountsRes.json();

    if (!accountsData.data) {
      return Response.json({ error: 'Failed to list pages', details: accountsData }, { status: 500 });
    }

    const results = [];
    let totalNew = 0;

    for (const page of accountsData.data) {
      const ig = page.instagram_business_account;
      if (!ig || !ig.id) {
        results.push({ page: page.name, skipped: 'no instagram business account' });
        continue;
      }

      const location = locationFromName(ig.username || page.name);
      const pageToken = page.access_token;

      // Fetch recent media for this Instagram Business account
      const mediaRes = await fetch(
        `https://graph.facebook.com/v25.0/${ig.id}/media?fields=id,caption,media_url,permalink,timestamp,media_type&limit=25&access_token=${pageToken}`
      );
      const mediaData = await mediaRes.json();

      if (!mediaData.data) {
        results.push({ page: page.name, username: ig.username, error: mediaData });
        continue;
      }

      let newCount = 0;
      for (const item of mediaData.data) {
        const existing = await base44.asServiceRole.entities.InstagramPost.filter({ instagram_id: item.id });
        if (existing.length === 0) {
          await base44.asServiceRole.entities.InstagramPost.create({
            caption: item.caption || '',
            media_url: item.media_url || '',
            permalink: item.permalink || '',
            username: ig.username || '',
            location_name: location,
            media_type: item.media_type || 'IMAGE',
            posted_at: item.timestamp,
            instagram_id: item.id,
          });
          newCount++;
        }
      }

      totalNew += newCount;
      results.push({
        page: page.name,
        username: ig.username,
        location,
        total: mediaData.data.length,
        new: newCount,
      });
    }

    return Response.json({ success: true, pages: results, totalNew });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});