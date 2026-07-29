import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { logEvent } from '../../shared/eventBus.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const isAuthenticated = await base44.auth.isAuthenticated();

    const body = await req.json().catch(() => ({}));
    const { visitor_id, action, profile_data } = body;

    if (!visitor_id) {
      return Response.json({ error: 'visitor_id is required' }, { status: 400 });
    }

    // Event Bus (Section 3): log this tool invocation as a structured event
    logEvent(base44, {
      type: 'memory.profileAccessed',
      domain: 'memory',
      payload: { action: action || 'get' },
      visitorId: visitor_id,
      source: 'tool',
    });

    // Use service role so visitor profiles persist even for unauthenticated browsers
    // (these are anonymous profiles tied to a browser-local ID, not user accounts)
    const entities = base44.asServiceRole.entities.VisitorProfile;

    // FIND existing profile
    const existing = await entities.filter({ visitor_id });
    const profile = existing && existing.length > 0 ? existing[0] : null;

    if (action === 'get' || !action) {
      if (!profile) {
        // Create empty profile on first access
        const created = await entities.create({
          visitor_id,
          visit_count: 1,
          last_visit: new Date().toISOString()
        });
        return Response.json({ profile: created, is_new: true });
      }
      return Response.json({ profile, is_new: false });
    }

    if (action === 'touch') {
      // Increment visit count, update last_visit
      if (!profile) {
        const created = await entities.create({
          visitor_id,
          visit_count: 1,
          last_visit: new Date().toISOString()
        });
        return Response.json({ profile: created, is_new: true });
      }
      const updated = await entities.update(profile.id, {
        visit_count: (profile.visit_count || 0) + 1,
        last_visit: new Date().toISOString()
      });
      return Response.json({ profile: updated, is_new: false });
    }

    if (action === 'update') {
      // Merge provided fields into existing profile
      if (!profile) {
        const created = await entities.create({
          visitor_id,
          visit_count: 1,
          last_visit: new Date().toISOString(),
          ...profile_data
        });
        return Response.json({ profile: created });
      }
      const updated = await entities.update(profile.id, {
        ...profile_data,
        last_conversation: new Date().toISOString()
      });
      return Response.json({ profile: updated });
    }

    if (action === 'increment_conversation') {
      if (!profile) {
        const created = await entities.create({
          visitor_id,
          visit_count: 1,
          conversation_count: 1,
          last_visit: new Date().toISOString(),
          last_conversation: new Date().toISOString()
        });
        return Response.json({ profile: created });
      }
      const updated = await entities.update(profile.id, {
        conversation_count: (profile.conversation_count || 0) + 1,
        last_conversation: new Date().toISOString()
      });
      return Response.json({ profile: updated });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});