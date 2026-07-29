import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';

// Memory tools (Section 4.4 / 6) — consent-aware.
// Visitor preferences are only stored when the visitor explicitly grants consent
// for the preference's category. All writes create a ConsentRecord.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, visitor_id } = body;
    if (!visitor_id) return Response.json({ error: 'visitor_id required' }, { status: 400 });

    logEvent(base44, { type: 'memory.accessed', domain: 'memory', payload: { action }, visitorId: visitor_id, source: 'tool' });

    const profiles = base44.asServiceRole.entities.VisitorProfile;
    const prefs = base44.asServiceRole.entities.VisitorPreference;
    const consent = base44.asServiceRole.entities.ConsentRecord;

    if (action === 'getVisitorProfile' || !action) {
      const p = await profiles.filter({ visitor_id });
      const pr = await prefs.filter({ visitor_id });
      const profile = p && p[0] ? p[0] : null;
      const preferences = (pr || []).map((x) => ({ key: x.key, value: x.value, category: x.category }));
      return Response.json({ profile, preferences, is_new: !profile });
    }

    if (action === 'setPreference') {
      const { key, value, category, consent_granted, source = 'chat', retentionDays = 365 } = body;
      if (!key || !value) return Response.json({ error: 'key and value required' }, { status: 400 });

      const retentionUntil = new Date();
      retentionUntil.setDate(retentionUntil.getDate() + retentionDays);

      // Always record the consent decision (granted or not)
      await consent.create({
        visitor_id,
        category: category || 'personalization',
        granted: Boolean(consent_granted),
        granted_at: new Date().toISOString(),
        expires_at: retentionUntil.toISOString(),
        source,
      });

      if (!consent_granted) {
        // No consent → do not store the preference value; forget any prior one.
        await prefs.deleteMany({ visitor_id, key });
        return Response.json({ stored: false, reason: 'consent_not_granted' });
      }

      // Upsert preference
      const existing = await prefs.filter({ visitor_id, key });
      if (existing && existing[0]) {
        const updated = await prefs.update(existing[0].id, { value, category, consent_granted: true, retention_until: retentionUntil.toISOString(), source });
        return Response.json({ stored: true, preference: updated });
      }
      const created = await prefs.create({ visitor_id, key, value, category: category || 'personalization', consent_granted: true, retention_until: retentionUntil.toISOString(), source });
      return Response.json({ stored: true, preference: created });
    }

    if (action === 'forget') {
      const { key } = body;
      const query = key ? { visitor_id, key } : { visitor_id };
      const removed = await prefs.deleteMany(query);
      logEvent(base44, { type: 'memory.forgotten', domain: 'memory', payload: { key, removed }, visitorId: visitor_id, source: 'tool' });
      return Response.json({ forgotten: true, key: key || 'all' });
    }

    return Response.json({ error: 'unknown_action', actions: ['getVisitorProfile', 'setPreference', 'forget'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}