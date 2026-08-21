import { useEffect, useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import BogestLogo from '@/components/BogestLogo';

// Admin gate for internal pages (Beeldbank, menukaart-beheer). Authorizes
// via the real Base44 admin session (base44.auth.me role === 'admin').
// Unauthenticated or non-admin visitors are sent to the standard login with
// a returnTo, so privileged mutations (assetsApi, siteImagesApi, siteTextApi)
// — which now require this same admin session server-side — will succeed.
export default function AdminGate() {
  const location = useLocation();
  const [state, setState] = useState('checking'); // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then((me) => { if (active) setState(me && me.role === 'admin' ? 'ok' : 'denied'); })
      .catch(() => { if (active) setState('denied'); });
    return () => { active = false; };
  }, []);

  if (state === 'checking') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <BogestLogo className="text-2xl tracking-wide" />
          <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (state === 'ok') return <Outlet />;

  return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
}