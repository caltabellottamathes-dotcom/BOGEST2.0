import { websiteAction } from './websiteDispatcher';
import { base44 } from '@/api/base44Client';
import { isPanelPath } from '@/components/GlassPanel';

// Normalize a dish name for fuzzy matching (lowercase, strip accents &
// punctuation) so "Lasagne" matches a photo tagged "Veggie Lasagna".
const _norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const _lev = (a, b) => { if (a === b) return 0; const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let prev = Array.from({ length: n + 1 }, (_, k) => k); for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) { cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))); } prev = cur; } return prev[n]; };

/**
 * UI Action Layer — the contract between the Base44 text-chat agent
 * (VraagHetBogest / "Digital Host") and the website front end.
 *
 * The digital host NEVER opens pop-ups to show something — it only
 * automatically navigates to the relevant page. Every action resolves to a
 * page navigation (or an in-page scroll/highlight).
 */
export async function dispatchUIAction({ type, args = [] }) {
  if (!type) return { success: false, message: 'Missing UI action type' };
  const a = (args || []).map((x) => (x == null ? '' : String(x)));

  switch (type) {
    case 'openPage':
      return websiteAction({ action: 'navigate', target: a[0] });

    case 'openSection': {
      const [pageId, sectionId] = a;
      const wasPanel = document.body.style.position === 'fixed';
      if (pageId) await websiteAction({ action: 'navigate', target: pageId });
      if (sectionId) {
        // When closing a panel (body was fixed) to scroll the page behind it,
        // wait for the body to unlock before scrolling — otherwise the scroll
        // lands on a locked, fixed body and nothing moves. Panel→panel keeps
        // the body locked, so only wait when the target is NOT a panel route.
        const targetIsPanel = pageId ? isPanelPath(pageId) : false;
        if (wasPanel && !targetIsPanel) {
          await new Promise((resolve) => {
            const start = Date.now();
            const tick = () => {
              if (document.body.style.position !== 'fixed' || Date.now() - start >= 800) return resolve();
              setTimeout(tick, 60);
            };
            tick();
          });
          await new Promise((r) => setTimeout(r, 140));
        }
        await websiteAction({ action: 'scroll', target: sectionId, options: { behavior: 'smooth' } });
      }
      return { success: true, currentPage: pageId, sectionId };
    }

    case 'scroll':
      return websiteAction({ action: 'scroll', target: a[0], options: { behavior: a[1] === 'false' ? 'auto' : 'smooth' } });

    case 'highlight':
      return websiteAction({ action: 'highlight', target: a[0], options: { duration: a[1] ? Number(a[1]) : undefined } });

    // The digital host only navigates — never opens a panel/pop-up.
    case 'openReservation':
      return websiteAction({ action: 'navigate', target: '/reserve' });

    case 'openContact':
      return websiteAction({ action: 'navigate', target: '/contact' });

    case 'openGiftCards':
      return websiteAction({ action: 'navigate', target: '/gift-cards' });

    case 'openGallery':
    case 'displaySocialPosts':
    case 'displayImages':
    case 'displayCarousel':
      return websiteAction({ action: 'navigate', target: a[0] || '/instagram' });

    case 'displayReviews':
      return websiteAction({ action: 'navigate', target: a[0] || '/' });

    case 'displayMaps': {
      const slug = (a[0] || '').toLowerCase();
      if (slug) {
        window.dispatchEvent(new CustomEvent('bogest:open-map', { detail: { slug } }));
        return { success: true, via: 'map-panel' };
      }
      return websiteAction({ action: 'navigate', target: '/locations' });
    }

    // Explicit pop-up actions are intentionally no-ops — the host navigates only.
    case 'openModal':
    case 'showNotification':
      return { success: true };

    // Close any open glass panel / slide-in overlay (dish photo, map) and
    // return to the homepage. The 'bogest:close-panel' event tells overlay
    // panels to dismiss; navigating '/' closes the glass-panel route.
    case 'closePanel':
    case 'close': {
      window.dispatchEvent(new CustomEvent('bogest:close-panel', { detail: {} }));
      await websiteAction({ action: 'navigate', target: '/' });
      return { success: true, via: 'close-panel' };
    }

    // Show a real Beeldbank photo in the slide-in dish-photo panel (NOT inline
    // in the chat). Only opens the panel when assetSearch returns a relevant
    // match for the requested dish/subject — no photo is better than a wrong
    // photo, so a no-match returns silently and the host describes instead.
    case 'showDishPhoto': {
      const [query, category, location] = a;
      // Open the panel instantly with a skeleton so the guest sees motion
      // immediately, then fill in the real photo when assetSearch resolves.
      window.dispatchEvent(new CustomEvent('bogest:show-dish-photo-loading', { detail: { query } }));
      try {
        // Always restrict dish photos to the food category so a wrong
        // location / atmosphere photo can never substitute for a dish. The
        // host may pass a different category for non-dish requests (e.g.
        // atmosphere), which is respected.
        const cat = (category && category !== 'all') ? category : 'gastronomy';
        // Dish photos are almost never location-tagged in the Beeldbank (most
        // gastronomy shots have location: unknown) — hard-filtering by the
        // visitor's current location would wipe out real matches (e.g. the
        // lasagne photo). Only keep the location filter for non-dish photos
        // (atmosphere/interiors/architecture) where it's meaningful.
        const res = await base44.functions.invoke('assetSearch', {
          query: query || '', category: cat, location: cat === 'gastronomy' ? 'all' : (location || 'all'), limit: 24,
        });
        const images = (res?.data?.images || res?.images || []).filter((im) => im.url);
        const q = _norm(query || '');
        let best = null;
        let bestScore = 0;
        for (const im of images) {
          let score = 0;
          const md = _norm(im.matched_dish || '');
          // 1) Strongest: a menu-item match (the Beeldbank links each food
          //    photo to exactly one dish). Fuzzy so "lasagne" finds "lasagna".
          if (md && q) {
            if (md === q) score = 100;
            else if (md.includes(q) || q.includes(md)) score = 80;
            else {
              const mdTokens = md.split(' ').filter(Boolean);
              const qTokens = q.split(' ').filter(Boolean);
              for (const qt of qTokens) {
                for (const mt of mdTokens) {
                  if (mt === qt) score = Math.max(score, 60);
                  else if (mt.includes(qt) || qt.includes(mt)) score = Math.max(score, 50);
                  else if (_lev(qt, mt) <= 2) score = Math.max(score, 40);
                }
              }
            }
          }
          // 2) Fallback: the photo's tags / description / subcategory mention
          //    the dish (an untagged food photo that clearly shows it).
          if (score === 0 && q) {
            const hay = _norm([(im.tags || []).join(' '), im.description || '', im.subcategory || ''].join(' '));
            const hayTokens = hay.split(' ').filter(Boolean);
            const qTokens = q.split(' ').filter(Boolean);
            let hits = 0;
            for (const qt of qTokens) {
              if (hay.includes(qt)) hits += 2;
              else { for (const ht of hayTokens) { if (_lev(qt, ht) <= 2) { hits += 1; break; } } }
            }
            if (hits >= 2) score = 30 + hits;
          }
          if (score > bestScore) { bestScore = score; best = im; }
        }
        // Require a real match — no photo is better than a wrong photo.
        if (!best || bestScore < 30) {
          // No relevant photo — dismiss the loading skeleton so the panel
          // never sits open with a spinner.
          window.dispatchEvent(new CustomEvent('bogest:close-panel'));
          return { success: false, message: 'no_relevant_photo' };
        }
        window.dispatchEvent(new CustomEvent('bogest:show-dish-photo', {
          detail: {
            url: best.url,
            name: best.matched_dish || query || 'Bogèst',
            description: best.description || '',
            location: best.location || location || '',
          },
        }));
        return { success: true, via: 'dish-photo-panel' };
      } catch {
        return { success: false, message: 'asset_search_failed' };
      }
    }

    default:
      return { success: false, message: `Unknown UI action: ${type}` };
  }
}