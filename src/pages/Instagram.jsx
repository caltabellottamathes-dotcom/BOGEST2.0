import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram as InstagramIcon, ExternalLink, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PanelHero from '@/components/PanelHero';

const LOCATIONS = [
  { id: 'all', label: 'Alle vestigingen' },
  { id: 'hasselt', label: 'Hasselt' },
  { id: 'borgloon', label: 'Borgloon' },
  { id: 'heusden-zolder', label: 'Heusden-Zolder' },
];

const ACCOUNT_LINKS = [
  { name: '@bogesthasselt', url: 'https://www.instagram.com/bogesthasselt', location: 'Hasselt' },
  { name: '@bogestborgloon', url: 'https://www.instagram.com/bogestborgloon', location: 'Borgloon' },
  { name: '@bogest_heusdenzolder', url: 'https://www.instagram.com/bogest_heusdenzolder', location: 'Heusden-Zolder' },
];

export default function Instagram() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await base44.entities.InstagramPost.list('-posted_at', 60);
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = filter === 'all' ? posts : posts.filter(p => p.location_name === filter);

  return (
    <div className="w-full min-h-screen">
      <PanelHero
        label="Social Media"
        title="Instagram"
        subtitle="Een blik achter de schermen bij Bogèst — sfeerbeelden, gerechten en momenten vanuit al onze vestigingen."
      />

      {/* Filters */}
      <div className="px-6 md:px-16 lg:px-24 py-8">
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map(loc => (
            <button
              key={loc.id}
              onClick={() => setFilter(loc.id)}
              className={`px-5 py-2 rounded-full font-body text-xs tracking-widest uppercase transition-all duration-300 ${
                filter === loc.id
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-16 lg:px-24 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <InstagramIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-sm text-muted-foreground">Nog geen Instagram posts beschikbaar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post, i) => (
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
                {post.media_type === 'VIDEO' ? (
                  <video src={post.media_url} className="w-full h-full object-cover" muted />
                ) : (
                  <img
                    src={post.media_url}
                    alt={post.caption?.slice(0, 50) || 'Instagram post'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary">
                      {post.location_name}
                    </span>
                  </div>
                  <p className="font-body text-xs text-white/90 line-clamp-3">{post.caption}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>

      {/* Account links */}
      <div className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="border-t border-border pt-10">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-6">Volg onze vestigingen.</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ACCOUNT_LINKS.map(acc => (
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
                  <p className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {acc.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">Bogèst {acc.location}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}