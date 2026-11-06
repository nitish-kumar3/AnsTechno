import nodemailer from 'nodemailer'
import env from '../config/env.js'

let transporter = null

// Pehli baar email bhejte waqt connection banta hai
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      auth: { user: env.mail.user, pass: env.mail.pass },
    })
  }
  return transporter
}

// User ka likha text email me daalne se pehle safe banao (< > jaise characters)
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Tumhe email bhejta hai
export async function sendMail({ subject, html, replyTo }) {
  // Settings na hon to chup-chaap skip
  if (!env.mail.host || !env.mail.user || !env.mail.pass || !env.mail.to) {
    console.log('Email setup nahi hai (.env me SMTP_* daalo), mail skip kiya')
    return false
  }

  try {
    await getTransporter().sendMail({
      from: `"Anstechno Website" <${env.mail.user}>`,
      to: env.mail.to,
      replyTo,
      subject: String(subject).replace(/[\r\n]+/g, ' '), // subject me new line nahi
      html,
    })
    return true
  } catch (error) {
    console.error('Email failed:', error.message)
    return false
  }
}