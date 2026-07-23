import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShoppingBag, Trash2, CreditCard, AlertCircle, Tag, Store, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useCart } from '@/lib/CartContext';
import { base44 } from '@/api/base44Client';
import { loadStripe } from '@stripe/stripe-js';
import StripeEmbeddedCheckout from '@/components/checkout/StripeEmbeddedCheckout';
import GiftCardSuccessPanel from '@/components/checkout/GiftCardSuccessPanel';

// Cart types that require in-store pickup — offer pay-in-store option
const PICKUP_TYPES = ['takeaway', 'giftpackage'];

export default function Checkout() {
  const { t } = useLang();
  const { items, cartMeta, removeItem, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isIframe, setIsIframe] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'instore'
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeInstance, setStripeInstance] = useState(null);

  // Gift card state
  const [gcCode, setGcCode] = useState('');
  const [gcLoading, setGcLoading] = useState(false);
  const [gcError, setGcError] = useState('');
  const [appliedGc, setAppliedGc] = useState(null); // { code, balance, redeemable, cardId }
  const [successGiftCard, setSuccessGiftCard] = useState(null); // Card to show in success panel

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  
  // Determine if cart has items that require pickup
  const hasPickupItems = items.some(i => ['takeaway', 'giftpackage'].includes(i.itemType));
  const isPickupOrder = hasPickupItems;

  const discount = appliedGc ? Math.min(appliedGc.redeemable, total) : 0;
  const finalTotal = Math.max(0, total - discount);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      // Deduct gift card balance if used
      const gcId = params.get('gcId');
      const gcDiscount = parseFloat(params.get('gcDiscount')) || 0;
      if (gcId && gcDiscount > 0) {
        base44.functions.invoke('deductGiftCard', { cardId: gcId, amount: gcDiscount }).catch(() => {});
      }
      // Get gift card info from saved session
      const savedItems = JSON.parse(sessionStorage.getItem('bogest_checkout_items') || '[]');
      const savedForm = JSON.parse(sessionStorage.getItem('bogest_checkout_form') || '{}');
      const giftCardItem = savedItems.find(i => i.itemType === 'giftcard');
      
      if (giftCardItem) {
        // Send gift card email and get the generated code
        base44.functions.invoke('sendGiftCardEmail', {
          recipientName: giftCardItem.details.recipient,
          recipientEmail: giftCardItem.details.recipientEmail,
          senderName: giftCardItem.details.sender || savedForm.name,
          message: giftCardItem.details.message,
          amount: giftCardItem.price,
          cardType: giftCardItem.cardType,
        })
          .then(res => {
            // Set success with real code from backend
            setSuccessGiftCard({
              code: res.data?.code || 'BOGEST-XXXX-XXXX',
              amount: giftCardItem.price,
              recipient_name: giftCardItem.details?.recipient || null,
              recipient_email: giftCardItem.details?.recipientEmail || null,
              message: giftCardItem.details?.message || null,
            });
            setSuccess(true);
          })
          .catch(err => {
            console.error('Gift card creation error:', err);
            // Still show success even if email fails
            setSuccessGiftCard({
              code: 'BOGEST-XXXX-XXXX',
              amount: giftCardItem.price,
              recipient_name: giftCardItem.details?.recipient || null,
              recipient_email: giftCardItem.details?.recipientEmail || null,
              message: giftCardItem.details?.message || null,
            });
            setSuccess(true);
          });
      } else {
        setSuccess(true);
      }
      
      sessionStorage.removeItem('bogest_checkout_items');
      sessionStorage.removeItem('bogest_checkout_form');
      clearCart();
      window.history.replaceState({}, '', '/checkout');
    }
  }, [clearCart]);

  const handleApplyGiftCard = async () => {
    if (!gcCode.trim()) return;
    setGcLoading(true);
    setGcError('');
    setAppliedGc(null);
    try {
      const res = await base44.functions.invoke('validateGiftCard', { code: gcCode.trim(), amountToRedeem: total });
      if (res.data?.valid) {
        setAppliedGc(res.data);
        setGcCode('');
      } else {
        setGcError(res.data?.error || 'Ongeldige code.');
      }
    } catch {
      setGcError('Kon de code niet controleren. Probeer opnieuw.');
    }
    setGcLoading(false);
  };

  const handlePayOnline = async () => {
    if (isIframe) {
      setError('Betaling werkt enkel vanuit de gepubliceerde website. Open de site in een nieuw venster.');
      return;
    }
    // Persist cart + form so we can send gift card emails after Stripe redirect
    sessionStorage.setItem('bogest_checkout_items', JSON.stringify(items));
    sessionStorage.setItem('bogest_checkout_form', JSON.stringify(form));
    setLoading(true);
    setError('');
    try {
      const giftCardItem = items.find(i => i.itemType === 'giftcard');
      const response = await base44.functions.invoke('stripeCheckout', {
        items: items.map(i => ({ ...i, type: i.itemType })),
        total,
        email: form.email,
        name: form.name,
        phone: form.phone,
        cartMeta,
        giftCardCode: appliedGc?.code || null,
        giftCardId: appliedGc?.cardId || null,
        giftCardDiscount: discount,
        giftCardItem: giftCardItem || null,
      });
      if (response.data?.clientSecret && response.data?.publishableKey) {
        const stripe = await loadStripe(response.data.publishableKey);
        setStripeInstance(stripe);
        setStripeClientSecret(response.data.clientSecret);
        setStep(3);
      } else {
        setError('Betaling kon niet worden gestart. Probeer opnieuw.');
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer opnieuw.');
      console.error('Stripe error:', err);
    }
    setLoading(false);
  };

  const handlePayInStore = async () => {
    setLoading(true);
    setError('');
    const takeawayItems = items.filter(i => i.itemType === 'takeaway');
    const packageItems = items.filter(i => i.itemType === 'giftpackage');
    const location = cartMeta?.takeaway?.location || cartMeta?.giftpackage?.location || '';

    // Save takeaway order
    if (takeawayItems.length > 0) {
      await base44.entities.Order.create({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        location,
        pickup_date: cartMeta?.takeaway?.pickupDate || '',
        pickup_time: cartMeta?.takeaway?.pickupTime || '',
        items: takeawayItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total: takeawayItems.reduce((s, i) => s + i.price * i.qty, 0),
        order_type: 'takeaway',
        payment_status: 'pending',
        status: 'new',
        seen: false,
      });
    }
    // Save gift package order
    if (packageItems.length > 0) {
      await base44.entities.GiftPackageOrder.create({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        location,
        pickup_date: cartMeta?.giftpackage?.pickupDate || '',
        pickup_time: cartMeta?.giftpackage?.pickupTime || '',
        items: packageItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total: packageItems.reduce((s, i) => s + i.price * i.qty, 0),
        payment_status: 'pending',
        status: 'pending',
        seen: false,
      });
    }

    setSuccess(true);
    clearCart();
    setLoading(false);
  };

  const getPaymentMethodLabel = () => {
    if (paymentMethod === 'instore') return 'Betaling bij locatie';
    return 'Online betaling';
  };

  if (success) {
  // Show gift card panel if one was purchased
  if (successGiftCard) {
    return (
      <GiftCardSuccessPanel 
        giftCard={successGiftCard} 
        onClose={() => {
          clearCart();
          window.location.href = '/';
        }}
      />
    );
  }

  // Otherwise show generic success message
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-foreground mb-3">{t('ch_success')}</h2>
        <p className="font-body text-muted-foreground mb-8">
          {paymentMethod === 'instore'
            ? 'Uw bestelling is geregistreerd. U betaalt bij afhaal in het restaurant.'
            : 'Uw bestelling is ontvangen en wordt verwerkt. U ontvangt een bevestiging per e-mail.'}
        </p>
        <Link to="/" className="inline-flex items-center justify-center w-full gap-2 px-8 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
          Terug naar home
        </Link>
      </motion.div>
    </div>
  );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mb-5" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">{t('ta_empty')}</h2>
        <p className="font-body text-sm text-muted-foreground mb-4">Waar wilt u bestellen?</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/takeaway" className="font-body text-sm text-primary hover:underline">Naar Traiteur</Link>
          <Link to="/gift-cards" className="font-body text-sm text-primary hover:underline">Naar Cadeaubon</Link>
          <Link to="/gift-package" className="font-body text-sm text-primary hover:underline">Naar Cadeaupakket</Link>
        </div>
      </div>
    );
  }

  const itemTypes = [...new Set(items.map(i => i.itemType))];
  const cartLabels = itemTypes.map(t => 
    t === 'takeaway' ? 'Traiteur' : t === 'giftcard' ? 'Cadeaubon' : 'Cadeaupakket'
  ).join(' + ');

  return (
    <div className="w-full">
      <section className="w-full pt-32 md:pt-40 pb-12 px-6 md:px-10 lg:px-16">
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">Afrekenen</span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">{t('ch_title')}</h1>
        {itemTypes.length > 0 && <p className="font-body text-sm text-muted-foreground mt-2">{cartLabels}</p>}
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">

          {/* Left: steps */}
          <div>
            {/* Step 1: contact info */}
            {step === 1 && (
              <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-heading text-xl font-bold text-foreground mb-6">Uw gegevens</h2>
                <div className="space-y-4">
                  <Input placeholder={t('ch_name')} value={form.name} onChange={e => set('name', e.target.value)} required className="bg-card border-border font-body" />
                  <Input type="email" placeholder={t('ch_email')} value={form.email} onChange={e => set('email', e.target.value)} required className="bg-card border-border font-body" />
                  <Input placeholder={t('ch_phone')} value={form.phone} onChange={e => set('phone', e.target.value)} className="bg-card border-border font-body" />
                  {cartMeta.takeaway?.pickupDate && (
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="font-body text-xs text-muted-foreground mb-1">Afhaal datum & tijd</p>
                      <p className="font-body text-sm font-medium text-foreground">{cartMeta.takeaway.pickupDate} om {cartMeta.takeaway.pickupTime}</p>
                    </div>
                  )}
                  <Button onClick={() => setStep(2)} disabled={!form.name || !form.email}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full py-3 h-auto">
                    Naar betaling <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Stripe Embedded Checkout */}
            {step === 3 && stripeClientSecret && stripeInstance && (
              <motion.div key="stripe" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-4 flex items-center gap-3">
                  <button onClick={() => { setStep(2); setStripeClientSecret(null); setStripeInstance(null); }}
                    className="font-body text-xs text-primary hover:underline flex items-center gap-1">
                    ← Terug
                  </button>
                  <h2 className="font-heading text-xl font-bold text-foreground">Betaalgegevens</h2>
                </div>
                <StripeEmbeddedCheckout stripe={stripeInstance} clientSecret={stripeClientSecret} />
              </motion.div>
            )}

            {/* Step 2: payment method + gift card */}
            {step === 2 && (
              <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />{t('ch_payment')}
                </h2>

                {/* Payment method selector */}
                <div className="space-y-3 mb-6">
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Betaalmethode</p>
                  <div className={`grid gap-3 ${isPickupOrder ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                    >
                      <CreditCard className="w-5 h-5 text-primary mb-2" />
                      <div className="font-heading text-sm font-semibold text-foreground">Online betalen</div>
                      <div className="font-body text-xs text-muted-foreground mt-0.5">Veilig via Stripe (kaart)</div>
                    </button>
                    {isPickupOrder && (
                      <button
                        onClick={() => setPaymentMethod('instore')}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'instore' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                      >
                        <Store className="w-5 h-5 text-primary mb-2" />
                        <div className="font-heading text-sm font-semibold text-foreground">Betalen bij locatie</div>
                        <div className="font-body text-xs text-muted-foreground mt-0.5">Cash of kaart in restaurant</div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Gift card field (always visible) */}
                <div className="mb-6 p-4 rounded-xl border border-border bg-card/50">
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-primary" /> Cadeaubon inwisselen
                  </p>
                  {appliedGc ? (
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div>
                        <p className="font-body text-xs font-medium text-foreground">{appliedGc.code}</p>
                        <p className="font-body text-xs text-primary">−€{discount.toFixed(2)} korting</p>
                      </div>
                      <button onClick={() => setAppliedGc(null)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="BOGEST-XXXX-XXXX"
                        value={gcCode}
                        onChange={e => setGcCode(e.target.value.toUpperCase())}
                        className="bg-background border-border font-body text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleApplyGiftCard()}
                      />
                      <Button onClick={handleApplyGiftCard} disabled={gcLoading || !gcCode.trim()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full px-4 h-auto py-2 whitespace-nowrap">
                        {gcLoading ? '...' : 'Toepassen'}
                      </Button>
                    </div>
                  )}
                  {gcError && <p className="font-body text-xs text-destructive mt-2">{gcError}</p>}
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="font-body text-xs tracking-widest uppercase rounded-full px-6 py-3 h-auto">
                    {t('btn_back')}
                  </Button>
                  {paymentMethod === 'online' ? (
                    <Button onClick={handlePayOnline} disabled={loading}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full py-3 h-auto">
                      {loading ? 'Verwerken...' : finalTotal > 0 ? `Betalen — €${finalTotal.toFixed(2)}` : 'Bevestigen (gratis)'}
                    </Button>
                  ) : (
                    <Button onClick={handlePayInStore}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs tracking-widest uppercase rounded-full py-3 h-auto">
                      Bestelling bevestigen
                    </Button>
                  )}
                </div>
                <div className="mt-6 p-4 rounded-xl border border-border bg-card/50">
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Betalingsmethode</p>
                  <p className="font-body text-sm text-foreground font-medium">{getPaymentMethodLabel()}</p>
                </div>

                {paymentMethod === 'online' && (
                  <p className="font-body text-[10px] text-muted-foreground mt-4 text-center">🔒 Beveiligde betaling met Stripe</p>
                )}
                {paymentMethod === 'instore' && (
                  <p className="font-body text-[10px] text-muted-foreground mt-4 text-center">💳 Betaling bij locatie • Cash of kaart</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Right: order summary */}
          <SectionReveal direction="right" delay={0.1} className="md:sticky md:top-32 md:self-start">
            <div className="bg-card border border-border rounded-xl p-5 md:p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-5">{t('ch_order_summary')}</h3>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="font-body text-xs text-muted-foreground w-6">{item.qty}×</span>
                    <span className="font-body text-sm text-foreground flex-1 truncate">{item.name}</span>
                    <span className="font-body text-sm font-medium text-foreground">€{(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id, item.itemType)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span>Subtotaal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-body text-sm text-primary">
                    <span>Cadeaubon korting</span>
                    <span>−€{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-body text-sm font-semibold">{t('ta_total')}</span>
                  <span className="font-heading text-xl font-bold text-primary">€{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}