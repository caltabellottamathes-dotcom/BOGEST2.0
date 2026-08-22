import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarDays, ShoppingBag, Gift, BarChart3, MapPin, Users, LayoutGrid, Search, Filter, LogOut, ArrowLeft, Package, Mail, Bell, RefreshCw, Settings, Clock, Briefcase, Image as ImageIcon, UtensilsCrossed,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { LOCATIONS_DATA } from '@/lib/data';
import TableManagement from '@/components/admin/TableManagement';
import GiftCardManager from '@/components/admin/GiftCardManager';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminGiftPackages from '@/components/admin/AdminGiftPackages';
import AdminContactRequests from '@/components/admin/AdminContactRequests';
import AdminNotificationsPopup from '@/components/admin/AdminNotificationsPopup';
import MenuBeheer from '@/pages/MenuBeheer';
import OpeningHoursBeheer from '@/pages/OpeningHoursBeheer';
import VacaturesBeheer from '@/pages/VacaturesBeheer';
import AnnouncementBeheer from '@/pages/AnnouncementBeheer';
import Assets from '@/pages/Assets';
import BogestLogo from '@/components/BogestLogo';

// Het geünificeerde admin-dashboard. Route /admin (AdminGate-gated, buiten de
// site-Layout). Alle beheerbare modules — operationeel (reserveringen, orders,
// cadeaubonnen, contact, tafels) én inhoud (menukaart, openingsuren, vacatures,
// meldingen) én media (Beeldbank) — zitten in één oppervlak met een zijbalk.
function StatCard({ icon: Icon, label, value, sub, highlight, badge }) {
  return (
    <div className={`backdrop-blur-lg rounded-2xl p-5 border transition-all ${
      highlight ? 'bg-primary/20 border-primary/40 shadow-xl shadow-primary/10' : 'bg-card/40 border-primary/10'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-primary/40' : 'bg-primary/10'}`}>
          <Icon className="w-4 h-4 text-primary" />
        </div>
        {badge > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground font-body text-[10px] font-bold">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <div className="font-heading text-2xl font-bold text-foreground mb-0.5">{value}</div>
      <div className="font-body text-xs text-muted-foreground">{label}</div>
      {sub && <div className="font-body text-[10px] text-primary mt-1">{sub}</div>}
    </div>
  );
}

const SECTIONS = [
  { key: 'overzicht', label: 'Overzicht', icon: LayoutGrid, group: 'Operationeel' },
  { key: 'reserveringen', label: 'Reserveringen', icon: CalendarDays, group: 'Operationeel' },
  { key: 'takeaway', label: 'Takeaway', icon: ShoppingBag, group: 'Operationeel' },
  { key: 'pakketten', label: 'Cadeaupakketten', icon: Package, group: 'Operationeel' },
  { key: 'bonnen', label: 'Cadeaubonnen', icon: Gift, group: 'Operationeel' },
  { key: 'contact', label: 'Contact', icon: Mail, group: 'Operationeel' },
  { key: 'tafels', label: 'Tafelbeheer', icon: Users, group: 'Operationeel' },
  { key: 'menu', label: 'Menukaart', icon: UtensilsCrossed, group: 'Inhoud' },
  { key: 'uren', label: 'Openingsuren', icon: Clock, group: 'Inhoud' },
  { key: 'vacatures', label: 'Vacatures', icon: Briefcase, group: 'Inhoud' },
  { key: 'meldingen', label: 'Meldingen', icon: Bell, group: 'Inhoud' },
  { key: 'beelden', label: 'Beeldbank', icon: ImageIcon, group: 'Media' },
];

const GROUPS = ['Operationeel', 'Inhoud', 'Media'];

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overzicht';
  const setSection = (s) => setSearchParams(s === 'overzicht' ? {} : { section: s }, { replace: true });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [giftPackages, setGiftPackages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    const [res, ord, pkg, con, gc] = await Promise.all([
      base44.entities.Reservation.list('-created_date', 500),
      base44.entities.Order.list('-created_date', 500),
      base44.entities.GiftPackageOrder.list('-created_date', 500),
      base44.entities.ContactRequest.list('-created_date', 500),
      base44.entities.GiftCard.list('-created_date', 500),
    ]);
    setReservations(res);
    setOrders(ord);
    setGiftPackages(pkg);
    setContacts(con);
    setGiftCards(gc);
    setDataLoaded(true);
  };

  useEffect(() => { loadData(); }, []);

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!dataLoaded) return;
    const notifs = [];
    reservations.filter(r => !r.seen).forEach(r => notifs.push({
      id: `res-${r.id}`, type: 'reservation', name: r.name,
      detail: `${r.date} om ${r.time} · ${r.guests} gasten · ${r.location}`,
      time: r.created_date ? new Date(r.created_date).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) : ''
    }));
    orders.filter(o => !o.seen).forEach(o => notifs.push({
      id: `ord-${o.id}`, type: 'order', name: o.customer_name,
      detail: `€${(o.total || 0).toFixed(2)} · ${o.location} · ${o.pickup_date}`,
      time: o.created_date ? new Date(o.created_date).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) : ''
    }));
    giftPackages.filter(p => !p.seen).forEach(p => notifs.push({
      id: `pkg-${p.id}`, type: 'giftpackage', name: p.customer_name,
      detail: `€${(p.total || 0).toFixed(2)} · ${p.location}`,
      time: p.created_date ? new Date(p.created_date).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) : ''
    }));
    contacts.filter(c => !c.seen).forEach(c => notifs.push({
      id: `con-${c.id}`, type: 'contact', name: c.name,
      detail: c.message?.substring(0, 60) + (c.message?.length > 60 ? '...' : ''),
      time: c.created_date ? new Date(c.created_date).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }) : ''
    }));
    setNotifications(notifs);
    if (notifs.length > 0 && !notifDismissed) setShowNotifications(true);
  }, [dataLoaded, reservations, orders, giftPackages, contacts, notifDismissed]);

  useEffect(() => {
    const unsubs = [
      base44.entities.Reservation.subscribe(e => {
        if (e.type === 'create') setReservations(p => [e.data, ...p]);
        else if (e.type === 'update') setReservations(p => p.map(r => r.id === e.id ? e.data : r));
        else if (e.type === 'delete') setReservations(p => p.filter(r => r.id !== e.id));
      }),
      base44.entities.Order.subscribe(e => {
        if (e.type === 'create') setOrders(p => [e.data, ...p]);
        else if (e.type === 'update') setOrders(p => p.map(o => o.id === e.id ? e.data : o));
        else if (e.type === 'delete') setOrders(p => p.filter(o => o.id !== e.id));
      }),
      base44.entities.GiftPackageOrder.subscribe(e => {
        if (e.type === 'create') setGiftPackages(p => [e.data, ...p]);
        else if (e.type === 'update') setGiftPackages(p => p.map(o => o.id === e.id ? e.data : o));
        else if (e.type === 'delete') setGiftPackages(p => p.filter(o => o.id !== e.id));
      }),
      base44.entities.ContactRequest.subscribe(e => {
        if (e.type === 'create') setContacts(p => [e.data, ...p]);
        else if (e.type === 'update') setContacts(p => p.map(c => c.id === e.id ? e.data : c));
        else if (e.type === 'delete') setContacts(p => p.filter(c => c.id !== e.id));
      }),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  const markAllSeen = async () => {
    await Promise.all([
      ...reservations.filter(r => !r.seen).map(r => base44.entities.Reservation.update(r.id, { seen: true })),
      ...orders.filter(o => !o.seen).map(o => base44.entities.Order.update(o.id, { seen: true })),
      ...giftPackages.filter(p => !p.seen).map(p => base44.entities.GiftPackageOrder.update(p.id, { seen: true })),
      ...contacts.filter(c => !c.seen).map(c => base44.entities.ContactRequest.update(c.id, { seen: true, status: 'read' })),
    ]);
    setNotifDismissed(true);
    setShowNotifications(false);
  };

  const unseenRes = reservations.filter(r => !r.seen).length;
  const unseenOrd = orders.filter(o => !o.seen).length;
  const unseenPkg = giftPackages.filter(p => !p.seen).length;
  const unseenCon = contacts.filter(c => !c.seen).length;
  const totalUnseen = unseenRes + unseenOrd + unseenPkg + unseenCon;

  const getLocStats = (slug) => ({
    todayRes: reservations.filter(r => r.location === slug && r.date === today && r.status !== 'cancelled').length,
    todayOrd: orders.filter(o => o.location === slug && o.pickup_date === today && o.status !== 'cancelled').length,
    pendingRes: reservations.filter(r => r.location === slug && r.status === 'pending').length,
    unseenCount: reservations.filter(r => r.location === slug && !r.seen).length + orders.filter(o => o.location === slug && !o.seen).length,
  });

  // Badge per operationele sectie
  const sectionBadge = (key) => {
    if (key === 'reserveringen') return unseenRes;
    if (key === 'takeaway') return unseenOrd;
    if (key === 'pakketten') return unseenPkg;
    if (key === 'contact') return unseenCon;
    return 0;
  };

  const logout = () => base44.auth.logout('/');

  const isOverzicht = section === 'overzicht';
  // Voor de operationele detailsecties (reserveringen/takeaway/…) werken we
  // altijd binnen één vestiging: op het overzicht kies je er een, daarna blijven
  // we daarbinnen tot je teruggaat.
  const operationalDetail = ['reserveringen', 'takeaway', 'pakketten', 'bonnen', 'contact', 'tafels'].includes(section);

  const renderContent = () => {
    if (section === 'menu') return <MenuBeheer />;
    if (section === 'uren') return <OpeningHoursBeheer />;
    if (section === 'vacatures') return <VacaturesBeheer />;
    if (section === 'meldingen') return <AnnouncementBeheer />;
    if (section === 'beelden') return <Assets />;
    return null; // operationeel wordt hieronder afgehandeld
  };

  return (
    <div className="w-full min-h-screen bg-background flex">
      {showNotifications && (
        <AdminNotificationsPopup
          notifications={notifications}
          onClose={() => { setNotifDismissed(true); setShowNotifications(false); }}
          onMarkAllSeen={markAllSeen}
        />
      )}

      {/* Zijbalk — desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border/50 bg-card/30 h-screen sticky top-0">
        <SidebarContent
          section={section} setSection={(s) => { setSection(s); setSelectedLocation(null); }}
          sectionBadge={sectionBadge} totalUnseen={totalUnseen}
          onLogout={logout}
        />
      </aside>

      {/* Zijbalk — mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[120]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border/50 flex flex-col">
            <SidebarContent
              section={section} setSection={(s) => { setSection(s); setSelectedLocation(null); setSidebarOpen(false); }}
              sectionBadge={sectionBadge} totalUnseen={totalUnseen}
              onLogout={logout}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/50 px-5 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </button>
            {(operationalDetail && selectedLocation) ? (
              <button onClick={() => { setSelectedLocation(null); }} className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <div className="min-w-0">
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary block leading-none mb-1">Beheer</span>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground truncate">
                {operationalDetail && selectedLocation ? selectedLocation.name : (SECTIONS.find(s => s.key === section)?.label || 'Dashboard')}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setShowNotifications(true)} className="relative w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-3.5 h-3.5" />
              {totalUnseen > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">{totalUnseen > 9 ? '9+' : totalUnseen}</span>
              )}
            </button>
            <button onClick={loadData} className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={logout} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground font-body text-xs tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors">
              <LogOut className="w-3 h-3" /> Uitloggen
            </button>
          </div>
        </header>

        {/* Zoek/filter — alleen binnen een geselecteerde vestiging */}
        {operationalDetail && selectedLocation && (
          <div className="px-5 lg:px-8 py-3 flex gap-3 flex-wrap border-b border-border/40">
            <div className="relative flex-1 min-w-56">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Zoeken op naam, email, telefoon..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-card/40 border-primary/10" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="pl-9 pr-3 py-2 bg-card/40 border border-primary/10 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {(searchQuery || filterDate) && (
              <button onClick={() => { setSearchQuery(''); setFilterDate(''); }} className="px-3 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-destructive/20 transition-colors">Wissen</button>
            )}
          </div>
        )}

        {/* Inhoud */}
        <main className="flex-1 overflow-y-auto">
          {(['menu', 'uren', 'vacatures', 'meldingen', 'beelden'].includes(section)) && (
            <div className="p-0">{renderContent()}</div>
          )}

          {/* OPERATIONEEL */}
          {section === 'overzicht' && !selectedLocation && (
            <section className="px-5 lg:px-8 py-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={CalendarDays} label="Reserveringen vandaag" badge={unseenRes} value={reservations.filter(r => r.date === today && r.status !== 'cancelled').length} sub={`${reservations.filter(r => r.status === 'pending').length} in afwachting`} highlight={unseenRes > 0} />
                <StatCard icon={ShoppingBag} label="Takeaway bestellingen" badge={unseenOrd} value={orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length} sub="In behandeling" highlight={unseenOrd > 0} />
                <StatCard icon={Gift} label="Cadeaubonnen actief" badge={0} value={giftCards.filter(g => g.status === 'active' || g.status === 'partially_used').length} sub="Verkocht" />
                <StatCard icon={Mail} label="Contactaanvragen" badge={unseenCon} value={contacts.filter(c => c.status !== 'archived').length} sub={`${unseenCon} ongelezen`} highlight={unseenCon > 0} />
              </div>
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Kies een vestiging</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {LOCATIONS_DATA.map(loc => {
                  const isComingSoon = !loc.phone;
                  const stats = getLocStats(loc.slug);
                  return (
                    <button key={loc.slug} onClick={() => { if (!isComingSoon) { setSection('reserveringen'); setSelectedLocation(loc); } }} disabled={isComingSoon}
                      className={`group relative text-left rounded-2xl border backdrop-blur-lg transition-all duration-300 overflow-hidden ${isComingSoon ? 'opacity-50 cursor-not-allowed bg-card/20 border-primary/10' : 'hover:border-primary/40 bg-card/40 hover:bg-card/60 border-primary/10'}`}>
                      {stats.unseenCount > 0 && <span className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">{stats.unseenCount}</span>}
                      <div className="relative h-32 overflow-hidden">
                        <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: 'saturate(0.6) brightness(0.8)' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3"><p className="font-heading text-sm font-bold text-white">{loc.city}</p></div>
                        {isComingSoon && <div className="absolute top-3 right-3 bg-black/50 px-2 py-0.5 rounded-full"><span className="font-body text-[9px] tracking-widest uppercase text-white/70">Binnenkort</span></div>}
                      </div>
                      <div className="p-4">
                        {isComingSoon ? <p className="font-body text-xs text-muted-foreground">Informatie volgt binnenkort</p> : (
                          <div className="grid grid-cols-3 gap-2">
                            <div><p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Res. vandaag</p><p className="font-heading text-lg font-bold text-primary">{stats.todayRes}</p>{stats.pendingRes > 0 && <p className="font-body text-[9px] text-amber-600">● {stats.pendingRes}</p>}</div>
                            <div><p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Takeaway</p><p className="font-heading text-lg font-bold text-primary">{stats.todayOrd}</p></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Contactaanvragen {unseenCon > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">{unseenCon}</span>}</h2>
                </div>
                <AdminContactRequests searchQuery={searchQuery} />
              </div>
            </section>
          )}

          {operationalDetail && selectedLocation && (
            <section className="px-5 lg:px-8 py-6">
              {section === 'reserveringen' && <AdminReservations locationFilter={selectedLocation.slug} searchQuery={searchQuery} dateFilter={filterDate} />}
              {section === 'takeaway' && <AdminOrders locationFilter={selectedLocation.slug} searchQuery={searchQuery} dateFilter={filterDate} />}
              {section === 'pakketten' && <AdminGiftPackages locationFilter={selectedLocation.slug} searchQuery={searchQuery} dateFilter={filterDate} />}
              {section === 'bonnen' && <GiftCardManager />}
              {section === 'contact' && <AdminContactRequests searchQuery={searchQuery} />}
              {section === 'tafels' && <TableManagement locationSlug={selectedLocation.slug} locationName={selectedLocation.city} />}
            </section>
          )}

          {/* Operationele detailsectie zonder vestiging → toon vestigingskeuze */}
          {operationalDetail && !selectedLocation && (
            <section className="px-5 lg:px-8 py-8">
              <p className="font-body text-sm text-muted-foreground mb-5">Kies eerst een vestiging om deze sectie te bekijken.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {LOCATIONS_DATA.filter(l => l.phone).map(loc => (
                  <button key={loc.slug} onClick={() => setSelectedLocation(loc)} className="text-left rounded-2xl border border-primary/10 bg-card/40 hover:bg-card/60 hover:border-primary/40 p-4 transition-all">
                    <p className="font-heading text-base font-bold text-foreground">{loc.city}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{getLocStats(loc.slug).todayRes} res. vandaag · {getLocStats(loc.slug).todayOrd} takeaway</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ section, setSection, sectionBadge, totalUnseen, onLogout }) {
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
                const badge = sectionBadge(s.key);
                return (
                  <button key={s.key} onClick={() => setSection(s.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all ${active ? 'bg-primary/15 text-primary border border-primary/30' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 border border-transparent'}`}>
                    <s.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{s.label}</span>
                    {badge > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">{badge > 9 ? '9+' : badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border/40">
        {totalUnseen > 0 && <p className="font-body text-[10px] text-muted-foreground px-2 mb-3">{totalUnseen} ongelezen items</p>}
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Uitloggen
        </button>
      </div>
    </div>
  );
}