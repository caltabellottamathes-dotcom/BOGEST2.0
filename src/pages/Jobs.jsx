import React, { useState } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp, MapPin, Clock, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';

const openings = [
  {
    title: 'Keukenhulp',
    location: 'Hasselt / Borgloon',
    type: 'Deeltijds of voltijds',
    desc: 'We zijn op zoek naar een enthousiaste keukenhulp die ons team versterkt.',
    fullText: `Bij Bogèst staan kwaliteit en ambacht centraal. Als keukenhulp ben je een onmisbare schakel in ons keukenteam. Je helpt bij de voorbereiding van verse ingrediënten, het schoonmaken en organiseren van de keuken en de ondersteuning van de kok tijdens de service.

Wat we zoeken:
— Gemotiveerde teamspeler met passie voor de horeca
— Bereidheid om ook in het weekend te werken
— Flexibel en stressbestendig karakter
— Ervaring is een plus, maar geen vereiste — wij leiden u op

Wat wij bieden:
— Competitief loon conform de horeca-sector
— Warme werksfeer in een groeiend bedrijf
— Mogelijkheid tot uitbreiding van uren
— Gratis maaltijd tijdens dienst`,
  },
  {
    title: 'Kelner(in)',
    location: 'Heusden-Zolder',
    type: 'Weekenden',
    desc: 'Je bent gastvrij, stressbestendig en werkt graag in een dynamisch team.',
    fullText: `Als kelner(in) bij Bogèst Heusden-Zolder ben jij het gezicht van onze zaak. Je verwelkomt gasten hartelijk, neemt bestellingen op en zorgt voor een vlekkeloze bediening.

Wat we zoeken:
— Gastvrij en communicatief sterk
— Stressbestendig tijdens drukke avonden
— Kennis van wijnen en bier is een grote plus
— Vlotte omgang met kassasystemen

Wat wij bieden:
— Aantrekkelijk loon + tips
— Weekend-uren (vrijdag, zaterdag, zondag)
— Familiale werksfeer
— Kansen op groei binnen het bedrijf`,
  },
  {
    title: 'Barista / Barman(vrouw)',
    location: 'Alle vestigingen',
    type: 'Variabele uren',
    desc: 'Passie voor drankbereiding en klantcontact staan centraal.',
    fullText: `Als barista/barman(vrouw) creëer je een aangename eerste indruk aan onze bar.

Wat we zoeken:
— Kennis van koffie, cocktails en wijnen
— Vlotte babbel en oog voor detail
— Bereidheid om op meerdere locaties te werken
— Hygiënebewust en georganiseerd

Wat wij bieden:
— Variabele uren — ook ideaal als bijverdienste
— Opleiding van onze ervaren bartenders
— Werken in een authentieke hoeve-setting
— Aantrekkelijk uurloon`,
  },
  {
    title: 'Sous-chef',
    location: 'Lommel (nieuw)',
    type: 'Voltijds',
    desc: 'Word mee de basis van onze nieuwste vestiging in Lommel.',
    fullText: `Bogèst opent binnenkort haar vierde vestiging in Lommel. Als sous-chef ben jij de rechterhand van de chef-kok.

Wat we zoeken:
— Minimum 3 jaar ervaring in de horeca-keuken
— Passie voor kwaliteitsvlees en ambachtelijke bereiding
— Leiderschapskwaliteiten en teamgeest
— Bereidheid om mee te bouwen aan een nieuwe vestiging

Wat wij bieden:
— Competitief voltijds salaris
— Directe samenwerking met de chef-kok en directie
— Unieke kans om mee te bouwen aan een nieuwe locatie
— Groeipad naar chef-kok op termijn`,
  },
];

function JobCard({ job, onSelect, isSelected }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLang();

  return (
    <div className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected ? 'border-primary' : 'border-border hover:border-primary/30'}`}
      style={{ background: expanded ? 'rgba(4,4,4,0.12)' : 'hsl(var(--card))' }}>
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-heading text-base font-semibold text-foreground">{job.title}</h3>
            <div className="flex flex-wrap gap-3 mt-1.5">
              <span className="inline-flex items-center gap-1 font-body text-xs text-primary">
                <MapPin className="w-3 h-3" />{job.location}
              </span>
              <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />{job.type}
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-2">{job.desc}</p>
          </div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {expanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-border/50">
              <div className="mt-4 mb-4">
                {job.fullText.split('\n\n').map((para, i) => (
                  <div key={i} className="mb-4">
                    {para.startsWith('—') || para.includes('\n—') ? (
                      <div className="space-y-1.5">
                        {para.split('\n').map((line, j) => (
                          <p key={j} className={`font-body text-sm ${line.startsWith('—') ? 'text-muted-foreground pl-3 border-l border-primary/30' : 'text-foreground font-medium'} leading-relaxed`}>
                            {line.startsWith('—') ? line.slice(2) : line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{para}</p>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => onSelect(job)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300">
                <Briefcase className="w-3.5 h-3.5" /> {t('btn_apply')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Jobs() {
  const { t } = useLang();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', motivation: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleApply = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1000);
  };

  return (
    <div className="w-full">
      <PanelHero label={t('job_label')} title={t('job_title')} titleAccent="kom erbij" subtitle={t('job_subtitle')} bgImage="https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg" />

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <SectionReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">{t('job_openings')}.</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">{t('job_openings_desc')}</p>
            </SectionReveal>
            <div className="space-y-3">
              {openings.map((job, i) => (
                <SectionReveal key={job.title} delay={i * 0.08}>
                  <JobCard job={job} onSelect={setSelected} isSelected={selected?.title === job.title} />
                </SectionReveal>
              ))}
            </div>
          </div>

          <SectionReveal direction="right" delay={0.1}>
            {success ? (
              <div className="flex flex-col items-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">{t('job_success_title')}</h3>
                <p className="font-body text-muted-foreground">{t('job_success_msg')}</p>
                <button onClick={() => { setSuccess(false); setSelected(null); }} className="mt-6 font-body text-sm text-primary hover:underline">
                  {t('btn_new_application')}
                </button>
              </div>
            ) : (
              <div className="sticky top-24">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {selected ? `${t('job_apply_for')}${selected.title}` : t('job_apply_title') + '.'}
                </h2>
                {!selected && <p className="font-body text-sm text-muted-foreground mb-6">{t('job_apply_desc')}</p>}
                {selected && <p className="font-body text-sm text-primary mb-6">{selected.location} · {selected.type}</p>}
                <form onSubmit={handleApply} className="space-y-4">
                  <Input placeholder={t('job_full_name')} value={form.name} onChange={e => set('name', e.target.value)} required className="bg-card border-border font-body" />
                  <Input type="email" placeholder={t('job_email')} value={form.email} onChange={e => set('email', e.target.value)} required className="bg-card border-border font-body" />
                  <Input placeholder={t('job_phone')} value={form.phone} onChange={e => set('phone', e.target.value)} className="bg-card border-border font-body" />
                  <textarea placeholder={t('job_motivation')} value={form.motivation} onChange={e => set('motivation', e.target.value)} rows={5}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  <Button type="submit" disabled={loading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-8 py-3 h-auto">
                    {loading ? t('job_sending') : t('job_send')}
                  </Button>
                </form>
              </div>
            )}
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}