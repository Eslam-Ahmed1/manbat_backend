import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
    console.warn('⚠️ RESEND_API_KEY is not defined in environment variables. Email sending will fail.');
} else {
    console.log('✅ Resend Email Service Initialized');
}

// Resend requires a verified domain to send emails, or you can use onboarding@resend.dev for testing
const senderEmail = process.env.EMAIL_FROM as string;

const getResendClient = () => {
    if (!resend) {
        throw new Error('❌ Resend API Key is missing. Please set RESEND_API_KEY in your environment variables.');
    }
    return resend;
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
        from: senderEmail,
        to: email,
        subject: 'Welcome to Manbut!',
        html: `<h1>Hello ${name},</h1><p>Welcome to Manbut! We are excited to help you care for your plants.</p>`
    });
    if (error) {
        console.error('❌ Failed to send welcome email:', error);
        throw error;
    }
    return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
        from: senderEmail,
        to: email,
        subject: 'Password Reset Token',
        html: `<p>You requested a password reset. Your password reset token is: <strong>${token}</strong></p><p>If you didn't request this, you can safely ignore this email.</p>`
    });
    if (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw error;
    }
    return data;
};

export const sendOrderReceipt = async (email: string, name: string, orderId: string, totalAmount: number) => {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
        from: senderEmail,
        to: email,
        subject: `Order Receipt - ${orderId}`,
        html: `<h1>Thank you for your order, ${name}!</h1><p>Your order (ID: ${orderId}) has been successfully placed.</p><p>Total Amount: <strong>$${totalAmount}</strong></p><p>We will notify you once it ships!</p>`
    });
    if (error) {
        console.error('❌ Failed to send order receipt:', error);
        throw error;
    }
    return data;
};

export const sendOrderStatusEmail = async (email: string, name: string, orderId: string, status: string) => {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
        from: senderEmail,
        to: email,
        subject: `Order Status Update - ${orderId}`,
        html: `<h1>Hello ${name},</h1><p>The status of your order (ID: ${orderId}) has been updated to: <strong style="text-transform: uppercase;">${status}</strong>.</p>`
    });
    if (error) {
        console.error('❌ Failed to send order status update email:', error);
        throw error;
    }
    return data;
};

