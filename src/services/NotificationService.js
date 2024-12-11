const nodemailer = require('nodemailer');
const User = require('../../models/User');
const Notification = require('../../models/Notification');
const config = require('../../config');

class NotificationService {
    static transporter = nodemailer.createTransport(config.email);

    static async notify(userId, notification) {
        try {
            // Save notification to database
            const newNotification = new Notification({
                userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                data: notification.data
            });
            await newNotification.save();

            // Get user preferences
            const user = await User.findById(userId);
            
            // Send email if enabled
            if (user.preferences.emailNotifications) {
                await this.sendEmail(user.email, notification);
            }

            // Send push notification if enabled
            if (user.preferences.pushNotifications) {
                await this.sendPushNotification(user.pushSubscription, notification);
            }

            return newNotification;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }

    static async sendEmail(email, notification) {
        const mailOptions = {
            from: config.email.from,
            to: email,
            subject: notification.title,
            html: this.generateEmailTemplate(notification)
        };

        await this.transporter.sendMail(mailOptions);
    }

    static async sendPushNotification(subscription, notification) {
        if (!subscription) return;

        // Implement push notification logic using web-push or similar
        // This is a placeholder for the actual implementation
        console.log('Sending push notification:', notification);
    }

    static generateEmailTemplate(notification) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>${notification.title}</h2>
                <p>${notification.message}</p>
                ${this.getNotificationTypeSpecificContent(notification)}
                <hr>
                <p style="color: #666; font-size: 12px;">
                    You received this email because you have automation notifications enabled. 
                    <a href="${config.app.url}/settings/notifications">Manage your notification preferences</a>
                </p>
            </div>
        `;
    }

    static getNotificationTypeSpecificContent(notification) {
        switch (notification.type) {
            case 'application-submitted':
                return `
                    <div style="margin: 20px 0;">
                        <p><strong>Job Details:</strong></p>
                        <ul>
                            <li>Position: ${notification.data.jobTitle}</li>
                            <li>Company: ${notification.data.company}</li>
                        </ul>
                    </div>
                `;
            case 'application-failed':
                return `
                    <div style="margin: 20px 0; color: #dc3545;">
                        <p><strong>Error Details:</strong></p>
                        <p>${notification.data.error}</p>
                    </div>
                `;
            default:
                return '';
        }
    }
}

module.exports = NotificationService; 