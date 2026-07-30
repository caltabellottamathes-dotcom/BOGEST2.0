import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Import a manually uploaded photo into the Bogèst asset archive.
// The file is already uploaded to Base44 storage by the caller (UploadFile);
// here we run a vision LLM pass to describe, categorize, tag and score the
// image — fully automated, Dutch description — then store the AssetArchive
// record. Admin-only.

const ANALYSIS_PROMPT = `Je bent een visuele archivaris voor het Belgische grillrestaurant Bogèst (vestigingen in Hasselt, Borgloon en Heusden-Zolder). Analyseer deze foto en geef een gestructureerd resultaat als geldige JSON:
- description: korte Nederlandse beschrijving van de foto (één vlotte zin).
- categories: array (max 3) van categoriepaden uit deze taxonomie: "food/Main Courses", "food/Starters", "food/Desserts", "food/Sides", "food/Sauces", "drinks/Wine", "drinks/Beer", "drinks/Cocktails", "atmosphere/Evening", "atmosphere/Cozy", "interiors/Dining", "interiors/Bar", "interiors/Terrace", "locations/Hasselt", "locations/Borgloon", "locations/Heusden-Zolder", "events/Private", "branding/Logo".
- primary_category: precies één van: interiors, gastronomy, atmosphere, architecture, branding.
- tags: array (max 8) van korte Engelse trefwoorden.
- mood: sfeer in één of twee woorden (Nederlands).
- colors: array (max 4) van dominante kleuren als hex (bijv. "#8a5a2b").
- location: precies één van: hasselt, borgloon, heusden-zolder, unknown.
- orientation: precies één van: landscape, portrait, square, unknown.
- quality_score: getal 0-100 (scherpte, compositie, belichting).
- is_relevant: boolean — is dit een relevante, bruikbare foto voor Bogèst?
Geef UITSLUITEND geldige JSON terug, geen andere tekst.`;

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    description: { type: 'string' },
    categories: { type: 'array', items: { type: 'string' } },
    primary_category: { type: 'string', enum: ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'] },
    tags: { type: 'array', items: { type: 'string' } },
    mood: { type: 'string' },
    colors: { type: 'array', items: { type: 'string' } },
    location: { type: 'string', enum: ['hasselt', 'borgloon', 'heusden-zolder', 'unknown'] },
    orientation: { type: 'string', enum: ['landscape', 'portrait', 'square', 'unknown'] },
    quality_score: { type: 'number' },
    is_relevant: { type: 'boolean' },
  },
  required: ['description', 'primary_category', 'tags', 'location', 'orientation', 'quality_score', 'is_relevant'],
};

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const file_url = body?.file_url;
    if (!file_url) return Response.json({ error: 'file_url required' }, { status: 400 });

    const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: ANALYSIS_PROMPT,
      file_urls: [file_url],
      response_json_schema: ANALYSIS_SCHEMA,
      model: 'gemini_3_flash',
    });

    const analysis = (llmRes && typeof llmRes === 'object' && 'description' in llmRes)
      ? llmRes
      : (llmRes?.data || {});

    const record = await base44.asServiceRole.entities.AssetArchive.create({
      image_url: file_url,
      source_url: file_url,
      source_urls: [file_url],
      source_type: 'seed',
      source_platform: 'Beheer upload',
      mirrored: true,
      status: 'active',
      description: analysis.description || '',
      categories: Array.isArray(analysis.categories) ? analysis.categories : [],
      primary_category: analysis.primary_category || 'gastronomy',
      tags: Array.isArray(analysis.tags) ? analysis.tags : [],
      mood: analysis.mood || '',
      colors: Array.isArray(analysis.colors) ? analysis.colors : [],
      location: analysis.location || 'unknown',
      orientation: analysis.orientation || 'unknown',
      quality_score: typeof analysis.quality_score === 'number' ? analysis.quality_score : 75,
      is_relevant: analysis.is_relevant !== false,
    });

    return Response.json({ status: 'success', asset: record });
  } catch (error) {
    return Response.json({ error: error?.message || 'Import failed' }, { status: 500 });
  }
}