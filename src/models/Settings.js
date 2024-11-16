const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    account: {
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorSecret: String
    },
    privacy: {
        profileVisibility: {
            type: String,
            enum: ['public', 'private', 'connections'],
            default: 'public'
        },
        showEmail: {
            type: Boolean,
            default: false
        },
        showPhone: {
            type: Boolean,
            default: false
        }
    },
    notifications: {
        email: {
            jobAlerts: {
                type: Boolean,
                default: true
            },
            applicationUpdates: {
                type: Boolean,
                default: true
            },
            messages: {
                type: Boolean,
                default: true
            }
        },
        push: {
            jobAlerts: {
                type: Boolean,
                default: true
            },
            applicationUpdates: {
                type: Boolean,
                default: true
            },
            messages: {
                type: Boolean,
                default: true
            }
        }
    },
    jobPreferences: {
        jobTypes: [{
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship']
        }],
        workLocations: [{
            type: String,
            enum: ['on-site', 'remote', 'hybrid']
        }],
        salary: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: 'USD'
            }
        },
        industries: [String],
        locations: [{
            city: String,
            state: String,
            country: String,
            remote: Boolean
        }]
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings; 