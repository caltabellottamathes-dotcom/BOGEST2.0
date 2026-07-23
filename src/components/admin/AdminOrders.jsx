import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_COLORS = {
  new: 'bg-primary/20 text-primary border-primary/30',
  preparing: 'bg-amber-100/30 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200/50',
  ready: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-secondary/50 text-secondary-foreground border-secondary/50',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};
const STATUS_LABELS = { new: 'Nieuw', preparing: 'In voorbereiding', ready: 'Klaar voor afhaal', completed: 'Afgehaald', cancelled: 'Geannuleerd' };

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-xs font-medium border ${STATUS_COLORS[status] || 'border-border'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function AdminOrders({ locationFilter, searchQuery, dateFilter }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Order.list('-created_date', 200);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const unsub = base44.entities.Order.subscribe((event) => {
      if (event.type === 'create') setOrders(p => [event.data, ...p]);
      else if (event.type === 'update') setOrders(p => p.map(o => o.id === event.id ? event.data : o));
      else if (event.type === 'delete') setOrders(p => p.filter(o => o.id !== event.id));
    });
    return unsub;
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.Order.update(id, { status, seen: true });
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    if (locationFilter && o.location !== locationFilter) return false;
    if (dateFilter && o.pickup_date !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!o.customer_name?.toLowerCase().includes(q) && !o.customer_email?.toLowerCase().includes(q) && !o.customer_phone?.includes(q)) return false;
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-16"><div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  if (filtered.length === 0) return <p className="font-body text-sm text-muted-foreground text-center py-12">Geen bestellingen gevonden.</p>;

  return (
    <div className="space-y-3">
      {filtered.map(order => {
        const isNew = !order.seen;
        const isExpanded = expandedId === order.id;
        return (
          <div key={order.id} className={`rounded-2xl border overflow-hidden transition-all backdrop-blur-lg ${
            isNew ? 'bg-primary/10 border-primary/40 shadow-xl shadow-primary/10' : 'bg-card/40 border-primary/10 hover:bg-card/60'
          }`}>
            <button onClick={() => {
              setExpandedId(isExpanded ? null : order.id);
              if (isNew) base44.entities.Order.update(order.id, { seen: true });
            }} className="w-full text-left p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Klant</p>
                  <p className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                    {isNew && <span className="text-amber-500 text-lg">●</span>}{order.customer_name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Afhaal</p>
                  <p className="font-body text-sm text-foreground">{order.pickup_time || '—'}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.pickup_date}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Totaal</p>
                  <p className="font-heading text-lg font-bold text-primary">€{(order.total || 0).toFixed(2)}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{order.payment_status === 'paid' ? '✓ Betaald' : 'Bij afhaal'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={order.status || 'new'} />
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-primary/10 pt-4 space-y-4">
                    {order.items?.length > 0 && (
                      <div>
                        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Bestelde items</p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="font-body text-sm text-foreground">{item.qty}× {item.name}</span>
                              <span className="font-body text-sm text-muted-foreground">€{((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t border-border pt-2 flex justify-between">
                            <span className="font-body text-sm font-semibold">Totaal</span>
                            <span className="font-heading text-sm font-bold text-primary">€{(order.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {order.notes && <p className="font-body text-xs text-muted-foreground">{order.notes}</p>}
                    <div className="flex gap-2 flex-wrap pt-2">
                      {order.status === 'new' && (
                        <button disabled={updating === order.id} onClick={() => updateStatus(order.id, 'preparing')}
                          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                          In voorbereiding
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button disabled={updating === order.id} onClick={() => updateStatus(order.id, 'ready')}
                          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                          Klaar voor afhaal
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button disabled={updating === order.id} onClick={() => updateStatus(order.id, 'completed')}
                          className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                          Afgehaald ✓
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button disabled={updating === order.id} onClick={() => updateStatus(order.id, 'cancelled')}
                          className="px-4 py-2 rounded-full border border-border text-muted-foreground font-body text-[10px] tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors disabled:opacity-50">
                          Annuleren
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