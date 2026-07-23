import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { cardId, amount } = await req.json();

    if (!cardId || !amount) {
      return Response.json({ error: 'Missing cardId or amount' }, { status: 400 });
    }

    const cards = await base44.asServiceRole.entities.GiftCard.filter({ id: cardId });
    if (!cards || cards.length === 0) {
      return Response.json({ error: 'Gift card not found' }, { status: 404 });
    }

    const card = cards[0];
    const newBalance = Math.max(0, card.balance - amount);
    const newStatus = newBalance <= 0 ? 'spent' : 'partially_used';

    await base44.asServiceRole.entities.GiftCard.update(card.id, {
      balance: newBalance,
      status: newStatus,
    });

    return Response.json({ success: true, newBalance, newStatus });
  } catch (error) {
    console.error('deductGiftCard error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});