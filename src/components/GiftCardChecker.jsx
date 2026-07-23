import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Loader2, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';

export default function GiftCardChecker() {
  const { t } = useLang();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await base44.functions.invoke('validateGiftCard', { code: code.trim() });
      if (res.data?.valid) {
        setResult(res.data);
      } else {
        setError(res.data?.error || t('gc_invalid'));
      }
    } catch {
      setError(t('gc_invalid'));
    }
    setLoading(false);
  };

  return (
    <div className="w-full space-y-5">
      {/* Input */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground leading-tight">{t('gc_balance_title')}</h3>
            <p className="font-body text-[11px] text-muted-foreground mt-0.5">{t('gc_balance_desc')}</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="BOGEST-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            className="flex-1 min-w-48 bg-card border-border font-body uppercase tracking-wider"
          />
          <Button
            onClick={handleCheck}
            disabled={loading || !code.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-6 h-auto py-2.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('gc_check_btn')}
          </Button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="font-body text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/30 rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{t('gc_balance_remaining')}</p>
              <p className="font-heading text-3xl font-bold text-primary">€{result.balance?.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="pt-4 border-t border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-body text-xs text-muted-foreground">{t('gc_card_ref')}</span>
              <code className="font-mono text-sm font-semibold text-foreground">{result.code}</code>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}