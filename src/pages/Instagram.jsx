import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram as InstagramIcon, Facebook as FacebookIcon, ExternalLink, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import SubPageNav from '@/components/SubPageNav';
import ReserveCtaSection from '@/components/ReserveCtaSection';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';

const COPY = {
  nl: {
    label: 'Social Media',
    title: 'Achter de schermen',
    subtitle: 'Sfeerbeelden, gerechten en momenten — live vanuit onze vestigingen op Instagram en Facebook.',
    followIg: 'Volg op Instagram',
    followFb: 'Volg op Facebook',
    igSection: 'Instagram',
    fbSection: 'Facebook',
    accounts: 'Volg onze vestigingen',
    all: 'Alles',
    loading: 'Laden…',
    noIg: 'Nog geen Instagram posts beschikbaar.',
    noFb: 'Nog geen Facebook berichten beschikbaar.',
    err: 'Sociale media niet beschikbaar',
  },
  fr: {
    label: 'Réseaux sociaux',
    title: 'Dans les coulisses',
    subtitle: "Ambiance, plats et moments — en direct de nos établissements sur Instagram et Facebook.",
    followIg: 'Suivre sur Instagram',
    followFb: 'Suivre sur Facebook',
    igSection: 'Instagram',
    fbSection: 'Facebook',
    accounts: 'Suivez nos établissements',
    all: 'Tout',
    loading: 'Chargement…',
    noIg: "Aucune publication Instagram pour l'instant.",
    noFb: "Aucune publication Facebook pour l'instant.",
    err: 'Réseaux sociaux indisponibles',
  },
  en: {
    label: 'Social Media',
    title: 'Behind the scenes',
    subtitle: 'Atmosphere, dishes and moments — live from our locations on Instagram and Facebook.',
    followIg: 'Follow on Instagram',
    followFb: 'Follow on Facebook',
    igSection: 'Instagram',
    fbSection: 'Facebook',
    accounts: 'Follow our locations',
    all: 'All',
    loading: 'Loading…',
    noIg: 'No Instagram posts yet.',
    noFb: 'No Facebook posts yet.',
    err: 'Social media unavailable',
  },
};

const LOC_TABS = [
  { id: 'all', city: 'Alles / Tout / All' },
  { id: 'hasselt', city: 'Hasselt' },
  { id: 'borgloon', city: 'Borgloon' },
  { id: 'heusden-zolder', city: 'Heusden-Zolder' },
];

const ACCOUNTS = [
  {
    location: 'hasselt',
    ig: { name: '@bogesthasselt', url: 'https://www.instagram.com/bogesthasselt' },
    fb: { name: 'Bogèst Hasselt', url: 'https://www.facebook.com/bogesthasselt' },
  },
  {
    location: 'borgloon',
    ig: { name: '@bogestborgloon', url: 'https://www.instagram.com/bogestborgloon' },
    fb: { name: 'Bogèst Borgloon', url: 'https://www.facebook.com/bogestborgloon' },
  },
  {
    location: 'heusden-zolder',
    ig: { name: '@bogest_heusdenzolder', url: 'https://www.instagram.com/bogest_heusdenzolder' },
    fb: { name: 'Bogèst Heusden-Zolder', url: 'https://www.facebook.com/bogestheusdenzolder' },
  },
];

const HERO_FALLBACK = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg';

