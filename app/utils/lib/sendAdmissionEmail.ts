'use server';
import nodemailer from 'nodemailer';

export async function sendMail({
  sendTo,
  subject,
  text,
  html,
}: {
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const smtpHost = process.env.SMTP_SERVER_HOST;
  const smtpUsername = process.env.SMTP_SERVER_USERNAME;
  const smtpPassword = process.env.SMTP_SERVER_PASSWORD;

  if (!smtpHost || !smtpUsername || !smtpPassword) {
    throw new Error('SMTP_SERVER_HOST, SMTP_SERVER_USERNAME and SMTP_SERVER_PASSWORD must be configured');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: smtpHost,
    port: 587,
    secure: true,
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  try {
    // const isVerified = 
    await transporter.verify();
  } catch {
    console.error('SMTP verification failed');
    return;
  }
  const info = await transporter.sendMail({
    from: smtpUsername,
    to: sendTo,
    subject: subject,
    text: text,
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  return info;
}
