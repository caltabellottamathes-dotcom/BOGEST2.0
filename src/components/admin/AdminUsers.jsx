import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { UserPlus, Mail, Shield, User as UserIcon, Loader2, Trash2, Check } from 'lucide-react';

// Gebruikersbeheer — nodig nieuwe admin/user-accounts uit en beheer bestaande.
// Nieuwe accounts krijgen een uitnodigingsmail met een link om zelf een
// wachtwoord te kiezen (platform-auth; wij kunnen geen wachtwoord instellen).
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('admin');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.User.list();
      setUsers(list || []);
    } catch (e) {
      setFeedback({ type: 'error', msg: e.message || 'Kon gebruikers niet ophalen' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const invite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setSending(true);
    setFeedback(null);
    try {
      await base44.users.inviteUser(inviteEmail.trim(), inviteRole);
      setFeedback({ type: 'success', msg: `Uitnodiging verzonden naar ${inviteEmail.trim()}` });
      setInviteEmail('');
      load();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Uitnodigen mislukt' });
    } finally {
      setSending(false);
    }
  };

  const setRole = async (user, role) => {
    try {
      await base44.entities.User.update(user.id, { role });
      setFeedback({ type: 'success', msg: 'Rol bijgewerkt' });
      load();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Rol wijzigen mislukt' });
    }
  };

  return (
    <div className="px-5 lg:px-8 py-8 max-w-4xl mx-auto space-y-8">
      {/* Uitnodigen */}
      <section className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-1">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Nieuw account uitnodigen</h2>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-5">
          De genodigde ontvangt een mail met een link om zelf een wachtwoord te kiezen.
        </p>
        <form onSubmit={invite} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="naam@voorbeeld.be"
              className="bogest-input pl-10"
            />
          </div>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="bogest-input sm:w-44"
          >
            <option value="admin">Admin</option>
            <option value="user">Gebruiker</option>
          </select>
          <button
            type="submit"
            disabled={sending}
            className="h-[42px] px-5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Uitnodigen
          </button>
        </form>
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            {feedback.msg}
          </div>
        )}
      </section>

      {/* Bestaande gebruikers */}
      <section className="bg-card rounded-2xl border border-border/50 p-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Bestaande accounts</h2>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Geen gebruikers gevonden.</p>
        ) : (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border/70 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  {u.role === 'admin'
                    ? <Shield className="w-4 h-4 text-primary" />
                    : <UserIcon className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{u.full_name || u.email}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <select
                  value={u.role || 'user'}
                  onChange={(e) => setRole(u, e.target.value)}
                  className="bogest-input w-32"
                >
                  <option value="admin">Admin</option>
                  <option value="user">Gebruiker</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}