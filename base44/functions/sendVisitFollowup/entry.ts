import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Service role: this runs as an entity automation on Reservation update,
    // not in a user session
    const entities = base44.asServiceRole.entities;

    const payload = await req.json().catch(() => ({}));
    const { event, data, old_data, changed_fields } = payload;

    // Only fire when reservation status changes to "completed"
    if (event?.type !== 'update') {
      return Response.json({ skipped: 'not an update event' });
    }

    if (!changed_fields?.includes('status')) {
      return Response.json({ skipped: 'status not changed' });
    }

    if (data?.status !== 'completed') {
      return Response.json({ skipped: `status is ${data?.status}, not completed` });
    }

    // Reservation must have an email to send follow-up
    if (!data?.email) {
      return Response.json({ skipped: 'no email on reservation' });
    }

    // Only send follow-up once — check old_data to ensure this is a fresh transition
    if (old_data?.status === 'completed') {
      return Response.json({ skipped: 'already completed before' });
    }

    const locationName = {
      hasselt: 'Hasselt',
      borgloon: 'Borgloon',
      'heusden-zolder': 'Heusden-Zolder'
    }[data?.location] || data?.location || 'Bogèst';

    // Build follow-up email
    const lang = data?.notes?.toLowerCase?.().includes('fr') ? 'fr' : 'nl';
    const isFrench = lang === 'fr';

    const subject = isFrench
      ? `Merci pour votre visite chez Bogèst ${locationName} !`
      : `Bedankt voor uw bezoek aan Bogèst ${locationName}!`;

    const body = isFrench
      ? `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2a2017;">
        <h1 style="font-family: 'Playfair Display', serif; color: #b8911e; font-size: 28px;">Merci ${data?.name || ''} !</h1>
        <p>Nous espérons que vous avez passé un excellent moment chez Bogèst ${locationName}.</p>
        <p>Votre avis nous est très précieux. Si vous avez quelques minutes, nous serions ravis de vous lire sur Instagram ou Google.</p>
        <p>À très bientôt,</p>
        <p style="font-family: 'Playfair Display', serif; font-size: 20px; color: #b8911e;">L'équipe Bogèst</p>
      </div>`
      : `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #2a2017;">
        <h1 style="font-family: 'Playfair Display', serif; color: #b8911e; font-size: 28px;">Bedankt ${data?.name || ''}!</h1>
        <p>We hopen dat u een heerlijk moment hebt gehad bij Bogèst ${locationName}.</p>
        <p>Uw mening betekent veel voor ons. Als u even tijd hebt, horen we graag van u op Instagram of Google.</p>
        <p>Tot snel,</p>
        <p style="font-family: 'Playfair Display', serif; font-size: 20px; color: #b8911e;">Het Bogèst-team</p>
      </div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: data.email,
      subject,
      body
    });

    return Response.json({ success: true, sent_to: data.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});