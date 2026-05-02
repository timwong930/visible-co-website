const { Resend } = require('resend');

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

function buildHtml({ businessName, text }) {
  const safeBusiness = businessName ? escapeHtml(businessName) : 'there';
  const safeText = escapeHtml(text || '');

  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#0f172a;background:#f8fafc;padding:24px">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px;border:1px solid #e2e8f0">
        <p style="margin:0 0 16px;font-size:16px;color:#0f172a">Hi ${safeBusiness},</p>
        <div style="font-size:16px;color:#334155">${safeText || ' '} </div>
      </div>
    </div>`;
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.OUTREACH_FROM_EMAIL;
  const fromName = process.env.OUTREACH_FROM_NAME || 'Made Visibly';

  if (!apiKey || !fromEmail) {
    return res.status(500).json({
      error: 'Missing Resend environment variables: RESEND_API_KEY and OUTREACH_FROM_EMAIL.',
    });
  }

  const { to, subject, text, html, replyTo, businessName } = req.body || {};

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({
      error: 'Missing required fields: to, subject, and text or html.',
    });
  }

  const resend = new Resend(apiKey);
  const payload = {
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    ...(html ? { html } : { html: buildHtml({ businessName, text }) }),
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  };

  try {
    const result = await resend.emails.send(payload);
    return res.status(200).json({ success: true, id: result.data?.id || null });
  } catch (error) {
    console.error('Resend API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to send email with Resend.',
    });
  }
};
