import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOC_ADDRESSES = {
  hasselt: { name: 'Bogèst Hasselt', address: 'Luikersteenweg 516, 3501 Wimmertingen' },
  borgloon: { name: 'Bogèst Borgloon', address: 'Graathempoort 33, 3840 Borgloon' },
  'heusden-zolder': { name: 'Bogèst Heusden-Zolder', address: 'Stationsstraat 67, 3550 Heusden-Zolder' },
};

function normalizeLoc(l) {
  if (!l) return null;
  const k = String(l).toLowerCase().trim();
  if (k.includes('hasselt')) return 'hasselt';
  if (k.includes('borgloon')) return 'borgloon';
  if (k.includes('heusden') || k.includes('zolder')) return 'heusden-zolder';
  return null;
}

function titleFor(type, args) {
  const t = {
    openGallery: 'Sfeerbeelden',
    displaySocialPosts: 'Instagram',
    displayImages: 'Beelden',
    displayCarousel: 'Meer',
    displayReviews: 'Gastenreviews',
    displayMaps: 'Locatie',
    openModal: args[0] || 'Info',
  };
  return t[type] || 'Bogèst';
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(231,205,112,0.25)', borderTopColor: 'hsl(var(--primary))' }} />
    </div>
  );
}

function renderBody(type, args, items, locInfo) {
  if (type === 'openGallery' || type === 'displaySocialPosts') {
    if (!items || items.length === 0)
      return <p className="font-body text-sm text-center py-10" style={{ color: 'rgba(255,255,255,0.6)' }}>Geen beelden gevonden.</p>;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {items.map((p, i) => (
          <a key={i} href={p.permalink || '#'} target="_blank" rel="noopener noreferrer" className="block relative rounded-xl overflow-hidden group" style={{ aspectRatio: '1 / 1' }}>
            <img src={p.media_url} alt={p.caption || 'Bogèst'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            {p.caption && <span className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-body line-clamp-1" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: 'rgba(255,255,255,0.9)' }}>{p.caption}</span>}
          </a>
        ))}
      </div>
    );
  }
  if (type === 'displayImages' || type === 'displayCarousel') {
    const urls = (args[0] || '').split(',').map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return <p className="font-body text-sm text-center py-10" style={{ color: 'rgba(255,255,255,0.6)' }}>Geen beelden beschikbaar.</p>;
    if (type === 'displayCarousel') {
      return (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {urls.map((u, i) => <img key={i} src={u} alt="Bogèst" className="rounded-xl object-cover flex-shrink-0" style={{ width: 220, height: 220 }} loading="lazy" />)}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {urls.map((u, i) => <img key={i} src={u} alt="Bogèst" className="rounded-xl w-full object-cover" style={{ aspectRatio: '4 / 3' }} loading="lazy" />)}
      </div>
    );
  }
  if (type === 'displayReviews') {
    if (!items || items.length === 0) return <p className="font-body text-sm text-center py-10" style={{ color: 'rgba(255,255,255,0.6)' }}>Nog geen reviews beschikbaar.</p>;
    return (
      <div className="space-y-3">
        {items.map((r, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-body text-sm font-semibold" style={{ color: 'rgba(255,240,200,0.95)' }}>{r.author_name || 'Gast'}</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="w-3 h-3" style={{ color: n <= (r.rating || 0) ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.2)', fill: n <= (r.rating || 0) ? 'hsl(var(--primary))' : 'transparent' }} />
                ))}
              </div>
            </div>
            {r.title && <p className="font-heading text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{r.title}</p>}
            {r.text && <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{r.text}</p>}
          </div>
        ))}
      </div>
    );
  }
  if (type === 'displayMaps') {
    if (!locInfo) return <p className="font-body text-sm text-center py-10" style={{ color: 'rgba(255,255,255,0.6)' }}>Locatie niet gevonden.</p>;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locInfo.name + ' ' + locInfo.address)}`;
    return (
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(231,205,112,0.15)', border: '1px solid rgba(231,205,112,0.35)' }}>
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <p className="font-heading text-lg font-bold mb-1" style={{ color: 'rgba(255,240,200,0.97)' }}>{locInfo.name}</p>
        <p className="font-body text-sm mb-5" style={{ color: 'rgba(255,255,255,0.8)' }}>{locInfo.address}</p>
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-xs uppercase tracking-widest" style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
          Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }
  if (type === 'openModal') {
    return <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.9)' }}>{args[1] || args[0] || ''}</p>;
  }
  return null;
}

export default function UIActionOverlay() {
  const [action, setAction] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer = null;
    const handler = async (e) => {
      const { type, args } = e.detail || {};
      setAction({ type, args });
      setItems([]);
      if (type === 'showNotification') {
        const dur = Number(args[2]) || 4200;
        timer = setTimeout(() => setAction(null), dur);
        return;
      }
      if (type === 'openGallery' || type === 'displaySocialPosts') {
        setLoading(true);
        try {
          const loc = normalizeLoc(args[1]);
          const posts = loc
            ? await base44.entities.InstagramPost.filter({ location_name: loc }, '-posted_at', 12)
            : await base44.entities.InstagramPost.list('-posted_at', 12);
          setItems((posts || []).filter((p) => p.media_type !== 'VIDEO' && p.media_url));
        } catch { setItems([]); }
        setLoading(false);
      } else if (type === 'displayReviews') {
        setLoading(true);
        try {
          const loc = normalizeLoc(args[0]);
          const reviews = loc
            ? await base44.entities.ZenchefReview.filter({ location: loc }, '-date', 8)
            : await base44.entities.ZenchefReview.list('-date', 8);
          setItems(reviews || []);
        } catch { setItems([]); }
        setLoading(false);
      }
    };
    window.addEventListener('bogest:ui-action', handler);
    return () => { window.removeEventListener('bogest:ui-action', handler); if (timer) clearTimeout(timer); };
  }, []);

  const close = () => setAction(null);
  if (!action) return null;
  const { type, args } = action;

  if (type === 'showNotification') {
    const severity = args[1] || 'success';
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -28 }} transition={{ duration: 0.3 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-[100003] px-4 w-auto max-w-[92vw]">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: severity === 'error' ? 'rgba(170,40,30,0.92)' : 'rgba(12,10,6,0.85)', backdropFilter: 'blur(22px) saturate(160%)', WebkitBackdropFilter: 'blur(22px) saturate(160%)', border: '1px solid ' + (severity === 'error' ? 'rgba(255,130,120,0.5)' : 'rgba(231,205,112,0.4)'), boxShadow: '0 12px 32px rgba(0,0,0,0.45)' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: severity === 'error' ? '#ff8a80' : 'hsl(var(--primary))' }} />
            <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.96)' }}>{args[0]}</p>
            <button onClick={close} className="ml-1 text-white/60 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const isMap = type === 'displayMaps';
  const loc = normalizeLoc(isMap ? args[0] : (type === 'displayReviews' ? args[0] : null));
  const locInfo = loc ? LOC_ADDRESSES[loc] : null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[100003] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 18 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} className="relative w-full rounded-[20px] overflow-hidden flex flex-col" style={{ maxWidth: isMap ? 460 : 720, maxHeight: '86vh', background: 'rgba(12,10,6,0.94)', backdropFilter: 'blur(28px)', border: '1px solid rgba(231,205,112,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(231,205,112,0.18)' }}>
            <h3 className="font-heading text-lg font-bold" style={{ color: 'rgba(255,240,200,0.97)' }}>{titleFor(type, args)}</h3>
            <button onClick={close} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}><X className="w-4 h-4" /></button>
          </div>
          <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: 'calc(86vh - 64px)' }}>
            {loading ? <Spinner /> : renderBody(type, args, items, locInfo)}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}