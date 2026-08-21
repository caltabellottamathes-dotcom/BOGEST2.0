import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Check } from 'lucide-react';
import BogestLogo from '@/components/BogestLogo';

// Admin gate for internal pages (Beeldbank, menukaart-beheer). The standalone
// /admin-login page was removed; instead the gate renders an inline login
// form when the visitor isn't authenticated, so admin tools stay reachable
// via their direct URL without a public login link anywhere on the site.
const ADMIN_USER = 'mail@salvatorecaltabellotta.com';
const ADMIN_PASS = 'S@lvatore1';

function isAuthed() {
  return sessionStorage.getItem('bogest-admin-auth') === '1' || localStorage.getItem('bogest-admin-auth') === '1';
}

export default function AdminGate() {
  const [authed, setAuthed] = useState(() => isAuthed());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem('bogest-admin-remember') === '1');
  const [error, setError] = useState('');

  if (authed) return <Outlet />;

  const submit = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      if (remember) {
        localStorage.setItem('bogest-admin-auth', '1');
        localStorage.setItem('bogest-admin-remember', '1');
        sessionStorage.removeItem('bogest-admin-auth');
      } else {
        sessionStorage.setItem('bogest-admin-auth', '1');
        localStorage.removeItem('bogest-admin-auth');
        localStorage.removeItem('bogest-admin-remember');
      }
      setAuthed(true);
    } else {
      setError('Ongeldige inloggegevens. Probeer opnieuw.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-sm">
        <div className="text-center mb-7">
          <BogestLogo className="text-3xl tracking-wide" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mt-2">Admin Toegang</p>
        </div>
        <div className="p-8 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/60 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200" placeholder="E-mail" required />
              </div>
            </div>
            <div>
              <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Wachtwoord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background/60 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200" placeholder="Wachtwoord" required />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            {error && <p className="font-body text-sm text-destructive text-center">{error}</p>}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button type="button" onClick={() => setRemember((r) => !r)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200 ${remember ? 'bg-primary border-primary' : 'border-border bg-background/60'}`} aria-pressed={remember}>{remember && <Check className="w-3 h-3 text-primary-foreground" />}</button>
              <span className="font-body text-xs text-muted-foreground">Onthoud mij</span>
            </label>
            <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300">Aanmelden</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}