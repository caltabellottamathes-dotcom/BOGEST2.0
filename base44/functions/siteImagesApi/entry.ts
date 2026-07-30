import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// siteImagesApi — manages live-website image overrides.
//   list  → public (service role): returns all overrides
//   set   → admin only: upsert { position_key, image_url, asset_id }
//   clear → admin only: delete override by position_key
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);

    let body: any = {};
    if (req.method === 'GET') {
      const u = new URL(req.url);
      body = {
        action: u.searchParams.get('action') || 'list',
        position_key: u.searchParams.get('position_key'),
        image_url: u.searchParams.get('image_url'),
        asset_id: u.searchParams.get('asset_id'),
      };
    } else {
      body = await req.json().catch(() => ({}));
    }

    const action = body.action || 'list';

    if (action === 'list') {
      const items = await base44.asServiceRole.entities.SiteImageOverride.list('-updated_date', 200);
      return Response.json({
        overrides: (items || []).map((o) => ({
          position_key: o.position_key,
          image_url: o.image_url,
          asset_id: o.asset_id,
        })),
      });
    }

    // set / clear are admin-only
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    if (action === 'set') {
      const { position_key, image_url, asset_id } = body;
      if (!position_key || !image_url) {
        return Response.json({ error: 'position_key & image_url required' }, { status: 400 });
      }
      const existing = await base44.asServiceRole.entities.SiteImageOverride.filter({ position_key });
      if (existing && existing.length) {
        const updated = await base44.asServiceRole.entities.SiteImageOverride.update(existing[0].id, { image_url, asset_id });
        return Response.json({ override: updated });
      }
      const created = await base44.asServiceRole.entities.SiteImageOverride.create({ position_key, image_url, asset_id });
      return Response.json({ override: created });
    }

    if (action === 'clear') {
      const { position_key } = body;
      if (!position_key) return Response.json({ error: 'position_key required' }, { status: 400 });
      await base44.asServiceRole.entities.SiteImageOverride.deleteMany({ position_key });
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}