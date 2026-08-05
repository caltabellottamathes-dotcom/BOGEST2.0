import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useConsent, writeConsent, readConsent } from '@/lib/consentStore';

// Premium, on-brand cookie banner + preferences screen. Frosted glass, gold
// accents, rounded corners, fade + slide — matches the rest of Bogèst.
// Shows only until the visitor makes a choice; the footer "Cookievoorkeuren"
// link reopens the preferences screen any time.

const CATS = [
  {
    key: 'necessary',
    alwaysOn: true,
    title: 'Noodzakelijk',
    desc: 'Deze technieken zijn noodzakelijk om de website veilig en correct te laten functioneren. Zonder deze kan de website niet goed werken.',
  },
  {
    key: 'personalization',
    title: 'Persoonlijke ervaring',
    desc: "Sta 'Vraag het aan Bogèst!' toe om relevante informatie uit gesprekken te onthouden, zoals je naam, favoriete gerechten, dieetwensen, voorkeuren en andere informatie die je vrijwillig deelt. Hierdoor wordt ieder volgend gesprek persoonlijker en hoef je niet steeds dezelfde informatie opnieuw te geven. Deze toestemming geldt voor de geheugenfuncties van Base44 en ElevenLabs, voor zover deze worden gebruikt om jouw ervaring persoonlijker te maken.",
  },
  {
    key: 'speech',
    title: 'Spraakfunctie',
    desc: "Sta toe dat de spraakfunctie jouw gesproken audio verwerkt wanneer je ervoor kiest om met 'Vraag het aan Bogèst!' te praten. Zonder deze toestemming blijft de chatfunctie gewoon beschikbaar.",
  },
  {
    key: 'analytics',
    title: 'Websiteverbetering',
    desc: "Sta toe dat anonieme of geanonimiseerde gebruiksinformatie wordt gebruikt om onze website en 'Vraag het aan Bogèst!' verder te verbeteren. Wanneer hiervoor momenteel geen gegevens worden verzameld, mag deze categorie verborgen blijven.",
  },
];

function Toggle({ on, disabled, onChange }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className="relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
      style={{
        background: on ? 'hsl(var(--primary))' : 'rgba(120,120,120,0.35)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
      aria-pressed={on}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function BannerPanel({ onAccept, onNecessary, onManage }) {
  return (
    <div className="p-6 md:p-8">
      <button
        onClick={onNecessary}
        className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
        aria-label="Sluiten"
      >
        <X className="w-3.5 h-3.5 text-foreground/70" />
      </button>

      <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary block mb-3">Bogèst</span>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
        Een persoonlijkere ervaring<span className="text-primary">?</span>
      </h2>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">
        Om onze website goed te laten werken gebruiken we cookies en vergelijkbare technieken.
      </p>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
        Met jouw toestemming mag <strong className="text-foreground/90 font-medium">‘Vraag het aan Bogèst!’</strong> ook relevante informatie uit gesprekken onthouden, zoals je voorkeuren, favoriete gerechten en andere informatie die je vrijwillig met ons deelt. Zo hoef je niet steeds opnieuw dezelfde informatie te vertellen en kunnen we je persoonlijker helpen bij een volgend bezoek.
      </p>
      <p className="font-body text-xs text-muted-foreground/80 mb-6">
        Je bepaalt zelf welke gegevens we hiervoor mogen gebruiken. Je kunt jouw keuze op ieder moment wijzigen.
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onAccept}
          className="flex-1 px-5 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: '1px solid hsl(var(--primary))' }}
        >
          Alles accepteren
        </button>
        <button
          onClick={onNecessary}
          className="flex-1 px-5 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'hsl(var(--foreground))', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          Alleen noodzakelijk
        </button>
        <button
          onClick={onManage}
          className="flex-1 px-5 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'transparent', color: 'hsl(var(--foreground))', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          Voorkeuren beheren
        </button>
      </div>
    </div>
  );
}

function PrefsPanel({ prefs, setPrefs, onAcceptAll, onSave, onCancel }) {
  const visibleCats = CATS.filter((c) => c.key !== 'analytics');
  const setCat = (key, val) => setPrefs((p) => ({ ...p, [key]: val }));
  return (
    <div className="flex flex-col max-h-[80vh]">
      <div className="p-6 md:p-8 pb-4 flex-shrink-0">
        <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary block mb-3">Bogèst</span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Cookievoorkeuren<span className="text-primary">.</span>
        </h2>
      </div>
      <div className="px-6 md:px-8 overflow-y-auto bogest-scroll flex-1 min-h-0 space-y-3 pb-2">
        {visibleCats.map((c) => (
          <div
            key={c.key}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-heading text-base font-semibold text-foreground">{c.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                {c.alwaysOn && (
                  <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/80">Altijd actief</span>
                )}
                <Toggle
                  on={c.alwaysOn ? true : !!prefs[c.key]}
                  disabled={!!c.alwaysOn}
                  onChange={(v) => setCat(c.key, v)}
                />
              </div>
            </div>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="p-6 md:p-8 pt-4 flex flex-col sm:flex-row gap-2.5 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
        <button
          onClick={onAcceptAll}
          className="flex-1 px-5 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: '1px solid hsl(var(--primary))' }}
        >
          Alles accepteren
        </button>
        <button
          onClick={onSave}
          className="flex-1 px-5 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'hsl(var(--foreground))', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          Selectie opslaan
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-5 py-3 rounded-full font-body text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]"
          style={{ background: 'transparent', color: 'hsl(var(--foreground))', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}

export default function CookieBanner() {
  const consent = useConsent();
  const [view, setView] = useState('none'); // 'banner' | 'prefs' | 'none'
  const [prefs, setPrefs] = useState(() => readConsent());

  // Show the banner only when the visitor hasn't chosen yet.
  useEffect(() => {
    if (!consent.decided) setView('banner');
  }, [consent.decided]);

  // Footer / external "Cookievoorkeuren" link reopens preferences any time.
  useEffect(() => {
    const open = () => {
      setPrefs(readConsent());
      setView('prefs');
    };
    window.addEventListener('bogest:open-cookie-preferences', open);
    return () => window.removeEventListener('bogest:open-cookie-preferences', open);
  }, []);

  const acceptAll = () => {
    writeConsent({ personalization: true, speech: true, analytics: true });
    setView('none');
  };
  const onlyNecessary = () => {
    writeConsent({ personalization: false, speech: false, analytics: false });
    setView('none');
  };
  const saveSelection = () => {
    writeConsent({ personalization: prefs.personalization, speech: prefs.speech, analytics: prefs.analytics });
    setView('none');
  };

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.16)',
  };

  return (
    <AnimatePresence>
      {view !== 'none' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={(e) => { if (e.target === e.currentTarget && view === 'prefs') setView('none'); }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg rounded-[24px] overflow-hidden relative"
            style={{ ...glass, boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}
          >
            {view === 'banner' ? (
              <BannerPanel onAccept={acceptAll} onNecessary={onlyNecessary} onManage={() => { setPrefs(readConsent()); setView('prefs'); }} />
            ) : (
              <PrefsPanel prefs={prefs} setPrefs={setPrefs} onAcceptAll={acceptAll} onSave={saveSelection} onCancel={() => setView('none')} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}