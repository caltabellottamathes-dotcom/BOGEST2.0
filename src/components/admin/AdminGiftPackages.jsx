import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_COLORS = {
  pending: 'bg-amber-100/30 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200/50',
  ready: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-secondary/50 text-secondary-foreground border-secondary/50',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};
const STATUS_LABELS = { pending: 'In afwachting', ready: 'Klaar', completed: 'Afgehaald', cancelled: 'Geannuleerd' };

export default function AdminGiftPackages({ locationFilter, searchQuery, dateFilter }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.GiftPackageOrder.list('-created_date', 200);
    setPackages(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const unsub = base44.entities.GiftPackageOrder.subscribe((event) => {
      if (event.type === 'create') setPackages(p => [event.data, ...p]);
      else if (event.type === 'update') setPackages(p => p.map(o => o.id === event.id ? event.data : o));
      else if (event.type === 'delete') setPackages(p => p.filter(o => o.id !== event.id));
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.GiftPackageOrder.update(id, { status, seen: true });
    setUpdating(null);
  };

  const filtered = packages.filter(p => {
    if (locationFilter && p.location !== locationFilter) return false;
    if (dateFilter && p.pickup_date !== dateFilter) return false;
    if (searchQuery && !p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex justify-center py-16"><div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  if (filtered.length === 0) return <p className="font-body text-sm text-muted-foreground text-center py-12">Geen cadeaupakketten gevonden.</p>;

  return (
    <div className="space-y-3">
      {filtered.map(pkg => {
        const isNew = !pkg.seen;
        const isExpanded = expandedId === pkg.id;
        return (
          <div key={pkg.id} className={`rounded-2xl border overflow-hidden transition-all backdrop-blur-lg ${
            isNew ? 'bg-primary/10 border-primary/40 shadow-xl shadow-primary/10' : 'bg-card/40 border-primary/10 hover:bg-card/60'
          }`}>
            <button onClick={() => {
              setExpandedId(isExpanded ? null : pkg.id);
              if (isNew) base44.entities.GiftPackageOrder.update(pkg.id, { seen: true });
            }} className="w-full text-left p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Klant</p>
                  <p className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                    {isNew && <span className="text-primary text-lg">●</span>}{pkg.customer_name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">{pkg.customer_phone}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Afhaal</p>
                  <p className="font-body text-sm text-foreground">{pkg.pickup_time || '—'}</p>
                  <p className="font-body text-xs text-muted-foreground">{pkg.pickup_date}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Totaal</p>
                  <p className="font-heading text-lg font-bold text-primary">€{(pkg.total || 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-body text-xs font-medium border ${STATUS_COLORS[pkg.status] || 'border-border'}`}>
                    {STATUS_LABELS[pkg.status] || pkg.status}
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
                    {pkg.items?.length > 0 && (
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Items</p>
                        <div className="space-y-1.5">
                          {pkg.items.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="font-body text-sm text-foreground">{item.qty}× {item.name}</span>
                              <span className="font-body text-sm text-muted-foreground">€{((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap pt-2">
                      {pkg.status === 'pending' && (
                        <button disabled={updating === pkg.id} onClick={() => updateStatus(pkg.id, 'ready')}
                          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                          Klaar voor afhaal
                        </button>
                      )}
                      {pkg.status === 'ready' && (
                        <button disabled={updating === pkg.id} onClick={() => updateStatus(pkg.id, 'completed')}
                          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                          Afgehaald ✓
                        </button>
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