export default function Instagram() {
  const { t, lang } = useLang();
  const c = COPY[lang] || COPY.nl;
  const [igPosts, setIgPosts] = useState([]);
  const [fbPages, setFbPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLoc, setActiveLoc] = useState('all');

  useEffect(() => {
    Promise.all([
      base44.functions.invoke('getInstagramPosts', {}).then((r) => r?.data?.posts || []).catch(() => []),
      base44.functions.invoke('getFacebookPosts', {}).then((r) => r?.data?.pages || []).catch(() => []),
    ])
      .then(([ig, fb]) => { setIgPosts(ig); setFbPages(fb); })
      .catch((e) => setError(e?.message || c.err))
      .finally(() => setLoading(false));
  }, [c.err]);

  const igFiltered = activeLoc === 'all' ? igPosts : igPosts.filter((p) => p.location === activeLoc);
  const fbFiltered = activeLoc === 'all' ? fbPages : fbPages.filter((p) => p.location === activeLoc);
  const fbPosts = fbFiltered.flatMap((p) => (p.posts || []).map((post) => ({ ...post, location: p.location, page_url: p.page_url })));

  return (
    <div className="w-full">
      <PanelHero
        label={c.label}
        title={c.title}
        titleAccent="Bogèst"
        subtitle={c.subtitle}
        positionKey="instagram.hero"
        bgImage={HERO_FALLBACK}
      />

      <PanelContent>
        <SubPageNav nextTo="/about" nextLabel={t('nav_about')} />

        {/* Location filter */}
        <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            {LOC_TABS.map((tab) => {
              const label = tab.id === 'all' ? c.all : tab.city;
              const active = activeLoc === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLoc(tab.id)}
                  className={`px-4 py-2 rounded-full font-body text-xs tracking-[0.15em] uppercase border transition-all duration-300 ${
                    active
                      ? 'bg-primary/15 border-primary/60 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Instagram feed */}
        <section id="instagram-feed" className="w-full px-6 md:px-10 lg:px-16 pt-8 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <InstagramIcon className="w-4 h-4 text-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{c.igSection}</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : igFiltered.length === 0 ? (
            <div className="text-center py-16">
              <InstagramIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground">{c.noIg}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {igFiltered.map((post, i) => (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: (i % 8) * 0.06 }}
                  className="group relative overflow-hidden rounded-xl aspect-square"
                >
                  <img
                    src={post.media_url}
                    alt={post.caption?.slice(0, 50) || 'Instagram post'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {post.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="font-body text-xs text-white/90 line-clamp-3">{post.caption}</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="w-3 h-3 text-white" />
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </section>

        {/* Facebook feed */}
        <section id="facebook-feed" className="w-full px-6 md:px-10 lg:px-16 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <FacebookIcon className="w-4 h-4 text-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{c.fbSection}</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error && fbPosts.length === 0 ? (
            <div className="text-center py-16">
              <FacebookIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground">{c.noFb}</p>
            </div>
          ) : fbPosts.length === 0 ? (
            <div className="text-center py-16">
              <FacebookIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground">{c.noFb}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {fbPosts.slice(0, 9).map((post, i) => (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
                  className="group rounded-2xl border border-border bg-white/[0.04] backdrop-blur-md overflow-hidden hover:border-primary/40 transition-colors duration-300 flex flex-col"
                >
                  {post.image && (
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img src={post.image} alt={post.message?.slice(0, 50) || 'Facebook post'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">{post.message || ''}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                      <FacebookIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Bogèst {post.location}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </section>

        {/* Account links — 3 locations, IG + FB each */}
        <section id="social-accounts" className="w-full px-6 md:px-10 lg:px-16 pb-20">
          <div className="border-t border-border pt-10">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-6">{c.accounts}<span className="text-primary">.</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ACCOUNTS.map((acc) => (
                <SectionReveal key={acc.location} className="h-full">
                  <div className="rounded-2xl border border-border bg-white/[0.04] backdrop-blur-md p-5 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-px w-8 bg-primary/50" />
                      <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{acc.location}</span>
                    </div>
                    <h4 className="font-heading text-base font-semibold text-foreground mb-4">Bogèst {acc.location}</h4>
                    <div className="space-y-2.5 mt-auto">
                      <a href={acc.ig.url} target="_blank" rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors duration-300">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <InstagramIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-body text-xs text-foreground group-hover:text-primary transition-colors flex-1">{acc.ig.name}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                      <a href={acc.fb.url} target="_blank" rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors duration-300">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <FacebookIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-body text-xs text-foreground group-hover:text-primary transition-colors flex-1">{acc.fb.name}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        <ReserveCtaSection positionKey="instagram.reserve" />
      </PanelContent>
    </div>
  );
}