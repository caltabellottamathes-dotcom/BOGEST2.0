import { waitUntil } from 'base44:runtime';

/**
 * Event Bus (Section 3).
 *
 * Every tool invocation and business/system process logs an immutable,
 * structured event to the EventLog entity: { type, payload, sessionId, visitorId, timestamp }.
 *
 * Logging is fire-and-forget via `waitUntil` so it never blocks the function
 * response, and any failure is swallowed — logging must never break the
 * calling function (Section 3: events are immutable and timestamped).
 *
 * Usage from a backend function:
 *   import { logEvent } from '../../shared/eventBus.ts';
 *   logEvent(base44, { type: 'reservation.created', domain: 'reservation', payload: { id }, visitorId, sessionId, source: 'tool' });
 */
export function logEvent(base44, event) {
  const {
    type,
    domain,
    payload = {},
    visitorId = null,
    sessionId = null,
    source = 'tool',
  } = event || {};
  if (!type || !domain) return;
  try {
    waitUntil(
      base44.asServiceRole.entities.EventLog.create({
        event_type: type,
        domain,
        payload,
        visitor_id: visitorId,
        session_id: sessionId,
        source,
        timestamp: new Date().toISOString(),
      }).catch(() => {})
    );
  } catch {
    /* logging must never break the calling function */
  }
}