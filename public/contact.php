<?php
/**
 * RP Technologies — Contact Form Handler
 * Uses Gmail SMTP with App Password (FREE, ~500 emails/day, no library needed)
 *
 * SETUP (5 minutes):
 * 1. Enable 2-Step Verification on your Google account:
 *    → myaccount.google.com → Security → 2-Step Verification
 *
 * 2. Create an App Password:
 *    → myaccount.google.com → Security → App Passwords
 *    → Select app: "Mail" | Select device: "Other" → name it "RP Tech Website"
 *    → Google gives you a 16-character password like: abcd efgh ijkl mnop
 *    → Remove spaces, use it below
 *
 * 3. Fill in YOUR_* values below
 *
 * 4. This file is automatically included in /dist when you run npm run build
 *    Just upload the entire /dist folder to cPanel public_html/ via FTP
 */

/* ── YOUR CONFIGURATION ──────────────────────────────── */
define('SMTP_HOST',     'smtp.gmail.com');
define('SMTP_PORT',     465);                           // SSL port (always works on cPanel)
define('SMTP_USER',     'YOUR_GMAIL@gmail.com');        // Your full Gmail address
define('SMTP_PASS',     'YOUR_16_CHAR_APP_PASSWORD');  // 16-char App Password (no spaces)
define('MAIL_TO',       'YOUR_INBOX@gmail.com');        // Where you receive enquiries
define('MAIL_FROM_NAME','RP Technologies Website');
define('SITE_NAME',     'RP Technologies');
define('RECAPTCHA_SECRET', 'YOUR_RECAPTCHA_SECRET_KEY');
/* ───────────────────────────────────────────────────── */

/* ── CORS: allow site + free hosts calling this PHP API ── */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedExact = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rptechnologies.in',
    'https://www.rptechnologies.in',
];
$allowedSuffix = [
    '.netlify.app',
    '.vercel.app',
    '.pages.dev',
];

$allowOrigin = false;
if ($origin !== '') {
    if (in_array($origin, $allowedExact, true) || str_contains($origin, 'localhost')) {
        $allowOrigin = true;
    } else {
        $host = parse_url($origin, PHP_URL_HOST) ?? '';
        foreach ($allowedSuffix as $suffix) {
            if ($host !== '' && str_ends_with($host, $suffix)) {
                $allowOrigin = true;
                break;
            }
        }
    }
}

if ($allowOrigin) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
} else {
    // Same-origin uploads (site + contact.php on same PHP host) need no CORS
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

/* Pre-flight OPTIONS request */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* Only accept POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

/* ── Parse JSON body ── */
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

/* ── Sanitise inputs ── */
$name     = trim(htmlspecialchars($data['name']    ?? '', ENT_QUOTES));
$email    = trim(filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL));
$type     = trim(htmlspecialchars($data['type']    ?? 'Not specified', ENT_QUOTES));
$message  = trim(htmlspecialchars($data['message'] ?? '', ENT_QUOTES));
$recaptchaToken = trim($data['recaptchaToken'] ?? '');

