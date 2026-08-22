import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LogOut, Clock, Briefcase, Bell, Image as ImageIcon, UtensilsCrossed } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MenuBeheer from '@/pages/MenuBeheer';
import OpeningHoursBeheer from '@/pages/OpeningHoursBeheer';
import VacaturesBeheer from '@/pages/VacaturesBeheer';
import AnnouncementBeheer from '@/pages/AnnouncementBeheer';
import Assets from '@/pages/Assets';
import BogestLogo from '@/components/BogestLogo';

// Het geünificeerde admin-dashboard. Route /admin (AdminGate-gated, buiten de
// site-Layout). Bevat alleen de zelfbeheerbare inhoud- en mediamodules:
// menukaart, openingsuren, vacatures, meldingen en de Beeldbank.
const SECTIONS = [
  { key: 'menu', label: 'Menukaart', icon: UtensilsCrossed, group: 'Inhoud' },
  { key: 'uren', label: 'Openingsuren', icon: Clock, group: 'Inhoud' },
  { key: 'vacatures', label: 'Vacatures', icon: Briefcase, group: 'Inhoud' },
  { key: 'meldingen', label: 'Meldingen', icon: Bell, group: 'Inhoud' },
  { key: 'beelden', label: 'Beeldbank', icon: ImageIcon, group: 'Media' },
];
const GROUPS = ['Inhoud', 'Media'];

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get('section') || 'menu';
  const setSection = (s) => setSearchParams({ section: s }, { replace: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => base44.auth.logout('/');

  const renderContent = () => {
    if (section === 'uren') return <OpeningHoursBeheer />;
    if (section === 'vacatures') return <VacaturesBeheer />;
    if (section === 'meldingen') return <AnnouncementBeheer />;
    if (section === 'beelden') return <Assets />;
    return <MenuBeheer />;
  };

  return (
    <div className="w-full min-h-screen bg-background flex">
      {/* Zijbalk — desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border/50 bg-card/30 h-screen sticky top-0">
        <SidebarContent section={section} setSection={setSection} onLogout={logout} />
      </aside>

      {/* Zijbalk — mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[120]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border/50 flex flex-col">
            <SidebarContent section={section} setSection={(s) => { setSection(s); setSidebarOpen(false); }} onLogout={logout} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/50 px-5 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary block leading-none mb-1">Beheer</span>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground truncate">{SECTIONS.find(s => s.key === section)?.label || 'Dashboard'}</h1>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground font-body text-xs tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors">
            <LogOut className="w-3 h-3" /> Uitloggen
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

function SidebarContent({ section, setSection, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border/40">
        <BogestLogo className="text-2xl tracking-wide" />
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mt-2">Admin Dashboard</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {GROUPS.map(group => (
          <div key={group}>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 px-2 mb-2">{group}</p>
            <div className="space-y-0.5">
              {SECTIONS.filter(s => s.group === group).map(s => {
                const active = section === s.key;
                return (
                  <button key={s.key} onClick={() => setSection(s.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all ${active ? 'bg-primary/15 text-primary border border-primary/30' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 border border-transparent'}`}>
                    <s.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border/40">
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Uitloggen
        </button>
      </div>
    </div>
  );
}