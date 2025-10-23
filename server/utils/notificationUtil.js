// server/utils/sendEmail.js (ES Module Format)
import nodemailer from 'nodemailer';
import logger from './logger.js'; // Import your logging utility

/**
 * @desc Sends an email using SMTP configuration from environment variables.
 * @param {object} options - Email options: { to, subject, html, [text], [attachments] }
 */
const sendEmail = async ({ to, subject, html, text, attachments }) => {

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.FROM_EMAIL) {
        logger.error('Email client is not configured. Please check SMTP_HOST, SMTP_USER, and FROM_EMAIL in .env.');
        // In development, you might want to return here without throwing
        return; 
    }

    try {
        // 1. Create the Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            // Ensure port is parsed as a number if needed, though Nodemailer handles strings
            port: parseInt(process.env.SMTP_PORT) || 587, 
            secure: (process.env.SMTP_PORT == 465), // true for port 465, false otherwise
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        // 2. Send the Mail
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to,
            subject,
            html,
            text,
            attachments
        });

        logger.info(`Message sent: ${info.messageId} (Recipient: ${to})`);
        
    } catch (error) {
        // 3. Robust Error Handling
        logger.error(`❌ Email failed to send to ${to}. Error: ${error.message}`);
        // Do NOT throw here, as email failure is usually non-critical for the main API response
    }
};

export default sendEmail;