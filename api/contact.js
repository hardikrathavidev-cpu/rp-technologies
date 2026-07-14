/**
 * Vercel serverless contact API — same-origin (no CORS).
 * Set these in Vercel → Settings → Environment Variables:
 *   GMAIL_USER, GMAIL_APP_PASS, MAIL_TO, RECAPTCHA_SECRET
 */
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS || '';
const MAIL_TO = process.env.MAIL_TO || GMAIL_USER;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || '';

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return Object.fromEntries(new URLSearchParams(req.body));
    }
  }
  return {};
}

async function verifyRecaptcha(token, ip) {
  if (!RECAPTCHA_SECRET) return { ok: false, message: 'reCAPTCHA not configured on server' };
  if (!token) return { ok: false, message: 'Please complete the reCAPTCHA' };

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: token,
      remoteip: ip || '',
    }),
  });
  const data = await res.json();
  if (!data.success) return { ok: false, message: 'reCAPTCHA verification failed. Please try again.' };
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const data = readBody(req);
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const type = String(data.type || 'Not specified').trim();
    const message = String(data.message || '').trim();
    const recaptchaToken = String(data.recaptchaToken || '').trim();

    if (!name || !email || !message) {
      res.status(422).json({ success: false, message: 'Name, email and message are required' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      res.status(422).json({ success: false, message: 'Invalid email address' });
      return;
    }
    if (message.length < 10) {
      res.status(422).json({ success: false, message: 'Message too short' });
      return;
    }

    const captcha = await verifyRecaptcha(recaptchaToken, req.headers['x-forwarded-for']);
    if (!captcha.ok) {
      res.status(422).json({ success: false, message: captcha.message });
      return;
    }

    if (!GMAIL_USER || !GMAIL_APP_PASS) {
      res.status(500).json({
        success: false,
        message: 'Mail not configured. Add GMAIL_USER and GMAIL_APP_PASS in Vercel env.',
      });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
    });

    await transporter.sendMail({
      from: `"RP Technologies Website" <${GMAIL_USER}>`,
      to: MAIL_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `New Enquiry from ${name} — RP Technologies`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;background:#0A0A0F;padding:24px;border-radius:16px;max-width:580px;margin:auto;color:#E8E8F0">
          <div style="border-bottom:1px solid #2A2A3A;padding-bottom:16px;margin-bottom:20px">
            <span style="font-size:20px;font-weight:800;color:#fff">RP <span style="color:#00D4FF">Technologies</span></span>
          </div>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project:</strong> ${type}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;background:#1A1A24;padding:14px;border-radius:10px;border:1px solid #2A2A3A">${message}</pre>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"RP Technologies" <${GMAIL_USER}>`,
      to: `"${name}" <${email}>`,
      subject: 'We received your enquiry — RP Technologies',
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto">
          <h2>Thanks for reaching out, ${name}!</h2>
          <p>We've received your enquiry and will reply within 24 hours on business days.</p>
          <p><strong>Project type:</strong> ${type}</p>
          <p>— The RP Technologies Team</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('[contact]', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try WhatsApp or email us directly.',
    });
  }
}
