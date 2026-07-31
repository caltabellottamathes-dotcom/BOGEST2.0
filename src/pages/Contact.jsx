import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { getLocations } from '@/lib/data';
import { base44 } from '@/api/base44Client';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';

export default function Contact() {
  const { t, lang } = useLang();
  const locations = getLocations(lang).filter((l) => l.email);
  const [form, setForm] = useState({ name: '', email: '', message: '', location: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await base44.functions.invoke('sendContactMessage', {
        name: form.name,
        email: form.email,
        message: form.message,
        location: form.location,
      });
      setSuccess(true);
    } catch {
      setError(t('con_error'));
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <PanelHero label={t('con_label')} title={t('con_title')} titleAccent={t('con_title_accent')} subtitle="Vragen of reservaties? Ons team helpt u graag verder." positionKey="contact.hero" />

      <PanelContent>
      <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          <SectionReveal direction="left">
            {success ?
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden flex flex-col items-center text-center rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-10 md:p-14 shadow-lg">

                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{t('con_sent_title')}</h3>
                <p className="font-body text-muted-foreground">{t('con_success')}</p>
                <button onClick={() => {setSuccess(false);setForm({ name: '', email: '', message: '', location: '' });}}
              className="mt-8 font-body text-sm text-primary hover:underline">{t('btn_another_message')}</button>
              </motion.div> :

            <form onSubmit={handleSubmit} className="relative overflow-hidden space-y-5 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 md:p-8 shadow-lg">

                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-primary" />
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('con_label')}</span>
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground mb-6">{t('con_send_us')}<span className="text-primary">.</span></h2>
                <select
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>{t('con_choose_location')}</option>
                  {locations.map((loc) => (
                    <option key={loc.slug} value={loc.slug}>{loc.name}</option>
                  ))}
                </select>
                <Input placeholder={t('con_name')} value={form.name} onChange={(e) => set('name', e.target.value)} required className="bg-card border-border font-body" />
                <Input type="email" placeholder={t('con_email')} value={form.email} onChange={(e) => set('email', e.target.value)} required className="bg-card border-border font-body" />
                <textarea placeholder={t('con_message')} value={form.message} onChange={(e) => set('message', e.target.value)} rows={5} required
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                {error && <p className="font-body text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading}
              className="bg-primary/15 text-primary border border-primary/40 backdrop-blur-md hover:bg-primary/25 hover:border-primary/60 font-body text-xs tracking-widest uppercase rounded-full px-8 py-3 h-auto transition-all duration-300">
                  {loading ? t('con_sending') : t('con_send')}
                </Button>
              </form>
            }
          </SectionReveal>

          <SectionReveal direction="right" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('nav_locations')}</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground mb-8">{t('con_locations')}<span className="text-primary">.</span></h2>
            <div className="space-y-4">
              {locations.map((loc, i) => {
                const selected = form.location === loc.slug;
                return (
                  <button key={loc.slug} type="button" onClick={() => set('location', loc.slug)}
                    className={`group relative w-full text-left rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${selected ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40'}`}>
                    <div className="relative h-28 md:h-32 overflow-hidden">
                      <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 60%)' }} />
                      <span className="absolute left-4 top-3 font-heading font-bold text-white/35 text-3xl leading-none select-none">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="absolute left-4 right-4 bottom-3 font-heading text-lg md:text-xl font-bold text-white">{loc.name}<span className="text-primary">.</span></h3>
                      {selected && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground font-body text-[10px] tracking-[0.2em] uppercase">
                          <Check className="w-3 h-3" />{t('shop_choose')}
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-card/70 backdrop-blur-sm space-y-1.5">
                      <p className="font-body text-sm text-muted-foreground leading-snug">{loc.address}</p>
                      <p className="font-body text-sm text-muted-foreground">{loc.phone}</p>
                      <p className="font-body text-sm text-muted-foreground break-all">{loc.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionReveal>
        </div>
      </section>
      </PanelContent>
    </div>
  );
}