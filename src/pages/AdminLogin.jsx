import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import BogestLogo from '@/components/BogestLogo';
import { useNavigate } from 'react-router-dom';

const ADMIN_USER = 'mail@salvatorecaltabellotta.com';
const ADMIN_PASS = 'S@lvatore1';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem('bogest-admin-auth', '1');
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        navigate(redirect || '/admin');
      } else {
        setError('Ongeldige inloggegevens. Probeer opnieuw.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <BogestLogo className="text-3xl tracking-wide" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mt-2">Admin Toegang</p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/60 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                  placeholder="E-mail"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background/60 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                  placeholder="Wachtwoord"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? 'Aanmelden...' : 'Aanmelden'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}