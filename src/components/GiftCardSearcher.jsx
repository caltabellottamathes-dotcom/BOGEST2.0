import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';

export default function GiftCardSearcher() {
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await base44.functions.invoke('searchGiftCard', {
        query: searchQuery.trim(),
      });

      if (res.data?.found && res.data?.card) {
        setResult(res.data.card);
      } else {
        setError(res.data?.error || 'Cadeaubon niet gevonden. Controleer uw gegevens en probeer opnieuw.');
      }
    } catch {
      setError('Er is een fout opgetreden bij het zoeken. Probeer opnieuw.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Cadeaubon zoeken</h3>
        </div>
        
        <p className="font-body text-sm text-muted-foreground mb-4">
          Zoek uw cadeaubon op e-mailadres of telefoonnummer van de verzender.
        </p>

        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="E-mailadres of telefoonnummer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="pl-9 bg-background border-border font-body"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-6 h-auto py-2.5"
          >
            {loading ? 'Zoeken...' : 'Zoeken'}
          </Button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Search Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 rounded-2xl p-8 shadow-xl shadow-primary/10"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-1">Uw cadeaubon gevonden!</h3>
              <p className="font-body text-sm text-muted-foreground">Hier zijn de details van uw cadeaubon.</p>
            </div>
            <div className="text-right">
              <p className="font-body text-xs text-muted-foreground mb-1">Resterende waarde</p>
              <p className="font-heading text-3xl font-bold text-primary">€{result.balance?.toFixed(2) || result.amount?.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-background/40 backdrop-blur-lg rounded-xl p-6 border border-primary/20">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Code</p>
              <div className="flex items-center gap-3">
                <code className="font-mono text-lg font-bold text-foreground flex-1">{result.code}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.code);
                    alert('Code gekopieerd!');
                  }}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  Kopie
                </button>
              </div>
            </div>

            <div className="bg-background/40 backdrop-blur-lg rounded-xl p-6 border border-primary/20">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Gegevens</p>
              <div className="space-y-2">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Verzender</p>
                  <p className="font-body text-sm font-semibold text-foreground">{result.sender_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Ontvanger</p>
                  <p className="font-body text-sm font-semibold text-foreground">{result.recipient_name || 'Persoonlijk'}</p>
                </div>
              </div>
            </div>

            <div className="bg-background/40 backdrop-blur-lg rounded-xl p-6 border border-primary/20">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Status</p>
              <div className="space-y-2">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Originele waarde</p>
                  <p className="font-body text-sm font-semibold text-foreground">€{result.amount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full font-body text-xs font-medium ${
                    result.status === 'active' ? 'bg-primary/20 text-primary' :
                    result.status === 'partially_used' ? 'bg-amber-100/30 text-amber-700' :
                    result.status === 'spent' ? 'bg-secondary/50 text-secondary-foreground' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {result.status === 'active' ? 'Actief' :
                     result.status === 'partially_used' ? 'Gedeeltelijk gebruikt' :
                     result.status === 'spent' ? 'Opgebruikt' : 'Vervallen'}
                  </span>
                </div>
              </div>
            </div>

            {result.message && (
              <div className="bg-background/40 backdrop-blur-lg rounded-xl p-6 border border-primary/20">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Bericht</p>
                <p className="font-body text-sm italic text-foreground">"{result.message}"</p>
              </div>
            )}
          </div>

          {result.status === 'active' || result.status === 'partially_used' ? (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
              <p className="font-body text-sm text-primary">
                ✓ Deze cadeaubon kan nog gebruikt worden. Ga naar <span className="font-semibold">Traiteur</span> en voer de code in bij afrekenen.
              </p>
            </div>
          ) : (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
              <p className="font-body text-sm text-destructive">
                ✗ Deze cadeaubon kan helaas niet meer gebruikt worden.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}