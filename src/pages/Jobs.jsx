import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp, MapPin, Clock, Mail, Phone, Footprints } from 'lucide-react';
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

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// UI chrome — localized per language (kept local so the shared i18n file
// doesn't keep growing).
const UI = {
  nl: {
    titleAccent: 'kom erbij',
    walkinTitle: 'Liever langslopen?',
    walkinDesc: 'Spring gerust binnen — we ontvangen u graag voor een informele kennismaking.',
    walkinAsk: 'vraag naar',
    walkinNote: 'Voor een vlotte start vragen we u bij een sollicitatie volgende zaken mee te brengen: uw identiteitskaart, bankkaart en een e-mailadres (voor de digitale loonbrief bij de loonberekening).',
    cardWalkin: 'Langskomen?',
  },
  fr: {
    titleAccent: 'joignez-vous',
    walkinTitle: 'Préférez-vous passer ?',
    walkinDesc: 'Passez nous voir — nous vous accueillons volontiers pour une rencontre informelle.',
    walkinAsk: 'demandez',
    walkinNote: "Pour un démarrage en douceur, nous vous demandons d'apporter les éléments suivants lors de votre candidature : votre carte d'identité, votre carte bancaire et une adresse e-mail (pour la fiche de paie numérique lors du calcul du salaire).",
    cardWalkin: 'Passer sur place ?',
  },
  en: {
    titleAccent: 'join us',
    walkinTitle: 'Rather drop by?',
    walkinDesc: 'Feel free to drop in — we welcome you for an informal meet-up.',
    walkinAsk: 'ask for',
    walkinNote: 'For a smooth start, we ask you to bring the following to your application: your identity card, bank card and an email address (for the digital payslip during payroll).',
    cardWalkin: 'Dropping by?',
  },
};

