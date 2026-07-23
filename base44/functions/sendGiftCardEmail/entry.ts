import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `BOGEST-${seg()}-${seg()}`;
}

function buildEmailHtml({ recipientName, senderName, message, amount, code }) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Uw Bogèst Cadeaubon</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f3ee;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ee;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#3d4a28;padding:40px 40px 32px;text-align:center;">
              <div style="font-family:'Georgia',serif;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:8px;">Grill Restaurant</div>
              <div style="font-family:'Georgia',serif;font-size:36px;font-weight:700;color:#ffffff;letter-spacing:2px;">BOG<em>È</em>ST</div>
              <div style="width:40px;height:2px;background:rgba(255,255,255,0.3);margin:16px auto 0;"></div>
            </td>
          </tr>

          <!-- Card visual -->
          <tr>
            <td style="background:linear-gradient(135deg,#3d4a28 0%,#5a6b3a 100%);padding:32px 40px;text-align:center;">
              <div style="font-family:'Georgia',serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:6px;">Cadeaubon</div>
              <div style="font-family:'Georgia',serif;font-size:56px;font-weight:800;color:#ffffff;line-height:1;">€${amount}</div>
              <div style="margin-top:20px;display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:8px;padding:10px 24px;">
                <span style="font-family:'Courier New',monospace;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:3px;">${code}</span>
              </div>
              <div style="font-family:'Georgia',serif;font-size:11px;color:rgba(255,255,255,0.5);margin-top:10px;letter-spacing:2px;">BEWAAR DEZE CODE</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0 0 8px;font-family:'Georgia',serif;font-size:20px;font-weight:700;color:#1a1a14;">Beste ${recipientName},</p>
              <p style="margin:0;font-family:'Georgia',serif;font-size:15px;color:#666;line-height:1.7;">
                ${senderName} heeft jou een Bogèst cadeaubon geschonken ter waarde van <strong style="color:#3d4a28;">€${amount}</strong>.
              </p>
            </td>
          </tr>

          ${message ? `
          <!-- Personal message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <div style="background:#f8f7f3;border-left:3px solid #3d4a28;border-radius:0 8px 8px 0;padding:16px 20px;">
                <div style="font-family:'Georgia',serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#3d4a28;margin-bottom:8px;">Persoonlijk bericht</div>
                <p style="margin:0;font-family:'Georgia',serif;font-size:15px;color:#444;line-height:1.7;font-style:italic;">"${message}"</p>
                <p style="margin:12px 0 0;font-family:'Georgia',serif;font-size:13px;color:#888;">— ${senderName}</p>
              </div>
            </td>
          </tr>` : ''}

          <!-- How to use -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 16px;font-family:'Georgia',serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1a1a14;">Hoe te gebruiken</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 10px;">
                    <div style="display:flex;align-items:flex-start;gap:12px;">
                      <span style="display:inline-block;width:22px;height:22px;background:#3d4a28;border-radius:50%;text-align:center;line-height:22px;font-family:'Georgia',serif;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">1</span>
                      <span style="font-family:'Georgia',serif;font-size:14px;color:#555;line-height:22px;padding-left:10px;">Ga naar <a href="https://bogest.base44.app/takeaway" style="color:#3d4a28;">bogest.base44.app</a> en voeg producten toe aan uw winkelmandje.</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 10px;">
                    <div style="display:flex;align-items:flex-start;gap:12px;">
                      <span style="display:inline-block;width:22px;height:22px;background:#3d4a28;border-radius:50%;text-align:center;line-height:22px;font-family:'Georgia',serif;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">2</span>
                      <span style="font-family:'Georgia',serif;font-size:14px;color:#555;line-height:22px;padding-left:10px;">Ga naar de afrekenpagina en voer uw cadeauboncode in bij "Cadeaubon inwisselen".</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="display:flex;align-items:flex-start;gap:12px;">
                      <span style="display:inline-block;width:22px;height:22px;background:#3d4a28;border-radius:50%;text-align:center;line-height:22px;font-family:'Georgia',serif;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">3</span>
                      <span style="font-family:'Georgia',serif;font-size:14px;color:#555;line-height:22px;padding-left:10px;">Het tegoed wordt automatisch afgetrokken van uw totaal. Geniet ervan!</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Locations -->
          <tr>
            <td style="padding:28px 40px 0;">
              <div style="background:#f8f7f3;border-radius:8px;padding:16px 20px;">
                <p style="margin:0 0 10px;font-family:'Georgia',serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#3d4a28;font-weight:700;">Onze vestigingen</p>
                <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:13px;color:#555;">📍 <strong>Hasselt</strong> — Luikersteenweg 137, 3500 Hasselt</p>
                <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:13px;color:#555;">📍 <strong>Borgloon</strong> — Groot Begijnhof 2-4, 3840 Borgloon</p>
                <p style="margin:0;font-family:'Georgia',serif;font-size:13px;color:#555;">📍 <strong>Heusden-Zolder</strong> — Molenstraat 59, 3550 Heusden-Zolder</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px 40px;text-align:center;border-top:1px solid #ede9e1;margin-top:28px;">
              <div style="margin-top:0;font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#3d4a28;letter-spacing:1px;">BOG<em>È</em>ST</div>
              <p style="margin:6px 0 0;font-family:'Georgia',serif;font-size:12px;color:#aaa;letter-spacing:1px;">Grill Restaurant — Limburg</p>
              <p style="margin:16px 0 0;font-family:'Georgia',serif;font-size:11px;color:#bbb;">Deze cadeaubon heeft geen vervaldatum en is niet inwisselbaar voor geld.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { recipientName, recipientEmail, senderName, message, amount, cardType } = await req.json();

    if (!recipientEmail || !recipientName || !senderName || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a unique code
    const code = generateCode();

    // Save the gift card to the database
    const giftCard = await base44.asServiceRole.entities.GiftCard.create({
      code,
      amount: parseFloat(amount),
      balance: parseFloat(amount),
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      sender_name: senderName,
      message: message || '',
      type: cardType || 'digital',
      status: 'active',
    });

    // Send the email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: recipientEmail,
      from_name: 'Bogèst Grill Restaurant',
      subject: `${senderName} heeft jou een Bogèst cadeaubon gestuurd 🎁`,
      body: buildEmailHtml({ recipientName, senderName, message, amount, code }),
    });

    console.log(`Gift card email sent to ${recipientEmail} with code ${code}`);

    return Response.json({ success: true, code, cardId: giftCard.id });
  } catch (error) {
    console.error('sendGiftCardEmail error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});