/* ── Verify reCAPTCHA ── */
if (!$recaptchaToken) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please complete the reCAPTCHA']);
    exit;
}
$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
$verifyPayload = http_build_query([
    'secret'   => RECAPTCHA_SECRET,
    'response' => $recaptchaToken,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);
$verifyCtx = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $verifyPayload,
        'timeout' => 10,
    ],
]);
$verifyRaw = @file_get_contents($verifyUrl, false, $verifyCtx);
$verifyResult = $verifyRaw ? json_decode($verifyRaw, true) : null;
if (!$verifyResult || empty($verifyResult['success'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
    exit;
}

/* ── Validate ── */
if (!$name || !$email || !$message) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Name, email and message are required']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}
if (strlen($message) < 10) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Message too short']);
    exit;
}

/* ── Build HTML email body ── */
$emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0F; color: #E8E8F0; margin:0; padding:0; }
    .wrap { max-width:580px; margin:30px auto; background:#13131A; border:1px solid #2A2A3A; border-radius:16px; overflow:hidden; }
    .header { background: linear-gradient(135deg, #0A0A0F 0%, #13131A 100%); padding:28px 32px; border-bottom:1px solid #2A2A3A; }
    .logo { font-size:20px; font-weight:800; color:#fff; letter-spacing:-0.03em; }
    .logo span { color:#00D4FF; }
    .badge { display:inline-block; background:rgba(0,212,255,0.12); color:#00D4FF; border:1px solid rgba(0,212,255,0.25); font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; margin-top:8px; }
    .body { padding:28px 32px; }
    .field { margin-bottom:18px; }
    .label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:#9090A8; margin-bottom:6px; }
    .value { font-size:15px; color:#E8E8F0; background:#1A1A24; border:1px solid #2A2A3A; border-radius:10px; padding:12px 16px; }
    .message-box { font-size:14px; color:#E8E8F0; background:#1A1A24; border:1px solid #2A2A3A; border-radius:10px; padding:16px; line-height:1.7; white-space:pre-wrap; }
    .reply-btn { display:inline-block; background:#00D4FF; color:#0A0A0F; font-weight:700; font-size:14px; padding:13px 28px; border-radius:12px; text-decoration:none; margin-top:8px; }
    .footer { padding:20px 32px; background:#0A0A0F; border-top:1px solid #2A2A3A; font-size:12px; color:#9090A8; text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">RP <span>Technologies</span></div>
      <div class="badge">New Project Enquiry</div>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">From</div>
        <div class="value">{$name} &lt;{$email}&gt;</div>
      </div>
      <div class="field">
        <div class="label">Project Type</div>
        <div class="value">{$type}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">{$message}</div>
      </div>
      <a href="mailto:{$email}?subject=Re: Your enquiry — RP Technologies" class="reply-btn">
        Reply to {$name} →
      </a>
    </div>
    <div class="footer">
      Sent from the contact form at <strong>rptechnologies.in</strong>
    </div>
  </div>
</body>
</html>
HTML;

/* ── Auto-reply email to sender ── */
$autoReply = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f4f8; color:#1a1a2e; margin:0; padding:0; }
    .wrap { max-width:560px; margin:30px auto; background:#fff; border:1px solid #e0e0ec; border-radius:16px; overflow:hidden; }
    .header { background: linear-gradient(135deg, #0A0A0F 0%, #13131A 100%); padding:28px 32px; }
    .logo { font-size:20px; font-weight:800; color:#fff; }
    .logo span { color:#00D4FF; }
    .body { padding:28px 32px; }
    h2 { font-size:22px; font-weight:700; color:#1a1a2e; margin:0 0 12px; }
    p { font-size:15px; color:#4a4a6a; line-height:1.7; margin:0 0 16px; }
    .highlight { background:#f0f9ff; border:1px solid #bae6fd; border-radius:10px; padding:14px 18px; font-size:14px; color:#0369a1; margin:16px 0; }
    .footer { padding:20px 32px; background:#f4f4f8; border-top:1px solid #e0e0ec; font-size:12px; color:#6b6b85; text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">RP <span>Technologies</span></div>
    </div>
    <div class="body">
      <h2>Thanks for reaching out, {$name}! 👋</h2>
      <p>We've received your enquiry and our team will review it shortly. You can expect a response within <strong>24 hours</strong> on business days.</p>
      <div class="highlight">
        <strong>Your project type:</strong> {$type}<br>
        <strong>We'll reply to:</strong> {$email}
      </div>
      <p>In the meantime, feel free to WhatsApp us directly for urgent queries.</p>
      <p style="color:#9090A8; font-size:13px;">— The RP Technologies Team</p>
    </div>
    <div class="footer">© 2025 RP Technologies · rptechnologies.in</div>
  </div>
</body>
</html>
HTML;

/* ═══════════════════════════════════════════════════════════════
   Minimal Gmail SMTP class — no library required
   Uses SSL on port 465 (direct TLS, works on all cPanel hosts)
   ═══════════════════════════════════════════════════════════════ */
class GmailSMTP {
    private string $user;
    private string $pass;
    private $sock;

    public function __construct(string $user, string $pass) {
        $this->user = $user;
        $this->pass = $pass;
    }

    private function connect(): void {
        $ctx = stream_context_create([
            'ssl' => [
                'verify_peer'       => true,
                'verify_peer_name'  => true,
                'allow_self_signed' => false,
            ],
        ]);
        $this->sock = stream_socket_client(
            'ssl://' . SMTP_HOST . ':' . SMTP_PORT,
            $errno, $errstr, 15,
            STREAM_CLIENT_CONNECT, $ctx
        );
        if (!$this->sock) {
            throw new \RuntimeException("SMTP connect failed: $errstr ($errno)");
        }
        stream_set_timeout($this->sock, 10);
        $this->read(); // greeting
    }

    private function send(string $cmd): void {
        fwrite($this->sock, $cmd . "\r\n");
    }

    private function read(): string {
        $reply = '';
        while ($line = fgets($this->sock, 512)) {
            $reply .= $line;
            if ($line[3] === ' ') break; // last line of multi-line response
        }
        return $reply;
    }

    private function cmd(string $cmd): string {
        $this->send($cmd);
        return $this->read();
    }

    public function sendMail(
        string $toAddr,
        string $toName,
        string $subject,
        string $htmlBody,
        string $replyTo = ''
    ): void {
        $this->connect();
        $this->cmd('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
        $this->cmd('AUTH LOGIN');
        $this->cmd(base64_encode($this->user));
        $r = $this->cmd(base64_encode($this->pass));
        if (strpos($r, '235') === false) {
            throw new \RuntimeException("SMTP auth failed. Check App Password. Response: $r");
        }
        $this->cmd("MAIL FROM:<{$this->user}>");
        $this->cmd("RCPT TO:<{$toAddr}>");
        $this->cmd('DATA');

        $boundary = md5(uniqid());
        $msgId    = '<' . uniqid() . '@rptechnologies.in>';

        $headers  = "Message-ID: {$msgId}\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "From: " . MAIL_FROM_NAME . " <{$this->user}>\r\n";
        $headers .= "To: {$toName} <{$toAddr}>\r\n";
        $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        if ($replyTo) $headers .= "Reply-To: {$replyTo}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";
        $headers .= "\r\n";
        $headers .= chunk_split(base64_encode($htmlBody));

        $this->send($headers . "\r\n.");
        $this->read();
        $this->cmd('QUIT');
        fclose($this->sock);
    }
}

/* ── Send both emails ── */
try {
    $mailer = new GmailSMTP(SMTP_USER, SMTP_PASS);

    // 1. Notification to YOU
    $mailer->sendMail(
        MAIL_TO,
        SITE_NAME,
        "New Enquiry from {$name} — RP Technologies",
        $emailBody,
        $email  // Reply-To set to sender so you can reply directly
    );

    // 2. Auto-reply confirmation to sender
    $mailer->sendMail(
        $email,
        $name,
        "We received your enquiry — RP Technologies",
        $autoReply
    );

    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);

} catch (\Exception $e) {
    // Log error server-side (never expose to client)
    error_log('[RP Tech Contact] SMTP error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try WhatsApp or email us directly.'
    ]);
}
