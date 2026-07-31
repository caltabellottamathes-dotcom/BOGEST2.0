import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MapPin, Phone, Mail } from 'lucide-react';
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
            className="flex flex-col items-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{t('con_sent_title')}</h3>
                <p className="font-body text-muted-foreground">{t('con_success')}</p>
                <button onClick={() => {setSuccess(false);setForm({ name: '', email: '', message: '', location: '' });}}
              className="mt-8 font-body text-sm text-primary hover:underline">{t('btn_another_message')}</button>
              </motion.div> :

            <form onSubmit={handleSubmit} className="space-y-5">
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-8 py-3 h-auto">
                  {loading ? t('con_sending') : t('con_send')}
                </Button>
              </form>
            }
          </SectionReveal>

          <SectionReveal direction="right" delay={0.1}>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground mb-8">{t('con_locations')}<span className="text-primary">.</span></h2>
            <div className="space-y-7">
              {locations.map((loc) =>
              <div key={loc.slug} className="py-6 border-b border-border/40">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">{loc.name}<span className="text-primary">.</span></h3>
                  <div className="space-y-2">
                    <p className="font-body text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />{loc.address}
                    </p>
                    <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />{loc.phone}
                    </p>
                    <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />{loc.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>
      </PanelContent>
    </div>
  );
}