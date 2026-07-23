import React, { useState, useEffect } from 'react';
import { CalendarDays, ShoppingBag, Gift, BarChart3, MapPin, Users, LayoutGrid, Search, Filter, LogOut, ArrowLeft, Package, Mail, Bell, RefreshCw, Settings } from 'lucide-react';
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

export default function Admin() {
  const [authed] = React.useState(() => sessionStorage.getItem('bogest-admin-auth') === '1');
  React.useEffect(() => { if (!authed) window.location.href = '/admin-login'; }, [authed]);
  if (!authed) return null;
  return <AdminInner />;
}

function AdminInner() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tab, setTab] = useState('reservations');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Live counts for notifications & badges
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [giftPackages, setGiftPackages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load all data for counts/notifications
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

  // Build notifications from unseen items
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

  // Real-time subscriptions for live badge counts
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

  // Badge counts
  const unseenRes = reservations.filter(r => !r.seen).length;
  const unseenOrd = orders.filter(o => !o.seen).length;
  const unseenPkg = giftPackages.filter(p => !p.seen).length;
  const unseenCon = contacts.filter(c => !c.seen).length;
  const totalUnseen = unseenRes + unseenOrd + unseenPkg + unseenCon;

  // Per-location stats
  const getLocStats = (slug) => ({
    todayRes: reservations.filter(r => r.location === slug && r.date === today && r.status !== 'cancelled').length,
    todayOrd: orders.filter(o => o.location === slug && o.pickup_date === today && o.status !== 'cancelled').length,
    pendingRes: reservations.filter(r => r.location === slug && r.status === 'pending').length,
    unseenCount: reservations.filter(r => r.location === slug && !r.seen).length + orders.filter(o => o.location === slug && !o.seen).length,
  });

  const LOCATION_TABS = [
    { id: 'reservations', label: 'Reserveringen', icon: CalendarDays, badge: unseenRes },
    { id: 'orders', label: 'Takeaway', icon: ShoppingBag, badge: unseenOrd },
    { id: 'packages', label: 'Cadeaupakketten', icon: Package, badge: unseenPkg },
    { id: 'giftcards', label: 'Cadeaubonnen', icon: Gift, badge: 0 },
    { id: 'contacts', label: 'Contactaanvragen', icon: Mail, badge: unseenCon },
    { id: 'tables', label: 'Tafelbeheer', icon: LayoutGrid, badge: 0 },
  ];

  const locSlug = selectedLocation?.slug;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Notifications popup */}
      {showNotifications && (
        <AdminNotificationsPopup
          notifications={notifications}
          onClose={() => { setNotifDismissed(true); setShowNotifications(false); }}
          onMarkAllSeen={markAllSeen}
        />
      )}

      {/* Top bar */}
      <section className="w-full pt-24 pb-6 px-6 md:px-10 lg:px-16 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {selectedLocation && (
              <button onClick={() => { setSelectedLocation(null); setTab('reservations'); setSearchQuery(''); setFilterDate(''); }}
                className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <div>
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-1 block">Beheer</span>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {selectedLocation ? selectedLocation.name : 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Bell with badge */}
            <button onClick={() => setShowNotifications(true)}
              className="relative w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-3.5 h-3.5" />
              {totalUnseen > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">
                  {totalUnseen > 9 ? '9+' : totalUnseen}
                </span>
              )}
            </button>
            <button onClick={loadData}
              className="w-9 h-9 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { sessionStorage.removeItem('bogest-admin-auth'); window.location.href = '/'; }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground font-body text-xs tracking-widest uppercase hover:border-destructive hover:text-destructive transition-colors">
              <LogOut className="w-3 h-3" /> Uitloggen
            </button>
          </div>
        </div>

        {/* Search & filter — shown in location view */}
        {selectedLocation && (
          <div className="flex gap-3 flex-wrap mt-4">
            <div className="relative flex-1 min-w-56">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Zoeken op naam, email, telefoon..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-card/40 border-primary/10" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="pl-9 pr-3 py-2 bg-card/40 border border-primary/10 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {(searchQuery || filterDate) && (
              <button onClick={() => { setSearchQuery(''); setFilterDate(''); }}
                className="px-3 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg font-body text-xs tracking-widest uppercase hover:bg-destructive/20 transition-colors">
                Wissen
              </button>
            )}
          </div>
        )}
      </section>

      {/* HOME — all locations overview */}
      {!selectedLocation && (
        <section className="w-full px-6 md:px-10 lg:px-16 py-10">
          {/* Global stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={CalendarDays} label="Reserveringen vandaag" badge={unseenRes}
              value={reservations.filter(r => r.date === today && r.status !== 'cancelled').length}
              sub={`${reservations.filter(r => r.status === 'pending').length} in afwachting`}
              highlight={unseenRes > 0} />
            <StatCard icon={ShoppingBag} label="Takeaway bestellingen" badge={unseenOrd}
              value={orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
              sub="In behandeling" highlight={unseenOrd > 0} />
            <StatCard icon={Gift} label="Cadeaubonnen actief" badge={0}
              value={giftCards.filter(g => g.status === 'active' || g.status === 'partially_used').length}
              sub="Verkocht" />
            <StatCard icon={Mail} label="Contactaanvragen" badge={unseenCon}
              value={contacts.filter(c => c.status !== 'archived').length}
              sub={`${unseenCon} ongelezen`} highlight={unseenCon > 0} />
          </div>

          {/* Location tiles */}
          <h2 className="font-heading text-xl font-bold text-foreground mb-5">Kies een vestiging</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {LOCATIONS_DATA.map(loc => {
              const isComingSoon = !loc.phone;
              const stats = getLocStats(loc.slug);
              const savedTables = (() => { try { const s = localStorage.getItem(`bogest-tables-${loc.slug}`); return s ? JSON.parse(s) : null; } catch { return null; } })();
              const availSeats = savedTables ? savedTables.filter(t => t.enabled && !t.unavailable).reduce((s, t) => s + t.seats, 0) : '—';
              return (
                <button key={loc.slug} onClick={() => !isComingSoon && setSelectedLocation(loc)} disabled={isComingSoon}
                  className={`group relative text-left rounded-2xl border backdrop-blur-lg transition-all duration-300 overflow-hidden ${
                    isComingSoon ? 'opacity-50 cursor-not-allowed bg-card/20 border-primary/10' : 'hover:border-primary/40 bg-card/40 hover:bg-card/60 border-primary/10'
                  }`}>
                  {stats.unseenCount > 0 && (
                    <span className="absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">
                      {stats.unseenCount}
                    </span>
                  )}
                  <div className="relative h-36 overflow-hidden">
                    <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ filter: 'saturate(0.6) brightness(0.8)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="font-heading text-sm font-bold text-white">{loc.city}</p>
                    </div>
                    {isComingSoon && (
                      <div className="absolute top-3 right-3 bg-black/50 px-2 py-0.5 rounded-full">
                        <span className="font-body text-[9px] tracking-widest uppercase text-white/70">Binnenkort</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {isComingSoon ? (
                      <p className="font-body text-xs text-muted-foreground">Informatie volgt binnenkort</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Res. vandaag</p>
                          <p className="font-heading text-lg font-bold text-primary">{stats.todayRes}</p>
                          {stats.pendingRes > 0 && <p className="font-body text-[9px] text-amber-600">● {stats.pendingRes}</p>}
                        </div>
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Takeaway</p>
                          <p className="font-heading text-lg font-bold text-primary">{stats.todayOrd}</p>
                        </div>
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Stoelen</p>
                          <p className="font-heading text-lg font-bold text-foreground">{availSeats}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Global Contact Requests */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Contactaanvragen
                {unseenCon > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">{unseenCon}</span>}
              </h2>
            </div>
            <AdminContactRequests searchQuery={searchQuery} />
          </div>
        </section>
      )}

      {/* LOCATION VIEW */}
      {selectedLocation && (
        <section className="w-full px-6 md:px-10 lg:px-16 py-8">
          {/* Location stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={CalendarDays} label="Reserveringen vandaag"
              value={reservations.filter(r => r.location === locSlug && r.date === today && r.status !== 'cancelled').length}
              sub={selectedLocation.city} highlight={unseenRes > 0}
              badge={reservations.filter(r => r.location === locSlug && !r.seen).length} />
            <StatCard icon={ShoppingBag} label="Takeaway vandaag"
              value={orders.filter(o => o.location === locSlug && o.pickup_date === today && o.status !== 'cancelled').length}
              sub="In behandeling" highlight={unseenOrd > 0}
              badge={orders.filter(o => o.location === locSlug && !o.seen).length} />
            <StatCard icon={Package} label="Cadeaupakketten"
              value={giftPackages.filter(p => p.location === locSlug && p.status !== 'completed' && p.status !== 'cancelled').length}
              sub="In behandeling"
              badge={giftPackages.filter(p => p.location === locSlug && !p.seen).length} />
            <StatCard icon={Users} label="Gasten bevestigd"
              value={reservations.filter(r => r.location === locSlug && r.status === 'confirmed' && r.date === today).reduce((s, r) => s + (r.guests || 0), 0)}
              sub="Vandaag" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border/50 mb-8 overflow-x-auto">
            {LOCATION_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-3 font-body text-xs whitespace-nowrap transition-all duration-200 border-b-2 -mb-px ${
                  tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}>
                <t.icon className="w-3.5 h-3.5" />{t.label}
                {t.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground font-body text-[9px] flex items-center justify-center">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'reservations' && (
            <AdminReservations locationFilter={locSlug} searchQuery={searchQuery} dateFilter={filterDate} />
          )}
          {tab === 'orders' && (
            <AdminOrders locationFilter={locSlug} searchQuery={searchQuery} dateFilter={filterDate} />
          )}
          {tab === 'packages' && (
            <AdminGiftPackages locationFilter={locSlug} searchQuery={searchQuery} dateFilter={filterDate} />
          )}
          {tab === 'giftcards' && <GiftCardManager />}
          {tab === 'contacts' && <AdminContactRequests searchQuery={searchQuery} />}
          {tab === 'tables' && (
            <TableManagement locationSlug={selectedLocation.slug} locationName={selectedLocation.city} />
          )}
        </section>
      )}
    </div>
  );
}