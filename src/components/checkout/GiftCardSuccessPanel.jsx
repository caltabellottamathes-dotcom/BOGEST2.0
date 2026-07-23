import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Copy, Check, Gift, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GiftCardSuccessPanel({ giftCard, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(giftCard.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <title>Bogèst Cadeaubon</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Georgia', serif; 
      background: #f5f3ee; 
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 600px;
      width: 100%;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #3d4a28 0%, #5a6b3a 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .logo {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .logo em { font-style: italic; }
    .subtitle { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; opacity: 0.7; }
    .divider { width: 40px; height: 2px; background: rgba(255,255,255,0.3); margin: 16px auto; }
    
    .amount-box {
      padding: 32px 40px;
      text-align: center;
      background: linear-gradient(135deg, #3d4a28 0%, #5a6b3a 100%);
      color: white;
    }
    .amount-label { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; opacity: 0.7; margin-bottom: 8px; }
    .amount { font-size: 56px; font-weight: 800; margin: 8px 0; }
    .code-box {
      display: inline-block;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 8px;
      padding: 12px 24px;
      margin-top: 16px;
      font-family: 'Courier New', monospace;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 3px;
    }
    .save-label { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 10px; letter-spacing: 2px; text-transform: uppercase; }

    .content { padding: 32px 40px; }
    .greeting { font-size: 18px; font-weight: 700; color: #1a1a14; margin-bottom: 12px; }
    .message { font-size: 14px; color: #666; line-height: 1.7; }

    .info-box {
      background: #f8f7f3;
      border-left: 3px solid #3d4a28;
      border-radius: 0 8px 8px 0;
      padding: 16px;
      margin-top: 24px;
      font-size: 13px;
      color: #555;
    }
    .info-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #3d4a28; font-weight: 700; margin-bottom: 8px; }
    .info-row { margin-bottom: 8px; }
    .info-row:last-child { margin-bottom: 0; }
    strong { color: #3d4a28; }

    .footer {
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #ede9e1;
      font-size: 12px;
      color: #aaa;
    }
    .footer-logo { font-size: 18px; font-weight: 700; color: #3d4a28; letter-spacing: 1px; margin-bottom: 4px; }
    .footer-text { margin-top: 12px; font-size: 11px; color: #bbb; }

    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="subtitle">Grill Restaurant</div>
      <div class="logo">BOG<em style="font-style: italic;">È</em>ST</div>
      <div class="divider"></div>
    </div>

    <div class="amount-box">
      <div class="amount-label">Cadeaubon</div>
      <div class="amount">€${giftCard.amount}</div>
      <div class="code-box">${giftCard.code}</div>
      <div class="save-label">BEWAAR DEZE CODE</div>
    </div>

    <div class="content">
      <div class="greeting">Uw Cadeaubon</div>
      <div class="message">
        U heeft zojuist een Bogèst cadeaubon ter waarde van <strong>€${giftCard.amount}</strong> gekocht.
        ${giftCard.recipient_name ? `Deze is bestemd voor <strong>${giftCard.recipient_name}</strong> en is verzonden naar ${giftCard.recipient_email}.` : ''}
      </div>

      <div class="info-box">
        <div class="info-label">Hoe te gebruiken</div>
        <div class="info-row">1. Ga naar <strong>bogest.base44.app</strong> en voeg producten toe</div>
        <div class="info-row">2. Bij checkout, voer de code in: <strong>${giftCard.code}</strong></div>
        <div class="info-row">3. Het tegoed wordt automatisch afgetrokken van uw totaal</div>
      </div>

      <div class="info-box" style="margin-top: 16px;">
        <div class="info-label">Onze Vestigingen</div>
        <div class="info-row">📍 <strong>Hasselt</strong> — Luikersteenweg 137</div>
        <div class="info-row">📍 <strong>Borgloon</strong> — Groot Begijnhof 2-4</div>
        <div class="info-row">📍 <strong>Heusden-Zolder</strong> — Molenstraat 59</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-logo">BOG<em style="font-style: italic;">È</em>ST</div>
      <div>Grill Restaurant — Limburg</div>
      <div class="footer-text">Geen vervaldatum • Niet inwisselbaar voor geld</div>
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bogest-Cadeaubon-${giftCard.code}.html`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 px-8 py-10 text-primary-foreground">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-6 h-6" />
              <span className="font-body text-xs tracking-widest uppercase opacity-80">Cadeaubon</span>
            </div>
            <h2 className="font-heading text-4xl font-bold">Uw Cadeaubon</h2>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Amount Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 text-center">
              <div className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">
                Waarde
              </div>
              <div className="font-heading text-6xl font-bold text-primary mb-6">€{giftCard.amount}</div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Code</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="mt-6 bg-background rounded-lg p-4 border border-primary/20 inline-block">
                <code className="font-mono text-xl font-bold text-foreground tracking-widest">{giftCard.code}</code>
              </div>
              <button
                onClick={handleCopy}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 text-sm font-body text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Gekopieerd!' : 'Code kopiëren'}
              </button>
            </div>

            {/* Recipient Info */}
            {giftCard.recipient_name && (
              <div className="bg-secondary/30 border border-secondary rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground mb-1">
                      Verzonden naar {giftCard.recipient_name}
                    </p>
                    <p className="font-body text-sm text-muted-foreground">{giftCard.recipient_email}</p>
                    {giftCard.message && (
                      <p className="font-body text-sm text-foreground mt-3 italic border-l-2 border-primary/40 pl-3">
                        "{giftCard.message}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="font-heading text-base font-semibold text-foreground">Hoe te gebruiken</h3>
              <ol className="space-y-2">
                {['Ga naar bogest.base44.app en voeg producten toe aan uw winkelmandje', 'Ga naar de afrekenpagina en voer de code in', 'Het tegoed wordt automatisch afgetrokken'].map((step, i) => (
                  <li key={i} className="flex gap-3 font-body text-sm text-muted-foreground">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Downloaden...' : 'Downloaden als PDF'}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Sluiten
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}