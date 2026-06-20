import nodemailer from 'nodemailer';

// Configure this with your SMTP provider details
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ SMTP Connection Failed:', error);
        console.error('Check your SMTP_HOST, SMTP_PORT, and credentials');
    } else {
        console.log('✅ SMTP Connection Successful - Ready to send emails');
    }
});

const senderEmail = process.env.EMAIL_FROM || '"Manbut Support" <support@manbut.com>';

export const sendWelcomeEmail = async (email: string, name: string) => {
    const mailOptions = {
        from: senderEmail,
        to: email,
        subject: 'Welcome to Manbut!',
        html: `<h1>Hello ${name},</h1><p>Welcome to Manbut! We are excited to help you care for your plants.</p>`
    };
    await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const mailOptions = {
        from: senderEmail,
        to: email,
        subject: 'Password Reset Token',
        html: `<p>You requested a password reset. Your password reset token is: <strong>${token}</strong></p><p>If you didn't request this, you can safely ignore this email.</p>`
    };
    await transporter.sendMail(mailOptions);
};

export const sendOrderReceipt = async (email: string, name: string, orderId: string, totalAmount: number) => {
    const mailOptions = {
        from: senderEmail,
        to: email,
        subject: `Order Receipt - ${orderId}`,
        html: `<h1>Thank you for your order, ${name}!</h1><p>Your order (ID: ${orderId}) has been successfully placed.</p><p>Total Amount: <strong>$${totalAmount}</strong></p><p>We will notify you once it ships!</p>`
    };
    await transporter.sendMail(mailOptions);
};

export const sendOrderStatusEmail = async (email: string, name: string, orderId: string, status: string) => {
    const mailOptions = {
        from: senderEmail,
        to: email,
        subject: `Order Status Update - ${orderId}`,
        html: `<h1>Hello ${name},</h1><p>The status of your order (ID: ${orderId}) has been updated to: <strong style="text-transform: uppercase;">${status}</strong>.</p>`
    };
    await transporter.sendMail(mailOptions);
};