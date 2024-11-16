const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY // You'll need to set this in your environment variables
        }
    })
);

class EmailService {
    static async sendVerificationEmail(email, token) {
        const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
        
        try {
            await transporter.sendMail({
                to: email,
                from: 'noreply@qravity.com',
                subject: 'Verify your email address',
                html: `
                    <h1>Welcome to Qravity!</h1>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="${verificationUrl}">Verify Email</a>
                    <p>If you didn't create this account, please ignore this email.</p>
                `
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send verification email');
        }
    }

    static async sendPasswordResetEmail(email, token) {
        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
        
        try {
            await transporter.sendMail({
                to: email,
                from: 'noreply@qravity.com',
                subject: 'Reset your password',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>You requested to reset your password. Click the link below to reset it:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>This link will expire in 1 hour.</p>
                `
            });
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send password reset email');
        }
    }
}

module.exports = EmailService; 