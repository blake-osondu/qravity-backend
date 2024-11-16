const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    searchCriteria: {
        keywords: [String],        // e.g., ['software engineer', 'developer']
        mustIncludeKeywords: [String], // Keywords that MUST be in the job posting
        excludeKeywords: [String], // Keywords to avoid
        locations: [String],       // e.g., ['Remote', 'New York, NY']
        maxDistance: Number,       // in miles
        salaryRange: {
            min: Number,
            max: Number
        },
        jobTypes: [{              // e.g., ['full-time', 'contract']
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'temporary']
        }],
        experienceLevel: [{
            type: String,
            enum: ['entry', 'mid-level', 'senior', 'executive']
        }],
        remotePreference: {
            type: String,
            enum: ['remote', 'hybrid', 'onsite', 'any']
        }
    },
    applicationSettings: {
        maxApplicationsPerDay: {
            type: Number,
            default: 20
        },
        platformCredentials: [{
            platform: String,      // e.g., 'linkedin', 'dice', 'indeed'
            username: String,
            password: String       // Should be encrypted
        }],
        autoApplyEnabled: {
            type: Boolean,
            default: true
        }
    },
    applicationHistory: [{
        jobTitle: String,
        company: String,
        platform: String,
        appliedDate: Date,
        status: {
            type: String,
            enum: ['applied', 'failed', 'pending']
        },
        errorMessage: String
    }]
});

module.exports = mongoose.model('Resume', resumeSchema);
