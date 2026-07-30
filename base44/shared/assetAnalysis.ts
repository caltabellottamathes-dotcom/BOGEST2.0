// Shared AI vision analysis for Bogèst archive assets — used by both the
// upload import path and the manual "analyseer nu" action so the prompt and
// schema live in one place.

export const ANALYSIS_PROMPT = `Je bent een visuele archivaris voor het Belgische grillrestaurant Bogèst (vestigingen in Hasselt, Borgloon en Heusden-Zolder). Analyseer deze foto en geef een gestructureerd resultaat als geldige JSON:
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

export const ANALYSIS_SCHEMA = {
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

// Run the vision analysis on an image URL and return the normalized result.
export async function analyzeImage(base44, imageUrl) {
  const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: ANALYSIS_PROMPT,
    file_urls: [imageUrl],
    response_json_schema: ANALYSIS_SCHEMA,
    model: 'gemini_3_flash',
  });
  return (llmRes && typeof llmRes === 'object' && 'description' in llmRes)
    ? llmRes
    : (llmRes?.data || {});
}

// Build the AssetArchive record fields from an analysis result.
export function fieldsFromAnalysis(analysis) {
  return {
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
    status: 'active',
    ai_analyzed: true,
  };
}