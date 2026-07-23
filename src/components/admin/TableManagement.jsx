import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
  AlertTriangle, CheckCircle2, Edit3, Save, X, Users, Grid3X3
} from 'lucide-react';

// Default table layouts per location
function buildDefaultTables(locationSlug) {
  const configs = {
    hasselt: [
      { id: 't1', name: 'Tafel 1', seats: 2, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't2', name: 'Tafel 2', seats: 2, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't3', name: 'Tafel 3', seats: 4, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't4', name: 'Tafel 4', seats: 4, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't5', name: 'Tafel 5', seats: 4, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't6', name: 'Tafel 6', seats: 6, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't7', name: 'Tafel 7', seats: 6, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't8', name: 'Tafel 8', seats: 8, zone: 'Zaal', enabled: true, unavailable: false },
      { id: 't9', name: 'Tafel 9', seats: 8, zone: 'Zaal', enabled: true, unavailable: false },
      { id: 't10', name: 'Tafel 10', seats: 10, zone: 'Zaal', enabled: true, unavailable: false },
    ],
    borgloon: [
      { id: 't1', name: 'Tafel 1', seats: 2, zone: 'Terras', enabled: true, unavailable: false },
      { id: 't2', name: 'Tafel 2', seats: 2, zone: 'Terras', enabled: true, unavailable: false },
      { id: 't3', name: 'Tafel 3', seats: 4, zone: 'Terras', enabled: true, unavailable: false },
      { id: 't4', name: 'Tafel 4', seats: 4, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't5', name: 'Tafel 5', seats: 4, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't6', name: 'Tafel 6', seats: 6, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't7', name: 'Tafel 7', seats: 8, zone: 'Zaal', enabled: true, unavailable: false },
      { id: 't8', name: 'Tafel 8', seats: 10, zone: 'Zaal', enabled: true, unavailable: false },
    ],
    'heusden-zolder': [
      { id: 't1', name: 'Tafel 1', seats: 2, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't2', name: 'Tafel 2', seats: 4, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't3', name: 'Tafel 3', seats: 4, zone: 'Veranda', enabled: true, unavailable: false },
      { id: 't4', name: 'Tafel 4', seats: 4, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't5', name: 'Tafel 5', seats: 6, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't6', name: 'Tafel 6', seats: 6, zone: 'Binnenhal', enabled: true, unavailable: false },
      { id: 't7', name: 'Tafel 7', seats: 8, zone: 'Zaal', enabled: true, unavailable: false },
      { id: 't8', name: 'Tafel 8', seats: 8, zone: 'Zaal', enabled: true, unavailable: false },
    ],
  };
  return configs[locationSlug] || [];
}

const ZONES = ['Veranda', 'Terras', 'Binnenhal', 'Zaal', 'Privézaal', 'Tuin'];
const SEAT_OPTIONS = [2, 4, 6, 8, 10, 12];

// Assigns reservations to tables optimally
export function assignTable(tables, guests) {
  const available = tables.filter(t => t.enabled && !t.unavailable);
  // First try exact match or smallest sufficient single table
  const singles = available.filter(t => t.seats >= guests).sort((a, b) => a.seats - b.seats);
  if (singles.length > 0) return [singles[0]];
  // Then try combining 2 adjacent tables
  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      if (available[i].seats + available[j].seats >= guests) {
        return [available[i], available[j]];
      }
    }
  }
  return null; // impossible
}

