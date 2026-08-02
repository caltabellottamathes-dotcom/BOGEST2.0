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
  const [srcOverrides, setSrcOverrides] = useState({}); // source_url -> { image_url, asset_id }
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await base44.functions.invoke('siteImagesApi', { action: 'list' });
      const posMap = {};
      const srcMap = {};
      for (const o of (res.data?.overrides || [])) {
        if (o.source_url) {
          srcMap[o.source_url] = { image_url: o.image_url, asset_id: o.asset_id };
        } else {
          posMap[o.position_key] = { image_url: o.image_url, asset_id: o.asset_id };
        }
      }
      setOverrides(posMap);
      setSrcOverrides(srcMap);
    } catch {
      setOverrides({});
      setSrcOverrides({});
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

  const setSrcOverride = useCallback(async (source_url, image_url, asset_id) => {
    await base44.functions.invoke('siteImagesApi', { action: 'setBySrc', source_url, image_url, asset_id });
    setSrcOverrides((o) => ({ ...o, [source_url]: { image_url, asset_id } }));
  }, []);

  const clearSrcOverride = useCallback(async (source_url) => {
    await base44.functions.invoke('siteImagesApi', { action: 'clearBySrc', source_url });
    setSrcOverrides((o) => { const n = { ...o }; delete n[source_url]; return n; });
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

  // Apply src-based overrides to untagged <img> elements across the whole site
  // (panel card images, etc.). data-bb-key images are handled by the position
  // system; the picker UI ([data-bb-ui]) is excluded. The original src is
  // recorded in a data-bb-src attribute so re-editing keeps a stable key.
  useEffect(() => {
    const apply = () => {
      const map = srcOverrides;
      if (!map || !Object.keys(map).length) return;
      const imgs = document.querySelectorAll('img:not([data-bb-key])');
      imgs.forEach((img) => {
        if (img.closest('[data-bb-ui]')) return;
        const original = img.getAttribute('data-bb-src') || img.src;
        const target = map[original];
        if (target && img.src !== target.image_url) {
          if (!img.getAttribute('data-bb-src')) img.setAttribute('data-bb-src', img.src);
          img.setAttribute('src', target.image_url);
        }
      });
    };
    apply();
    const obs = new MutationObserver(() => apply());
    obs.observe(document.body, { subtree: true, childList: true, attributes: ['src'] });
    return () => obs.disconnect();
  }, [srcOverrides]);

  const value = useMemo(
    () => ({ siteImg, positions, setOverride, clearOverride, setSrcOverride, clearSrcOverride, srcOverrides, loading }),
    [siteImg, positions, setOverride, clearOverride, setSrcOverride, clearSrcOverride, srcOverrides, loading],
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
      setSrcOverride: async () => {},
      clearSrcOverride: async () => {},
      srcOverrides: {},
      loading: false,
    };
  }
  return ctx;
}