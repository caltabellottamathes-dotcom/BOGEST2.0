import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { SITE_IMAGE_POSITIONS, SITE_IMAGE_DEFAULTS } from '@/lib/siteImages';

const SiteImagesContext = createContext(null);

// Fallback used when no provider is mounted (should not happen — Layout wraps
// every page — but keeps components safe and SSR/preview-friendly).
const fallbackPositions = SITE_IMAGE_POSITIONS.map((p) => ({
  ...p, overridden: false, image_url: p.default, asset_id: null,
}));

export function SiteImagesProvider({ children }) {
  const [overrides, setOverrides] = useState({}); // key -> { image_url, asset_id }
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await base44.functions.invoke('siteImagesApi', { action: 'list' });
      const map = {};
      for (const o of (res.data?.overrides || [])) {
        map[o.position_key] = { image_url: o.image_url, asset_id: o.asset_id };
      }
      setOverrides(map);
    } catch {
      setOverrides({});
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const siteImg = useCallback(
    (key) => (overrides[key] ? overrides[key].image_url : SITE_IMAGE_DEFAULTS[key]),
    [overrides],
  );

  const setOverride = useCallback(async (key, image_url, asset_id) => {
    await base44.functions.invoke('siteImagesApi', { action: 'set', position_key: key, image_url, asset_id });
    setOverrides((o) => ({ ...o, [key]: { image_url, asset_id } }));
  }, []);

  const clearOverride = useCallback(async (key) => {
    await base44.functions.invoke('siteImagesApi', { action: 'clear', position_key: key });
    setOverrides((o) => { const n = { ...o }; delete n[key]; return n; });
  }, []);

  const positions = useMemo(
    () => SITE_IMAGE_POSITIONS.map((p) => ({
      ...p,
      overridden: !!overrides[p.key],
      image_url: overrides[p.key] ? overrides[p.key].image_url : p.default,
      asset_id: overrides[p.key] ? overrides[p.key].asset_id : null,
    })),
    [overrides],
  );

  const value = useMemo(
    () => ({ siteImg, positions, setOverride, clearOverride, loading }),
    [siteImg, positions, setOverride, clearOverride, loading],
  );

  return <SiteImagesContext.Provider value={value}>{children}</SiteImagesContext.Provider>;
}

export function useSiteImages() {
  const ctx = useContext(SiteImagesContext);
  if (!ctx) {
    return {
      siteImg: (key) => SITE_IMAGE_DEFAULTS[key],
      positions: fallbackPositions,
      setOverride: async () => {},
      clearOverride: async () => {},
      loading: false,
    };
  }
  return ctx;
}