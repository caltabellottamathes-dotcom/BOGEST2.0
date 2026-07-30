import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ThemeProvider } from '@/lib/ThemeContext';
import { LangProvider } from '@/lib/LangContext';
import { CartProvider } from '@/lib/CartContext';
import Layout from '@/components/layout/Layout';
import AdminGate from '@/components/AdminGate';
import BogestLogo from '@/components/BogestLogo';

import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import About from '@/pages/About';
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
import YellowPreview from '@/pages/YellowPreview';
import BurgundyPreview from '@/pages/BurgundyPreview';
import PowderBluePreview from '@/pages/PowderBluePreview';
import Instagram from '@/pages/Instagram';
import VraagHetAanBogest from '@/pages/VraagHetAanBogest';
import Assets from '@/pages/Assets';
import AdminLogin from '@/pages/AdminLogin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
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
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:slug" element={<LocationDetail />} />
        <Route path="/restaurant-spaces/:location" element={<RestaurantSpaces />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/takeaway" element={<Takeaway />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/yellow-preview" element={<YellowPreview />} />
        <Route path="/burgundy-preview" element={<BurgundyPreview />} />
        <Route path="/powder-blue-preview" element={<PowderBluePreview />} />
        <Route path="/instagram" element={<Instagram />} />
        <Route path="/vraag-het-aan-bogest" element={<VraagHetAanBogest />} />
        <Route element={<AdminGate />}>
          <Route path="/assets" element={<Assets />} />
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