import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { KeyRound, Loader2, Lock } from 'lucide-react';

// "Mijn account" — laat de ingelogde beheerder zijn eigen wachtwoord wijzigen.
// Vereist het huidige wachtwoord (platform-veiligheid); werkt dus alleen voor
// accounts die al een wachtwoord hebben (niet voor pure Google-accounts).
export default function AdminMyAccount() {
  const [me, setMe] = useState(null);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (next !== confirm) {
      setFeedback({ type: 'error', msg: 'Nieuwe wachtwoorden komen niet overeen.' });
      return;
    }
    if (next.length < 6) {
      setFeedback({ type: 'error', msg: 'Nieuw wachtwoord moet minstens 6 tekens zijn.' });
      return;
    }
    setSaving(true);
    try {
      await base44.auth.changePassword({
        userId: me.id,
        currentPassword: current,
        newPassword: next,
      });
      setFeedback({ type: 'success', msg: 'Wachtwoord gewijzigd. Je kunt nu inloggen met e-mail + dit wachtwoord.' });
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      if (err.status === 401) {
        setFeedback({ type: 'error', msg: 'Huidig wachtwoord onjuist — of dit account heeft nog geen wachtwoord (Google-account). Vraag dan eerst een reset-link aan.' });
      } else if (err.status === 422) {
        setFeedback({ type: 'error', msg: 'Nieuw wachtwoord voldoet niet aan de eisen.' });
      } else {
        setFeedback({ type: 'error', msg: err.message || 'Wachtwoord wijzigen mislukt.' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-1">
        <KeyRound className="w-5 h-5 text-primary" />
        <h2 className="font-heading text-lg font-bold text-foreground">Mijn wachtwoord</h2>
      </div>
      <p className="font-body text-sm text-muted-foreground mb-5">
        {me ? `Ingelogd als ${me.email}` : '…'} — wijzig je eigen wachtwoord. Werkt alleen als dit account al een wachtwoord heeft.
      </p>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Huidig wachtwoord" className="bogest-input pl-10" />
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="password" required value={next} onChange={(e) => setNext(e.target.value)} placeholder="Nieuw wachtwoord" className="bogest-input pl-10" />
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Herhaal nieuw wachtwoord" className="bogest-input pl-10" />
        </div>
        <button type="submit" disabled={saving || !me} className="h-[42px] px-5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          Wijzigen
        </button>
      </form>
      {feedback && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
          {feedback.msg}
        </div>
      )}
    </section>
  );
}