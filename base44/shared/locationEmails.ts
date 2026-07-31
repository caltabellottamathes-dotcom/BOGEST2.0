// Shared vestiging → e-mail mapping and location resolver, used by the
// contact / jobs / groups form handlers so the visitor never has to pick an
// e-mail address themselves — the correct location address is derived from
// the job or location they selected.

export const LOCATION_EMAILS: Record<string, string> = {
  hasselt: 'info@bogest-hasselt.be',
  borgloon: 'info@bogest-borgloon.be',
  'heusden-zolder': 'info@bogest-heusdenzolder.be',
};

export const LOCATION_NAMES: Record<string, string> = {
  hasselt: 'Bogèst Hasselt',
  borgloon: 'Bogèst Borgloon',
  'heusden-zolder': 'Bogèst Heusden-Zolder',
};

// Normalize a free-text location label (e.g. "Hasselt", "Bogèst Hasselt",
// "heusden-zolder") into a canonical slug. Returns null when no known
// location matches (e.g. the not-yet-open Lommel).
export function resolveLocationSlug(input: string | null | undefined): string | null {
  if (!input) return null;
  const s = String(input).toLowerCase().trim();
  if (LOCATION_EMAILS[s]) return s;
  if (s.includes('hasselt')) return 'hasselt';
  if (s.includes('borgloon')) return 'borgloon';
  if (s.includes('heusden') || s.includes('zolder')) return 'heusden-zolder';
  return null;
}

export function locationEmail(slug: string | null): string | null {
  return slug ? (LOCATION_EMAILS[slug] ?? null) : null;
}

export function locationName(slug: string | null): string {
  return slug ? (LOCATION_NAMES[slug] ?? slug) : 'Bogèst';
}