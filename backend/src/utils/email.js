// utils/email.js — kirim email via SMTP (Gmail App Password)
import nodemailer from 'nodemailer';

function createTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      'SMTP belum dikonfigurasi. Set SMTP_USER dan SMTP_PASS di backend/.env'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Kirim email reset password.
 * @param {{ to: string, resetUrl: string, fullName?: string }} opts
 */
export async function sendPasswordResetEmail({ to, resetUrl, fullName }) {
  const from =
    process.env.SMTP_FROM ||
    `"Sistem P3DN BMKG" <${process.env.SMTP_USER}>`;

  const transporter = createTransport();

  const name = fullName || 'Pengguna';
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #0052A3;">Reset Password — Sistem P3DN BMKG</h2>
      <p>Halo ${name},</p>
      <p>Kami menerima permintaan untuk mereset password akun Anda.
         Klik tombol di bawah untuk membuat password baru:</p>
      <p style="margin: 28px 0;">
        <a href="${resetUrl}"
           style="background:#0052A3;color:#fff;padding:12px 24px;border-radius:8px;
                  text-decoration:none;font-weight:600;display:inline-block;">
          Reset Password
        </a>
      </p>
      <p>Atau salin tautan ini ke browser:</p>
      <p style="word-break:break-all;color:#555;">${resetUrl}</p>
      <p style="color:#888;font-size:13px;">Tautan berlaku 1 jam. Jika Anda tidak meminta reset password,
         abaikan email ini.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="color:#aaa;font-size:12px;">Sistem Verifikasi P3DN — BMKG</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset Password — Sistem P3DN BMKG',
    text: `Halo ${name},\n\nReset password Anda di: ${resetUrl}\n\nTautan berlaku 1 jam.`,
    html,
  });
}
