const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../../models/Subscription');
const User = require('../../models/User');

const PLANS = {
    pro: {
        priceId: 'price_XXXXX', // Your Stripe price ID for Pro plan
        features: {
            applications: { limit: 50 },
            resumeDownloads: { limit: 20 }
        }
    },
    premium: {
        priceId: 'price_YYYYY', // Your Stripe price ID for Premium plan
        features: {
            applications: { limit: 999999 }, // Unlimited
            resumeDownloads: { limit: 999999 } // Unlimited
        }
    }
};

class StripeService {
    static async createCustomer(user) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
                userId: user._id.toString()
            }
        });
        return customer;
    }

    static async createSubscription(userId, planId) {
        try {
            const user = await User.findById(userId);
            const subscription = await Subscription.findOne({ userId });

            // Create or get Stripe customer
            let stripeCustomerId = subscription?.stripeCustomerId;
            if (!stripeCustomerId) {
                const customer = await this.createCustomer(user);
                stripeCustomerId = customer.id;
            }

            // Create Stripe subscription
            const stripeSubscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [{ price: PLANS[planId].priceId }],
                expand: ['latest_invoice.payment_intent']
            });

            // Update subscription in database
            const updatedSubscription = await Subscription.findOneAndUpdate(
                { userId },
                {
                    plan: planId,
                    stripeCustomerId,
                    stripeSubscriptionId: stripeSubscription.id,
                    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                    status: 'active',
                    usage: PLANS[planId].features
                },
                { new: true, upsert: true }
            );

            return {
                subscription: updatedSubscription,
                clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret
            };
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    static async cancelSubscription(userId) {
        const subscription = await Subscription.findOne({ userId });
        if (!subscription?.stripeSubscriptionId) {
            throw new Error('No active subscription found');
        }

        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true
        });

        subscription.cancelAtPeriodEnd = true;
        await subscription.save();

        return subscription;
    }

    static async handleWebhook(event) {
        switch (event.type) {
            case 'invoice.payment_succeeded':
                await this.handleSuccessfulPayment(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this.handleFailedPayment(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionCanceled(event.data.object);
                break;
        }
    }
}

module.exports = StripeService; 