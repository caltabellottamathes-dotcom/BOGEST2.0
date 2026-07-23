import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { query } = await req.json();

    if (!query || !query.trim()) {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    const q = query.trim().toLowerCase();

    // Search gift cards by sender email, sender phone, or recipient email
    const allCards = await base44.asServiceRole.entities.GiftCard.list();
    
    const found = allCards.find(card => {
      const senderName = (card.sender_name || '').toLowerCase();
      const recipientEmail = (card.recipient_email || '').toLowerCase();
      const notes = (card.notes || '').toLowerCase();
      
      // Match email exactly or phone pattern
      const isEmailMatch = recipientEmail.includes(q) || senderName.includes(q);
      const isPhoneMatch = q.length >= 6 && notes.includes(q); // Phone might be in notes
      
      return isEmailMatch || isPhoneMatch;
    });

    if (found) {
      return Response.json({
        found: true,
        card: {
          code: found.code,
          amount: found.amount,
          balance: found.balance,
          status: found.status,
          sender_name: found.sender_name,
          recipient_name: found.recipient_name,
          message: found.message,
        },
      });
    }

    return Response.json({
      found: false,
      error: 'Cadeaubon niet gevonden. Controleer uw e-mailadres en probeer opnieuw.',
    });
  } catch (error) {
    console.error('searchGiftCard error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});