import Stripe from 'npm:stripe@17.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

// Deducts a gift card balance, but ONLY against a verified, paid Stripe
// checkout session whose metadata references this exact card. The deduction
// amount is capped at the discount actually applied to that session, and a
// session can only deduct once (idempotent via deducted_session_id). This
// prevents unauthenticated callers from depleting arbitrary gift cards.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { cardId, amount, stripeSessionId } = await req.json();

    if (!cardId || !stripeSessionId) {
      return Response.json({ error: 'Missing cardId or stripeSessionId' }, { status: 400 });
    }

    // Verify the Stripe checkout session was paid and references this card.
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const paid = session && (session.status === 'paid' || session.status === 'complete') && session.payment_status === 'paid';
    if (!paid) {
      return Response.json({ error: 'Payment not verified' }, { status: 403 });
    }
    if (String(session.metadata?.gift_card_id || '') !== String(cardId)) {
      return Response.json({ error: 'Gift card does not match this payment' }, { status: 403 });
    }

    // Cap the deduction at the discount actually applied to this session.
    const verifiedAmount = Math.max(0, parseFloat(session.metadata?.gift_card_discount || '0'));
    const deductAmount = Math.min(verifiedAmount, Number(amount) || 0);
    if (deductAmount <= 0) {
      return Response.json({ success: true, newBalance: null, skipped: true });
    }

    const cards = await base44.asServiceRole.entities.GiftCard.filter({ id: cardId });
    if (!cards || cards.length === 0) {
      return Response.json({ error: 'Gift card not found' }, { status: 404 });
    }
    const card = cards[0];

    // Idempotency — a given checkout session can only deduct a card once.
    if (card.deducted_session_id === stripeSessionId) {
      return Response.json({ success: true, newBalance: card.balance, newStatus: card.status, alreadyProcessed: true });
    }

    const newBalance = Math.max(0, card.balance - deductAmount);
    const newStatus = newBalance <= 0 ? 'spent' : 'partially_used';

    await base44.asServiceRole.entities.GiftCard.update(card.id, {
      balance: newBalance,
      status: newStatus,
      deducted_session_id: stripeSessionId,
    });

    return Response.json({ success: true, newBalance, newStatus });
  } catch (error) {
    console.error('deductGiftCard error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});