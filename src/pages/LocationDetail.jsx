import React from 'react';
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react';
import RestaurantPanel from '@/components/RestaurantPanel';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { getLocations } from '@/lib/data';

export default function LocationDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const locations = getLocations(lang);
  const loc = locations.find(l => l.slug === slug);
  const [showRestaurantPanel, setShowRestaurantPanel] = useState(false);

  // Get restaurant spaces for this location
  const getRestaurantData = () => {
    const spacesData = {
      nl: {
        hasselt: {
          title: 'Restaurant en Ruimtes',
          location: 'Bogèst Hasselt',
          spaces: [
            { name: 'De Bar', capacity: 40, desc: 'Karakteristiek met de stierenkop en open haard.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
            { name: 'Open Keuken / Tomahawk', capacity: 14, desc: 'De open keuken — ideaal voor een exclusieve vleesbeleving.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
            { name: 'De Living', capacity: 45, desc: 'Vernieuwd met authentieke elementen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
            { name: 'Het Terras', capacity: 50, desc: 'Buitenterras met duurzame materialen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
          ]
        },
        borgloon: {
          title: 'Restaurant en Ruimtes',
          location: 'Bogèst Borgloon',
          spaces: [
            { name: 'De Bar', capacity: 40, desc: 'Ideaal voor aperitieven met vrienden.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
            { name: 'De Living', capacity: 44, desc: 'Centraal in het restaurant, erg gezellig voor een grotere groep.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
            { name: 'De Toog', capacity: 25, desc: 'Kleinere gezellige ruimte aansluitend aan de keuken.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
            { name: 'De Koelcel', capacity: 42, desc: 'Unieke ruimte met doorkijkraam op het vlees.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
            { name: 'Het Terras', capacity: 60, desc: 'Zomers terras met beweegbaar dak.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
          ]
        },
        'heusden-zolder': {
          title: 'Restaurant en Ruimtes',
          location: 'Bogèst Heusden-Zolder',
          spaces: [
            { name: 'Restaurant', capacity: 80, desc: 'Warm ingericht restaurant met authentieke sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
            { name: 'Het Terras', capacity: 40, desc: 'Ruim terras met aangename sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
          ]
        }
      },
      fr: {
        hasselt: {
          title: 'Restaurant et Espaces',
          location: 'Bogèst Hasselt',
          spaces: [
            { name: 'Le Bar', capacity: 40, desc: 'Caractéristique avec la tête de taureau et la cheminée ouverte.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
            { name: 'Cuisine Ouverte / Tomahawk', capacity: 14, desc: 'La cuisine ouverte — idéale pour une expérience viande exclusive.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
            { name: 'Le Living', capacity: 45, desc: 'Rénové avec des éléments authentiques.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
            { name: 'La Terrasse', capacity: 50, desc: 'Terrasse extérieure avec matériaux durables.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
          ]
        },
        borgloon: {
          title: 'Restaurant et Espaces',
          location: 'Bogèst Borgloon',
          spaces: [
            { name: 'Le Bar', capacity: 40, desc: 'Idéal pour les apéritifs entre amis.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
            { name: 'Le Living', capacity: 44, desc: 'Au cœur du restaurant, très convivial pour un grand groupe.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
            { name: 'Le Comptoir', capacity: 25, desc: 'Petit espace convivial attenant à la cuisine.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
            { name: 'La Cave Réfrigérée', capacity: 42, desc: 'Espace unique avec vue sur la viande.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
            { name: 'La Terrasse', capacity: 60, desc: 'Terrasse estivale avec toit mobile.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
          ]
        },
        'heusden-zolder': {
          title: 'Restaurant et Espaces',
          location: 'Bogèst Heusden-Zolder',
          spaces: [
            { name: 'Restaurant', capacity: 80, desc: 'Restaurant chaleureusement décoré avec une ambiance authentique.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
            { name: 'La Terrasse', capacity: 40, desc: 'Grande terrasse avec une ambiance agréable.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
          ]
        }
      },
      en: {
        hasselt: {
          title: 'Restaurant and Spaces',
          location: 'Bogèst Hasselt',
          spaces: [
            { name: 'The Bar', capacity: 40, desc: 'Characterful with the bull\'s head and open fireplace.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
            { name: 'Open Kitchen / Tomahawk', capacity: 14, desc: 'The open kitchen — ideal for an exclusive meat experience.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
            { name: 'The Living Room', capacity: 45, desc: 'Renovated with authentic elements.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
            { name: 'The Terrace', capacity: 50, desc: 'Outdoor terrace with sustainable materials.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
          ]
        },
        borgloon: {
          title: 'Restaurant and Spaces',
          location: 'Bogèst Borgloon',
          spaces: [
            { name: 'The Bar', capacity: 40, desc: 'Ideal for aperitifs with friends.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
            { name: 'The Living Room', capacity: 44, desc: 'Central in the restaurant, very cosy for a larger group.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
            { name: 'The Counter', capacity: 25, desc: 'Smaller cosy space adjoining the kitchen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
            { name: 'The Cold Room', capacity: 42, desc: 'Unique space with a view through to the meat.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
            { name: 'The Terrace', capacity: 60, desc: 'Summer terrace with a movable roof.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
          ]
        },
        'heusden-zolder': {
          title: 'Restaurant and Spaces',
          location: 'Bogèst Heusden-Zolder',
          spaces: [
            { name: 'Restaurant', capacity: 80, desc: 'Warmly decorated restaurant with authentic atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
            { name: 'The Terrace', capacity: 40, desc: 'Spacious terrace with a pleasant atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
          ]
        }
      }
    };
    return spacesData[lang]?.[slug] || spacesData.nl[slug];
  };

  if (!loc) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">{t('loc_not_found')}</h1>
          <Link to="/locations" className="font-body text-sm text-primary hover:underline">{t('loc_back')}</Link>
        </div>
      </div>
    );
  }

  const currentIndex = locations.findIndex(l => l.slug === slug);
  const next = locations[(currentIndex + 1) % locations.length];

  return (
    <div className="w-full">
      <section className="relative w-full pt-32 md:pt-40 pb-16 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
         <div className="w-full px-6 md:px-10 lg:px-16">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">{t('nav_locations')}</span>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">{loc.name}</h1>
          <p className="font-body text-base text-muted-foreground mt-2">{loc.city}, {loc.region}</p>
          </div>
          </section>

      <section className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionReveal>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">{t('loc_about')} {loc.city}</h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {t('loc_about_desc').replace('{city}', loc.city)}
              </p>
            </SectionReveal>

            {loc.parking && (
              <SectionReveal id="parking" delay={0.1} className="mt-8">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{t('loc_parking')}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{loc.parking}</p>
              </SectionReveal>
            )}

            <SectionReveal id="openingsuren" delay={0.15} className="mt-8">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">{t('loc_hours')}</h3>
              <div className="space-y-2">
                {loc.hours.map(h => (
                  <div key={h.day} className="flex justify-between font-body text-sm py-2 border-b border-border/50">
                    <span className="text-foreground">{h.day}</span>
                    <span className={h.time === 'Gesloten' || h.time === 'Fermé' || h.time === 'Closed' || h.time.includes('beschikbaar') ? 'text-muted-foreground' : 'text-primary font-medium'}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
              {loc.zenchefId && (
                <Link to={`/reserve?loc=${loc.slug}`}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
                  {t('btn_reserve')} <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}
              {loc.mapsUrl && (
                <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 border border-border text-foreground font-body text-xs tracking-widest uppercase rounded-full hover:border-primary hover:text-primary transition-all duration-500">
                  Google Maps <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </SectionReveal>
          </div>

          <SectionReveal id="contact" direction="right" delay={0.1} className="h-fit">
            <div className="bg-card border border-border rounded-xl p-7 space-y-5">
              <h3 className="font-heading text-lg font-semibold text-foreground">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-body text-sm text-muted-foreground">{loc.address}</span>
                </div>
                {loc.phone && (
                  <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 group">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-primary transition-colors">{loc.phone}</span>
                  </a>
                )}
                {loc.email && (
                  <a href={`mailto:${loc.email}`} className="flex items-center gap-3 group">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-body text-sm text-muted-foreground group-hover:text-primary transition-colors break-all">{loc.email}</span>
                  </a>
                )}
              </div>
            </div>
          </SectionReveal>
        </div>

        <div id="spaces" className="mt-20 pt-12 border-t border-border">
           <button onClick={() => setShowRestaurantPanel(true)} className="group w-full flex items-center justify-between hover:opacity-70 transition-opacity">
             <div className="text-left">
               <span className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{t('loc_spaces')}</span>
               <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mt-1">
                 Restaurant en ruimtes
               </h3>
             </div>
             <ArrowUpRight className="w-6 h-6 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
           </button>
        </div>
      </section>

      {/* Restaurant Panel Overlay */}
      {loc && (
        <RestaurantPanel
          isOpen={showRestaurantPanel}
          onClose={() => setShowRestaurantPanel(false)}
          {...getRestaurantData()}
        />
      )}
      </div>
      );
      }