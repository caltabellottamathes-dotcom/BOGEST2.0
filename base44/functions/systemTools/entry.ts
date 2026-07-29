import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';

// System tools (Section 6.x) — maintenance & monitoring automations.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action } = body;

    if (action === 'retentionSweep') {
      const now = new Date();
      const prefs = base44.asServiceRole.entities.VisitorPreference;
      const consent = base44.asServiceRole.entities.ConsentRecord;

      const allPrefs = await prefs.list('-created_date', 500);
      let purgedPrefs = 0;
      for (const p of (allPrefs || [])) {
        if (p.retention_until && new Date(p.retention_until) < now) {
          await prefs.delete(p.id);
          purgedPrefs++;
        }
      }

      const allConsent = await consent.list('-created_date', 500);
      let purgedConsent = 0;
      for (const c of (allConsent || [])) {
        if (c.expires_at && new Date(c.expires_at) < now) {
          await consent.delete(c.id);
          purgedConsent++;
        }
      }

      logEvent(base44, { type: 'system.retentionSweep', domain: 'system', payload: { purgedPrefs, purgedConsent }, source: 'automation' });
      return Response.json({ purgedPrefs, purgedConsent, sweptAt: now.toISOString() });
    }

    if (action === 'reviewSpike') {
      const reviews = base44.asServiceRole.entities.ZenchefReview;
      const since = new Date();
      since.setDate(since.getDate() - 1);
      const recent = await reviews.list('-date', 100);
      const count = (recent || []).filter((r) => new Date(r.date || r.created_date) >= since).length;
      const threshold = 3;
      const spike = count >= threshold;
      if (spike) {
        logEvent(base44, { type: 'system.reviewSpike', domain: 'analytics', payload: { count, since: since.toISOString() }, source: 'automation' });
      }
      return Response.json({ recentCount: count, spike, threshold });
    }

    if (action === 'healthCheck') {
      return Response.json({ ok: true, timestamp: new Date().toISOString() });
    }

    return Response.json({ error: 'unknown_action', actions: ['retentionSweep', 'reviewSpike', 'healthCheck'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}