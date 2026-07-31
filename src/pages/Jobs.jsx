import React, { useState } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp, MapPin, Clock, Briefcase, Mail, Phone, Footprints } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import { HintLine } from '@/components/HostHint';
import { hostQuestion } from '@/lib/hostHint';
import { base44 } from '@/api/base44Client';

// Actuele vacatures — overgenomen van bogest.be/joinus
const openings = [
  {
    title: 'Zaalverantwoordelijke',
    location: 'Bogèst Hasselt',
    type: 'Voltijds · M/V',
    desc: 'Een verbindende leider met passie voor service, sfeer en kwaliteit voor onze authentieke zaak in Hasselt-Wimmertingen.',
    applyEmail: 'info@bogest-hasselt.be',
    applyPhone: '0473 77 87 49',
    walkIn: 'Marah (Hasselt)',
    fullText: `Voor Bogèst Hasselt, onze authentieke zaak in Hasselt-Wimmertingen, zoeken we een voltijdse zaalverantwoordelijke M/V. Bij Bogèst draait alles om kwaliteit, gastvrijheid en een gulhartige restaurantbeleving. Jij zorgt ervoor dat onze gasten zich welkom voelen, het zaalteam sterk samenwerkt en iedere service vlot verloopt.

Wat ga je doen?
— Je geeft leiding aan het zaalteam en maakt de personeelsplanning op.
— Je zorgt iedere dag voor een optimale gastenervaring.
— Je gaat gastgericht om met vragen en handelt speciale verzoeken professioneel af.
— Je stroomlijnt de serviceprocessen en bewaakt een constante kwaliteit.
— Je werkt nauw samen met de keuken en andere afdelingen voor een naadloze service.
— Je helpt bij de werving, opleiding en coaching van nieuwe medewerkers.

Wie zoeken we?
— Je straalt positieve energie uit en hebt een proactieve houding.
— Je beschikt over sterke communicatieve en leidinggevende vaardigheden.
— Je hebt minimaal enkele jaren ervaring in zaalbeheer of als leidinggevende in de horeca.
— Je werkt gestructureerd en behoudt je kalmte tijdens drukke momenten.
— Je weet medewerkers te motiveren, coachen en inspireren.
— Je bent gastgericht, representatief en hands-on.

Wat bieden wij?
— Een aantrekkelijke, marktconforme verloning met groeimogelijkheden.
— Een bedrijfswagen, afhankelijk van je ervaring.
— Twee vaste vrije dagen per week.
— Vijf avondservices, zonder lunchservice.
— Doorgroeimogelijkheden binnen een collegiaal topteam.
— Werken in een authentiek steakhouse met een passie voor kwaliteit.
— Stabiliteit en groei binnen drie gevestigde locaties in Limburg.

Bogèst is afgeleid van Beau Geste — een mooi gebaar. Dat mooie gebaar begint bij oprechte gastvrijheid, en daar speel jij als zaalverantwoordelijke een sleutelrol in.`,
  },
  {
    title: 'Grillkok',
    location: 'Bogèst Heusden-Zolder',
    type: 'Voltijds',
    desc: 'Ben jij op je best achter een gloeiende grill? Een mooi stuk vlees perfect tot zijn recht laten komen?',
    applyEmail: 'info@bogest-heusdenzolder.be',
    applyPhone: '011 18 21 20',
    walkIn: 'Mieke (Heusden-Zolder)',
    fullText: `Ben jij op je best achter een gloeiende grill? Weet jij hoe je een mooi stuk vlees perfect tot zijn recht laat komen? Dan hebben wij misschien een plaats voor jou in ons team in Heusden-Zolder. Bij Bogèst draait alles om kwaliteit, ambacht en een gulhartige restaurantbeleving. Van een perfect gebakken steak en sappige ribeye tot onze beroemde spare ribs: onze gasten rekenen op smaak, vakmanschap en constante kwaliteit.

Wat ga je doen?
— Je bereidt onze vleesgerechten met respect voor product en bakwijze.
— Je bewaakt de kwaliteit en perfecte cuisson van elk gerecht.
— Je werkt vlot en georganiseerd tijdens de service.
— Je vormt samen met de keuken- en zaalploeg één sterk team.
— Je helpt van ieder bord een echt Bogèst-moment te maken.

Wie zoeken we?
— Je hebt ervaring als grillkok of een sterke passie voor grillen en vleesbereidingen.
— Je kent het verschil tussen bleu, saignant en à point.
— Je werkt netjes, nauwkeurig en stressbestendig.
— Je bent betrouwbaar en een echte teamspeler.
— Je draagt kwaliteit, smaak en gasttevredenheid hoog in het vaandel.

Wat bieden wij?
— Een aantrekkelijke, marktconforme verloning afhankelijk van je ervaring.
— Twee vaste vrije dagen per week.
— Vijf avondservices, zonder lunchservice.
— Een stabiele functie binnen een collegiaal en ervaren team.
— Werken met kwaliteitsvlees, verse producten en huisbereide gerechten.
— Ruimte om je vakkennis verder te ontwikkelen en door te groeien.

Bogèst is afgeleid van Beau Geste — een mooi gebaar. Dat is precies wat we onze gasten iedere dag willen bieden, en daar hebben we jouw talent voor nodig.`,
  },
  {
    title: 'Grillkok / koude kant',
    location: 'Bogèst Borgloon',
    type: 'Voltijds · M/V',
    desc: 'Gepassioneerd door koken, kwaliteitsproducten en mooi afgewerkte gerechten — thuis achter de grill én aan de koude kant.',
    applyEmail: 'info@bogest-borgloon.be',
    applyPhone: '012 21 06 90',
    walkIn: 'Ramin (Borgloon)',
    fullText: `Ben jij gepassioneerd door koken, kwaliteitsproducten en mooi afgewerkte gerechten? Voel jij je thuis achter de grill én aan de koude kant van de keuken? Voor Bogèst Borgloon zoeken we een voltijdse grillkok / medewerker koude kant M/V. Bij Bogèst draait alles om kwaliteit, ambacht en een gulhartige restaurantbeleving. Van een perfect gebakken steak en sappige ribeye tot verzorgde voorgerechten, frisse salades en huisbereide desserts: onze gasten rekenen op smaak, vakmanschap en constante kwaliteit.

Wat ga je doen?
— Je bereidt onze vleesgerechten met respect voor product en bakwijze.
— Je bewaakt de kwaliteit en perfecte cuisson van elk gerecht.
— Je verzorgt de mise-en-place en bereidingen van de koude kant.
— Je werkt mee aan onze voorgerechten, salades en koude garnituren.
— Je zorgt voor een verzorgde afwerking van onze huisbereide desserts.
— Je bewaakt de presentatie en kwaliteit van ieder bord.
— Je werkt vlot en georganiseerd tijdens de service.
— Je stemt goed af met de warme keuken, koude kant en zaalploeg.
— Je houdt je werkplek netjes en volgt de hygiënevoorschriften correct op.

Wie zoeken we?
— Je hebt ervaring als grillkok, kok of keukenmedewerker.
— Je kent de verschillende bakwijzen of bent gemotiveerd om deze perfect te leren.
— Je hebt oog voor smaak, presentatie en detail.
— Je kunt zelfstandig werken, maar bent ook een echte teamspeler.
— Je werkt netjes, nauwkeurig en stressbestendig.
— Je bent betrouwbaar, gemotiveerd en hands-on.

Wat bieden wij?
— Een aantrekkelijke, marktconforme verloning afhankelijk van je ervaring.
— Twee vaste vrije dagen per week.
— Vijf avondservices, zonder lunchservice.
— Een stabiele voltijdse functie binnen een collegiaal en ervaren team.
— Werken met kwaliteitsvlees, verse producten en huisbereide gerechten.
— Ruimte om je vakkennis verder te ontwikkelen en door te groeien.
— Stabiliteit en groeimogelijkheden binnen drie gevestigde locaties in Limburg.

Bogèst is afgeleid van Beau Geste — een mooi gebaar. Dat is precies wat we onze gasten iedere dag willen bieden, en daar hebben we jouw talent voor nodig.`,
  },
];

