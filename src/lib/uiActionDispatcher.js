import { websiteAction } from './websiteDispatcher';

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
      if (pageId) await websiteAction({ action: 'navigate', target: pageId });
      if (sectionId) await websiteAction({ action: 'scroll', target: sectionId, options: { behavior: 'smooth' } });
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

    default:
      return { success: false, message: `Unknown UI action: ${type}` };
  }
}