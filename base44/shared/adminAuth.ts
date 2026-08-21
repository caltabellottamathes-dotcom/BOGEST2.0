// Server-side admin authorization for privileged backend mutations.
// Returns the authenticated admin user, or null if the caller is not a
// logged-in Base44 admin. Callers must reject (401) when this returns null.
// Used by assetsApi, siteImagesApi and siteTextApi so that client-side UI
// gates are never trusted for authorization.
export async function requireAdmin(base44: any): Promise<any | null> {
  try {
    const me = await base44.auth.me();
    if (me && me.role === 'admin') return me;
  } catch {
    // not logged in / no session
  }
  return null;
}