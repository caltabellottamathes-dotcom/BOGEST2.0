import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_COLORS = {
  pending: 'bg-amber-100/30 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200/50',
  confirmed: 'bg-primary/20 text-primary border-primary/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  completed: 'bg-secondary/50 text-secondary-foreground border-secondary/50',
};
const STATUS_ICONS = { confirmed: CheckCircle, pending: AlertCircle, cancelled: XCircle, completed: CheckCircle };

function StatusBadge({ status }) {
  const Icon = STATUS_ICONS[status] || AlertCircle;
  const label = { pending: 'In afwachting', confirmed: 'Bevestigd', cancelled: 'Geannuleerd', completed: 'Afgerond' }[status] || status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-xs font-medium border ${STATUS_COLORS[status] || ''}`}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

export default function AdminReservations({ locationFilter, searchQuery, dateFilter }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Reservation.list('-created_date', 200);
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Real-time subscribe
  useEffect(() => {
    const unsub = base44.entities.Reservation.subscribe((event) => {
      if (event.type === 'create') setReservations(p => [event.data, ...p]);
      else if (event.type === 'update') setReservations(p => p.map(r => r.id === event.id ? event.data : r));
      else if (event.type === 'delete') setReservations(p => p.filter(r => r.id !== event.id));
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.Reservation.update(id, { status, seen: true });
    setUpdating(null);
  };

  const filtered = reservations.filter(r => {
    if (locationFilter && r.location !== locationFilter) return false;
    if (dateFilter && r.date !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.name?.toLowerCase().includes(q) && !r.email?.toLowerCase().includes(q) && !r.phone?.includes(q)) return false;
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-16"><div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

  if (filtered.length === 0) return <p className="font-body text-sm text-muted-foreground text-center py-12">Geen reserveringen gevonden.</p>;

  return (
    <div className="space-y-3">
      {filtered.map(res => {
        const isNew = !res.seen;
        const isExpanded = expandedId === res.id;
        return (
          <div key={res.id} className={`rounded-2xl border overflow-hidden transition-all duration-300 backdrop-blur-lg ${
            isNew ? 'bg-primary/10 border-primary/40 shadow-xl shadow-primary/10' : 'bg-card/40 border-primary/10 hover:bg-card/60'
          }`}>
            <button onClick={() => {
              setExpandedId(isExpanded ? null : res.id);
              if (isNew) base44.entities.Reservation.update(res.id, { seen: true });
            }} className="w-full text-left p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Naam</p>
                  <p className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                    {isNew && <span className="text-primary text-lg">●</span>}{res.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">{res.phone}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Datum & Tijd</p>
                  <p className="font-body text-sm text-foreground">{res.date}</p>
                  <p className="font-body text-xs text-primary">{res.time} · {res.guests} gasten</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Locatie</p>
                  <p className="font-body text-sm text-foreground capitalize">{res.location}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Status</p>
                    <StatusBadge status={res.status || 'pending'} />
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-primary/10 pt-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">E-mail</p>
                        <p className="font-body text-sm text-foreground">{res.email}</p>
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Gasten</p>
                        <p className="font-body text-sm text-foreground">{res.guests} personen</p>
                      </div>
                      {res.allergies && (
                        <div>
                          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Allergieën</p>
                          <p className="font-body text-sm text-foreground">{res.allergies}</p>
                        </div>
                      )}
                      {res.notes && (
                        <div className="md:col-span-3">
                          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Opmerkingen</p>
                          <p className="font-body text-sm text-foreground">{res.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap pt-2">
                      {res.status !== 'confirmed' && (
                        <button disabled={updating === res.id} onClick={() => updateStatus(res.id, 'confirmed')}
                          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                          Bevestigen
                        </button>
                      )}
                      {res.status !== 'completed' && res.status !== 'cancelled' && (
                        <button disabled={updating === res.id} onClick={() => updateStatus(res.id, 'completed')}
                          className="px-4 py-2 rounded-full border border-primary/30 text-primary font-body text-[10px] tracking-widest uppercase hover:bg-primary/10 transition-colors disabled:opacity-50">
                          Afgerond
                        </button>
                      )}
                      {res.status !== 'cancelled' && (
                        <button disabled={updating === res.id} onClick={() => updateStatus(res.id, 'cancelled')}
                          className="px-4 py-2 rounded-full border border-border text-muted-foreground font-body text-[10px] tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors disabled:opacity-50">
                          Annuleren
                        </button>
                      )}
                      {res.email && (
                        <a href={`mailto:${res.email}?subject=Uw reservering bij Bogèst ${res.location}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-muted-foreground font-body text-[10px] tracking-widest uppercase hover:border-primary hover:text-primary transition-colors">
                          <Mail className="w-3 h-3" /> E-mail
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}