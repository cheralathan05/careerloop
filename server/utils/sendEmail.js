// server/utils/sendEmail.js (FINAL ROBUST VERSION)

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;
    let info;
    const isEtherealFallback = !(process.env.EMAIL_HOST && process.env.EMAIL_USERNAME);

    if (!isEtherealFallback) {
        // --- Option A: Use live/Mailtrap credentials from .env ---
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, 
            port: process.env.EMAIL_PORT, 
            
            // Set secure based on port (true for 465, false for 587/2525)
            secure: process.env.EMAIL_PORT == 465, 
            
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        console.log("--- Using Live/Mailtrap SMTP ---");

    } else {
        // --- Option B: Ethereal Fallback (For testing when .env is empty) ---
        let testAccount = await nodemailer.createTestAccount();
        console.log("--- Using Ethereal (Free) for Email Testing ---");
        
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // Ethereal uses TLS on 587
            auth: {
                user: testAccount.user, // Dynamically generated user
                pass: testAccount.pass, // Dynamically generated password
            },
        });
    }

    // 2. Define email options
    const mailOptions = {
        // Use environment variables, with defaults for Ethereal testing
        from: `"${process.env.FROM_NAME || 'Auth Flow'}" <${process.env.FROM_EMAIL || 'no-reply@test.com'}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || `<p>${options.text}</p>`,
    };

    // 3. Send the email
    console.log(`Attempting to send OTP to: ${options.to}`);
    info = await transporter.sendMail(mailOptions);
    
    // 4. Logging based on transport method
    if (isEtherealFallback) {
        // Log the URL for the user to open the virtual inbox
        console.log("\n✅ Email sent! OTP is in the virtual inbox.");
        console.log("   Preview OTP email at: %s\n", nodemailer.getTestMessageUrl(info));
    } else {
        // Log status for live/Mailtrap connection
        console.log(`Email successfully queued by transporter: ${info.messageId}`);
    }
};

module.exports = sendEmail;