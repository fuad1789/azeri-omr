import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_APP_PASSWORD, // Gmail App Password
  },
});

interface AuthNotifyOptions {
  attemptEmail: string;
  attemptName?: string;
  allowed: boolean;
  ip?: string;
}

export async function sendAuthNotification(opts: AuthNotifyOptions) {
  const { attemptEmail, attemptName, allowed, ip } = opts;
  const timestamp = new Date().toLocaleString('az-AZ', { timeZone: 'Asia/Baku' });

  const subject = allowed
    ? `✅ OMR Sistemə Giriş: ${attemptEmail}`
    : `⛔ OMR Sistemə İcazəsiz Giriş Cəhdi: ${attemptEmail}`;

  const color = allowed ? '#16a34a' : '#dc2626';
  const icon = allowed ? '✅' : '⛔';
  const statusText = allowed ? 'UĞURLu GİRİŞ' : 'RƏDD EDİLDİ';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:${color};padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">
            ${icon} ${statusText}
          </h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">
            OMR Dashboard — Giriş Bildirişi
          </p>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#64748b;font-size:13px;width:120px;">İstifadəçi</td>
              <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;">${attemptName || 'Naməlum'}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:10px 0;color:#64748b;font-size:13px;">Email</td>
              <td style="padding:10px 0;color:#0f172a;font-size:14px;">${attemptEmail}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:10px 0;color:#64748b;font-size:13px;">Tarix/Saat</td>
              <td style="padding:10px 0;color:#0f172a;font-size:14px;">${timestamp}</td>
            </tr>
            ${ip ? `
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:10px 0;color:#64748b;font-size:13px;">IP</td>
              <td style="padding:10px 0;color:#0f172a;font-size:14px;font-family:monospace;">${ip}</td>
            </tr>` : ''}
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:10px 0;color:#64748b;font-size:13px;">Nəticə</td>
              <td style="padding:10px 0;">
                <span style="background:${color}15;color:${color};padding:3px 10px;border-radius:99px;font-size:12px;font-weight:700;">
                  ${statusText}
                </span>
              </td>
            </tr>
          </table>

          ${!allowed ? `
          <div style="margin-top:20px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 16px;">
            <p style="margin:0;color:#991b1b;font-size:13px;">
              ⚠️ Bu şəxsin sisteminizə girişi rədd edildi. Tanımırsınızsa, 
              <strong>NEXTAUTH_SECRET</strong>-i dəyişib sistemin təhlükəsizliyini yoxlayın.
            </p>
          </div>` : ''}
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #f1f5f9;">
          <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;">
            OMR Dashboard Avtomatik Bildiriş Sistemi
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"OMR Dashboard" <${process.env.NOTIFY_EMAIL}>`,
      to: process.env.NOTIFY_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    // Don't crash auth if email fails — just log
    console.error('[EMAIL NOTIFY] Göndərilə bilmədi:', err);
  }
}
