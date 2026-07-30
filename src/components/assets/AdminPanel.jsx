import React, { useState } from 'react';
import { X, Loader2, Globe, Layers, Sparkles, Check, AlertCircle, Crosshair, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SOURCES = [
  'bogest.be — alle pagina\'s (via sitemap)',
  'd-entrecote.be',
  'Tripadvisor — Borgloon, Hasselt & Heusden-Zolder',
  'Facebook — alle vestigingspagina\'s',
  'Instagram — verbonden account',
];

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between font-body text-[11px] py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function Card({ icon: Icon, title, desc, children }) {
  return (
    <div className="rounded-xl border border-border p-4 bg-card/40">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">{title}</h3>
      </div>
      <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>
      {children}
    </div>
  );
}

function ResultBlock({ result, error, statRows }) {
  if (error) {
    return <p className="font-body text-[11px] text-destructive mt-2 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> {error}</p>;
  }
  if (!result) return null;
  return (
    <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
      <p className="font-body text-[11px] text-primary mb-2 flex items-center gap-1.5"><Check className="w-3 h-3" /> Voltooid</p>
      {statRows.map((r) => <Stat key={r.label} label={r.label} value={r.value} />)}
    </div>
  );
}

export default function AdminPanel({ onClose, onChanged }) {
  const [discoverMax, setDiscoverMax] = useState(15);
  const [discover, setDiscover] = useState({ running: false, result: null, error: null });
  const [topic, setTopic] = useState('');
  const [topicMax, setTopicMax] = useState(15);
  const [topicState, setTopicState] = useState({ running: false, result: null, error: null });
  const [dedupe, setDedupe] = useState({ running: false, result: null, error: null });
  const [bulk, setBulk] = useState({ running: false, total: 0, done: 0, errors: 0, results: [] });

  const runDiscover = async () => {
    setDiscover({ running: true, result: null, error: null });
    try {
      const res = await base44.functions.invoke('discoverAssets', { discoverAll: true, limit: discoverMax });
      setDiscover({ running: false, result: res.data, error: null });
      onChanged?.();
    } catch (e) {
      setDiscover({ running: false, error: e?.response?.data?.error || e?.message || 'Ontdekking mislukt' });
    }
  };

  const runTopic = async () => {
    if (!topic.trim()) return;
    setTopicState({ running: true, result: null, error: null });
    try {
      const res = await base44.functions.invoke('discoverAssets', { topic: topic.trim(), limit: topicMax });
      setTopicState({ running: false, result: res.data, error: null });
      onChanged?.();
    } catch (e) {
      setTopicState({ running: false, error: e?.response?.data?.error || e?.message || 'Zoeken mislukt' });
    }
  };

  const runDedupe = async () => {
    setDedupe({ running: true, result: null, error: null });
    try {
      const res = await base44.functions.invoke('dedupeAssets', {});
      setDedupe({ running: false, result: res.data, error: null });
      onChanged?.();
    } catch (e) {
      setDedupe({ running: false, error: e?.response?.data?.error || e?.message || 'Ontdubbeling mislukt' });
    }
  };

  const onUploadFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBulk({ running: true, total: files.length, done: 0, errors: 0, results: [] });
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const up = await base44.integrations.Core.UploadFile({ file });
        const file_url = up?.file_url || up?.data?.file_url;
        if (!file_url) throw new Error('Upload mislukt');
        const res = await base44.functions.invoke('importUploadedAsset', { file_url, quick: true });
        results.push({ name: file.name, ok: true });
      } catch (err) {
        results.push({ name: file.name, ok: false });
      }
      setBulk({ running: true, total: files.length, done: i + 1, errors: results.filter((r) => !r.ok).length, results });
    }
    setBulk((b) => ({ ...b, running: false }));
    onChanged?.();
    if (e.target) e.target.value = '';
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 z-[111] w-full max-w-md bg-background border-r border-border overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur px-5 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold">Beheer</h3>
            <p className="font-body text-[11px] text-muted-foreground">Beeldbank · Bogèst</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          {/* Foto's uploaden */}
          <Card
            icon={Upload}
            title="Foto's uploaden"
            desc="Upload één of meerdere foto's tegelijk — ze worden direct aan de beeldbank toegevoegd (zonder analyse). Analyseer ze daarna handmatig vanuit de beeldbank door op de foto te klikken."
          >
            <label className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-lg py-4 px-3 text-sm cursor-pointer transition-colors ${bulk.running ? 'border-primary/40 opacity-60' : 'border-primary/40 text-primary hover:bg-primary/10'}`}>
              {bulk.running ? <><Loader2 className="w-4 h-4 animate-spin" /> {bulk.done}/{bulk.total} toegevoegd…</> : <><Upload className="w-4 h-4" /> Kies foto's om te uploaden (meerdere toegestaan)</>}
              <input type="file" accept="image/*" multiple className="hidden" onChange={onUploadFiles} disabled={bulk.running} />
            </label>
            {bulk.running && (
              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${bulk.total ? (bulk.done / bulk.total) * 100 : 0}%` }} />
                </div>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {bulk.results.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 font-body text-[11px]">
                      {r.ok ? <Check className="w-3 h-3 text-primary flex-shrink-0" /> : <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0" />}
                      <span className="truncate text-muted-foreground">{r.name}</span>
                      {r.ok && r.cat && <span className="text-primary/70">· {r.cat}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!bulk.running && bulk.done > 0 && (
              <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
                <p className="font-body text-[11px] text-primary mb-1 flex items-center gap-1.5"><Check className="w-3 h-3" /> {bulk.done} foto's toegevoegd{bulk.errors ? `, ${bulk.errors} mislukt` : ''}</p>
              </div>
            )}
          </Card>

          {/* Alles ontdekken */}
          <Card
            icon={Globe}
            title="Alles ontdekken & importeren"
            desc="Eén doorlopende zoekopdracht die alle Bogèst-beelden verzamelt — eigen website, Tripadvisor, Facebook en Instagram — en automatisch ontdubbelt, filtert en indeelt."
          >
            <div className="rounded-lg border border-border/60 bg-background/50 p-3 mb-3">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Bronnen</p>
              <ul className="space-y-1.5">
                {SOURCES.map((s) => (
                  <li key={s} className="flex items-center gap-2 font-body text-[11px] text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">Max. foto's per run</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                min="1"
                max="40"
                value={discoverMax}
                onChange={(e) => setDiscoverMax(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
                className="w-20 px-3 py-2 rounded-lg bg-card/60 border border-border focus:outline-none focus:border-primary text-sm"
              />
              <span className="font-body text-xs text-muted-foreground">beelden (1–40)</span>
            </div>
            <button
              onClick={runDiscover}
              disabled={discover.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {discover.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig met ontdekken…</> : <><Globe className="w-4 h-4" /> Alles ontdekken & importeren</>}
            </button>
            <ResultBlock
              result={discover.result}
              error={discover.error}
              statRows={[
                { label: 'Nieuw toegevoegd', value: discover.result?.stored ?? 0 },
                { label: 'Kandidaten gevonden', value: discover.result?.candidates ?? 0 },
                { label: 'Dubbelingen overgeslagen', value: discover.result?.skippedDup ?? 0 },
                { label: 'Afgewezen (niet relevant)', value: discover.result?.rejected ?? 0 },
              ]}
            />
            {discover.result && (
              <p className="font-body text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">
                Voer opnieuw uit om meer beelden toe te voegen — elke run haalt alleen unieke, relevante foto's binnen.
              </p>
            )}
          </Card>

          {/* Gericht zoeken */}
          <Card
            icon={Crosshair}
            title="Gericht zoeken op onderwerp"
            desc="Zoek beelden rond een specifiek onderwerp — bv. wijn, terras, steak, interieur Borgloon. Doorzoekt de eigen site, Tripadvisor en Facebook."
          >
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runTopic(); }}
              placeholder="bv. wijn, terras, steak…"
              className="w-full px-3 py-2.5 rounded-lg bg-card/60 border border-border focus:outline-none focus:border-primary text-sm mb-2"
            />
            <div className="flex items-center gap-2 mb-3">
              <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Max.</label>
              <input
                type="number"
                min="1"
                max="40"
                value={topicMax}
                onChange={(e) => setTopicMax(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
                className="w-20 px-3 py-2 rounded-lg bg-card/60 border border-border focus:outline-none focus:border-primary text-sm"
              />
              <span className="font-body text-xs text-muted-foreground">beelden</span>
            </div>
            <button
              onClick={runTopic}
              disabled={topicState.running || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 border border-primary/40 text-primary text-sm py-2.5 rounded-lg hover:bg-primary/10 disabled:opacity-50 transition-colors"
            >
              {topicState.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig met zoeken…</> : <><Crosshair className="w-4 h-4" /> Zoek op onderwerp</>}
            </button>
            <ResultBlock
              result={topicState.result}
              error={topicState.error}
              statRows={[
                { label: 'Nieuw toegevoegd', value: topicState.result?.stored ?? 0 },
                { label: 'Kandidaten gevonden', value: topicState.result?.candidates ?? 0 },
                { label: 'Onderwerp', value: topicState.result?.topic ?? topic.trim() },
              ]}
            />
          </Card>

          {/* Ontdubbelen */}
          <Card
            icon={Layers}
            title="Dubbele verwijderen"
            desc="Scan het volledige archief en verwijder in één keer alle dubbele beelden — exacte kopieën én visuele nabijheden (perceptuele hash). De beste versie blijft behouden; bronnen worden samengevoegd."
          >
            <button
              onClick={runDedupe}
              disabled={dedupe.running}
              className="w-full flex items-center justify-center gap-2 border border-primary/40 text-primary text-sm py-2.5 rounded-lg hover:bg-primary/10 disabled:opacity-50 transition-colors"
            >
              {dedupe.running ? <><Loader2 className="w-4 h-4 animate-spin" /> Bezig met ontdubbelen…</> : <><Layers className="w-4 h-4" /> Alle dubbele verwijderen</>}
            </button>
            <ResultBlock
              result={dedupe.result}
              error={dedupe.error}
              statRows={[
                { label: 'Verwijderd', value: dedupe.result?.removed ?? 0 },
                { label: 'Exacte kopieën', value: dedupe.result?.exactDuplicates ?? 0 },
                { label: 'Visuele dubbelingen', value: dedupe.result?.nearDuplicates ?? 0 },
                { label: 'Blijft behouden', value: dedupe.result?.remaining ?? 0 },
              ]}
            />
          </Card>

          <p className="font-body text-[10px] text-muted-foreground/70 leading-relaxed pt-1 flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
            Elke gevonden foto wordt automatisch gecontroleerd op dubbelingen (URL + inhoud + perceptuele hash) en door een strenge AI-relevantiepoort gehaald — alleen echte Bogèst-beelden komen in het archief.
          </p>
        </div>
      </div>
    </>
  );
}