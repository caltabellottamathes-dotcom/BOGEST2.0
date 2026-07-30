import React, { useState } from 'react';
import { X, Rocket, Sparkles, Globe, Loader2, Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['interiors', 'gastronomy', 'atmosphere', 'architecture', 'branding'];
const CAT_LABELS = { interiors: 'Interieur', gastronomy: 'Gastronomie', atmosphere: 'Sfeer', architecture: 'Architectuur', branding: 'Branding' };

const SITES = ['TripAdvisor', 'Instagram', 'Facebook Hasselt', "Facebook d'Entrecote", 'Facebook Zolder', 'bogest.be', 'd-entrecote.be'];

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border p-4 bg-card/40">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm';

export default function AdminPanel({ onClose, onChanged }) {
  const [kickstart, setKickstart] = useState({ limit: 15, running: false, result: null, error: null });
  const [discovery, setDiscovery] = useState({ theme: 'gastronomy', limit: 3, useWebSearch: false, running: false, result: null, error: null });
  const [auto, setAuto] = useState({ limit: 10, running: false, result: null, error: null });

  const runKickstart = async () => {
    setKickstart((k) => ({ ...k, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { kickstart: true, limit: kickstart.limit });
      setKickstart((k) => ({ ...k, result: res.data, running: false }));
      onChanged?.();
    } catch (e) {
      setKickstart((k) => ({ ...k, error: e?.response?.data?.error || e?.message || 'Kickstart mislukt', running: false }));
    }
  };

  const runDiscovery = async () => {
    setDiscovery((d) => ({ ...d, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { theme: discovery.theme, limit: discovery.limit, useWebSearch: discovery.useWebSearch });
      setDiscovery((d) => ({ ...d, result: res.data, running: false }));
      onChanged?.();
    } catch (e) {
      setDiscovery((d) => ({ ...d, error: e?.response?.data?.error || e?.message || 'Zoekopdracht mislukt', running: false }));
    }
  };

  // Automatic site-scoped discovery: SerpApi google_images per domain → dedup
  // (content_hash + phash) → vision filter → auto-import ONLY new, unique,
  // relevant photos. No manual selection needed.
  const runAuto = async () => {
    setAuto((a) => ({ ...a, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', { auto: true, limit: auto.limit });
      setAuto((a) => ({ ...a, result: res.data, running: false }));
      onChanged?.();
    } catch (e) {
      setAuto((a) => ({ ...a, error: e?.response?.data?.error || e?.message || 'Automatische ontdekking mislukt', running: false }));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 z-[111] w-full max-w-md bg-background border-r border-border overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">Beheer</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          <Section icon={Wand2} title="Automatische ontdekking">
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Doorzoekt automatisch TripAdvisor, Instagram, de Facebook-pagina's, bogest.be en d-entrecote.be via SerpApi. Vergelijkt elke foto met het archief (content + perceptuele hash) en importeert enkel nieuwe, unieke, relevante foto's — volledig automatisch.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SITES.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">{s}</span>
              ))}
            </div>
            <label className="block font-body text-xs text-muted-foreground mb-1">Max. nieuwe foto's</label>
            <input type="number" min={1} max={30} value={auto.limit}
              onChange={(e) => setAuto((a) => ({ ...a, limit: Math.max(1, Math.min(30, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <button onClick={runAuto} disabled={auto.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {auto.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig…</> : <><Wand2 className="w-4 h-4" /> Ontdek & importeer</>}
            </button>
            {auto.result && (
              <div className="font-body text-[11px] text-primary mt-2 space-y-0.5">
                <p>{auto.result.stored} nieuw toegevoegd · {auto.result.candidates} kandidaten</p>
                <p className="text-muted-foreground">{auto.result.skippedDup} duplicaten · {auto.result.skippedFilter} gefilterd · {auto.result.rejected} afgewezen</p>
              </div>
            )}
            {auto.error && <p className="font-body text-[11px] text-destructive mt-2">{auto.error}</p>}
          </Section>

          <Section icon={Rocket} title="Bibliotheek vullen">
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Importeert alle afbeeldingen van de website + gekende seeds en categoriseert ze.
            </p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal</label>
            <input type="number" min={1} max={40} value={kickstart.limit}
              onChange={(e) => setKickstart((k) => ({ ...k, limit: Math.max(1, Math.min(40, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <button onClick={runKickstart} disabled={kickstart.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {kickstart.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Vullen…</> : <><Rocket className="w-4 h-4" /> Vullen</>}
            </button>
            {kickstart.result && <p className="font-body text-[11px] text-primary mt-2">{kickstart.result.stored} toegevoegd · {kickstart.result.candidates} kandidaten</p>}
            {kickstart.error && <p className="font-body text-[11px] text-destructive mt-2">{kickstart.error}</p>}
          </Section>

          <Section icon={Sparkles} title="Thematische discovery">
            <p className="font-body text-xs text-muted-foreground mb-3">Lichte zoekopdracht per thema.</p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Thema</label>
            <select value={discovery.theme} onChange={(e) => setDiscovery((d) => ({ ...d, theme: e.target.value }))} className={inputCls + ' mb-3'}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal</label>
            <input type="number" min={1} max={10} value={discovery.limit}
              onChange={(e) => setDiscovery((d) => ({ ...d, limit: Math.max(1, Math.min(10, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <label className="flex items-center gap-2.5 mb-3 cursor-pointer">
              <input type="checkbox" checked={discovery.useWebSearch} onChange={(e) => setDiscovery((d) => ({ ...d, useWebSearch: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <span className="font-body text-xs text-foreground/70">Diep web-zoeken (trager)</span>
            </label>
            <button onClick={runDiscovery} disabled={discovery.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {discovery.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig…</> : <><Sparkles className="w-4 h-4" /> Uitvoeren</>}
            </button>
            {discovery.result && <p className="font-body text-[11px] text-primary mt-2">{discovery.result.stored} toegevoegd · {discovery.result.candidates} kandidaten</p>}
            {discovery.error && <p className="font-body text-[11px] text-destructive mt-2">{discovery.error}</p>}
          </Section>

          <p className="font-body text-[10px] text-muted-foreground/70 leading-relaxed pt-1">
            <Globe className="w-3 h-3 inline mr-1 text-primary/70" />
            De dagelijkse workflow draait de automatische ontdekking elke nacht om 03:00 — nieuwe foto's verschijnen automatisch in de beeldbank.
          </p>
        </div>
      </div>
    </>
  );
}