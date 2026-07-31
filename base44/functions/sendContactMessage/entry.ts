import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { resolveLocationSlug, locationEmail, locationName } from '../../shared/locationEmails.ts';

// Handles three website form types (contact / job application / group request).
// The visitor never chooses an e-mail address — the correct vestiging address
// is derived automatically from the location (or job location) they selected.
// Every submission is also stored as a ContactRequest so the admin always has
// a record, even if the e-mail itself cannot be delivered.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { type = 'contact', name, email, phone, message, location, jobTitle, guests, date } = body;

    if (!name || !email || !location) {
      return Response.json({ error: 'Name, email and location are required' }, { status: 400 });
    }

    const slug = resolveLocationSlug(location);
    const to = locationEmail(slug);
    if (!to) {
      return Response.json({ error: 'No e-mail address known for this location' }, { status: 400 });
    }
    const locName = locationName(slug);

    let subject: string;
    let bodyText: string;

    if (type === 'job') {
      subject = `Nieuwe sollicitatie — ${jobTitle || 'Vacature'} — ${locName}`;
      bodyText = `Nieuwe sollicitatie via de website\n\nFunctie: ${jobTitle || '-'}\nVestiging: ${locName}\n\nNaam: ${name}\nE-mail: ${email}\nTelefoon: ${phone || '-'}\n\nMotivatie:\n${message || ''}\n\n---\nVerzonden via de sollicitatiepagina op de Bogèst website.`;
    } else if (type === 'group') {
      subject = `Nieuwe groepsaanvraag — ${locName}`;
      bodyText = `Nieuwe groepsaanvraag via de website\n\nVestiging: ${locName}\nAantal gasten: ${guests || '-'}\nGewenste datum: ${date || '-'}\n\nNaam: ${name}\nE-mail: ${email}\nTelefoon: ${phone || '-'}\n\nOpmerkingen:\n${message || ''}\n\n---\nVerzonden via de groepenpagina op de Bogèst website.`;
    } else {
      if (!message) return Response.json({ error: 'Message is required' }, { status: 400 });
      subject = `Nieuw bericht van ${name} — ${locName}`;
      bodyText = `Nieuw contactformulier bericht\n\nVan: ${name}\nE-mail: ${email}\nVestiging: ${locName}\n\nBericht:\n${message}\n\n---\nDit bericht is verzonden via het contactformulier op de Bogèst website.`;
    }

    // Always keep a record for the admin panel.
    await base44.asServiceRole.entities.ContactRequest.create({
      name,
      email,
      message: message || '',
      subject,
      location: slug,
      status: 'new',
      seen: false,
    });

    // Send to the correct location's e-mail address (registered users only —
    // see the SendEmail integration note). Failures here do not fail the
    // request: the record above is already stored.
    const emailResult = await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      from_name: 'Bogèst Website',
      subject,
      body: bodyText,
    }).catch((err: any) => ({ error: err?.message || String(err) }));

    return Response.json({ success: true, location: slug, sentTo: to, emailResult });
  } catch (error) {
    console.error('sendContactMessage error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});