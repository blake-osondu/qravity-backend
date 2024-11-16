const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free'
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired', 'past_due'],
        default: 'active'
    },
    stripeCustomerId: {
        type: String,
        sparse: true
    },
    stripeSubscriptionId: {
        type: String,
        sparse: true
    },
    currentPeriodStart: {
        type: Date,
        default: Date.now
    },
    currentPeriodEnd: {
        type: Date,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    usage: {
        applications: {
            count: { type: Number, default: 0 },
            limit: { type: Number, default: 10 }
        },
        resumeDownloads: {
            count: { type: Number, default: 0 },
            limit: { type: Number, default: 5 }
        }
    },
    billingHistory: [{
        date: Date,
        amount: Number,
        description: String,
        status: {
            type: String,
            enum: ['paid', 'pending', 'failed']
        },
        invoiceUrl: String
    }]
}, {
    timestamps: true
});

// Methods
subscriptionSchema.methods.canUseFeature = function(feature) {
    if (!this.usage[feature]) return false;
    return this.usage[feature].count < this.usage[feature].limit;
};

subscriptionSchema.methods.incrementUsage = async function(feature) {
    if (!this.usage[feature]) return false;
    this.usage[feature].count += 1;
    await this.save();
    return true;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription; 