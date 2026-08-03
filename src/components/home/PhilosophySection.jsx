import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HomeTitle from '@/components/home/HomeTitle';

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
    title: 'Het gebaar achter Bogèst.',
    accent: 'Bogèst',
    lead: 'Bogèst begon met een eenvoudige gedachte: een compleet diner genieten, zonder verrassingen op de rekening. Rond die belofte groeide een huis van ambacht — grilleurs die elk stuk vlees kennen, een kelder met zelfgekozen wijnen, en drie authentieke hoeves waar generaties samenkomen. Achter elk gerecht schuilt een verhaal van mensen, passie en streek.',
    cta: 'Ontdek ons verhaal',
    caption: 'Drie hoeves · één belofte',
  },
  fr: {
    label: 'Notre promesse et philosophie',
    title: 'Le geste derrière Bogèst.',
    accent: 'Bogèst',
    lead: "Bogèst est né d'une idée simple : profiter d'un dîner complet, sans surprise sur l'addition. Autour de cette promesse s'est bâtie une maison d'artisanat — des grillards qui connaissent chaque pièce de viande, une cave de vins choisis par nos soins, et trois fermes authentiques où se réunissent les générations. Derrière chaque plat se cache une histoire de personnes, de passion et de territoire.",
    cta: 'Découvrez notre histoire',
    caption: 'Trois fermes · une promesse',
  },
  en: {
    label: 'Our promise and philosophy',
    title: 'The gesture behind Bogèst.',
    accent: 'Bogèst',
    lead: 'Bogèst began with a simple idea: enjoy a complete dinner, with no surprises on the bill. Around that promise grew a house of craft — grillers who know every cut of meat, a cellar of self-selected wines, and three authentic farmhouses where generations gather. Behind every dish lies a story of people, passion and region.',
    cta: 'Discover our story',
    caption: 'Three farmhouses · one promise',
  },
};

// A calm, editorial introduction to the Over Ons panel. Strong typography, a
// single portrait image with a refined gold corner accent, and a hairline
// that separates the text from the image on desktop — no watermark, no
// scroll-driven panels; just the story of Bogèst, leading onward.
export default function PhilosophySection() {
  const { lang } = useLang();
  const { siteImg } = useSiteImages();
  const labels = LABELS[lang] || LABELS.nl;

  return (
    <section id="filosofie" className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Subtle warm tonal layer for depth — no watermark */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(160deg, hsl(var(--primary) / 0.05) 0%, transparent 45%)' }} />

      <div className="relative w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <div className="lg:col-span-7 lg:pr-12 lg:border-r lg:border-border/70">
            <SectionReveal direction="up">
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-10 bg-primary" />
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">
                  {labels.label}
                </span>
              </div>

              <HomeTitle title={labels.title} accent={labels.accent} breakLine className="mb-8" />

              <div className="flex items-center gap-2 mb-7">
                <div className="w-12 h-px bg-primary/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              </div>

              <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10">
                {labels.lead}
              </p>

              <Link
                to="/about"
                className="group inline-flex items-center gap-3 font-body text-xs tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors duration-300"
              >
                {labels.cta}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/40 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </Link>
            </SectionReveal>
          </div>

          {/* Image column */}
          <div className="lg:col-span-5">
            <SectionReveal direction="left" delay={0.12}>
              <figure className="relative">
                <div
                  className="relative overflow-hidden rounded-2xl aspect-[4/5] shadow-2xl"
                  style={{ boxShadow: '0 28px 70px -24px rgba(0,0,0,0.45)' }}
                >
                  <img
                    src={siteImg('philosophy.0')}
                    data-bb-key="philosophy.0"
                    data-bb-label="Filosofie — Bogèst"
                    alt="Bogèst"
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                    style={{ filter: 'saturate(0.85) brightness(0.92)' }}
                  />
                  {/* Soft tonal gradient for caption legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  {/* Gold corner accents */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-primary/50 rounded-tl-lg" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-primary/50 rounded-br-lg" />
                </div>

                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="h-px w-7 bg-primary/50" />
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                    {labels.caption}
                  </span>
                </figcaption>
              </figure>
            </SectionReveal>
          </div>

        </div>
      </div>
    </section>
  );
}