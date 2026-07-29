import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Analytics tools (Section 3) — structured event logging + lightweight metrics.
// logEvent here is the direct entity write (the shared fire-and-forget bus is
// for *other* functions to log non-blocking; this tool is the explicit API).

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action } = body;

    const events = base44.asServiceRole.entities.EventLog;

    if (action === 'logEvent' || !action) {
      const { event_type, domain, payload = {}, visitor_id, session_id, source = 'user' } = body;
      if (!event_type || !domain) return Response.json({ error: 'event_type and domain required' }, { status: 400 });
      const created = await events.create({
        event_type,
        domain,
        payload,
        visitor_id: visitor_id || null,
        session_id: session_id || null,
        source,
        timestamp: new Date().toISOString(),
      });
      return Response.json({ logged: true, id: created.id });
    }

    if (action === 'getMetric') {
      const { event_type, since } = body;
      const list = event_type ? await events.filter({ event_type }) : await events.list('-timestamp', 500);
      const arr = list || [];
      const filtered = since ? arr.filter((e) => new Date(e.timestamp || e.created_date) >= new Date(since)) : arr;
      return Response.json({ event_type: event_type || 'all', count: filtered.length, since: since || null });
    }

    return Response.json({ error: 'unknown_action', actions: ['logEvent', 'getMetric'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}