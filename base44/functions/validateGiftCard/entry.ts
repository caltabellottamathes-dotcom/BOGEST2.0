import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code, amountToRedeem } = await req.json();

    if (!code) {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }

    const cards = await base44.asServiceRole.entities.GiftCard.filter({ code: code.trim().toUpperCase() });

    if (!cards || cards.length === 0) {
      return Response.json({ valid: false, error: 'Cadeaubon code niet gevonden.' });
    }

    const card = cards[0];

    if (card.status === 'void' || card.status === 'expired') {
      return Response.json({ valid: false, error: 'Deze cadeaubon is niet meer geldig.' });
    }

    if (card.balance <= 0 || card.status === 'spent') {
      return Response.json({ valid: false, error: 'Deze cadeaubon is volledig opgebruikt.' });
    }

    const redeemable = Math.min(card.balance, amountToRedeem || card.balance);

    return Response.json({
      valid: true,
      code: card.code,
      balance: card.balance,
      amount: card.amount,
      redeemable,
      recipient: card.recipient_name || '',
      cardId: card.id,
    });
  } catch (error) {
    console.error('validateGiftCard error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});