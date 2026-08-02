import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, RotateCcw, Pencil, Check, ImageIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useSiteImages } from '@/lib/SiteImageContext';
import { useLang } from '@/lib/LangContext';
import { translations } from '@/lib/i18n';

/**
 * BeeldbankEditor — in-place beeld- en tekstbewerking voor de hele live site.
 * Alleen zichtbaar wanneer de bezoeker is ingelogd als Beeldbank-admin
 * (sessionStorage 'bogest-admin-auth' === '1', zie AdminLogin / AdminGate).
 *
 * Beeld: elk element met een `data-bb-key` (positie-sleutel uit siteImages.js)
 * krijgt in bewerkingsmodus een gouden contour; klikken opent de Beeldbank-
 * picker om het beeld te vervangen (persisteert via siteImagesApi).
 * Tekst: klik op een tekst-element → inline bewerkbaar; op blur wordt de
 * bijhorende i18n-sleutel herkend en de nieuwe tekst opgeslagen via
 * siteTextApi (override laadt door in LangContext.t()).
 */
export default function BeeldbankEditor() {
  const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem('bogest-admin-auth') === '1';
  const [editMode, setEditMode] = useState(false);
  const [picker, setPicker] = useState(null); // { key, label }
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const { setOverride, clearOverride } = useSiteImages();
  const { lang, reloadTextOverrides } = useLang();
  const reverseRef = useRef({});

  // Reverse dictionary (text → i18n key) for auto-detecting edited text keys.
  useEffect(() => {
    const dict = translations[lang] || translations.nl;
    const map = {};
    for (const k in dict) {
      const v = String(dict[k]);
      if (v && !map[v]) map[v] = k;
    }
    reverseRef.current = map;
  }, [lang]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  // Edit-mode interaction: one capture-phase click handler that makes the whole
  // site inert, routes image clicks to the picker, and makes text leaves editable.
  useEffect(() => {
    if (!editMode) return;
    const onClick = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      // Editor UI (toggle, picker, toast) stays interactive.
      if (t.closest('[data-bb-ui]')) return;
      e.preventDefault();
      e.stopPropagation();

      // Image with a position key → open picker.
      const imgEl = t.closest('[data-bb-key]');
      if (imgEl) {
        setPicker({ key: imgEl.getAttribute('data-bb-key'), label: imgEl.getAttribute('data-bb-label') || imgEl.getAttribute('data-bb-key') });
        return;
      }

      // Text leaf — element with a direct non-empty text node and few children.
      if (t.closest('input,textarea,svg,canvas,video')) return;
      const hasText = Array.from(t.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText || t.children.length > 3) return;

      const oldText = t.textContent.trim();
      t.setAttribute('contenteditable', 'true');
      t.style.outline = '2px solid hsl(40 50% 57%)';
      t.style.outlineOffset = '2px';
      t.focus();
      try {
        const range = document.createRange(); range.selectNodeContents(t);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      } catch {}

      let done = false;
      const finish = () => {
        if (done) return; done = true;
        t.removeEventListener('blur', finish);
        t.removeAttribute('contenteditable');
        t.style.outline = ''; t.style.outlineOffset = '';
        const newText = t.textContent.trim();
        if (newText && newText !== oldText) {
          const key = reverseRef.current[oldText];
          if (key) {
            base44.functions.invoke('siteTextApi', { action: 'set', key, lang, value: newText })
              .then(() => { reloadTextOverrides?.(); flash('Tekst opgeslagen'); })
              .catch(() => { t.textContent = oldText; flash('Opslaan mislukt'); });
          } else {
            // No matching i18n key (hardcoded text) — revert, not editable here.
            t.textContent = oldText;
            flash('Tekst niet herkend (geen i18n-sleutel)');
          }
        } else {
          t.textContent = oldText;
        }
      };
      t.addEventListener('blur', finish);
    };
    document.addEventListener('click', onClick, true);

    // Outline style for replaceable images/videos.
    const style = document.createElement('style');
    style.id = 'bb-edit-style';
    style.textContent = `
      [data-bb-key] { cursor: pointer !important; outline: 2px dashed hsl(40 50% 57% / 0.85) !important; outline-offset: 3px; }
      [data-bb-key]::after { content: 'Wissel'; position:absolute; top:8px; left:8px; font:600 9px/1 Inter,sans-serif; letter-spacing:.2em; text-transform:uppercase; color:#1a1812; background:hsl(40 50% 57%); padding:3px 7px; border-radius:6px; z-index:99999; pointer-events:none; }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.getElementById('bb-edit-style')?.remove();
    };
  }, [editMode, lang, reloadTextOverrides]);

  // Load Beeldbank assets when the picker opens.
  useEffect(() => {
    if (!picker) return;
    let alive = true;
    setLoading(true);
    base44.functions.invoke('assetsApi', { limit: 200 })
      .then((res) => { if (alive) setAssets(res.data?.items || []); })
      .catch(() => { if (alive) setAssets([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [picker]);

  if (!isAdmin) return null;

  const pick = (asset) => {
    setOverride(picker.key, asset.image_url, asset.id);
    setPicker(null);
    flash('Beeld vervangen');
  };
  const reset = () => {
    clearOverride(picker.key);
    setPicker(null);
    flash('Terug naar standaardbeeld');
  };

  const q = search.trim().toLowerCase();
  const filtered = q
    ? assets.filter((a) => [a.description, a.mood, a.location, a.primary_category, ...(a.categories || []), ...(a.tags || [])].join(' ').toLowerCase().includes(q))
    : assets;

  return (
    <>
      {/* Floating toggle — bottom-left, away from the ElevenLabs orb & footer */}
      <div data-bb-ui className="fixed bottom-5 left-5 z-[99998]">
        <button
          onClick={() => setEditMode((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
          style={{
            background: editMode ? 'hsl(40 50% 57%)' : 'rgba(26,24,20,0.72)',
            color: editMode ? '#1a1812' : 'rgba(255,255,255,0.92)',
            border: editMode ? '1px solid hsl(40 50% 57%)' : '1px solid rgba(200,163,89,0.30)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}
        >
          {editMode ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
          {editMode ? 'Klaar' : 'Beeldbank-modus'}
        </button>
      </div>

      {/* Edit-mode hint bar */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            data-bb-ui
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[99998] px-4 py-2 rounded-full"
            style={{ background: 'rgba(26,24,20,0.78)', border: '1px solid rgba(200,163,89,0.30)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/85 whitespace-nowrap">
              Klik een beeld om te wisselen · klik tekst om te bewerken
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            data-bb-ui
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 left-5 z-[99998] px-4 py-2 rounded-full"
            style={{ background: 'hsl(40 50% 57%)', color: '#1a1812' }}
          >
            <p className="font-body text-[10px] tracking-[0.2em] uppercase font-semibold">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset picker */}
      <AnimatePresence>
        {picker && (
          <motion.div
            data-bb-ui
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            style={{ background: 'rgba(10,8,4,0.78)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setPicker(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
              style={{ background: 'hsl(25 6% 9%)', border: '1px solid rgba(200,163,89,0.22)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <ImageIcon className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">Beeld wisselen</p>
                  <p className="font-heading text-sm text-foreground truncate">{picker.label}</p>
                </div>
                <button onClick={reset} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                  <RotateCcw className="w-3 h-3" /> Standaard
                </button>
                <button onClick={() => setPicker(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Zoek in de Beeldbank…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto bogest-scroll p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : filtered.length === 0 ? (
                  <p className="font-body text-sm text-muted-foreground text-center py-20">Geen beelden gevonden.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filtered.map((a) => (
                      <button key={a.id} onClick={() => pick(a)} className="group relative aspect-square rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={a.image_url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                          <span className="font-body text-[9px] tracking-[0.15em] uppercase text-white/90">Kies</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}