function TableCard({ table, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: table.name, seats: table.seats, zone: table.zone });

  const save = () => { onUpdate(table.id, draft); setEditing(false); };
  const cancel = () => { setDraft({ name: table.name, seats: table.seats, zone: table.zone }); setEditing(false); };

  const statusColor = !table.enabled
    ? 'border-border bg-muted/30 opacity-60'
    : table.unavailable
      ? 'border-amber-400/40 bg-amber-50/30 dark:bg-amber-900/10'
      : 'border-border bg-card hover:border-primary/30';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-xl border transition-all duration-200 overflow-hidden ${statusColor}`}
    >
      {/* Status pill */}
      {!table.enabled && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-body text-[9px] tracking-widest uppercase">
          Uitgeschakeld
        </div>
      )}
      {table.unavailable && table.enabled && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-body text-[9px] tracking-widest uppercase flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5" /> Onbeschikbaar
        </div>
      )}

      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <input
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="Tafelnaam"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1 block">Stoelen</label>
                <select
                  value={draft.seats}
                  onChange={e => setDraft(d => ({ ...d, seats: +e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {SEAT_OPTIONS.map(n => <option key={n} value={n}>{n} stoelen</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-[10px] tracking-widests uppercase text-muted-foreground mb-1 block">Zone</label>
                <select
                  value={draft.zone}
                  onChange={e => setDraft(d => ({ ...d, zone: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={save}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors">
                <Save className="w-3 h-3" /> Opslaan
              </button>
              <button onClick={cancel}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> Annuleren
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Visual table icon */}
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${table.enabled && !table.unavailable ? 'bg-primary/10' : 'bg-muted'}`}>
                <Grid3X3 className={`w-5 h-5 ${table.enabled && !table.unavailable ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <button onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="font-heading text-sm font-bold text-foreground mb-0.5">{table.name}</p>
            <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-3">{table.zone}</p>

            {/* Seat dots */}
            <div className="flex items-center gap-1 flex-wrap mb-4">
              {Array.from({ length: table.seats }).map((_, i) => (
                <div key={i}
                  className={`w-4 h-4 rounded-full border ${table.enabled && !table.unavailable ? 'border-primary/40 bg-primary/10' : 'border-border bg-muted'}`}
                />
              ))}
              <span className="font-body text-xs text-muted-foreground ml-1">{table.seats} st.</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 border-t border-border/50 pt-3">
              <button
                onClick={() => onUpdate(table.id, { enabled: !table.enabled })}
                className={`flex items-center gap-1.5 flex-1 justify-center px-2 py-1.5 rounded-lg font-body text-[10px] tracking-widest uppercase border transition-all duration-200 ${
                  table.enabled
                    ? 'border-primary/20 text-primary hover:bg-primary/5'
                    : 'border-border text-muted-foreground hover:border-primary/20 hover:text-primary'
                }`}
              >
                {table.enabled
                  ? <><ToggleRight className="w-3 h-3" /> Aan</>
                  : <><ToggleLeft className="w-3 h-3" /> Uit</>
                }
              </button>
              <button
                onClick={() => onUpdate(table.id, { unavailable: !table.unavailable })}
                disabled={!table.enabled}
                className={`flex items-center gap-1.5 flex-1 justify-center px-2 py-1.5 rounded-lg font-body text-[10px] tracking-widest uppercase border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                  table.unavailable
                    ? 'border-amber-400/50 text-amber-600 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-900/10'
                    : 'border-border text-muted-foreground hover:border-amber-400/50 hover:text-amber-600'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                {table.unavailable ? 'Geblokkeerd' : 'Blokkeer'}
              </button>
              <button
                onClick={() => onDelete(table.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-transparent hover:border-destructive/20 transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function AddTableModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: '', seats: 4, zone: 'Binnenhal' });

  const submit = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, seats: +form.seats });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-bold text-foreground">Tafel toevoegen</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-body text-[10px] tracking-widests uppercase text-muted-foreground mb-1.5 block">Tafelnaam *</label>
            <input
              autoFocus
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="bv. Tafel 11"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1.5 block">Aantal stoelen</label>
              <select
                value={form.seats}
                onChange={e => setForm(f => ({ ...f, seats: +e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {SEAT_OPTIONS.map(n => <option key={n} value={n}>{n} stoelen</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1.5 block">Zone</label>
              <select
                value={form.zone}
                onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={submit}
            disabled={!form.name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl font-body text-xs tracking-widests uppercase hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <Plus className="w-4 h-4" /> Tafel toevoegen
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-border rounded-xl font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
            Annuleren
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReservationSimulator({ tables }) {
  const [guests, setGuests] = useState(4);
  const result = assignTable(tables, guests);

  const available = tables.filter(t => t.enabled && !t.unavailable);
  const totalSeats = available.reduce((s, t) => s + t.seats, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h4 className="font-heading text-sm font-bold text-foreground mb-4">Tafel Simulator</h4>
      <p className="font-body text-xs text-muted-foreground mb-4">
        Test welke tafel(s) worden toegewezen bij een reservering.
      </p>

      <div className="flex items-center gap-4 mb-5">
        <label className="font-body text-xs text-muted-foreground whitespace-nowrap">Aantal gasten:</label>
        <input
          type="range" min={1} max={20} value={guests}
          onChange={e => setGuests(+e.target.value)}
          className="flex-1 accent-primary"
        />
        <span className="font-heading text-lg font-bold text-primary w-8 text-right">{guests}</span>
      </div>

      <div className={`rounded-xl p-4 border ${result ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
        {result ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-foreground mb-1">
                {result.length === 1 ? 'Tafel gevonden' : `${result.length} tafels gecombineerd`}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.map(t => (
                  <span key={t.id} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full font-body text-xs font-medium">
                    {t.name} · {t.seats} stoelen
                  </span>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Totale capaciteit: {result.reduce((s, t) => s + t.seats, 0)} / {guests} benodigd
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-destructive">Reservering niet mogelijk</p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Maximale beschikbare capaciteit: {totalSeats} stoelen.
                {available.length === 0 && ' Geen tafels beschikbaar.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TableManagement({ locationSlug, locationName }) {
  const storageKey = `bogest-tables-${locationSlug}`;
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : buildDefaultTables(locationSlug);
    } catch { return buildDefaultTables(locationSlug); }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [filterZone, setFilterZone] = useState('all');
  const [saved, setSaved] = useState(false);

  const persist = (newTables) => {
    setTables(newTables);
    localStorage.setItem(storageKey, JSON.stringify(newTables));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateTable = (id, changes) => persist(tables.map(t => t.id === id ? { ...t, ...changes } : t));
  const deleteTable = (id) => persist(tables.filter(t => t.id !== id));
  const addTable = ({ name, seats, zone }) => {
    const newId = `t${Date.now()}`;
    persist([...tables, { id: newId, name, seats, zone, enabled: true, unavailable: false }]);
  };

  const zones = ['all', ...Array.from(new Set(tables.map(t => t.zone)))];
  const filtered = filterZone === 'all' ? tables : tables.filter(t => t.zone === filterZone);

  const enabledCount = tables.filter(t => t.enabled && !t.unavailable).length;
  const totalSeats = tables.filter(t => t.enabled && !t.unavailable).reduce((s, t) => s + t.seats, 0);
  const unavailableCount = tables.filter(t => t.unavailable).length;
  const disabledCount = tables.filter(t => !t.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header + summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-1 block">
            Tafelbeheer — {locationName}
          </span>
          <div className="flex items-center gap-5 mt-1">
            <div>
              <span className="font-heading text-2xl font-bold text-foreground">{tables.length}</span>
              <span className="font-body text-xs text-muted-foreground ml-1.5">tafels totaal</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="font-heading text-2xl font-bold text-primary">{totalSeats}</span>
              <span className="font-body text-xs text-muted-foreground ml-1.5">beschikbare stoelen</span>
            </div>
            {unavailableCount > 0 && (
              <>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-body text-xs text-amber-600 dark:text-amber-400">{unavailableCount} geblokkeerd</span>
                </div>
              </>
            )}
            {disabledCount > 0 && (
              <>
                <div className="w-px h-6 bg-border" />
                <span className="font-body text-xs text-muted-foreground">{disabledCount} uitgeschakeld</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-body text-xs"
            >
              <CheckCircle2 className="w-3 h-3" /> Opgeslagen
            </motion.div>
          )}
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tafel toevoegen
          </button>
        </div>
      </div>

      {/* Zone filter pills */}
      {zones.length > 2 && (
        <div className="flex gap-2 flex-wrap">
          {zones.map(z => (
            <button key={z}
              onClick={() => setFilterZone(z)}
              className={`px-3.5 py-1.5 rounded-full font-body text-xs border transition-all duration-200 ${
                filterZone === z
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {z === 'all' ? 'Alle zones' : z}
              {z !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {tables.filter(t => t.zone === z).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Table grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Grid3X3 className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">Geen tafels gevonden.</p>
          <button onClick={() => setShowAdd(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Eerste tafel toevoegen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(table => (
              <TableCard
                key={table.id}
                table={table}
                onUpdate={updateTable}
                onDelete={deleteTable}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Capacity overview by zone */}
      {tables.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Capaciteit per zone
          </h4>
          <div className="space-y-3">
            {Array.from(new Set(tables.map(t => t.zone))).map(zone => {
              const zoneTables = tables.filter(t => t.zone === zone);
              const availTables = zoneTables.filter(t => t.enabled && !t.unavailable);
              const zoneSeats = availTables.reduce((s, t) => s + t.seats, 0);
              const totalZoneSeats = zoneTables.reduce((s, t) => s + t.seats, 0);
              const pct = totalZoneSeats > 0 ? (zoneSeats / totalZoneSeats) * 100 : 0;
              return (
                <div key={zone}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-body text-sm text-foreground">{zone}</span>
                    <span className="font-body text-xs text-muted-foreground">
                      {zoneSeats} / {totalZoneSeats} stoelen beschikbaar
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reservation simulator */}
      <ReservationSimulator tables={tables} />

      {/* Add table modal */}
      <AnimatePresence>
        {showAdd && (
          <AddTableModal onAdd={addTable} onClose={() => setShowAdd(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}