const mongoose = require('mongoose');

const automationSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    dailyLimit: {
        type: Number,
        default: 10,
        min: 1,
        max: 50
    },
    applicationInterval: {
        type: Number,
        default: 2, // hours
        min: 1,
        max: 24
    },
    matchingCriteria: {
        minSalary: {
            type: Number,
            default: 0
        },
        maxDistance: {
            type: Number,
            default: 50 // miles
        },
        requiredKeywords: [{
            type: String,
            trim: true
        }],
        excludedKeywords: [{
            type: String,
            trim: true
        }]
    },
    platforms: {
        linkedin: {
            type: Boolean,
            default: true
        },
        indeed: {
            type: Boolean,
            default: true
        },
        glassdoor: {
            type: Boolean,
            default: true
        }
    },
    statistics: {
        totalApplications: {
            type: Number,
            default: 0
        },
        applicationsToday: {
            type: Number,
            default: 0
        },
        lastApplicationDate: Date,
        responseRate: {
            type: Number,
            default: 0
        },
        interviewRate: {
            type: Number,
            default: 0
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Reset daily applications count at midnight
automationSettingsSchema.methods.resetDailyApplications = async function() {
    const today = new Date();
    const lastApplication = this.statistics.lastApplicationDate;
    
    if (lastApplication && lastApplication.getDate() !== today.getDate()) {
        this.statistics.applicationsToday = 0;
        await this.save();
    }
};

const AutomationSettings = mongoose.model('AutomationSettings', automationSettingsSchema);
module.exports = AutomationSettings; 