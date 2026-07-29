import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';
import { LOCATIONS, isOpenNow, nextOpenDay } from '../../shared/bogestData.ts';
import { suggestLocation } from '../../shared/recommendationEngine.ts';

// Reservation tools (Section 2.3) — location suggestion, availability check
// (open-state + ZenChef link) and reservation creation (stored locally +
// routed to ZenChef for confirmation).

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, visitor_id } = body;

    logEvent(base44, { type: 'reservation.tool', domain: 'reservation', payload: { action }, visitorId: visitor_id, source: 'tool' });

    if (action === 'suggestLocation') {
      const { partySize, occasion, weather, sundayLunch } = body;
      const result = suggestLocation({ partySize, occasion, weather, sundayLunch });
      const loc = LOCATIONS[result.location];
      return Response.json({
        location: result.location,
        name: loc.name,
        reason: loc.atmosphere,
        zenchefLink: loc.zenchefLink,
        uiAction: `openReservation|${result.location}`,
      });
    }

    if (action === 'checkAvailability') {
      const { location, date } = body;
      const loc = LOCATIONS[location];
      if (!loc) return Response.json({ error: 'unknown_location' }, { status: 400 });
      const target = date ? new Date(date) : new Date();
      const open = isOpenNow(location, target);
      return Response.json({
        location,
        date: target.toISOString().slice(0, 10),
        openNow: open,
        nextOpen: open ? null : nextOpenDay(location, target),
        zenchefLink: loc.zenchefLink,
        note: open ? 'Live beschikbaarheid via de reservatieknop.' : 'Geen live beschikbaarheid — check via de link of bel de vestiging.',
      });
    }

    if (action === 'create') {
      const { name, email, phone, location, date, time, guests, notes, allergies } = body;
      if (!name || !email || !phone || !location || !date || !time || !guests) {
        return Response.json({ error: 'missing_fields', required: ['name', 'email', 'phone', 'location', 'date', 'time', 'guests'] }, { status: 400 });
      }
      const loc = LOCATIONS[location];
      if (!loc) return Response.json({ error: 'unknown_location' }, { status: 400 });

      const reservation = await base44.asServiceRole.entities.Reservation.create({
        name, email, phone, location, date, time, guests: Number(guests), notes: notes || '', allergies: allergies || '', status: 'pending',
      });
      logEvent(base44, { type: 'reservation.created', domain: 'reservation', payload: { id: reservation.id, location, date, guests }, visitorId: visitor_id, source: 'user' });

      return Response.json({
        reservation,
        zenchefLink: loc.zenchefLink,
        message: 'Uw aanvraag is genoteerd. Bevestig online via ZenChef voor de definitieve reservatie.',
        uiAction: `openReservation|${location}|${date}|${guests}`,
      });
    }

    return Response.json({ error: 'unknown_action', actions: ['suggestLocation', 'checkAvailability', 'create'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}