function JobCard({ job, onSelect, isSelected, lang }) {
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

              {(job.applyEmail || job.applyPhone || job.walkIn) && (
                <div className="mb-4 p-3 rounded-lg space-y-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {job.applyEmail && (
                    <a href={`mailto:${job.applyEmail}`} className="flex items-center gap-2 font-body text-xs text-foreground hover:text-primary transition-colors">
                      <Mail className="w-3.5 h-3.5 text-primary" /> {job.applyEmail}
                    </a>
                  )}
                  {job.applyPhone && (
                    <a href={`tel:${job.applyPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {job.applyPhone}
                    </a>
                  )}
                  {job.walkIn && (
                    <p className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                      <Footprints className="w-3.5 h-3.5 text-primary" /> Langskomen? Vraag naar {job.walkIn}
                    </p>
                  )}
                </div>
              )}

              <button onClick={() => onSelect(job)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300">
                <Briefcase className="w-3.5 h-3.5" /> {t('btn_apply')}
              </button>
              <div className="mt-4">
                <HintLine question={hostQuestion(lang, job.title)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Jobs() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', motivation: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      await base44.functions.invoke('sendContactMessage', {
        type: 'job',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.motivation,
        location: selected.location,
        jobTitle: selected.title,
      });
      setSuccess(true);
    } catch {
      // validation/store failure — leave the form so the visitor can retry
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <PanelHero label={t('job_label')} title={t('job_title')} titleAccent="kom erbij" subtitle={t('job_subtitle')} positionKey="jobs.hero" />

      <PanelContent>
      <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <SectionReveal>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-10 bg-primary" />
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('job_label')}</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground mb-3">{t('job_openings')}<span className="text-primary">.</span></h2>
              <p className="font-body text-sm text-muted-foreground mb-8 max-w-xl">{t('job_openings_desc')}</p>
            </SectionReveal>
            <div className="space-y-3">
              {openings.map((job, i) => (
                <SectionReveal key={job.title} delay={i * 0.08}>
                  <JobCard job={job} onSelect={setSelected} isSelected={selected?.title === job.title} lang={lang} />
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={0.1}>
              <div className="mt-8 p-5 rounded-2xl border border-border" style={{ background: 'hsl(var(--card))' }}>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">Liever langslopen?</h3>
                <p className="font-body text-sm text-muted-foreground mb-3">Spring gerust binnen — we ontvangen u graag voor een informele kennismaking.</p>
                <ul className="space-y-1.5 font-body text-sm text-muted-foreground">
                  <li>📍 <span className="text-foreground">Borgloon</span> — vraag naar Ramin</li>
                  <li>📍 <span className="text-foreground">Hasselt</span> — vraag naar Marah</li>
                  <li>📍 <span className="text-foreground">Heusden-Zolder</span> — vraag naar Mieke</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="font-body text-xs text-muted-foreground">
                    Voor een vlotte start vragen we u bij een sollicitatie volgende zaken mee te brengen: uw identiteitskaart, bankkaart en een e-mailadres (voor de digitale loonbrief bij de loonberekening).
                  </p>
                </div>
              </div>
            </SectionReveal>
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
                <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[0.95] text-foreground mb-2">
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
      </PanelContent>
    </div>
  );
}