// ---------------------------------------------------------------------------
// lib/email.js -- transactional email via the Resend REST API.
//
// Requires RESEND_API_KEY (set in Vercel). Emails are sent from
// onboarding@resend.dev, the official Resend sandbox sender -- no verified
// domain needed for testing.
// ---------------------------------------------------------------------------

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "Acorn <onboarding@resend.dev>";

/**
 * Send a password-reset email. Returns { ok: true } on success, or
 * { ok: false, reason: "not_configured" | "send_failed" }.
 */
export async function sendPasswordResetEmail({ to, url }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "not_configured" };

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject: "Reset your Acorn password",
        html: `
          <p>Hi,</p>
          <p>We received a request to reset your Acorn password. Click the
          button below to choose a new one. This link expires in 1 hour.</p>
          <p><a href="${url}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#0f766e;color:#fff;text-decoration:none;font-weight:600;">Reset my password</a></p>
          <p>If the button doesn't work, copy and paste this link into your
          browser:</p>
          <p><a href="${url}">${url}</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      }),
    });

    if (!res.ok) return { ok: false, reason: "send_failed" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "send_failed" };
  }
}