// Actuele vacatures — overgenomen van bogest.be/joinus
const OPENINGS = {
  nl: [
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
  ],
  fr: [
    {
      title: 'Responsable de salle',
      location: 'Bogèst Hasselt',
      type: 'Temps plein · H/F',
      desc: "Un leader fédérateur passionné par le service, l'ambiance et la qualité pour notre établissement authentique à Hasselt-Wimmertingen.",
      applyEmail: 'info@bogest-hasselt.be',
      applyPhone: '0473 77 87 49',
      walkIn: 'Marah (Hasselt)',
      fullText: `Pour Bogèst Hasselt, notre établissement authentique à Hasselt-Wimmertingen, nous recherchons un responsable de salle temps plein H/F. Chez Bogèst, tout tourne autour de la qualité, de l'hospitalité et d'une expérience restaurant généreuse. Vous veillez à ce que nos invités se sentent les bienvenus, que l'équipe de salle collabore fort et que chaque service se déroule sans heurts.

Que ferez-vous ?
— Vous dirigez l'équipe de salle et établissez le planning du personnel.
— Vous garantissez chaque jour une expérience optimale pour les invités.
— Vous répondez aux questions de manière orientée client et gérez les demandes spéciales avec professionnalisme.
— Vous fluidifiez les processus de service et veillez à une qualité constante.
— Vous travaillez en étroite collaboration avec la cuisine et les autres départements pour un service sans couture.
— Vous aidez au recrutement, à la formation et au coaching des nouveaux collaborateurs.

Qui recherchons-nous ?
— Vous dégagez une énergie positive et faites preuve de proactivité.
— Vous disposez de solides compétences de communication et de direction.
— Vous avez plusieurs années d'expérience en gestion de salle ou en tant que responsable dans l'horeca.
— Vous travaillez de manière structurée et gardez votre sang-froid lors des moments chargés.
— Vous savez motiver, coacher et inspirer les collaborateurs.
— Vous êtes orienté client, représentatif et hands-on.

Qu'offrons-nous ?
— Une rémunération attractive, conforme au marché, avec des perspectives d'évolution.
— Une voiture de société, selon votre expérience.
— Deux jours de congé fixes par semaine.
— Cinq services du soir, sans service de midi.
— Des possibilités d'évolution au sein d'une équipe de pointe et solidaire.
— Travailler dans un steakhouse authentique passionné de qualité.
— Stabilité et croissance au sein de trois établissements établis au Limbourg.

Bogèst est dérivé de Beau Geste — un beau geste. Ce beau geste commence par une hospitalité sincère, et vous, en tant que responsable de salle, y jouez un rôle clé.`,
    },
    {
      title: 'Grillardin',
      location: 'Bogèst Heusden-Zolder',
      type: 'Temps plein',
      desc: 'Donnez-vous le meilleur devant un grill brûlant ? Sublimer une belle pièce de viande ?',
      applyEmail: 'info@bogest-heusdenzolder.be',
      applyPhone: '011 18 21 20',
      walkIn: 'Mieke (Heusden-Zolder)',
      fullText: `Donnez-vous le mieux de vous-même devant un grill brûlant ? Savez-vous comment sublimer une belle pièce de viande ? Nous avons peut-être une place pour vous dans notre équipe à Heusden-Zolder. Chez Bogèst, tout tourne autour de la qualité, de l'artisanat et d'une expérience restaurant généreuse. D'un steak parfaitement cuit et d'un ribeye juteux à nos célèbres spare ribs : nos invités comptent sur le goût, le savoir-faire et une qualité constante.

Que ferez-vous ?
— Vous préparez nos plats de viande avec respect pour le produit et la cuisson.
— Vous veillez à la qualité et à la cuisson parfaite de chaque plat.
— Vous travaillez de façon fluide et organisée pendant le service.
— Vous formez, avec la cuisine et l'équipe de salle, une seule équipe forte.
— Vous contribuez à faire de chaque assiette un vrai moment Bogèst.

Qui recherchons-nous ?
— Vous avez de l'expérience comme grillardin ou une forte passion pour le grill et la préparation de la viande.
— Vous connaissez la différence entre bleu, saignant et à point.
— Vous travaillez proprement, avec précision et résistance au stress.
— Vous êtes fiable et un vrai joueur d'équipe.
— Vous placez la qualité, le goût et la satisfaction des invités au plus haut.

Qu'offrons-nous ?
— Une rémunération attractive, conforme au marché, selon votre expérience.
— Deux jours de congé fixes par semaine.
— Cinq services du soir, sans service de midi.
— Une fonction stable au sein d'une équipe solidaire et expérimentée.
— Travailler avec de la viande de qualité, des produits frais et des plats maison.
— De l'espace pour développer votre savoir-faire et évoluer.

Bogèst est dérivé de Beau Geste — un beau geste. C'est précisément ce que nous voulons offrir à nos invités chaque jour, et pour cela nous avons besoin de votre talent.`,
    },
    {
      title: 'Grillardin / partie froide',
      location: 'Bogèst Borgloon',
      type: 'Temps plein · H/F',
      desc: "Passionné de cuisine, de produits de qualité et de plats soignés — à l'aise au grill comme à la partie froide.",
      applyEmail: 'info@bogest-borgloon.be',
      applyPhone: '012 21 06 90',
      walkIn: 'Ramin (Borgloon)',
      fullText: `Êtes-vous passionné de cuisine, de produits de qualité et de plats soignés ? Vous sentez-vous à l'aise au grill comme à la partie froide de la cuisine ? Pour Bogèst Borgloon, nous recherchons un grillardin / collaborateur partie froide temps plein H/F. Chez Bogèst, tout tourne autour de la qualité, de l'artisanat et d'une expérience restaurant généreuse. D'un steak parfaitement cuit et d'un ribeye juteux aux entrées soignées, salades fraîches et desserts maison : nos invités comptent sur le goût, le savoir-faire et une qualité constante.

Que ferez-vous ?
— Vous préparez nos plats de viande avec respect pour le produit et la cuisson.
— Vous veillez à la qualité et à la cuisson parfaite de chaque plat.
— Vous assurez la mise en place et les préparations de la partie froide.
— Vous participez à nos entrées, salades et garnitures froides.
— Vous assurez une finition soignée de nos desserts maison.
— Vous veillez à la présentation et à la qualité de chaque assiette.
— Vous travaillez de façon fluide et organisée pendant le service.
— Vous coordonnez avec la cuisine chaude, la partie froide et l'équipe de salle.
— Vous tenez votre poste propre et suivez correctement les règles d'hygiène.

Qui recherchons-nous ?
— Vous avez de l'expérience comme grillardin, cuisinier ou collaborateur de cuisine.
— Vous connaissez les différents modes de cuisson ou êtes motivé pour les apprendre parfaitement.
— Vous avez l'œil pour le goût, la présentation et le détail.
— Vous pouvez travailler en autonomie, mais êtes aussi un vrai joueur d'équipe.
— Vous travaillez proprement, avec précision et résistance au stress.
— Vous êtes fiable, motivé et hands-on.

Qu'offrons-nous ?
— Une rémunération attractive, conforme au marché, selon votre expérience.
— Deux jours de congé fixes par semaine.
— Cinq services du soir, sans service de midi.
— Une fonction temps plein stable au sein d'une équipe solidaire et expérimentée.
— Travailler avec de la viande de qualité, des produits frais et des plats maison.
— De l'espace pour développer votre savoir-faire et évoluer.
— Stabilité et possibilités d'évolution au sein de trois établissements établis au Limbourg.

Bogèst est dérivé de Beau Geste — un beau geste. C'est précisément ce que nous voulons offrir à nos invités chaque jour, et pour cela nous avons besoin de votre talent.`,
    },
  ],
  en: [
    {
      title: 'Front-of-house manager',
      location: 'Bogèst Hasselt',
      type: 'Full-time · M/F',
      desc: 'A unifying leader with a passion for service, atmosphere and quality for our authentic restaurant in Hasselt-Wimmertingen.',
      applyEmail: 'info@bogest-hasselt.be',
      applyPhone: '0473 77 87 49',
      walkIn: 'Marah (Hasselt)',
      fullText: `For Bogèst Hasselt, our authentic restaurant in Hasselt-Wimmertingen, we are looking for a full-time front-of-house manager M/F. At Bogèst, everything revolves around quality, hospitality and a generous restaurant experience. You ensure our guests feel welcome, the floor team works together strongly and every service runs smoothly.

What will you do?
— You lead the floor team and draw up the staff schedule.
— You ensure an optimal guest experience every day.
— You handle questions in a guest-oriented way and deal with special requests professionally.
— You streamline service processes and safeguard constant quality.
— You work closely with the kitchen and other departments for a seamless service.
— You help recruit, train and coach new staff.

Who are we looking for?
— You radiate positive energy and take a proactive attitude.
— You have strong communication and leadership skills.
— You have at least several years of experience in floor management or as a hospitality lead.
— You work in a structured way and keep your cool during busy moments.
— You know how to motivate, coach and inspire staff.
— You are guest-oriented, presentable and hands-on.

What do we offer?
— An attractive, market-conform remuneration with growth opportunities.
— A company car, depending on your experience.
— Two fixed days off per week.
— Five evening services, no lunch service.
— Growth opportunities within a collegial top team.
— Working in an authentic steakhouse with a passion for quality.
— Stability and growth across three established locations in Limburg.

Bogèst is derived from Beau Geste — a beautiful gesture. That beautiful gesture begins with sincere hospitality, and as front-of-house manager you play a key role in it.`,
    },
    {
      title: 'Grill chef',
      location: 'Bogèst Heusden-Zolder',
      type: 'Full-time',
      desc: 'Are you at your best behind a glowing grill? Bringing a beautiful piece of meat to perfection?',
      applyEmail: 'info@bogest-heusdenzolder.be',
      applyPhone: '011 18 21 20',
      walkIn: 'Mieke (Heusden-Zolder)',
      fullText: `Are you at your best behind a glowing grill? Do you know how to bring a beautiful piece of meat to perfection? Then we may have a place for you on our team in Heusden-Zolder. At Bogèst, everything revolves around quality, craft and a generous restaurant experience. From a perfectly cooked steak and juicy ribeye to our famous spare ribs: our guests count on flavour, craftsmanship and constant quality.

What will you do?
— You prepare our meat dishes with respect for the product and the cooking method.
— You safeguard the quality and perfect doneness of every dish.
— You work smoothly and in an organised way during service.
— You form one strong team together with the kitchen and floor crew.
— You help turn every plate into a true Bogèst moment.

Who are we looking for?
— You have experience as a grill chef or a strong passion for grilling and meat preparation.
— You know the difference between bleu, saignant and à point.
— You work cleanly, precisely and stress-resistant.
— You are reliable and a real team player.
— You hold quality, flavour and guest satisfaction in high regard.

What do we offer?
— An attractive, market-conform remuneration depending on your experience.
— Two fixed days off per week.
— Five evening services, no lunch service.
— A stable role within a collegial and experienced team.
— Working with quality meat, fresh products and homemade dishes.
— Room to further develop your craft and grow.

Bogèst is derived from Beau Geste — a beautiful gesture. That is exactly what we want to offer our guests every day, and for that we need your talent.`,
    },
    {
      title: 'Grill chef / cold section',
      location: 'Bogèst Borgloon',
      type: 'Full-time · M/F',
      desc: 'Passionate about cooking, quality products and beautifully finished dishes — at home at the grill and on the cold section.',
      applyEmail: 'info@bogest-borgloon.be',
      applyPhone: '012 21 06 90',
      walkIn: 'Ramin (Borgloon)',
      fullText: `Are you passionate about cooking, quality products and beautifully finished dishes? Do you feel at home at the grill as well as on the cold section of the kitchen? For Bogèst Borgloon we are looking for a full-time grill chef / cold section worker M/F. At Bogèst, everything revolves around quality, craft and a generous restaurant experience. From a perfectly cooked steak and juicy ribeye to carefully prepared starters, fresh salads and homemade desserts: our guests count on flavour, craftsmanship and constant quality.

What will you do?
— You prepare our meat dishes with respect for the product and the cooking method.
— You safeguard the quality and perfect doneness of every dish.
— You handle the mise-en-place and preparations of the cold section.
— You help with our starters, salads and cold garnishes.
— You ensure a careful finish of our homemade desserts.
— You safeguard the presentation and quality of every plate.
— You work smoothly and in an organised way during service.
— You coordinate well with the hot kitchen, cold section and floor crew.
— You keep your workstation clean and follow hygiene rules correctly.

Who are we looking for?
— You have experience as a grill chef, cook or kitchen worker.
— You know the different doneness levels or are motivated to learn them perfectly.
— You have an eye for flavour, presentation and detail.
— You can work independently, but are also a real team player.
— You work cleanly, precisely and stress-resistant.
— You are reliable, motivated and hands-on.

What do we offer?
— An attractive, market-conform remuneration depending on your experience.
— Two fixed days off per week.
— Five evening services, no lunch service.
— A stable full-time role within a collegial and experienced team.
— Working with quality meat, fresh products and homemade dishes.
— Room to further develop your craft and grow.
— Stability and growth opportunities across three established locations in Limburg.

Bogèst is derived from Beau Geste — a beautiful gesture. That is exactly what we want to offer our guests every day, and for that we need your talent.`,
    },
  ],
};

