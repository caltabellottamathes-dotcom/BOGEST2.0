import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const RESTAURANTS = [
  { zenchefId: '368482', location: 'hasselt' },
  { zenchefId: '368313', location: 'borgloon' },
  { zenchefId: '368311', location: 'heusden-zolder' },
];

// Formitable is the original API domain (Zenchef rebranded from Formitable)
const API_BASE = 'https://api.formitable.com/api/v1.2';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const apiKey = Deno.env.get('ZENCHEF_API_KEY');

    if (!apiKey) {
      return Response.json({ error: 'ZENCHEF_API_KEY not set' }, { status: 500 });
    }

    // List available restaurants to get their UIDs
    const listRes = await fetch(`${API_BASE}/restaurants`, {
      headers: { 'ApiKey': apiKey, 'Accept': 'application/json' },
    });

    if (!listRes.ok) {
      const errBody = await listRes.text().catch(() => '');
      return Response.json({
        error: `Zenchef API returned ${listRes.status}`,
        details: errBody.slice(0, 300),
        hint: 'Ensure ZENCHEF_API_KEY is a valid REST API key from Zenchef Settings > Team',
      }, { status: 500 });
    }

    const listData = await listRes.json();
    const apiRestaurants = Array.isArray(listData) ? listData : (listData.restaurants || listData.data || listData.value || []);

    // Match API restaurants to our locations by name or ID
    const locationMap = {};
    for (const r of apiRestaurants) {
      const name = (r.name || '').toLowerCase();
      const uid = r.uid || r.id;
      if (name.includes('hasselt')) locationMap['hasselt'] = uid;
      else if (name.includes('borgloon') || name.includes('loon')) locationMap['borgloon'] = uid;
      else if (name.includes('zolder') || name.includes('heusden')) locationMap['heusden-zolder'] = uid;
    }

    // If we couldn't match by name, try using the booking widget IDs directly as UIDs
    for (const restaurant of RESTAURANTS) {
      if (!locationMap[restaurant.location]) {
        locationMap[restaurant.location] = restaurant.zenchefId;
      }
    }

    const results = [];
    let totalNew = 0;

    for (const [location, uid] of Object.entries(locationMap)) {
      try {
        // Build date range: last 3 years to now
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 3);
        const fmt = (d) => d.toISOString().slice(0, 10);

        // Use the review endpoint with date range
        const reviewRes = await fetch(
          `${apiBase}/${uid}/review/${fmt(startDate)}/${fmt(endDate)}/0/250`,
          {
            headers: {
              'ApiKey': apiKey,
              'Accept': 'application/json',
            },
          }
        );

        if (!reviewRes.ok) {
          // Fallback: try the restaurants/{uid}/reviews endpoint
          const altRes = await fetch(
            `${apiBase}/restaurants/${uid}/reviews`,
            {
              headers: {
                'ApiKey': apiKey,
                'Accept': 'application/json',
              },
            }
          );

          if (!altRes.ok) {
            results.push({
              location,
              uid,
              error: `API returned ${reviewRes.status} / ${altRes.status}`,
            });
            continue;
          }

          const altData = await altRes.json();
          const reviews = Array.isArray(altData) ? altData : (altData.reviews || altData.data || altData.value || []);
          const count = await processReviews(base44, reviews, location);
          totalNew += count;
          results.push({ location, uid, total: reviews.length, new: count });
          continue;
        }

        const reviewData = await reviewRes.json();
        const reviews = Array.isArray(reviewData) ? reviewData : (reviewData.reviews || reviewData.data || reviewData.value || []);

        const count = await processReviews(base44, reviews, location);
        totalNew += count;
        results.push({ location, uid, total: reviews.length, new: count });
      } catch (err) {
        results.push({ location, uid, error: err.message });
      }
    }

    return Response.json({ success: true, apiBase: API_BASE, apiRestaurants: apiRestaurants.map(r => ({ uid: r.uid || r.id, name: r.name })), locationMap, results, totalNew });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function processReviews(base44, reviews, location) {
  let newCount = 0;
  for (const review of reviews) {
    const reviewId = String(review.uid || review.id || review.reviewId || review.review_id || '');
    if (!reviewId) continue;

    // Check if review already exists
    const existing = await base44.asServiceRole.entities.ZenchefReview.filter({ review_id: reviewId });
    if (existing.length > 0) continue;

    const rating = review.rating ?? review.score ?? review.stars ?? review.overallRating ?? 5;
    const authorName = review.authorName || review.name || review.author || review.guestName || review.customerName || 'Anoniem';
    const text = review.text || review.comment || review.message || review.description || review.body || '';
    const title = review.title || review.subject || '';
    const date = review.date || review.createdAt || review.created || review.submittedAt || new Date().toISOString();

    await base44.asServiceRole.entities.ZenchefReview.create({
      author_name: authorName,
      rating: Number(rating) || 5,
      text: text,
      title: title,
      date: date,
      location: location,
      source: 'Zenchef',
      review_id: reviewId,
    });
    newCount++;
  }
  return newCount;
}