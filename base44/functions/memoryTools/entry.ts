import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { logEvent } from '../../shared/eventBus.ts';

// Shared Guest Profile memory — ONE profile across the Base44 Digital Host
// (VraagHetBogèst) and the ElevenLabs Voice Agent. Both hosts call this
// function with the same browser-local visitor_id, so a guest is the same
// person on every channel. Consent-gated: no personal preference is stored
// until the guest grants personalisation consent.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, visitor_id } = body;
    if (!visitor_id) return Response.json({ error: 'visitor_id required' }, { status: 400 });

    const profiles = base44.asServiceRole.entities.VisitorProfile;
    const prefs = base44.asServiceRole.entities.VisitorPreference;
    const consent = base44.asServiceRole.entities.ConsentRecord;

    logEvent(base44, { type: 'memory.accessed', domain: 'memory', payload: { action }, visitorId: visitor_id, source: 'tool' });

    // Get-or-create the base profile row
    async function getOrCreate() {
      const p = await profiles.filter({ visitor_id });
      if (p && p[0]) return p[0];
      return await profiles.create({
        visitor_id,
        visit_count: 0,
        conversation_count: 0,
        consent_state: 'none',
        last_visit: new Date().toISOString(),
      });
    }

    // getGuestProfile — full structured profile for both hosts
    if (action === 'getGuestProfile' || action === 'getVisitorProfile' || !action) {
      const profile = await getOrCreate();
      const pr = await prefs.filter({ visitor_id });
      const preferences = (pr || []).map((x) => ({
        key: x.key, value: x.value, category: x.category,
        inferred: x.inferred, confidence: x.confidence,
        source_channel: x.source_channel, times_observed: x.times_observed,
      }));
      const is_returning = (profile.visit_count || 0) > 1 || (profile.conversation_count || 0) > 1 || Boolean(profile.first_name);
      return Response.json({ profile, preferences, is_returning, is_new: !is_returning });
    }

    // requestConsent — record the guest's consent decision before storing
    if (action === 'requestConsent') {
      const { granted, source = 'chat', category = 'personalization' } = body;
      const profile = await getOrCreate();
      const retentionUntil = new Date();
      retentionUntil.setDate(retentionUntil.getDate() + 365);
      await consent.create({
        visitor_id, category, granted: Boolean(granted),
        granted_at: new Date().toISOString(), expires_at: retentionUntil.toISOString(), source,
      });
      const updated = await profiles.update(profile.id, {
        consent_state: granted ? 'granted' : 'denied',
        consent_asked_at: new Date().toISOString(),
      });
      logEvent(base44, { type: 'memory.consent', domain: 'memory', payload: { granted: Boolean(granted) }, visitorId: visitor_id, source: 'tool' });
      return Response.json({ consent_state: updated.consent_state });
    }

    // updateIdentity — store identity the guest shared (names, language, email)
    if (action === 'updateIdentity') {
      const { first_name, last_name, preferred_name, preferred_language, email } = body;
      const profile = await getOrCreate();
      const data = {};
      if (first_name !== undefined) data.first_name = first_name;
      if (last_name !== undefined) data.last_name = last_name;
      if (preferred_name !== undefined) data.preferred_name = preferred_name;
      if (preferred_language !== undefined) data.preferred_language = preferred_language;
      if (email !== undefined) data.email = email;
      const updated = await profiles.update(profile.id, data);
      return Response.json({ profile: updated });
    }

    // setPreference — consent-gated, confidence-aware upsert
    if (action === 'setPreference') {
      const { key, value, category = 'personalization', consent_granted, source = 'chat',
        inferred = false, source_channel = 'base44', retentionDays = 365 } = body;
      if (!key || value === undefined || value === null) return Response.json({ error: 'key and value required' }, { status: 400 });

      const profile = await getOrCreate();
      const hasConsent = consent_granted === true || profile.consent_state === 'granted';
      const retentionUntil = new Date();
      retentionUntil.setDate(retentionUntil.getDate() + retentionDays);

      if (!hasConsent) {
        // Record the (implicit) denial and forget any prior value of this key.
        await consent.create({
          visitor_id, category, granted: false,
          granted_at: new Date().toISOString(), expires_at: retentionUntil.toISOString(), source,
        });
        await prefs.deleteMany({ visitor_id, key });
        return Response.json({ stored: false, reason: 'consent_not_granted' });
      }

      const isExplicit = inferred === false;
      const existing = await prefs.filter({ visitor_id, key });
      if (existing && existing[0]) {
        const ex = existing[0];
        // Explicit always overwrites; inferred increments confidence.
        const times = (ex.times_observed || 1) + 1;
        const confidence = isExplicit ? 1 : Math.min(0.95, (ex.confidence || 0.5) + 0.15);
        const updated = await prefs.update(ex.id, {
          value,
          category,
          consent_granted: true,
          inferred: isExplicit ? false : (ex.inferred !== false ? ex.inferred : true),
          confidence,
          times_observed: times,
          source_channel,
          retention_until: retentionUntil.toISOString(),
          source,
        });
        return Response.json({ stored: true, preference: updated });
      }
      const created = await prefs.create({
        visitor_id, key, value, category, consent_granted: true,
        inferred, confidence: inferred ? 0.5 : 1, times_observed: 1,
        source_channel, retention_until: retentionUntil.toISOString(), source,
      });
      return Response.json({ stored: true, preference: created });
    }

    // addInsight — AI-inferred preference with growing confidence
    if (action === 'addInsight') {
      const { insight, confidence = 0.5 } = body;
      if (!insight) return Response.json({ error: 'insight required' }, { status: 400 });
      const profile = await getOrCreate();
      const insights = Array.isArray(profile.ai_insights) ? [...profile.ai_insights] : [];
      const idx = insights.findIndex((i) => (i.text || '').toLowerCase() === String(insight).toLowerCase());
      if (idx >= 0) {
        insights[idx] = { ...insights[idx], confidence: Math.min(0.95, (insights[idx].confidence || 0.5) + 0.1), updated_at: new Date().toISOString() };
      } else {
        insights.push({ text: insight, confidence, source: 'ai', updated_at: new Date().toISOString() });
      }
      const updated = await profiles.update(profile.id, { ai_insights: insights });
      return Response.json({ profile: updated });
    }

    // recordBehaviour — track hospitality behaviour + conversation continuity
    if (action === 'recordBehaviour') {
      const { preferred_time, typical_party_size, last_topic, last_channel, reservation } = body;
      const profile = await getOrCreate();
      const data = {};
      if (preferred_time !== undefined) data.preferred_time = preferred_time;
      if (typical_party_size !== undefined) data.typical_party_size = typical_party_size;
      if (last_topic !== undefined) data.last_topic = last_topic;
      if (last_channel !== undefined) data.last_channel = last_channel;
      if (reservation) {
        const history = Array.isArray(profile.reservation_history) ? [...profile.reservation_history] : [];
        history.push({ ...reservation, at: new Date().toISOString() });
        data.reservation_history = history.slice(-20);
      }
      const updated = await profiles.update(profile.id, data);
      return Response.json({ profile: updated });
    }

    // forget — remove a preference (or all), consent-aware
    if (action === 'forget') {
      const { key } = body;
      const query = key ? { visitor_id, key } : { visitor_id };
      await prefs.deleteMany(query);
      const profile = await getOrCreate();
      if (!key) {
        await profiles.update(profile.id, { ai_insights: [], notes: '', consent_state: 'none' });
      }
      logEvent(base44, { type: 'memory.forgotten', domain: 'memory', payload: { key }, visitorId: visitor_id, source: 'tool' });
      return Response.json({ forgotten: true, key: key || 'all' });
    }

    return Response.json({ error: 'unknown_action', actions: ['getGuestProfile', 'requestConsent', 'updateIdentity', 'setPreference', 'addInsight', 'recordBehaviour', 'forget'] }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}