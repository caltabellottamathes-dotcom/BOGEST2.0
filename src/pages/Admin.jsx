import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogOut, Clock, Briefcase, Bell, Image as ImageIcon, UtensilsCrossed, Users, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MenuBeheer from '@/pages/MenuBeheer';
import OpeningHoursBeheer from '@/pages/OpeningHoursBeheer';
import VacaturesBeheer from '@/pages/VacaturesBeheer';
import AnnouncementBeheer from '@/pages/AnnouncementBeheer';
import Assets from '@/pages/Assets';
import BogestLogo from '@/components/BogestLogo';
import AdminUsers from '@/components/admin/AdminUsers';

// Geünificeerd admin-dashboard: minimalistisch en rustig — een gewone zijbalk,
// een gewone pagina, geen glas-effecten of aan-pop animaties (die veroorzaakten
// de flikkerglitches). Alles werkt: menukaart, openingsuren, vacatures,
// meldingen, beeldbank en gebruikers.
const SECTIONS = [
  { key: 'menu', label: 'Menukaart', icon: UtensilsCrossed },
  { key: 'uren', label: 'Openingsuren', icon: Clock },
  { key: 'vacatures', label: 'Vacatures', icon: Briefcase },
  { key: 'meldingen', label: 'Meldingen', icon: Bell },
  { key: 'beelden', label: 'Beeldbank', icon: ImageIcon },
  { key: 'gebruikers', label: 'Gebruikers', icon: Users },
];

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const section = searchParams.get('section') || 'menu';
  const setSection = (s) => setSearchParams({ section: s }, { replace: true });

  const logout = () => base44.auth.logout('/');

  // Beeldbank-modus op de live website: zet de admin-vlag zodat de
  // BeeldbankEditor verschijnt — daar kan de hele site doorklikt worden en
  // kan elke foto aangeklikt en vervangen worden. "Afsluiten" op de site
  // zet de modus terug uit.
  const startBeeldbankMode = () => {
    try {
      sessionStorage.setItem('bogest-admin-auth', '1');
      localStorage.setItem('bogest-admin-auth', '1');
    } catch {}
    navigate('/');
  };

  const renderContent = () => {
    if (section === 'uren') return <OpeningHoursBeheer />;
    if (section === 'vacatures') return <VacaturesBeheer />;
    if (section === 'meldingen') return <AnnouncementBeheer />;
    if (section === 'beelden') return <Assets />;
    if (section === 'gebruikers') return <AdminUsers />;
    return <MenuBeheer />;
  };

  const activeLabel = SECTIONS.find((s) => s.key === section)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Zijbalk — desktop. Gewone, rustige lijst zonder effecten. */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-card/40">
        <div className="px-5 py-5 border-b border-border">
          <BogestLogo className="text-xl tracking-wide" />
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mt-1.5">Beheer</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SECTIONS.map((s) => {
            const active = section === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border space-y-1">
          <button onClick={startBeeldbankMode} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-primary hover:bg-primary/10 transition-colors" title="Blader door de website en wissel elke foto">
            <Globe className="w-4 h-4" /> Beeldbank-modus
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </div>
      </aside>

      {/* Inhoud */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="border-b border-border bg-background px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <BogestLogo className="lg:hidden text-lg shrink-0" />
              <h1 className="font-heading text-lg font-bold truncate">{activeLabel}</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobiel: dezelfde acties als in de zijbalk */}
              <button onClick={startBeeldbankMode} className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-xs hover:bg-primary/10 transition-colors">
                <Globe className="w-3.5 h-3.5" /> Beeldbank-modus
              </button>
              <button onClick={logout} className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-xs hover:text-destructive transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Uitloggen
              </button>
            </div>
          </div>
          {/* Secties — op mobiel een simpele chip-rij */}
          <div className="lg:hidden flex gap-1.5 overflow-x-auto -mx-1 px-1 mt-3 bogest-scroll">
            {SECTIONS.map((s) => {
              const active = section === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full font-body text-xs transition-colors ${
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground border border-border'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">
          {renderContent()}
        </main>

        <footer className="px-4 lg:px-8 py-4 border-t border-border">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Bogèst</span>
        </footer>
      </div>
    </div>
  );
}