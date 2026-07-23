import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, Archive } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_COLORS = {
  new: 'bg-primary/20 text-primary border-primary/30',
  read: 'bg-secondary/50 text-secondary-foreground border-secondary/50',
  replied: 'bg-primary/10 text-primary/70 border-primary/20',
  archived: 'bg-muted text-muted-foreground border-border',
};
const STATUS_LABELS = { new: 'Nieuw', read: 'Gelezen', replied: 'Beantwoord', archived: 'Gearchiveerd' };
const LOCATION_LABELS = { hasselt: 'Hasselt', borgloon: 'Borgloon', 'heusden-zolder': 'Heusden-Zolder' };

export default function AdminContactRequests({ searchQuery }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ContactRequest.list('-created_date', 200);
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const unsub = base44.entities.ContactRequest.subscribe((event) => {
      if (event.type === 'create') setRequests(p => [event.data, ...p]);
      else if (event.type === 'update') setRequests(p => p.map(r => r.id === event.id ? event.data : r));
      else if (event.type === 'delete') setRequests(p => p.filter(r => r.id !== event.id));
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.ContactRequest.update(id, { status, seen: true });
  };

  const filtered = requests.filter(r => {
    if (r.status === 'archived') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.name?.toLowerCase().includes(q) && !r.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-16"><div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  if (filtered.length === 0) return <p className="font-body text-sm text-muted-foreground text-center py-12">Geen contactaanvragen gevonden.</p>;

  return (
    <div className="space-y-3">
      {filtered.map(req => {
        const isNew = !req.seen || req.status === 'new';
        const isExpanded = expandedId === req.id;
        return (
          <div key={req.id} className={`rounded-2xl border overflow-hidden transition-all backdrop-blur-lg ${
            isNew ? 'bg-primary/10 border-primary/40' : 'bg-card/40 border-primary/10 hover:bg-card/60'
          }`}>
            <button onClick={() => {
              setExpandedId(isExpanded ? null : req.id);
              if (isNew) updateStatus(req.id, 'read');
            }} className="w-full text-left p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Naam</p>
                  <p className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                    {isNew && <span className="text-primary text-lg">●</span>}{req.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">{req.email}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Vestiging</p>
                  <p className="font-body text-sm font-semibold text-foreground">{LOCATION_LABELS[req.location] || '—'}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Bericht</p>
                  <p className="font-body text-sm text-foreground truncate max-w-xs">{req.message}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-body text-xs font-medium border ${STATUS_COLORS[req.status] || 'border-border'}`}>
                    {STATUS_LABELS[req.status] || req.status}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-primary/10 pt-4 space-y-4">
                    <div>
                      <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Volledig bericht</p>
                      <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{req.message}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {req.email && (
                        <a href={`mailto:${req.email}?subject=Re: uw bericht aan Bogèst`}
                          onClick={() => updateStatus(req.id, 'replied')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors">
                          <Mail className="w-3 h-3" /> Beantwoorden
                        </a>
                      )}
                      <button onClick={() => updateStatus(req.id, 'archived')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-muted-foreground font-body text-[10px] tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors">
                        <Archive className="w-3 h-3" /> Archiveren
                      </button>
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