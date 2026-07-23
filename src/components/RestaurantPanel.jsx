import React from 'react';
import { Users } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import SectionReveal from '@/components/ui/SectionReveal';
import OverlayPanelShell from '@/components/OverlayPanelShell';

export default function RestaurantPanel({ isOpen, onClose, location, spaces, title }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const header = (
    <div className="flex-1 min-w-0">
      <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-1 block">{location}</span>
      <p className="font-heading text-base md:text-lg font-semibold text-foreground leading-tight">{title}</p>
    </div>
  );

  return (
    <OverlayPanelShell isOpen={isOpen} onClose={onClose} header={header}>
      <div className="p-6 sm:p-8 space-y-6">
        {/* Spaces grid */}
        <div className="grid grid-cols-1 gap-4">
          {spaces.map((space, i) => (
            <SectionReveal key={space.name} delay={i * 0.05}>
              <div
                className="group rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden"
                style={{
                  background: isLight ? 'hsl(0 0% 50% / 0.08)' : 'rgba(128,128,128,0.05)',
                  border: isLight ? '1px solid hsl(0 0% 40% / 0.15)' : '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isLight ? 'hsl(var(--primary) / 0.40)' : 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.background = isLight ? 'hsl(0 0% 50% / 0.12)' : 'rgba(128,128,128,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isLight ? '1px solid hsl(0 0% 40% / 0.15)' : '1px solid rgba(255,255,255,0.07)';
                  e.currentTarget.style.background = isLight ? 'hsl(0 0% 50% / 0.08)' : 'rgba(128,128,128,0.05)';
                }}
              >
                {space.image && (
                  <div className="overflow-hidden h-40">
                    <img src={space.image} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: 'saturate(0.85) brightness(0.95)' }} />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{space.name}</h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{space.desc}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-primary whitespace-nowrap flex-shrink-0 mt-1">
                      <Users className="w-3.5 h-3.5" /> {space.capacity}p
                    </span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <div className="pt-4 border-t" style={{ borderColor: isLight ? 'hsl(0 0% 40% / 0.10)' : 'rgba(255,255,255,0.07)' }}>
          <p className="font-body text-xs text-muted-foreground">
            Voor meer informatie, bezoek <span className="text-primary font-medium">/groups</span>
          </p>
        </div>
      </div>
    </OverlayPanelShell>
  );
}