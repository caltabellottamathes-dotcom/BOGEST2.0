import Stripe from 'npm:stripe@17.5.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { items, total, email, name, phone, cartMeta, giftCardCode, giftCardId, giftCardDiscount, giftCardItem } = await req.json();

    if (!items || items.length === 0 || !email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Map items to Stripe line items
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const appliedDiscount = parseFloat(giftCardDiscount) || 0;

    // Build discounts array using a Stripe coupon if gift card is applied
    let discounts = [];
    if (appliedDiscount > 0 && giftCardCode) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(appliedDiscount * 100),
        currency: 'eur',
        name: `Cadeaubon ${giftCardCode}`,
        max_redemptions: 1,
        duration: 'once',
      });
      discounts = [{ coupon: coupon.id }];
    }

    // Pickup info from cartMeta
    const pickupInfo = cartMeta?.takeaway
      ? `${cartMeta.takeaway.location || ''} — ${cartMeta.takeaway.pickupDate || ''} ${cartMeta.takeaway.pickupTime || ''}`
      : (cartMeta?.giftpackage?.location || '');

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://bogest.base44.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: `${origin}/checkout?success=true&gcId=${giftCardId || ''}&gcDiscount=${appliedDiscount}`,
      customer_email: email,
      line_items: lineItems,
      ...(discounts.length > 0 ? { discounts } : {}),
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        customer_name: name || '',
        customer_phone: phone || '',
        pickup_info: pickupInfo,
        gift_card_code: giftCardCode || '',
        gift_card_discount: String(appliedDiscount),
        gift_card_id: giftCardId || '',
      },
    });

    return Response.json({
      sessionId: session.id,
      clientSecret: session.client_secret,
      publishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY'),
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});