function JobCard({ job, onSelect, isSelected, lang, num }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLang();
  const ui = UI[lang] || UI.nl;

  return (
    <div className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden bg-white/[0.04] backdrop-blur-md hover:-translate-y-0.5 hover:shadow-xl ${isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40'}`}>
      <span className="absolute right-4 top-3 font-heading font-bold text-primary/10 group-hover:text-primary/20 text-5xl leading-none select-none pointer-events-none transition-colors duration-300">{num}</span>
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left p-5 relative">
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
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 border border-border group-hover:border-primary/50 transition-colors">
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
                <div className="mb-4 p-3 rounded-lg space-y-1.5 bg-muted/30 border border-border">
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
                      <Footprints className="w-3.5 h-3.5 text-primary" /> {ui.cardWalkin} {ui.walkinAsk} {job.walkIn}
                    </p>
                  )}
                </div>
              )}

              <button onClick={() => onSelect(job)}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary/15 text-primary border border-primary/40 backdrop-blur-md hover:bg-primary/25 hover:border-primary/60 font-body text-xs tracking-widest uppercase transition-all duration-300">
                {t('btn_apply')}
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
  const ui = UI[lang] || UI.nl;
  const [openings, setOpenings] = useState(() => OPENINGS[lang] || OPENINGS.nl);
  useEffect(() => {
    let active = true;
    base44.entities.Job.filter({ active: true }, 'sort_order', 50)
      .then((rows) => {
        if (!active || !rows || !rows.length) return;
        const mapped = rows.map((r) => ({
          title: r[`title_${lang}`] || r.title_nl || '',
          location: r.location_name || '',
          type: r[`type_${lang}`] || r.type_nl || '',
          desc: r[`desc_${lang}`] || r.desc_nl || '',
          applyEmail: r.apply_email,
          applyPhone: r.apply_phone,
          walkIn: r.walk_in,
          fullText: r[`full_text_${lang}`] || r.full_text_nl || '',
        }));
        if (active && mapped.length) setOpenings(mapped);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [lang]);
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
      <PanelHero label={t('job_label')} title={t('job_title')} titleAccent={ui.titleAccent} subtitle={t('job_subtitle')} positionKey="jobs.hero" />

      <PanelContent>
      <section id="vacatures" className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
        {/* Gelaagd glas — warme gradient + ghostbull, zoals de pop-up */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.20) 0%, rgba(44,42,36,0.06) 55%, transparent 100%)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent 55%)' }} />
          <img src={BULL_MARK} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '30rem', width: 'auto', bottom: '-5rem', right: '-10%', opacity: 0.09, filter: 'grayscale(1) brightness(2.4)' }} />
          <div className="relative z-10 p-5 md:p-7">
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
                  <JobCard job={job} onSelect={setSelected} isSelected={selected?.title === job.title} lang={lang} num={String(i + 1).padStart(2, '0')} />
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={0.1}>
              <div id="langskomen" className="mt-8 p-5 rounded-2xl border border-border bg-white/[0.04] backdrop-blur-md shadow-lg">
                <h3 className="font-heading text-base font-semibold text-foreground mb-3">{ui.walkinTitle}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{ui.walkinDesc}</p>
                <ul className="space-y-2 font-body text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span className="text-foreground">Borgloon</span> — {ui.walkinAsk} Ramin</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span className="text-foreground">Hasselt</span> — {ui.walkinAsk} Marah</li>
                  <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span className="text-foreground">Heusden-Zolder</span> — {ui.walkinAsk} Mieke</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="font-body text-xs text-muted-foreground">
                    {ui.walkinNote}
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>

          <SectionReveal id="solliciteren" direction="right" delay={0.1}>
            {success ? (
              <div className="flex flex-col items-center text-center rounded-2xl border border-border bg-white/[0.04] backdrop-blur-md p-10 md:p-14 shadow-lg">
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
              <div className="sticky top-24 relative overflow-hidden rounded-2xl border border-border bg-white/[0.04] backdrop-blur-md p-6 md:p-8 shadow-lg">

                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-10 bg-primary" />
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('job_label')}</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold leading-[0.95] text-foreground mb-2">
                  {selected ? `${t('job_apply_for')}${selected.title}` : t('job_apply_title')}<span className="text-primary">.</span>
                </h2>
                {!selected && <p className="font-body text-sm text-muted-foreground mb-6">{t('job_apply_desc')}</p>}
                {selected && <p className="font-body text-sm text-primary mb-6">{selected.location} · {selected.type}</p>}
                <form onSubmit={handleApply} className="space-y-4">
                  <Input placeholder={t('job_full_name')} value={form.name} onChange={e => set('name', e.target.value)} required className="bg-white/[0.04] border-white/10 backdrop-blur-md font-body" />
                  <Input type="email" placeholder={t('job_email')} value={form.email} onChange={e => set('email', e.target.value)} required className="bg-white/[0.04] border-white/10 backdrop-blur-md font-body" />
                  <Input placeholder={t('job_phone')} value={form.phone} onChange={e => set('phone', e.target.value)} className="bg-white/[0.04] border-white/10 backdrop-blur-md font-body" />
                  <textarea placeholder={t('job_motivation')} value={form.motivation} onChange={e => set('motivation', e.target.value)} rows={5}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-md px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  <Button type="submit" disabled={loading}
                    className="bg-primary/15 text-primary border border-primary/40 backdrop-blur-md hover:bg-primary/25 hover:border-primary/60 font-body text-xs tracking-widest uppercase rounded-full px-8 py-3 h-auto transition-all duration-300">
                    {loading ? t('job_sending') : t('job_send')}
                  </Button>
                </form>
              </div>
            )}
          </SectionReveal>
        </div>
          </div>
        </div>
      </section>
      </PanelContent>
    </div>
  );
}