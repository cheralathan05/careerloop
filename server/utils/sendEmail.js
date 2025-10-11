// server/utils/sendEmail.js (FINAL CORRECTED VERSION FOR MAILTRAP)

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: process.env.EMAIL_PORT, 
        
        // 🛑 CRITICAL FIX: Mailtrap often uses port 2525 and is not fully secure (SSL/TLS).
        // We ensure 'secure' is FALSE unless the port is explicitly 465 (the SSL port).
        secure: process.env.EMAIL_PORT == 465, // Should resolve to false for port 2525
        
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    // 3. Send the email
    console.log(`Attempting to send OTP to: ${options.to}`);
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully queued by transporter.`);
};

module.exports = sendEmail;