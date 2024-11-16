const express = require('express');
const router = express.Router();
const StripeService = require('../services/StripeService');
const Subscription = require('../models/Subscription');
const { authenticateUser, allowUnauthenticatedAccess } = require('../middleware/auth');

// Get current subscription
router.get('/', authenticateUser, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user._id });
        res.json(subscription || { plan: 'free' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/update subscription
router.post('/create', authenticateUser, async (req, res) => {
    try {
        const { planId } = req.body;
        const result = await StripeService.createSubscription(req.user._id, planId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel subscription
router.post('/cancel', authenticateUser, async (req, res) => {
    try {
        const subscription = await StripeService.cancelSubscription(req.user._id);
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get billing history
router.get('/billing-history', authenticateUser, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user._id });
        res.json(subscription?.billingHistory || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        await StripeService.handleWebhook(event);
        res.json({ received: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 