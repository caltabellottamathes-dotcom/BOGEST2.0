import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import HomeTitle from '@/components/home/HomeTitle';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

export const PILLARS_DATA = {
  nl: [
  { num: '01', title: 'Onze Formule', subtitle: 'De basis van alles', body: 'Bij Bogèst draait alles om de formule: bij elk hoofdgerecht is een voorgerecht naar keuze én een dessert inbegrepen. Geen verrassingen op de rekening — één prijs, een complete ervaring. Van de warme soep tot de laatste hap dessert, wij zorgen voor het hele traject. Dat is hoe wij gastvrijheid vieren.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg' },
  { num: '02', title: 'Onze Specialiteit', subtitle: 'Vleesambacht', body: 'Vlees is ons handwerk. Onze grilleurs kennen elk stuk, elke snede en elke techniek om de smaak optimaal tot zijn recht te laten komen. Of het nu om een malse filet pur, een goed gemarmerde ribeye of een feestelijke côte à l\'os gaat — wij weten hoe elk stuk op de grill thuishoort. Onze trots: het Belgisch Witblauw, een streekras dat vlees van uitzonderlijke fijnheid en kwaliteit levert.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
  { num: '03', title: 'Voor Iedereen', subtitle: 'Kip, Vis en Veggie', body: 'Hoewel vlees ons handwerk is, begrijpen we dat niet iedereen hetzelfde kiest. Daarom bieden we ook heerlijke kip, verse vis en innovatieve vegetarische opties. Elk gerecht wordt met dezelfde zorg bereid en dezelfde ingrediëntenkwaliteit, zodat iedereen een onvergetelijk moment heeft.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg' },
  { num: '04', title: 'Onze Wijnen', subtitle: 'Exclusief Huislabel', body: 'Wijn is meer dan een bijgerecht — het is een partner in het diner. Ons exclusieve huislabel is door ons zelf geselecteerd, in samenwerking met wijnmakers die wij persoonlijk kennen. We kozen bewust voor wijnen met karakter die onze grillgerechten aanvullen: een volle rode die het vlees tilt, een frisse witte die vis verfraait, en verrassende orange wines voor wie iets anders zoekt. Elke fles in onze kelder is een bewuste keuze — geen toeval.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798027-ZPXKAMZNVCSV6440QX6W/402597853_796945305777335_8211882432551808857_n.jpg' },
  { num: '05', title: 'De Sfeer', subtitle: 'Authentieke Hoeves', body: 'Onze locaties — Hasselt, Borgloon en Heusden-Zolder — zijn niet zomaar restaurants. Ze zijn warme, gezellige hoeves waar generaties hebben gegeten, gelachen en gevierd. Elke ruimte vertelt een verhaal. Hier ontstaan vriendschappen, mijlpalen, en momenten die u nooit vergeet.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg' }],

  fr: [
  { num: '01', title: 'Notre Formule', subtitle: 'La base de tout', body: "Chez Bogèst, tout tourne autour de la formule : avec chaque plat principal, une entrée au choix et un dessert sont inclus. Aucune surprise sur l'addition — un seul prix, une expérience complète. De la soupe chaude à la dernière bouchée de dessert, nous nous occupons de tout le parcours. C'est ainsi que nous célébrons l'hospitalité.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg' },
  { num: '02', title: 'Notre Spécialité', subtitle: "L'art de la viande", body: "La viande est notre métier. Nos grillards connaissent chaque pièce, chaque coupe et chaque technique pour faire ressortir la meilleure saveur. Qu'il s'agisse d'un filet pur tendre, d'une ribeye bien persillée ou d'une côte à l'os festive — nous savons comment chaque morceau doit cuire. Notre fierté : le Blanc Bleu Belge, une race régionale qui offre une viande d'une finesse et d'une qualité exceptionnelles.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
  { num: '03', title: 'Pour Tous', subtitle: 'Poulet, Poisson et Végétarien', body: "Bien que la viande soit notre métier, nous comprenons que tous ne font pas les mêmes choix. C'est pourquoi nous proposons aussi un poulet délicieux, du poisson frais et des options végétariennes innovantes.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg' },
  { num: '04', title: 'Nos Vins', subtitle: 'Label Maison Exclusif', body: "Le vin est bien plus qu'un accompagnement — c'est un partenaire du dîner. Notre label maison exclusif a été sélectionné par nous-mêmes, en collaboration avec des vignerons que nous connaissons personnellement. Nous avons choisi des vins de caractère qui subliment nos grillades : un rouge puissant qui élève la viande, un blanc frais qui magnifie le poisson, et des orange wines surprenants pour ceux qui cherchent autre chose. Chaque bouteille dans notre cave est un choix réfléchi — jamais un hasard.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798027-ZPXKAMZNVCSV6440QX6W/402597853_796945305777335_8211882432551808857_n.jpg' },
  { num: '05', title: "L'Ambiance", subtitle: 'Fermes Authentiques', body: "Nos trois lieux — Hasselt, Borgloon et Heusden-Zolder — ne sont pas simplement des restaurants. Ce sont des fermes chaleureuses et conviviales où les générations ont mangé, ri et célébré. Chaque espace raconte une histoire.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg' }],

  en: [
  { num: '01', title: 'Our Formula', subtitle: 'The foundation of everything', body: 'At Bogèst, everything revolves around the formula: with every main course, a starter of your choice and a dessert are included. No surprises on the bill — one price, a complete experience. From the warm soup to the last bite of dessert, we take care of the entire journey. That is how we celebrate hospitality.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg' },
  { num: '02', title: 'Our Specialty', subtitle: 'The Craft of Meat', body: 'Meat is our craft. Our grillers know every cut, every slice, and every technique to bring out the best flavor. Whether it is a tender filet pur, a well-marbled ribeye, or a festive côte à l\'os — we know how each piece belongs on the grill. Our pride: the Belgian Blanc Bleu, a regional breed that yields meat of exceptional fineness and quality.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
  { num: '03', title: 'For Everyone', subtitle: 'Chicken, Fish and Veggie', body: "While meat is our craft, we understand that not everyone makes the same choice. That's why we also offer delicious chicken, fresh fish, and innovative vegetarian options. Each dish is prepared with the same care and ingredient quality.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg' },
  { num: '04', title: 'Our Wines', subtitle: 'Exclusive House Label', body: "Wine is more than a pairing — it's a dinner partner. Our exclusive house label was selected by us, in collaboration with winemakers we know personally. We chose wines with character that complement our grilled dishes: a full red that elevates the meat, a crisp white that enhances the fish, and surprising orange wines for those seeking something different. Every bottle in our cellar is a conscious choice — never an accident.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798027-ZPXKAMZNVCSV6440QX6W/402597853_796945305777335_8211882432551808857_n.jpg' },
  { num: '05', title: 'The Atmosphere', subtitle: 'Authentic Farmhouses', body: "Our three locations — Hasselt, Borgloon, and Heusden-Zolder — are not just restaurants. They are warm, convivial farmhouses where generations have eaten, laughed, and celebrated. Every space tells a story.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg' }]
};

export const LABELS = {
  nl: {
    label: 'Onze belofte en filosofie',
    title: 'Achter elk gerecht',
    accent: 'een verhaal.',
    lead: 'Bogèst begon met één gedachte: genieten zonder verrassingen. Rond die belofte groeide een huis van ambacht — waar grilleurs, wijnen en drie authentieke hoeves samen één verhaal vertellen.',
    chapters: [
      { num: '01', title: 'Ons Verhaal', subtitle: 'Drie hoeves, één familie', body: 'Wat begon als een bescheiden grillrestaurant groeide uit tot drie geliefde hoeves — in Hasselt, Borgloon en Heusden-Zolder. Drie plekken, dezelfde warmte, dezelfde passie voor vleesambacht en gastvrijheid.', link: { label: 'Ontdek ons verhaal', to: '/about/ons-verhaal' } },
      { num: '02', title: 'Onze Filosofie', subtitle: 'De formule, de ambacht', body: 'Eén prijs, een compleet diner: voorgerecht, hoofdgerecht en dessert. Geen verrassingen op de rekening — alleen op het bord. Achter die eenvoud staat een keuken die elk detail kent.', link: { label: 'Ontdek onze filosofie', to: '/about/onze-filosofie' } },
      { num: '03', title: 'Achter de schermen', subtitle: 'Onze wereld, live', body: 'Sfeerbeelden, gerechten en momenten uit keuken en zalen — wij delen ze dagelijks op Instagram en Facebook. Een blik achter de schermen, terwijl het gebeurt.', link: { label: 'Bekijk achter de schermen', to: '/about/instagram' } },
    ],
    finalCta: 'Ontdek ons verhaal',
  },
  fr: {
    label: 'Notre promesse et philosophie',
    title: 'Derrière chaque plat',
    accent: 'une histoire.',
    lead: "Bogèst est né d'une idée : profiter sans surprises. Autour de cette promesse s'est bâti une maison d'artisanat — où grillards, vins et trois fermes authentiques racontent une seule histoire.",
    chapters: [
      { num: '01', title: 'Notre Histoire', subtitle: 'Trois fermes, une famille', body: "Ce qui a commencé comme un modeste restaurant-grill est devenu trois fermes bien-aimées — à Hasselt, Borgloon et Heusden-Zolder. Trois lieux, la même chaleur, la même passion pour l'art de la viande et l'hospitalité.", link: { label: 'Découvrir notre histoire', to: '/about/ons-verhaal' } },
      { num: '02', title: 'Notre Philosophie', subtitle: "La formule, l'artisanat", body: "Un seul prix, un dîner complet : entrée, plat et dessert. Aucune surprise sur l'addition — seulement dans l'assiette. Derrière cette simplicité se cache une cuisine qui connaît chaque détail.", link: { label: 'Découvrir notre philosophie', to: '/about/onze-filosofie' } },
      { num: '03', title: 'Dans les coulisses', subtitle: 'Notre univers, en direct', body: "Ambiances, plats et moments de la cuisine et des salles — nous les partageons chaque jour sur Instagram et Facebook. Un regard dans les coulisses, au fil de l'instant.", link: { label: 'Voir les coulisses', to: '/about/instagram' } },
    ],
    finalCta: 'Découvrez notre histoire',
  },
  en: {
    label: 'Our promise and philosophy',
    title: 'Behind every dish',
    accent: 'a story.',
    lead: 'Bogèst began with one thought: enjoyment without surprises. Around that promise grew a house of craft — where grillers, wines and three authentic farmhouses tell a single story.',
    chapters: [
      { num: '01', title: 'Our Story', subtitle: 'Three farmhouses, one family', body: 'What began as a modest grill restaurant grew into three beloved farmhouses — in Hasselt, Borgloon and Heusden-Zolder. Three places, the same warmth, the same passion for the craft of meat and hospitality.', link: { label: 'Discover our story', to: '/about/ons-verhaal' } },
      { num: '02', title: 'Our Philosophy', subtitle: 'The formula, the craft', body: 'One price, a complete dinner: starter, main and dessert. No surprises on the bill — only on the plate. Behind that simplicity stands a kitchen that knows every detail.', link: { label: 'Discover our philosophy', to: '/about/onze-filosofie' } },
      { num: '03', title: 'Behind the scenes', subtitle: 'Our world, live', body: 'Atmosphere, dishes and moments from the kitchen and the dining rooms — we share them daily on Instagram and Facebook. A look behind the scenes, as it happens.', link: { label: 'See behind the scenes', to: '/about/instagram' } },
    ],
    finalCta: 'Discover our story',
  },
};

// A quiet, editorial introduction to the Over Ons panel. Three chapters —
// Verhaal, Filosofie, Achter de schermen — separated by hairline rules, each
// led by a ghosted gold numeral. The "Achter de schermen" chapter points to
// the dedicated social panel (/about/instagram) rather than showing social
// content inline. No watermark, no images — just the story, leading onward.
export default function PhilosophySection() {
  const { lang } = useLang();
  const labels = LABELS[lang] || LABELS.nl;

  return (
    <section id="filosofie" className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Subtle warm tonal layer for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, hsl(var(--primary) / 0.06) 0%, transparent 45%)' }} />
      {/* Large ghosted bull mark — bleeding off the right edge, the recurring site motif */}
      <img src={BULL_MARK} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '40rem', width: 'auto', bottom: '-8rem', right: '-10%', opacity: 0.05, filter: 'grayscale(1) brightness(2.4)' }} />

      <div className="relative w-full px-6 md:px-10 lg:px-16">

        {/* Editorial header */}
        <SectionReveal direction="up">
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{labels.label}</span>
          </div>
          <HomeTitle title={labels.title} accent={labels.accent} breakLine className="mb-7 max-w-[16ch]" />
          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
            {labels.lead}
          </p>
        </SectionReveal>

        {/* Three chapters — hairline-separated editorial columns */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 gap-12 lg:gap-0 lg:grid-cols-3 lg:divide-x lg:divide-border/50">
          {labels.chapters.map((ch, i) => (
            <SectionReveal
              key={ch.num}
              direction="up"
              delay={i * 0.1}
              className="lg:px-10"
            >
              <div className="flex items-start gap-5">
                <span className="font-heading text-5xl md:text-6xl font-bold text-primary/25 leading-none select-none mt-1">
                  {ch.num}
                </span>
                <div className="min-w-0">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-2">{ch.title}</p>
                  <p className="font-heading text-lg md:text-xl font-semibold text-foreground mb-3 leading-snug">{ch.subtitle}</p>
                  <p className="font-body text-base text-muted-foreground leading-relaxed">{ch.body}</p>
                  {ch.link && (
                    <Link
                      to={ch.link.to}
                      className="group mt-5 inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors duration-300"
                    >
                      {ch.link.label}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

      </div>
    </section>
  );
}