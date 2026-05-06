// api/send-challenge.js
// Sends a trash talk challenge email via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const { to, message, score, won, gameIndex } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Build a clean HTML email
  const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:6px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 16px;border-bottom:1px solid #222;">
              <div style="font-family:Georgia,serif;font-style:italic;font-size:32px;color:#c8a96e;margin-bottom:4px;">Dwindle</div>
              <div style="font-size:10px;letter-spacing:0.3em;color:#3a3a3a;text-transform:uppercase;">Daily Photo Challenge</div>
            </td>
          </tr>

          <!-- Trash talk message -->
          <tr>
            <td style="padding:28px 32px;">
              <div style="font-size:15px;color:#d4cfc7;line-height:1.7;letter-spacing:0.02em;">
                ${message.replace(/\n\n.*$/, '')}
              </div>
            </td>
          </tr>

          <!-- Score badge -->
          <tr>
            <td style="padding:0 32px 28px;">
              <div style="background:#0a0a0a;border:1px solid #222;border-radius:4px;padding:16px;text-align:center;">
                <div style="font-size:9px;letter-spacing:0.3em;color:#3a3a3a;text-transform:uppercase;margin-bottom:6px;">${won ? 'Score to beat' : 'Can you do better?'}</div>
                <div style="font-size:36px;color:#c8a96e;font-family:Georgia,serif;">${score} <span style="font-size:14px;color:#3a3a3a;">clicks</span></div>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 32px 32px;">
              <a href="${message.match(/https?:\/\/[^\s]+/)?.[0] || 'https://playdwindle.com'}" 
                 style="display:block;background:#c8a96e;color:#0a0a0a;text-decoration:none;text-align:center;padding:14px;border-radius:4px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-family:'Courier New',monospace;">
                Accept the Challenge →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #222;">
              <div style="font-size:9px;letter-spacing:0.2em;color:#222;text-transform:uppercase;text-align:center;">
                Dwindle · Reveal the photo · Beat the score
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Dwindle <onboarding@resend.dev>',
        to: [to],
        subject: '🎯 Dwindle Challenge — think you can beat me?',
        html: htmlEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Resend API error');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error('Send challenge error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
