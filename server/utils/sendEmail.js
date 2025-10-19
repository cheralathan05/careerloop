// server/utils/sendEmail.js (FINAL, ZERO-ERROR VERSION)

const nodemailer = require('nodemailer');

/**
 * Sends an email using either live SMTP credentials or a fallback Ethereal account for testing.
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async (options) => {
    let transporter;
    let info;

    // 🚨 FIX: Define isEtherealFallback using const/let outside the try block
    const isEtherealFallback = !(process.env.EMAIL_HOST && process.env.EMAIL_USERNAME);

    try {
        if (!isEtherealFallback) {
            // --- Option A: Live/Mailtrap SMTP ---
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT) || 587,
                secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587/2525
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
                // Add TLS option to prevent non-fatal SSL warnings
                tls: {
                    ciphers: 'SSLv3' 
                }
            });
            console.log('--- Using Live/Mailtrap SMTP ---');
        } else {
            // --- Option B: Ethereal Fallback ---
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log('--- Using Ethereal (Free) for Email Testing ---');
        }

        // --- Mail Options ---
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'Auth Flow'}" <${process.env.FROM_EMAIL || 'no-reply@test.com'}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || `<p>${options.text}</p>`,
        };

        // --- Send Email ---
        console.log(`Attempting to send email to: ${options.to}`);
        info = await transporter.sendMail(mailOptions);

        // --- Logging ---
        if (isEtherealFallback) {
            console.log('\n✅ Email sent! Preview in Ethereal inbox: %s\n', nodemailer.getTestMessageUrl(info));
        } else {
            console.log(`✅ Email queued successfully: ${info.messageId}`);
        }

        return info;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw new Error('Email sending failed. Please try again later.');
    }
};

module.exports = sendEmail;