// server/utils/sendEmail.js (FINAL ES MODULE VERSION)

import nodemailer from 'nodemailer';
// NOTE: Assuming logger utility or custom console logs are available

/**
 * @desc Sends an email using either live SMTP credentials or a fallback Ethereal account for testing.
 * @param {Object} options - { to, subject, text, html }
 * @returns {Promise<Object>} The nodemailer info object.
 */
const sendEmail = async (options) => {
    let transporter;
    let info;
    
    // Check for required LIVE config credentials
    const isEtherealFallback = !(process.env.EMAIL_HOST && process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD);

    try {
        if (!isEtherealFallback) {
            // --- Option A: Live/Mailtrap/Prod SMTP ---
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT) || 587,
                secure: Number(process.env.EMAIL_PORT) === 465, 
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
                // Added for robustness against SSL warnings
                tls: {
                    ciphers: 'SSLv3' 
                }
            });
            console.log('--- Using Live/Prod SMTP ---');
        } else {
            // --- Option B: Ethereal Fallback (for local testing without a real SMTP service) ---
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
            console.log('--- Using Ethereal (Testing) ---');
        }

        // --- Mail Options ---
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'CareerLoop'}" <${process.env.FROM_EMAIL || 'no-reply@careerloop.com'}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            // Ensure HTML is prioritized or a fallback text is used
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
        // Log the detailed error but throw a generic message for the API consumer
        console.error('❌ FATAL ERROR sending email:', error.message);
        throw new Error('Internal service error: Failed to send email.');
    }
};

export default sendEmail;