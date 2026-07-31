import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { useLang } from '@/lib/LangContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSiteImages } from '@/lib/SiteImageContext';
import BogestLogo from '@/components/BogestLogo';
import HomeTitle from '@/components/home/HomeTitle';
import HostHint from '@/components/HostHint';
import { hostQuestion, hostHintLabel } from '@/lib/hostHint';

const PILLARS_DATA = {
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

const LABELS = {
  nl: { label: 'Onze belofte en filosofie', title: 'Het gebaar achter Bogèst.', accent: 'Bogèst' },
  fr: { label: 'Notre promesse et philosophie', title: 'Le geste derrière Bogèst.', accent: 'Bogèst' },
  en: { label: 'Our promise and philosophy', title: 'The gesture behind Bogèst.', accent: 'Bogèst' }
};

export default function PhilosophySection() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isMobile = useIsMobile();
  const pillars = PILLARS_DATA[lang] || PILLARS_DATA.nl;
  const labels = LABELS[lang] || LABELS.nl;
  const isLight = theme === 'light';
  const { siteImg } = useSiteImages();
  const NAV = isMobile ? 64 : 80;

  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const panelRefs = useRef([]);
  const imgRefs = useRef([]);

  // Same glassmorphism as overlay panels (OverlayPanelShell / GlassPanel)
  const glassBg = isLight ? 'hsl(var(--background) / 0.30)' : 'rgba(0,0,0,0.38)';
  const glassBorder = isLight ? '1px solid hsl(78 35% 28% / 0.25)' : '1px solid rgba(255,255,255,0.10)';
  const glassShadow = isLight ? '0 -24px 60px rgba(0,0,0,0.10)' : '0 -24px 80px rgba(0,0,0,0.50)';

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const totalScrollable = el.offsetHeight - window.innerHeight;
        if (totalScrollable <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
        const n = pillars.length - 1;

        for (let i = 1; i < pillars.length; i++) {
          const startAt = (i - 1) / n;
          const entryWindow = 0.18;
          const p = (progress - startAt) / entryWindow;
          const clamped = Math.max(0, Math.min(1, p));
          const offset = (1 - clamped) * 100;

          const panel = panelRefs.current[i];
          if (panel) panel.style.transform = `translate3d(0, ${offset}%, 0)`;

          const img = imgRefs.current[i];
          if (img) {
            const isVisible = offset < 50;
            if (isMobile) {
              // Mobile: opacity-only, no transform — avoids expensive repaints
              img.style.opacity = isVisible ? '1' : '0';
            } else {
              const imgX = (i % 2 === 0 ? -1 : 1) * 120;
              img.style.transform = isVisible ? 'translate3d(0, 0, 0)' : `translate3d(${imgX}px, 0, 0)`;
              img.style.opacity = isVisible ? '1' : '0';
            }
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pillars.length, isMobile]);

  // Total scroll height: each panel gets ~80vh of "dwell" time to be read
  const totalHeight = pillars.length * 80; // vh units

  return (
    <section id="filosofie" className="w-full bg-background">

      {/*
               Outer div: tall enough to scroll through all panels.
               Inner sticky div: pins to viewport while user scrolls through outer div.
               Panels are absolutely positioned on top of each other; JS picks which is visible.
              */}
        <div
          ref={sectionRef}
          style={{ height: `${totalHeight}vh` }}>
          
          <div
            style={{
              position: 'sticky',
              top: NAV,
              height: `calc(100vh - ${NAV}px)`,
              overflow: 'hidden',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}>
            
            {/* Title — always visible behind panels */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              background: 'hsl(var(--background))',
              paddingTop: 'clamp(1.5rem, 3vw, 3rem)',
              paddingBottom: 'clamp(1rem, 2vw, 1.5rem)',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)'
            }}>
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">
                {labels.label}
              </span>
              <HomeTitle title={labels.title} accent={labels.accent} />
            </div>

            {/* Panels — all stacked at the same position, scroll-driven translateY */}
            {pillars.map((pillar, i) => {
              const imageLeft = i % 2 === 0;
              const initOffset = i === 0 ? 0 : 100;
              const initImgX = imageLeft ? -120 : 120;
              return (
                <div
                  key={pillar.num}
                  className="group"
                  ref={el => panelRefs.current[i] = el}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: isMobile ? '86%' : '78%',
                    zIndex: 10 + i,
                    background: glassBg,
                    backdropFilter: isMobile ? 'blur(16px)' : 'blur(40px)',
                    WebkitBackdropFilter: isMobile ? 'blur(16px)' : 'blur(40px)',
                    borderTop: glassBorder,
                    borderRadius: '24px 24px 0 0',
                    boxShadow: glassShadow,
                    overflow: 'hidden',
                    transform: `translate3d(0, ${initOffset}%, 0)`,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden'
                  }}>
                  
                  <div className="w-full h-full flex items-stretch px-4 md:px-12 lg:px-16 py-3 md:py-8 opacity-100">
                    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 lg:gap-12 items-stretch">

                      {/* Image — portrait, slides in from side, with gold frame and watermark */}
                      <div className={`relative col-span-1 md:col-span-5 flex items-center overflow-hidden ${imageLeft ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}>
                        {/* chapter numeral moved to the text column as a graphic anchor */}
                        {/* Image with refined frame — slides in from its side */}
                        <div
                          ref={el => imgRefs.current[i] = el}
                          className="relative overflow-hidden rounded-2xl w-full aspect-[16/10] md:aspect-[3/4] max-h-[130px] md:max-h-full"
                          style={{
                            boxShadow: isMobile ? 'none' : (isLight ? '0 16px 56px rgba(0,0,0,0.16)' : '0 16px 56px rgba(0,0,0,0.55)'),
                            border: isLight ? '1px solid rgba(107, 122, 63, 0.22)' : '1px solid rgba(231, 205, 112, 0.22)',
                            transform: isMobile ? 'translate3d(0, 0, 0)' : (i === 0 ? 'translate3d(0, 0, 0)' : `translate3d(${initImgX}px, 0, 0)`),
                            opacity: i === 0 ? 1 : 0,
                            transition: isMobile ? 'opacity 0.3s ease' : 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease'
                          }}>
                          
                          <img
                            src={siteImg('philosophy.' + i)}
                            alt={pillar.title}
                            className="w-full h-full object-cover"
                            style={{ filter: 'saturate(0.85) brightness(0.92)' }} loading="lazy" decoding="async" />
                          
                          {/* Gold accent corner — top-left */}
                          <div className="absolute top-3 left-3 w-10 h-10 border-t border-l border-primary/40 rounded-tl-lg" />
                          {/* Gold accent corner — bottom-right */}
                          <div className="absolute bottom-3 right-3 w-10 h-10 border-b border-r border-primary/40 rounded-br-lg" />
                          <HostHint variant="note" question={hostQuestion(lang, pillar.title)} className="absolute top-3 right-3 z-20" />
                        </div>
                      </div>

                      {/* Text — editorial layout with progress indicator */}
                      <div className={`relative col-span-1 md:col-span-7 flex flex-col justify-start md:justify-end pb-2 md:pb-10 ${imageLeft ? 'order-2 md:order-2' : 'order-2 md:order-1'}`}>

                        {/* Giant chapter numeral — graphic anchor, bleeds off the outer edge */}
                        <span aria-hidden className="absolute font-heading font-bold select-none leading-none pointer-events-none hidden md:block"
                          style={{ fontSize: 'clamp(8rem, 26vw, 20rem)', color: 'hsl(var(--primary) / 0.12)', top: '-2rem', right: imageLeft ? '-0.5rem' : 'auto', left: imageLeft ? 'auto' : '-0.5rem', zIndex: 0 }}>
                          {pillar.num}
                        </span>

                        {/* Top corner — brand mark fills empty upper corner */}
                        <div className={`absolute top-0 hidden md:block ${imageLeft ? 'right-0 text-right' : 'left-0'}`} style={{ zIndex: 5 }}>
                          <BogestLogo className="text-lg leading-none block" />
                          <span className="font-body text-[11px] tracking-[0.3em] uppercase block mt-1 text-foreground">
                            {labels.label}
                          </span>
                        </div>

                        <div className="relative z-10">
                        {/* Progress indicator */}
                        <div className="flex items-center gap-1.5 mb-3 md:mb-6">
                          {pillars.map((_, idx) =>
                          <div
                            key={idx}
                            className="h-px transition-all duration-500"
                            style={{
                              width: idx === i ? '36px' : '18px',
                              background: idx <= i ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                              opacity: idx <= i ? 1 : 0.5
                            }} />

                          )}
                          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary ml-3">
                            {pillar.num} / 0{pillars.length}
                          </span>
                        </div>

                        {/* Subtitle as overline */}
                        <div className="flex items-center gap-3 mb-2 md:mb-3">
                          <span className="h-px w-8 bg-primary/50" />
                          <span className="font-body text-xs tracking-[0.35em] uppercase text-primary">
                            {pillar.subtitle}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-heading text-3xl md:text-5xl lg:text-[4.5vw] font-bold leading-[0.98] mb-2 md:mb-4 text-foreground">
                          {pillar.title}<span className="text-primary">.</span>
                        </h3>

                        {/* Refined divider */}
                        <div className="flex items-center gap-2 mb-3 md:mb-6">
                          <div className="w-12 h-px bg-primary/50" />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        </div>

                        {/* Body */}
                        <p className="font-body text-sm md:text-base leading-snug md:leading-relaxed w-full pr-4 text-foreground">
                          {pillar.body}
                        </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>

    </section>);

}