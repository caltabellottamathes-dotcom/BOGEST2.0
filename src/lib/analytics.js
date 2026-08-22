import { base44 } from '@/api/base44Client';

// Centrale event-helper: meet in Base44-analytics én Google Analytics 4 (indien actief).
// GA4 wordt in index.html geladen zodra een echte property-ID is ingesteld (zie checklist).
export function trackEvent(name, props = {}) {
  try { base44.analytics?.track?.({ eventName: name, properties: props }); } catch {}
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, props);
    }
  } catch {}
}

export function trackPhone(location) {
  trackEvent('phone_click', { location: location || 'unknown' });
}

export function trackRoute(location) {
  trackEvent('route_click', { location: location || 'unknown' });
}

export function trackReserveStart(location) {
  trackEvent('reserve_start', { location: location || 'all' });
}