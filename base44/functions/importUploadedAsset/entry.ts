import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { analyzeImage, fieldsFromAnalysis } from '../../shared/assetAnalysis.ts';

// Import a manually uploaded photo into the Bogèst asset archive.
// The file is already uploaded to Base44 storage by the caller (UploadFile).
// Two modes:
//   { file_url }            — run the full vision analysis and store (legacy)
//   { file_url, quick: true } — store immediately WITHOUT analysis (ai_analyzed=false),
//                              so the admin can add many photos fast and analyse
//                              them later from the Beeldbank. Admin-only (AdminGate).

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const file_url = body?.file_url;
    if (!file_url) return Response.json({ error: 'file_url required' }, { status: 400 });

    // Quick add — no LLM, just persist the photo so it appears in the archive
    // immediately. The admin starts the AI analysis manually afterwards.
    if (body.quick) {
      const record = await base44.asServiceRole.entities.AssetArchive.create({
        image_url: file_url,
        source_url: file_url,
        source_urls: [file_url],
        source_type: 'seed',
        source_platform: 'Beheer upload',
        mirrored: true,
        status: 'pending',
        ai_analyzed: false,
      });
      return Response.json({ status: 'success', asset: record });
    }

    const analysis = await analyzeImage(base44, file_url);
    const record = await base44.asServiceRole.entities.AssetArchive.create({
      image_url: file_url,
      source_url: file_url,
      source_urls: [file_url],
      source_type: 'seed',
      source_platform: 'Beheer upload',
      mirrored: true,
      ...fieldsFromAnalysis(analysis),
    });

    return Response.json({ status: 'success', asset: record });
  } catch (error) {
    return Response.json({ error: error?.message || 'Import failed' }, { status: 500 });
  }
}