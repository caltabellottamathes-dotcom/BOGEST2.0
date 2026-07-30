import React, { useState } from 'react';
import { X, Loader2, Globe, Layers, Sparkles, Check, AlertCircle } from 'lucide-react';
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

function ActionCard({ icon: Icon, title, desc, children }) {
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

export default function AdminPanel({ onClose, onChanged }) {
  const [discover, setDiscover] = useState({ running: false, result: null, error: null });
  const [dedupe, setDedupe] = useState({ running: false, result: null, error: null });

  const runDiscover = async () => {
    setDiscover({ running: true, result: null, error: null });
    try {
      const res = await base44.functions.invoke('discoverAssets', { discoverAll: true, limit: 25 });
      setDiscover({ running: false, result: res.data, error: null });
      onChanged?.();
    } catch (e) {
      setDiscover({ running: false, error: e?.response?.data?.error || e?.message || 'Ontdekking mislukt' });
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
          {/* One comprehensive discovery action */}
          <ActionCard
            icon={Globe}
            title="Alles ontdekken & importeren"
            desc="Eén doorlopende zoekopdracht die alle Bogèst-beelden verzamelt — van de eigen website, Tripadvisor, Facebook en Instagram — en automatisch ontdubbelt, filtert en indeelt."
          >
            <div className="rounded-lg border border-border/60 bg-background/50 p-3 mb-3">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Bronnen</p>
              <ul className="space-y-1.5">
                {SOURCES.map((s) => (
                  <li key={s} className="flex items-center gap-2 font-body text-[11px] text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={runDiscover}
              disabled={discover.running}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {discover.running ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Bezig met ontdekken…</>
              ) : (
                <><Globe className="w-4 h-4" /> Alles ontdekken & importeren</>
              )}
            </button>
            {discover.error && (
              <p className="font-body text-[11px] text-destructive mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" /> {discover.error}
              </p>
            )}
            {discover.result && (
              <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
                <p className="font-body text-[11px] text-primary mb-2 flex items-center gap-1.5">
                  <Check className="w-3 h-3" /> Import voltooid
                </p>
                <Stat label="Nieuw toegevoegd" value={discover.result.stored ?? 0} />
                <Stat label="Kandidaten gevonden" value={discover.result.candidates ?? 0} />
                <Stat label="Dubbelingen overgeslagen" value={discover.result.skippedDup ?? 0} />
                <Stat label="Gefilterd" value={discover.result.skippedFilter ?? 0} />
                <Stat label="Afgewezen (niet relevant)" value={discover.result.rejected ?? 0} />
                <p className="font-body text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">
                  Voer opnieuw uit om meer beelden toe te voegen — elke run haalt alleen unieke, relevante foto's binnen.
                </p>
              </div>
            )}
          </ActionCard>

          {/* Deduplicate action */}
          <ActionCard
            icon={Layers}
            title="Dubbele verwijderen"
            desc="Scan het volledige archief en verwijder in één keer alle dubbele beelden — exacte kopieën (identieke bestandshash) én visuele nabijheden (perceptuele hash). De beste versie blijft behouden; bronnen worden samengevoegd."
          >
            <button
              onClick={runDedupe}
              disabled={dedupe.running}
              className="w-full flex items-center justify-center gap-2 border border-primary/40 text-primary text-sm py-2.5 rounded-lg hover:bg-primary/10 disabled:opacity-50 transition-colors"
            >
              {dedupe.running ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Bezig met ontdubbelen…</>
              ) : (
                <><Layers className="w-4 h-4" /> Alle dubbele verwijderen</>
              )}
            </button>
            {dedupe.error && (
              <p className="font-body text-[11px] text-destructive mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" /> {dedupe.error}
              </p>
            )}
            {dedupe.result && (
              <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
                <p className="font-body text-[11px] text-primary mb-2 flex items-center gap-1.5">
                  <Check className="w-3 h-3" /> Ontdubbeld
                </p>
                <Stat label="Verwijderd" value={dedupe.result.removed ?? 0} />
                <Stat label="Exacte kopieën" value={dedupe.result.exactDuplicates ?? 0} />
                <Stat label="Visuele dubbelingen" value={dedupe.result.nearDuplicates ?? 0} />
                <Stat label="Blijft behouden" value={dedupe.result.remaining ?? 0} />
              </div>
            )}
          </ActionCard>

          <p className="font-body text-[10px] text-muted-foreground/70 leading-relaxed pt-1 flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
            Elke gevonden foto wordt automatisch gecontroleerd op dubbelingen (URL + inhoud + perceptuele hash) en door een strenge AI-relevantiepoort gehaald — alleen echte Bogèst-beelden komen in het archief.
          </p>
        </div>
      </div>
    </>
  );
}