import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, RefreshCw, Check, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const AMOUNTS = [25, 50, 75, 100, 150, 200];
const LOCATIONS = ['hasselt', 'borgloon', 'heusden-zolder'];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `BOGEST-${seg()}-${seg()}`;
}

const STATUS_COLORS = {
  active: 'bg-primary/10 text-primary',
  partially_used: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  spent: 'bg-muted text-muted-foreground',
  expired: 'bg-destructive/10 text-destructive',
  void: 'bg-destructive/10 text-destructive',
};

export default function GiftCardManager() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({
    code: '',
    amount: 50,
    recipient_name: '',
    recipient_email: '',
    sender_name: '',
    location: '',
    notes: '',
    type: 'store',
  });

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.GiftCard.list('-created_date', 200);
      setCards(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadCards(); }, []);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleGenerateCode = () => setF('code', generateCode());

  const handleCreate = async () => {
    if (!form.code || !form.amount || !form.recipient_name || !form.sender_name) return;
    setSaving(true);
    try {
      await base44.entities.GiftCard.create({
        ...form,
        balance: form.amount,
        status: 'active',
      });
      setShowForm(false);
      setForm({ code: '', amount: 50, recipient_name: '', recipient_email: '', sender_name: '', location: '', notes: '', type: 'store' });
      await loadCards();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleVoid = async (card) => {
    await base44.entities.GiftCard.update(card.id, { status: 'void' });
    await loadCards();
  };

  const handleReactivate = async (card) => {
    await base44.entities.GiftCard.update(card.id, { status: 'active' });
    await loadCards();
  };

  const filtered = cards.filter(c =>
    !search ||
    c.code?.toLowerCase().includes(search.toLowerCase()) ||
    c.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.sender_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = cards.filter(c => c.status === 'active' || c.status === 'partially_used').reduce((s, c) => s + (c.balance || 0), 0);

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Totaal</p>
          <p className="font-heading text-2xl font-bold text-foreground">{cards.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Actief</p>
          <p className="font-heading text-2xl font-bold text-primary">{cards.filter(c => c.status === 'active' || c.status === 'partially_used').length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Openstaand saldo</p>
          <p className="font-heading text-2xl font-bold text-foreground">€{totalActive.toFixed(0)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Zoek op code, naam..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border font-body text-sm"
          />
        </div>
        <Button onClick={() => setShowForm(v => !v)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-5 h-10 gap-2">
          <Plus className="w-3.5 h-3.5" /> Nieuwe cadeaubon
        </Button>
        <button onClick={loadCards} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card border border-primary/20 rounded-2xl p-6">
              <h3 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Cadeaubon aanmaken
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Code */}
                <div className="sm:col-span-2">
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Code</label>
                  <div className="flex gap-2">
                    <Input value={form.code} onChange={e => setF('code', e.target.value.toUpperCase())}
                      placeholder="BOGEST-XXXX-XXXX" className="bg-background border-border font-body font-medium tracking-wider" />
                    <button onClick={handleGenerateCode}
                      className="px-4 py-2 rounded-lg border border-border text-muted-foreground font-body text-xs hover:border-primary hover:text-primary transition-colors whitespace-nowrap">
                      Genereer
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Bedrag (€)</label>
                  <div className="flex flex-wrap gap-2">
                    {AMOUNTS.map(a => (
                      <button key={a} type="button" onClick={() => setF('amount', a)}
                        className={`px-4 py-1.5 rounded-full font-body text-sm border-2 transition-all duration-200 ${form.amount === a ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary/40'}`}>
                        €{a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Type</label>
                  <div className="flex gap-2">
                    {[{ v: 'store', l: 'Verkoop restaurant' }, { v: 'digital', l: 'Digitaal' }, { v: 'physical', l: 'Fysiek' }].map(opt => (
                      <button key={opt.v} type="button" onClick={() => setF('type', opt.v)}
                        className={`px-3 py-1.5 rounded-full font-body text-xs border-2 transition-all duration-200 ${form.type === opt.v ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary/40'}`}>
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Ontvanger</label>
                  <Input value={form.recipient_name} onChange={e => setF('recipient_name', e.target.value)}
                    placeholder="Naam ontvanger" className="bg-background border-border font-body" />
                </div>
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Verzender / Koper</label>
                  <Input value={form.sender_name} onChange={e => setF('sender_name', e.target.value)}
                    placeholder="Naam koper" className="bg-background border-border font-body" />
                </div>
                {form.type === 'digital' && (
                  <div>
                    <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">E-mail ontvanger</label>
                    <Input type="email" value={form.recipient_email} onChange={e => setF('recipient_email', e.target.value)}
                      placeholder="email@example.com" className="bg-background border-border font-body" />
                  </div>
                )}
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Locatie</label>
                  <select value={form.location} onChange={e => setF('location', e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">— Kies locatie (optioneel)</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Notities (intern)</label>
                  <Input value={form.notes} onChange={e => setF('notes', e.target.value)}
                    placeholder="Bijv. verkocht aan kassa Borgloon" className="bg-background border-border font-body" />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)} className="font-body text-xs tracking-widest uppercase rounded-full px-5 h-9">
                  Annuleren
                </Button>
                <Button onClick={handleCreate} disabled={saving || !form.code || !form.recipient_name || !form.sender_name}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-6 h-9 gap-2">
                  {saving ? 'Opslaan...' : <><Check className="w-3 h-3" /> Aanmaken</>}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground text-center py-12">Geen cadeaubonnen gevonden.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(card => (
            <div key={card.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === card.id ? null : card.id)}
                className="w-full text-left p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                  <div className="md:col-span-2">
                    <p className="font-body text-xs font-medium text-foreground tracking-wider">{card.code}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {card.sender_name && `Van: ${card.sender_name}`}{card.recipient_name && ` → ${card.recipient_name}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Saldo</p>
                    <p className="font-heading text-base font-bold text-primary">€{(card.balance || 0).toFixed(2)}</p>
                    {card.balance !== card.amount && <p className="font-body text-[9px] text-muted-foreground">van €{card.amount}</p>}
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-body text-[10px] font-medium ${STATUS_COLORS[card.status] || 'bg-muted text-muted-foreground'}`}>
                      {card.status}
                    </span>
                    <p className="font-body text-[9px] text-muted-foreground mt-1 capitalize">{card.type}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {card.created_date && <p className="font-body text-[10px] text-muted-foreground hidden md:block">{new Date(card.created_date).toLocaleDateString('nl-BE')}</p>}
                    {expandedId === card.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === card.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-3 border-t border-border/50 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {card.recipient_email && (
                          <div>
                            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">E-mail</p>
                            <p className="font-body text-xs text-foreground">{card.recipient_email}</p>
                          </div>
                        )}
                        {card.location && (
                          <div>
                            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Locatie</p>
                            <p className="font-body text-xs text-foreground capitalize">{card.location}</p>
                          </div>
                        )}
                        {card.notes && (
                          <div className="md:col-span-2">
                            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Notities</p>
                            <p className="font-body text-xs text-foreground">{card.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-1">
                        {card.status === 'void' ? (
                          <button onClick={() => handleReactivate(card)}
                            className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors">
                            Reactiveren
                          </button>
                        ) : (
                          <button onClick={() => handleVoid(card)}
                            className="px-4 py-1.5 rounded-full border border-border text-muted-foreground font-body text-[10px] tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors flex items-center gap-1.5">
                            <X className="w-3 h-3" /> Ongeldig maken
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}