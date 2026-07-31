import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import GroupsConceptSection from '@/components/GroupsConceptSection';
import { HintLine } from '@/components/HostHint';
import { hostQuestion } from '@/lib/hostHint';
import { base44 } from '@/api/base44Client';

export default function Groups() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '', location: '', date: '', notes: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.functions.invoke('sendContactMessage', {
        type: 'group',
        name: form.name,
        email: form.email,
        phone: form.phone,
        guests: form.guests,
        date: form.date,
        message: form.notes,
        location: form.location,
      });
      setSuccess(true);
    } catch {
      // unknown location (e.g. Lommel) or store failure — leave the form
    }
    setLoading(false);
  };

  const events = [
    { num: '01', title: t('grp_event_1_title'), desc: t('grp_event_1_desc') },
    { num: '02', title: t('grp_event_2_title'), desc: t('grp_event_2_desc') },
    { num: '03', title: t('grp_event_3_title'), desc: t('grp_event_3_desc') },
    { num: '04', title: t('grp_event_4_title'), desc: t('grp_event_4_desc') },
  ];

  return (
    <div className="w-full">
      <PanelHero label="Events" title={t('grp_title_main')} titleAccent={t('grp_title_accent')} subtitle={t('grp_subtitle')} positionKey="groups.hero" />

      <PanelContent>
      <GroupsConceptSection />

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('btn_request')}</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground mb-4">{t('grp_request_title')}<span className="text-primary">.</span></h2>
            <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed max-w-xl">{t('grp_request_desc')}</p>
            {success ? (
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{t('grp_success_title')}</h3>
                <p className="font-body text-muted-foreground">{t('grp_success_msg')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder={t('grp_name')} value={form.name} onChange={e => set('name', e.target.value)} required className="bg-card border-border font-body" />
                  <Input type="email" placeholder={t('grp_email')} value={form.email} onChange={e => set('email', e.target.value)} required className="bg-card border-border font-body" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder={t('grp_phone')} value={form.phone} onChange={e => set('phone', e.target.value)} required className="bg-card border-border font-body" />
                  <Input placeholder={t('grp_guests')} value={form.guests} onChange={e => set('guests', e.target.value)} required className="bg-card border-border font-body" />
                </div>
                <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="bg-card border-border font-body" />
                <select value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">{t('grp_location_choose')}</option>
                  {['Hasselt', 'Borgloon', 'Heusden-Zolder', 'Lommel'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <textarea placeholder={t('grp_notes')} value={form.notes} onChange={e => set('notes', e.target.value)} rows={4}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                <Button type="submit" disabled={loading}
                  className="bg-primary/15 text-primary border border-primary/40 backdrop-blur-md hover:bg-primary/25 hover:border-primary/60 font-body text-xs tracking-widest uppercase rounded-full px-8 py-3 h-auto transition-all duration-300">
                  {loading ? t('grp_sending') : t('btn_send_request')}
                </Button>
              </form>
            )}
          </SectionReveal>

          <SectionReveal direction="fade" delay={0.1}>
            <div className="space-y-4">
              {events.map(item => (
                <div key={item.num} className="group relative py-6 border-b border-border/40">
                  <span className="absolute -top-3 left-0 font-heading text-6xl font-bold text-primary/15 leading-none pointer-events-none select-none">{item.num}</span>
                  <div className="relative pl-16">
                    <h4 className="font-heading text-lg font-semibold text-foreground mb-1">{item.title}<span className="text-primary">.</span></h4>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="overflow-hidden max-h-0 group-hover:max-h-14 transition-all duration-500 ease-out pl-16">
                    <HintLine question={hostQuestion(lang, item.title)} className="mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
      </PanelContent>
    </div>
  );
}