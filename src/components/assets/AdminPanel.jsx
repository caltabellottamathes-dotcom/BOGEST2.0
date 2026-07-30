import React, { useState } from 'react';
import { X, Rocket, Sparkles, Globe, Loader2, Wand2, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SITES = ['TripAdvisor', 'Instagram', 'Facebook Hasselt', "Facebook d'Entrecote", 'Facebook Zolder', 'bogest.be', 'd-entrecote.be'];

const SEARCH_SUGGESTIONS = [
  'Bogèst restaurant Hasselt', 'Bogèst restaurant Borgloon', 'Bogèst restaurant Heusden-Zolder',
  'Bogèst interieur veranda', 'Bogèst terras', 'Bogèst eetzaal',
  'Bogèst steak beef grilled', 'Bogèst Belgian Blue', 'Bogèst spare ribs',
  'Bogèst desserts', 'Bogèst wijn bar', 'Bogèst cocktails',
  'Bogèst staff chef', 'Bogèst guests dining', 'Bogèst event group',
  'Bogèst kerst decoratie', 'Bogèst valentijn diner',
];

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

function ResultLine({ result, error }) {
  if (error) return <p className="font-body text-[11px] text-destructive mt-2">{error}</p>;
  if (!result) return null;
  return (
    <div className="font-body text-[11px] text-primary mt-2 space-y-0.5">
      <p>{result.stored} nieuw toegevoegd · {result.candidates} kandidaten</p>
      <p className="text-muted-foreground">{result.skippedDup} duplicaten · {result.skippedFilter} gefilterd · {result.rejected} afgewezen</p>
    </div>
  );
}

export default function AdminPanel({ onClose, onChanged }) {
  const [auto, setAuto] = useState({ limit: 10, running: false, result: null, error: null });
  const [fill, setFill] = useState({ limit: 15, running: false, result: null, error: null });
  const [targeted, setTargeted] = useState({ query: 'Bogèst restaurant', limit: 8, running: false, result: null, error: null });

  const run = async (key, payload, state, setter) => {
    setter((s) => ({ ...s, running: true, result: null, error: null }));
    try {
      const res = await base44.functions.invoke('discoverAssets', payload);
      setter((s) => ({ ...s, result: res.data, running: false }));
      onChanged?.();
    } catch (e) {
      setter((s) => ({ ...s, error: e?.response?.data?.error || e?.message || 'Actie mislukt', running: false }));
    }
  };

  const runAuto = () => run('auto', { auto: true, limit: auto.limit }, auto, setAuto);
  const runFill = () => run('fill', { fill: true, limit: fill.limit }, fill, setFill);
  const runTargeted = () => run('serp', { serpQuery: targeted.query, num: Math.min(30, targeted.limit * 3), limit: targeted.limit }, targeted, setTargeted);

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
          <Section icon={Search} title="Gericht zoeken (SerpApi)">
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Zoek gericht naar foto's met een eigen zoekterm — gebaseerd op categorieën en tags. Elke foto wordt gedupliceerd gecontroleerd en door de relevante-poort gehaald.
            </p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Zoekterm</label>
            <input value={targeted.query} onChange={(e) => setTargeted((t) => ({ ...t, query: e.target.value }))}
              placeholder="bv. Bogèst Belgian Blue beef" className={inputCls + ' mb-2'} />
            <div className="flex flex-wrap gap-1 mb-3 max-h-24 overflow-y-auto">
              {SEARCH_SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setTargeted((t) => ({ ...t, query: s }))}
                  className="text-[10px] py-1 px-2 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors">
                  {s}
                </button>
              ))}
            </div>
            <label className="block font-body text-xs text-muted-foreground mb-1">Max. nieuwe foto's</label>
            <input type="number" min={1} max={20} value={targeted.limit}
              onChange={(e) => setTargeted((t) => ({ ...t, limit: Math.max(1, Math.min(20, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <button onClick={runTargeted} disabled={targeted.running || !targeted.query.trim()}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {targeted.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig…</> : <><Search className="w-4 h-4" /> Zoek & importeer</>}
            </button>
            <ResultLine result={targeted.result} error={targeted.error} />
          </Section>

          <Section icon={Rocket} title="Bibliotheek vullen (SerpApi)">
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Vult de beeldbank met een brede SerpApi-zoekset over alle vestigingen en onderwerpen — dezelfde engine als gericht zoeken.
            </p>
            <label className="block font-body text-xs text-muted-foreground mb-1">Aantal</label>
            <input type="number" min={1} max={40} value={fill.limit}
              onChange={(e) => setFill((f) => ({ ...f, limit: Math.max(1, Math.min(40, Number(e.target.value) || 1)) }))}
              className={inputCls + ' mb-3'} />
            <button onClick={runFill} disabled={fill.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {fill.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Vullen…</> : <><Rocket className="w-4 h-4" /> Vullen</>}
            </button>
            <ResultLine result={fill.result} error={fill.error} />
          </Section>

          <Section icon={Wand2} title="Automatische ontdekking (SerpApi)">
            <p className="font-body text-xs text-muted-foreground mb-3 leading-relaxed">
              Doorzoekt automatisch TripAdvisor, Instagram, de Facebook-pagina's, bogest.be en d-entrecote.be via SerpApi. Importeert enkel nieuwe, unieke, relevante foto's.
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
            <ResultLine result={auto.result} error={auto.error} />
          </Section>

          <p className="font-body text-[10px] text-muted-foreground/70 leading-relaxed pt-1">
            <Globe className="w-3 h-3 inline mr-1 text-primary/70" />
            De dagelijkse workflow draait de automatische ontdekking elke nacht — nieuwe foto's verschijnen automatisch. Elke import wordt nu dubbel gecontroleerd (URL + content + perceptuele hash) en door een strenge relevante-poort gehaald.
          </p>
        </div>
      </div>
    </>
  );
}