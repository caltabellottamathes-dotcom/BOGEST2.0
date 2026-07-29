import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';
import { LOCATIONS, isOpenNow, nextOpenDay, hoursSummary } from '../../shared/bogestData.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, visitor_id } = body;

    logEvent(base44, { type: 'business.queried', domain: 'business', payload: { action }, visitorId: visitor_id, source: 'tool' });

    if (action === 'getOpeningHours') {
      const { location } = body;
      const loc = LOCATIONS[location];
      if (!loc) return Response.json({ error: 'unknown_location', locations: Object.keys(LOCATIONS) }, { status: 400 });
      const hs = hoursSummary(location);
      return Response.json({
        location,
        name: loc.name,
        address: loc.address,
        phone: loc.phone,
        hours: hs.summary,
        sundayLunch: hs.sundayLunch,
        openNow: isOpenNow(location),
        nextOpen: nextOpenDay(location),
        zenchefLink: loc.zenchefLink,
        uiAction: `openReservation|${location}`,
      });
    }

    if (action === 'getEvents') {
      // Events are managed per-location; no event entity yet — return a stable placeholder
      return Response.json({ events: [], note: 'Voor speciale events en seizoensacties, contacteer de vestiging.' });
    }

    if (action === 'getReviews') {
      const { location, limit = 6 } = body;
      const reviews = base44.asServiceRole.entities.ZenchefReview;
      const list = location
        ? await reviews.filter({ location }, '-date', limit)
        : await reviews.list('-date', limit);
      const arr = list || [];
      const avg = arr.length ? Math.round((arr.reduce((s, r) => s + (r.rating || 0), 0) / arr.length) * 10) / 10 : null;
      return Response.json({
        location: location || 'all',
        averageRating: avg,
        count: arr.length,
        reviews: arr.map((r) => ({ author_name: r.author_name, rating: r.rating, title: r.title, text: r.text, date: r.date })),
        uiAction: location ? `displayReviews|${location}` : 'displayReviews',
      });
    }

    return Response.json({ error: 'unknown_action', actions: ['getOpeningHours', 'getEvents', 'getReviews'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}