import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { analyzeImage, fieldsFromAnalysis } from '../../shared/assetAnalysis.ts';

// Manually run the AI vision analysis on an existing AssetArchive record
// (one that was quick-added with ai_analyzed=false). Updates the record with
// description, categories, tags, mood, colours, location, quality, etc.
// When the photo is a food/dish, it also matches it to exactly one menu item
// from MenuKnowledge and stores that in matched_dish (empty when no clear
// match — no match is better than a wrong match).
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
    const fields = fieldsFromAnalysis(analysis);
    await base44.asServiceRole.entities.AssetArchive.update(asset_id, fields);

    // Dish matching — for food photos, find the single best menu item.
    let matchedDish = '';
    try {
      if (fields.primary_category === 'gastronomy') {
        const menu = await base44.asServiceRole.entities.MenuKnowledge.list('-sort_order', 250);
        const items = (menu || []).map((m) => m.item_name).filter(Boolean);
        if (items.length) {
          const matchRes: any = await base44.asServiceRole.integrations.Core.InvokeLLM({
            model: 'gemini_3_flash',
            prompt: `Je bekijkt een foto van een gerecht uit het restaurant Bogèst. Hier is de lijst van gerechten op de kaart:\n${JSON.stringify(items)}\nWelk gerecht uit deze lijst staat op de foto? Geef de EXACTE naam uit de lijst, of "" als er geen duidelijke match is of je het niet zeker weet. Geef alleen geldige JSON: { "matched_dish": "..." }`,
            file_urls: [asset.image_url],
            response_json_schema: { type: 'object', properties: { matched_dish: { type: 'string' } } },
          });
          const dish = String(matchRes?.matched_dish || '').trim();
          matchedDish = items.includes(dish) ? dish : '';
          await base44.asServiceRole.entities.AssetArchive.update(asset_id, { matched_dish: matchedDish });
        }
      }
    } catch {}

    const updated = await base44.asServiceRole.entities.AssetArchive.get(asset_id);
    return Response.json({ status: 'success', asset: updated, matched_dish: matchedDish });
  } catch (error) {
    return Response.json({ error: error?.message || 'Analysis failed' }, { status: 500 });
  }
}