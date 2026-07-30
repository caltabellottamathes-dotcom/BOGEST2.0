import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { analyzeImage, fieldsFromAnalysis } from '../../shared/assetAnalysis.ts';

// Manually run the AI vision analysis on an existing AssetArchive record
// (one that was quick-added with ai_analyzed=false). Updates the record with
// description, categories, tags, mood, colours, location, quality, etc.
// Admin-only (access controlled by the client-side AdminGate).
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const asset_id = body?.asset_id;
    if (!asset_id) return Response.json({ error: 'asset_id required' }, { status: 400 });

    const asset = await base44.asServiceRole.entities.AssetArchive.get(asset_id);
    if (!asset || !asset.image_url) return Response.json({ error: 'Asset not found' }, { status: 404 });

    const analysis = await analyzeImage(base44, asset.image_url);
    const updated = await base44.asServiceRole.entities.AssetArchive.update(asset_id, fieldsFromAnalysis(analysis));

    return Response.json({ status: 'success', asset: updated });
  } catch (error) {
    return Response.json({ error: error?.message || 'Analysis failed' }, { status: 500 });
  }
}