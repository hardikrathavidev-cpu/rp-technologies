/**
 * RP Technologies — Local Mail Test Server
 * Run this alongside `npm run dev` to test the contact form with real Gmail SMTP.
 *
 * HOW TO USE:
 * 1. Fill in your Gmail address and App Password below
 * 2. Open TWO terminals:
 *      Terminal 1: node mail-server.js
 *      Terminal 2: npm run dev
 * 3. Open http://localhost:5173 → fill the form → click Send
 * 4. Check your Gmail inbox
 *
 * GET A GMAIL APP PASSWORD (free, 2 min):
 *   → myaccount.google.com → Security → App Passwords
 *   → Create → name it "RP Tech" → copy 16-char password (remove spaces)
 */

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

/* ── YOUR CREDENTIALS ─────────────────────────────────── */
const GMAIL_USER = 'YOUR_GMAIL@gmail.com';   // ← your Gmail address
const GMAIL_APP_PASS = 'YOUR_16_CHAR_APP_PASSWORD';        // ← 16-char App Password, no spaces
const MAIL_TO = 'YOUR_INBOX@gmail.com';   // ← where enquiries land (can be same)
const RECAPTCHA_SECRET = 'YOUR_RECAPTCHA_SECRET_KEY';
/* ───────────────────────────────────────────────────── */

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.json());

/* ── Gmail SMTP transporter ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASS,
  },
});

/* ── Verify connection on startup ── */
transporter.verify((err) => {
  if (err) {
    console.error('\n❌  Gmail SMTP connection FAILED:');
    console.error('   ', err.message);
    console.error('\n   ► Check GMAIL_USER and GMAIL_APP_PASS in mail-server.js\n');
  } else {
    console.log('\n✅  Gmail SMTP connected successfully!');
    console.log(`   Sending FROM: ${GMAIL_USER}`);
    console.log(`   Enquiries TO: ${MAIL_TO}`);
    console.log(`\n🚀  Mail server running on http://localhost:${PORT}`);
    console.log('   Start Vite:   npm run dev\n');
  }
});

/* ── POST /contact.php  (Vite proxies this from localhost:5173) ── */
app.post('/contact.php', async (req, res) => {
  const { name, email, type = 'Not specified', message, recaptchaToken } = req.body ?? {};

  /* Basic validation */
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(422).json({ success: false, message: 'Name, email and message required.' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(422).json({ success: false, message: 'Invalid email address.' });
  }
  if (!recaptchaToken) {
    return res.status(422).json({ success: false, message: 'Please complete the reCAPTCHA' });
  }

  try {
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: recaptchaToken,
      }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return res.status(422).json({
        success: false,
        message: 'reCAPTCHA verification failed. Please try again.',
      });
    }
  } catch (err) {
    console.error('❌  reCAPTCHA verify failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Could not verify reCAPTCHA. Try again.',
    });
  }

  try {
    /* ── 1. Notification email to YOU ── */
    await transporter.sendMail({
      from: `"RP Technologies Website" <${GMAIL_USER}>`,
      to: MAIL_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `New Enquiry from ${name} — RP Technologies`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:#0A0A0F;padding:24px;border-radius:16px;max-width:580px;margin:auto">
          <div style="border-bottom:1px solid #2A2A3A;padding-bottom:16px;margin-bottom:20px">
            <span style="font-size:20px;font-weight:800;color:#fff">RP <span style="color:#00D4FF">Technologies</span></span>
            <span style="display:inline-block;background:rgba(0,212,255,.12);color:#00D4FF;border:1px solid rgba(0,212,255,.25);font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;margin-left:10px">New Enquiry</span>
          </div>
          <table style="width:100%;border-collapse:collapse">
            ${[
          ['Name', name],
          ['Email', `<a href="mailto:${email}" style="color:#00D4FF">${email}</a>`],
          ['Project', type],
        ].map(([label, val]) => `
              <tr>
                <td style="color:#9090A8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:6px 0 2px">${label}</td>
              </tr>
              <tr>
                <td style="background:#1A1A24;color:#E8E8F0;border:1px solid #2A2A3A;border-radius:8px;padding:10px 14px;font-size:14px;margin-bottom:12px;display:block">${val}</td>
              </tr>
              <tr><td style="height:10px"></td></tr>
            `).join('')}
            <tr>
              <td style="color:#9090A8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:6px 0 2px">Message</td>
            </tr>
            <tr>
              <td style="background:#1A1A24;color:#E8E8F0;border:1px solid #2A2A3A;border-radius:8px;padding:14px;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</td>
            </tr>
          </table>
          <div style="margin-top:20px">
            <a href="mailto:${email}?subject=Re: Your enquiry — RP Technologies"
               style="background:#00D4FF;color:#0A0A0F;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none;display:inline-block">
              Reply to ${name} →
            </a>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #2A2A3A;color:#9090A8;font-size:11px">
            Sent from the contact form at rptechnologies.in
          </div>
        </div>
      `,
    });

    /* ── 2. Auto-reply to sender ── */
    await transporter.sendMail({
      from: `"RP Technologies" <${GMAIL_USER}>`,
      to: `"${name}" <${email}>`,
      subject: `We received your enquiry — RP Technologies`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:auto;background:#fff;border:1px solid #e0e0ec;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#0A0A0F,#13131A);padding:28px 32px">
            <span style="font-size:20px;font-weight:800;color:#fff">RP <span style="color:#00D4FF">Technologies</span></span>
          </div>
          <div style="padding:28px 32px">
            <h2 style="font-size:22px;font-weight:700;color:#1a1a2e;margin:0 0 12px">Thanks for reaching out, ${name}! 👋</h2>
            <p style="color:#4a4a6a;font-size:15px;line-height:1.7;margin:0 0 16px">
              We've received your enquiry and our team will review it shortly.
              You can expect a response within <strong>24 hours</strong> on business days.
            </p>
            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:14px 18px;font-size:14px;color:#0369a1;margin:16px 0">
              <strong>Project type:</strong> ${type}<br>
              <strong>We'll reply to:</strong> ${email}
            </div>
            <p style="color:#4a4a6a;font-size:14px;line-height:1.7;margin:0 0 16px">
              For urgent queries, feel free to WhatsApp us directly.
            </p>
            <p style="color:#9090A8;font-size:13px;margin:0">— The RP Technologies Team</p>
          </div>
          <div style="padding:16px 32px;background:#f4f4f8;border-top:1px solid #e0e0ec;font-size:12px;color:#6b6b85;text-align:center">
            © 2025 RP Technologies · rptechnologies.in
          </div>
        </div>
      `,
    });

    console.log(`✉️  Email sent: ${name} <${email}> — ${type}`);
    return res.json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('❌  Send failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Check terminal for details.',
    });
  }
});

app.listen(PORT, () => { });
