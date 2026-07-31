import nodemailer, { type Transporter } from "nodemailer";

// Microsoft 365 / Outlook SMTP (Authenticated SMTP with an App Password).
// See: https://mysignins.microsoft.com/security-info to generate an app
// password for the mailbox (requires per-user MFA + SMTP AUTH enabled).
const DEFAULT_HOST = "smtp.office365.com";
const DEFAULT_PORT = 587;

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

let transporter: Transporter | null = null;

function getConfig() {
  const host = process.env.EMAIL_HOST || DEFAULT_HOST;
  const port = Number(process.env.EMAIL_PORT) || DEFAULT_PORT;
  const secure = process.env.EMAIL_SECURE === "true" || port === 465;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    const message = "EMAIL_USER and EMAIL_APP_PASSWORD must be set to send email.";
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }
    console.warn(message + " Mail sending is disabled until they are configured.");
  }

  return { host, port, secure, user, pass };
}

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const { host, port, secure, user, pass } = getConfig();

  transporter = nodemailer.createTransport({
    host,
    port,
    secure, // false for 587 (STARTTLS), true for 465 (SSL)
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
}

export async function verifyMailTransport(): Promise<boolean> {
  try {
    await getTransporter().verify();
    return true;
  } catch (error) {
    console.error("Mail transport verification failed:", error);
    return false;
  }
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const { user } = getConfig();

  if (!user) {
    throw new Error("Cannot send email: EMAIL_USER/EMAIL_APP_PASSWORD are not configured.");
  }

  await getTransporter().sendMail({
    from: `"CheckAPay" <${user}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  });
}
