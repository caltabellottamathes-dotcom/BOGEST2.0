import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { isOpenNow, nextOpenDay, LOCATIONS } from '../../shared/bogestData.ts';

// Context Engine (Section 4.1) — aggregates a real-time snapshot the agent
// reasons over: visitor profile, recent events, location open-state.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action = 'getSnapshot', visitor_id, location } = body;

    if (action !== 'getSnapshot') {
      return Response.json({ error: 'unknown_action', actions: ['getSnapshot'] }, { status: 400 });
    }

    const snapshot = {
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }),
      day: new Date().toLocaleDateString('nl-BE', { weekday: 'long' }),
      location: null,
      profile: null,
      recentEvents: [],
    };

    if (visitor_id) {
      const p = await base44.asServiceRole.entities.VisitorProfile.filter({ visitor_id });
      snapshot.profile = p && p[0] ? p[0] : null;
      const ev = await base44.asServiceRole.entities.EventLog.filter({ visitor_id }, '-timestamp', 5);
      snapshot.recentEvents = (ev || []).map((e) => ({ type: e.event_type, domain: e.domain, timestamp: e.timestamp }));
    }

    const loc = location || (snapshot.profile && snapshot.profile.preferred_location) || 'hasselt';
    if (LOCATIONS[loc]) {
      snapshot.location = {
        key: loc,
        name: LOCATIONS[loc].name,
        openNow: isOpenNow(loc),
        nextOpen: nextOpenDay(loc),
      };
    }

    return Response.json({ snapshot });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}