const nodemailer = require('nodemailer');

exports.sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    // uses environment MAIL config if provided; fallback is ethereal (not configured)
    // for dev, user should configure SMTP in .env and replace below
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, html });
};
