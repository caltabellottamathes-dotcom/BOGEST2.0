import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const LOCATION_NAMES = {
  hasselt: 'Bogèst Hasselt',
  borgloon: 'Bogèst Borgloon',
  'heusden-zolder': 'Bogèst Heusden-Zolder',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, message, location } = await req.json();

    if (!name || !email || !message || !location) {
      return Response.json({ error: 'Name, email, message and location are required' }, { status: 400 });
    }

    if (!LOCATION_NAMES[location]) {
      return Response.json({ error: 'Invalid location' }, { status: 400 });
    }

    const locName = LOCATION_NAMES[location];

    // Store the contact request with location
    await base44.asServiceRole.entities.ContactRequest.create({
      name,
      email,
      message,
      subject: 'Contact aanvraag — ' + locName,
      location,
      status: 'new',
      seen: false,
    });

    // Send notification email to all admin users (they can forward to the correct location)
    const users = await base44.asServiceRole.entities.User.list();
    const admins = users.filter(u => u.role === 'admin' || u.role === 'user');

    const emailBody = `Nieuw contactformulier bericht\n\nVan: ${name}\nE-mail: ${email}\nVestiging: ${locName}\n\nBericht:\n${message}\n\n---\nDit bericht is verzonden via het contactformulier op de Bogèst website. Controleer het admin paneel voor meer details.`;

    const emailResults = await Promise.all(
      admins.map(admin =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: admin.email,
          from_name: 'Bogèst Website',
          subject: `Nieuw bericht van ${name} — ${locName}`,
          body: emailBody,
        }).catch(err => ({ error: err.message, email: admin.email }))
      )
    );

    return Response.json({ success: true, notified: admins.length, results: emailResults });
  } catch (error) {
    console.error('sendContactMessage error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});