import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function MeatSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full py-24 md:py-32">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4 block">
              Kwaliteitsvlees
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-8">
              Belgisch Wit Blauw — ons trots.
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              In Bogèst serveren we een uitgebreid assortiment aan kwaliteitsvlees, met als trots ons botermalse Belgische Wit Blauw runds. Elk stuk wordt zorgvuldig geselecteerd op kwaliteit, structuur en smaak.
            </p>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
              Naast ons rundvlees zijn ook onze spare ribben met koolsla, stoofvlees, vol-au-vent en giga rundsbrochette echte trekkers.
            </p>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-primary text-primary font-body text-sm tracking-widest uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              Ontdek de kaart
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              <img
                src="https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798035-Y0LQXMVFSBJWWVXQG7ZI/filet+pur+.jpeg"
                alt="Premium beef at Bogèst"
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.82) brightness(0.95)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}