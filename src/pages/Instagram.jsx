import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram as InstagramIcon, ExternalLink, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import AboutSubNav from '@/components/about/AboutSubNav';
import ReserveCtaSection from '@/components/ReserveCtaSection';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';

const ACCOUNT_LINKS = [
  { name: '@bogesthasselt', url: 'https://www.instagram.com/bogesthasselt', location: 'Hasselt' },
  { name: '@bogestborgloon', url: 'https://www.instagram.com/bogestborgloon', location: 'Borgloon' },
  { name: '@bogest_heusdenzolder', url: 'https://www.instagram.com/bogest_heusdenzolder', location: 'Heusden-Zolder' },
];

const HERO_FALLBACK = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg';

export default function Instagram() {
  const { t } = useLang();
  const [data, setData] = useState({ username: '', posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.functions.invoke('getInstagramPosts', {})
      .then((res) => setData({ username: res.data?.username || '', posts: res.data?.posts || [] }))
      .catch((e) => setError(e?.message || 'Instagram niet beschikbaar'))
      .finally(() => setLoading(false));
  }, []);

  const accountUrl = data.username ? `https://www.instagram.com/${data.username}` : 'https://www.instagram.com/bogesthasselt';

  return (
    <div className="w-full">
      <PanelHero
        label="Social Media"
        title="Achter de schermen"
        titleAccent="Bogèst"
        subtitle="Een blik achter de schermen — sfeerbeelden, gerechten en momenten, live vanuit onze account."
        bgImage={HERO_FALLBACK}
      />

      <PanelContent>
        <AboutSubNav nextTo="/about" nextLabel={t('nav_about')} />

        {/* Account header + live feed */}
        <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-16">
          <SectionReveal className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-2xl border border-border/50 bg-white/[0.04] backdrop-blur-md p-5 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <InstagramIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading text-xl font-bold text-foreground">@{data.username || 'bogesthasselt'}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{loading ? 'Laden…' : `${data.posts.length} recente posts`}</p>
                </div>
              </div>
              <a href={accountUrl} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors w-fit">
                <InstagramIcon className="w-4 h-4" />
                Volg op Instagram
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </SectionReveal>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <InstagramIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground">{error}</p>
            </div>
          ) : data.posts.length === 0 ? (
            <div className="text-center py-20">
              <InstagramIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground">Nog geen Instagram posts beschikbaar.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-primary" />
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">Recente posts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {data.posts.map((post, i) => (
                  <motion.a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                    className="group relative overflow-hidden rounded-xl aspect-square"
                  >
                    <img
                      src={post.media_url}
                      alt={post.caption?.slice(0, 50) || 'Instagram post'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="font-body text-xs text-white/90 line-clamp-3">{post.caption}</p>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Account links */}
        <section className="w-full px-6 md:px-10 lg:px-16 pb-20">
          <div className="border-t border-border pt-10">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-6">Volg onze vestigingen.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ACCOUNT_LINKS.map((acc) => (
                <a
                  key={acc.url}
                  href={acc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/40 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <InstagramIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{acc.name}</p>
                    <p className="font-body text-xs text-muted-foreground">Bogèst {acc.location}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Reserve — zelfde systeem als de andere About-subpagina's */}
        <ReserveCtaSection positionKey="instagram.reserve" />
      </PanelContent>
    </div>
  );
}