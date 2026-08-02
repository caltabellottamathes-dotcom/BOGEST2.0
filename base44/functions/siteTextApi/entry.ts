import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// siteTextApi — manages live-website text (i18n) overrides.
//   list  → public (service role): returns overrides, optionally filtered by lang
//   set   → admin only: upsert { key, lang, value }
//   clear → admin only: delete override(s) by key (and optional lang)
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);

    let body: any = {};
    if (req.method === 'GET') {
      const u = new URL(req.url);
      body = {
        action: u.searchParams.get('action') || 'list',
        lang: u.searchParams.get('lang'),
        key: u.searchParams.get('key'),
        value: u.searchParams.get('value'),
      };
    } else {
      body = await req.json().catch(() => ({}));
    }

    const action = body.action || 'list';

    if (action === 'list') {
      const filter: any = {};
      if (body.lang) filter.lang = body.lang;
      const items = await base44.asServiceRole.entities.SiteTextOverride.filter(filter, '-updated_date', 500);
      return Response.json({
        overrides: (items || []).map((o) => ({ key: o.key, lang: o.lang, value: o.value })),
      });
    }

    if (action === 'set') {
      const { key, lang, value } = body;
      if (!key || !lang || value == null) {
        return Response.json({ error: 'key, lang & value required' }, { status: 400 });
      }
      const existing = await base44.asServiceRole.entities.SiteTextOverride.filter({ key, lang });
      if (existing && existing.length) {
        const updated = await base44.asServiceRole.entities.SiteTextOverride.update(existing[0].id, { value });
        return Response.json({ override: updated });
      }
      const created = await base44.asServiceRole.entities.SiteTextOverride.create({ key, lang, value });
      return Response.json({ override: created });
    }

    if (action === 'clear') {
      const { key, lang } = body;
      if (!key) return Response.json({ error: 'key required' }, { status: 400 });
      const filter: any = { key };
      if (lang) filter.lang = lang;
      await base44.asServiceRole.entities.SiteTextOverride.deleteMany(filter);
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}