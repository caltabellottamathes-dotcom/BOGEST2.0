import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ThemeProvider } from '@/lib/ThemeContext';
import { LangProvider } from '@/lib/LangContext';
import { CartProvider } from '@/lib/CartContext';
import Layout from '@/components/layout/Layout';
import AdminGate from '@/components/AdminGate';
import BogestLogo from '@/components/BogestLogo';
import { preloadHeroVideo, preloadWelcomeVideo } from '@/lib/heroVideo';

import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import About from '@/pages/About';
import OnsVerhaal from '@/pages/OnsVerhaal';
import OnzeFilosofie from '@/pages/OnzeFilosofie';
import Locations from '@/pages/Locations';
import LocationDetail from '@/pages/LocationDetail';
import RestaurantSpaces from '@/pages/RestaurantSpaces';
import Reserve from '@/pages/Reserve';
import Takeaway from '@/pages/Takeaway';
import GiftCards from '@/pages/GiftCards';
import Contact from '@/pages/Contact';
import Groups from '@/pages/Groups';
import Jobs from '@/pages/Jobs';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import CookiePolicy from '@/pages/CookiePolicy';
import AiDisclaimer from '@/pages/AiDisclaimer';
import Instagram from '@/pages/Instagram';
import MenuBeheer from '@/pages/MenuBeheer';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VraagHetAanBogest from '@/pages/VraagHetAanBogest';
import Assets from '@/pages/Assets';
import AnnouncementBeheer from '@/pages/AnnouncementBeheer';
import OpeningHoursBeheer from '@/pages/OpeningHoursBeheer';
import VacaturesBeheer from '@/pages/VacaturesBeheer';
import SeoHead from '@/components/SeoHead';

// Doorverwijzingen van oude Engelse paden → Nederlandse URL's. Behoudt de
// query-string (zoals ?loc=hasselt) en eventuele route-params.
function PathRedirect({ to }) {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
}
function LocationRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/locaties/${slug}`} replace />;
}
function SpacesRedirect() {
  const { location } = useParams();
  return <Navigate to={`/restaurantruimtes/${location}`} replace />;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  // Preload the hero video during the loading entrance so the homepage is
  // fully ready (video playing) the moment it reveals. Always preload in the
  // background; only block the reveal when the guest actually lands on home.
  useEffect(() => {
    preloadHeroVideo().then(() => setHeroVideoReady(true));
    // Warm the digital host's welcome video in parallel so its entry pop-up
    // shows the video instantly instead of loading it late.
    preloadWelcomeVideo();
    const path = window.location.pathname;
    if (path !== '/' && path !== '') setHeroVideoReady(true);
  }, []);

  // On the homepage, keep the branded loading screen up until the hero video
  // has preloaded its first frame. The homepage then reveals with the video
  // already playing — no black flash. Other routes don't wait for it.
  const onHome = window.location.pathname === '/' || window.location.pathname === '';
  if (isLoadingPublicSettings || isLoadingAuth || (onHome && !heroVideoReady)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5">
          <BogestLogo className="text-3xl tracking-wide" />
          <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* Nederlandse routes */}
        <Route path="/menukaart" element={<Menu />} />
        <Route path="/over-ons" element={<About />} />
        <Route path="/over-ons/ons-verhaal" element={<OnsVerhaal />} />
        <Route path="/over-ons/onze-filosofie" element={<OnzeFilosofie />} />
        <Route path="/over-ons/instagram" element={<Instagram />} />
        <Route path="/locaties" element={<Locations />} />
        <Route path="/locaties/:slug" element={<LocationDetail />} />
        <Route path="/restaurantruimtes/:location" element={<RestaurantSpaces />} />
        <Route path="/reserveren" element={<Reserve />} />
        <Route path="/reserveren/:vestiging" element={<Reserve />} />
        <Route path="/traiteur" element={<Takeaway />} />
        <Route path="/cadeaubonnen" element={<GiftCards />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/groepen" element={<Groups />} />
        <Route path="/vacatures" element={<Jobs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/voorwaarden" element={<Terms />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/ai-disclaimer" element={<AiDisclaimer />} />
        <Route path="/vraag-het-aan-bogest" element={<VraagHetAanBogest />} />

        {/* Doorverwijzingen van oude Engelse paden → Nederlandse URL's (301-style) */}
        <Route path="/menu" element={<Navigate to="/menukaart" replace />} />
        <Route path="/about" element={<Navigate to="/over-ons" replace />} />
        <Route path="/about/ons-verhaal" element={<Navigate to="/over-ons/ons-verhaal" replace />} />
        <Route path="/about/onze-filosofie" element={<Navigate to="/over-ons/onze-filosofie" replace />} />
        <Route path="/about/instagram" element={<Navigate to="/over-ons/instagram" replace />} />
        <Route path="/locations" element={<Navigate to="/locaties" replace />} />
        <Route path="/locations/:slug" element={<LocationRedirect />} />
        <Route path="/restaurant-spaces/:location" element={<SpacesRedirect />} />
        <Route path="/reserve" element={<PathRedirect to="/reserveren" />} />
        <Route path="/takeaway" element={<Navigate to="/traiteur" replace />} />
        <Route path="/gift-cards" element={<Navigate to="/cadeaubonnen" replace />} />
        <Route path="/groups" element={<Navigate to="/groepen" replace />} />
        <Route path="/jobs" element={<Navigate to="/vacatures" replace />} />
        <Route path="/terms" element={<Navigate to="/voorwaarden" replace />} />

        <Route element={<AdminGate />}>
          <Route path="/assets" element={<Assets />} />
          <Route path="/menu-beheer" element={<MenuBeheer />} />
          <Route path="/meldingen-beheer" element={<AnnouncementBeheer />} />
          <Route path="/uren-beheer" element={<OpeningHoursBeheer />} />
          <Route path="/vacatures-beheer" element={<VacaturesBeheer />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <CartProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <AuthenticatedApp />
                <SeoHead />
              </Router>
              <Toaster />
            </QueryClientProvider>
          </AuthProvider>
        </CartProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;