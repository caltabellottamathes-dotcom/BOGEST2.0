import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

/**
 * Returns recent Facebook Page posts for the three Bogèst pages, using the
 * facebook_pages shared connector. One OAuth connection covers every Page the
 * builder manages — so all three Bogèst pages are fetched from a single token.
 *
 * Response: { pages: [{ location, name, page_url, posts: [{ id, message, image, permalink, created_time }] }] }
 */
const LOCATION_MAP = [
  { match: ['borgloon'], location: 'borgloon' },
  { match: ['heusden', 'zolder'], location: 'heusden-zolder' },
  { match: ['hasselt'], location: 'hasselt' },
];

const PAGE_URLS = {
  hasselt: 'https://www.facebook.com/bogesthasselt',
  borgloon: 'https://www.facebook.com/bogestborgloon',
  'heusden-zolder': 'https://www.facebook.com/bogestheusdenzolder',
};

function locationFromName(name) {
  const lower = (name || '').toLowerCase();
  for (const entry of LOCATION_MAP) {
    if (entry.match.some((m) => lower.includes(m))) return entry.location;
  }
  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');
    if (!accessToken) {
      return Response.json({ error: 'Facebook Pages not connected' }, { status: 400 });
    }

    const accountsRes = await fetch(
      `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token&limit=100&access_token=${accessToken}`
    );
    const accountsData = await accountsRes.json();
    if (!accountsData.data) {
      return Response.json({ error: 'Failed to list pages', details: accountsData }, { status: 500 });
    }

    const pages = (accountsData.data || [])
      .map((p) => ({ ...p, location: locationFromName(p.name) }))
      .filter((p) => p.location);

    const results = [];
    for (const page of pages) {
      const postsRes = await fetch(
        `https://graph.facebook.com/v25.0/${page.id}/posts?fields=id,message,full_picture,permalink_url,created_time&limit=12&access_token=${page.access_token}`
      );
      const postsData = await postsRes.json();
      const posts = (postsData.data || [])
        .map((p) => ({
          id: p.id,
          message: p.message || '',
          image: p.full_picture || '',
          permalink: p.permalink_url || '',
          created_time: p.created_time || '',
        }))
        .filter((p) => p.image || p.message);
      results.push({
        location: page.location,
        name: page.name,
        page_url: PAGE_URLS[page.location] || `https://www.facebook.com/${page.id}`,
        posts,
      });
    }

    return Response.json({ pages: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});