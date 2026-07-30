import { Outlet, Navigate, useLocation } from 'react-router-dom';

// Admin gate for internal pages (Beeldbank). Uses the same sessionStorage flag
// set by AdminLogin. Unauthenticated visitors are sent to /admin-login?redirect=<path>.
export default function AdminGate() {
  const location = useLocation();
  const authed = sessionStorage.getItem('bogest-admin-auth') === '1';
  if (!authed) {
    return (
      <Navigate to={`/admin-login?redirect=${encodeURIComponent(location.pathname)}`} replace />
    );
  }
  return <Outlet />;
}