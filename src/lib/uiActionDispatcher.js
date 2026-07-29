import { websiteAction } from './websiteDispatcher';

/**
 * UI Action Layer (Section 5) — the single contract between the Base44
 * text-chat agent (VraagHetBogest) and the website front end.
 *
 * The agent emits [UIACTION:type|arg1|arg2|...] tags in its chat replies.
 * The Digital Host parses them and calls dispatchUIAction({ type, args }).
 *
 * Navigation / panel actions route to the existing websiteAction dispatcher.
 * Visual media actions (openGallery, displaySocialPosts, displayImages,
 * displayCarousel, displayReviews, displayMaps, openModal, showNotification)
 * dispatch a `bogest:ui-action` CustomEvent that <UIActionOverlay /> renders.
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

    case 'openReservation': {
      await websiteAction({ action: 'open', target: 'reservation' });
      window.dispatchEvent(new CustomEvent('bogest:reservation-prefill', { detail: { location: a[0], date: a[1], partySize: a[2] } }));
      return { success: true };
    }

    case 'openContact':
      return websiteAction({ action: 'open', target: 'contact-form' });

    case 'openGiftCards':
      return websiteAction({ action: 'open', target: 'gift-cards' });

    // Visual / media renderers → handled by <UIActionOverlay />
    case 'openGallery':
    case 'displaySocialPosts':
    case 'displayImages':
    case 'displayCarousel':
    case 'displayReviews':
    case 'displayMaps':
    case 'openModal':
    case 'showNotification': {
      window.dispatchEvent(new CustomEvent('bogest:ui-action', { detail: { type, args: a } }));
      return { success: true };
    }

    default:
      return { success: false, message: `Unknown UI action: ${type}` };
  }
}