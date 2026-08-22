import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '@/lib/LangContext';
import { resolveSeo } from '@/lib/seoPages';

const ORIGIN = 'https://www.bogest.be';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href, attrs = {}) {
  // match by rel + hreflang (for alternate) so we manage each one
  const hreflang = attrs.hreflang;
  let selector = `link[rel="${rel}"]`;
  if (hreflang) selector += `[hreflang="${hreflang}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SeoHead() {
  const location = useLocation();
  const { lang } = useLang();
  const pathname = location.pathname;

  useEffect(() => {
    const seo = resolveSeo(pathname, lang);
    const url = `${ORIGIN}${seo.canonicalPath || pathname}`;

    document.title = seo.title;
    setMeta('name', 'description', seo.description);

    // Open Graph
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', seo.image);
    setMeta('property', 'og:locale', lang === 'fr' ? 'fr_BE' : lang === 'en' ? 'en_US' : 'nl_BE');

    // Twitter
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setMeta('name', 'twitter:image', seo.image);

    // Canonical
    setLink('canonical', url);

    // hreflang — single-URL multilingual SPA: self-referencing alternates
    setLink('alternate', url, { hreflang: 'nl-be' });
    setLink('alternate', url, { hreflang: 'fr-be' });
    setLink('alternate', url, { hreflang: 'en' });
    setLink('alternate', url, { hreflang: 'x-default' });

    // Per-vestiging JSON-LD (dynamisch, zelfde bron als de pagina)
    const schema = seo.schema;
    let ld = document.getElementById('bogest-route-ld');
    if (schema) {
      if (!ld) {
        ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.id = 'bogest-route-ld';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(schema);
    } else if (ld) {
      ld.remove();
    }
  }, [pathname, lang]);

  return null;
}