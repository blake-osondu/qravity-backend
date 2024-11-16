const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        period: {
            type: String,
            enum: ['hourly', 'monthly', 'yearly'],
            default: 'yearly'
        }
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
    platform: {
        type: String,
        required: true,
        enum: ['linkedin', 'indeed', 'glassdoor'],
        index: true
    },
    platformJobId: {
        type: String,
        required: true,
        index: true
    },
    applicationUrl: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive'],
        required: true
    },
    keywords: [{
        type: String,
        trim: true
    }],
    distance: {
        type: Number,  // Distance in miles from user's preferred location
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'filled', 'deleted'],
        default: 'active',
        index: true
    },
    postedDate: {
        type: Date,
        required: true,
        index: true
    },
    expiryDate: {
        type: Date,
        index: true
    },
    appliedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appliedDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'successful', 'failed'],
            default: 'pending'
        },
        error: String
    }],
    metadata: {
        industry: String,
        companySize: String,
        remote: {
            type: Boolean,
            default: false
        },
        skills: [{
            type: String,
            trim: true
        }],
        benefits: [{
            type: String,
            trim: true
        }]
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
jobPostingSchema.index({ keywords: 1 });
jobPostingSchema.index({ 'salary.min': 1 });
jobPostingSchema.index({ distance: 1 });
jobPostingSchema.index({ experienceLevel: 1 });
jobPostingSchema.index({ employmentType: 1 });
jobPostingSchema.index({ 'metadata.remote': 1 });

// Compound indexes for common queries
jobPostingSchema.index({ platform: 1, status: 1, postedDate: -1 });
jobPostingSchema.index({ platform: 1, platformJobId: 1 }, { unique: true });

// Instance methods
jobPostingSchema.methods.isExpired = function() {
    return this.expiryDate && this.expiryDate < new Date();
};

jobPostingSchema.methods.hasUserApplied = function(userId) {
    return this.appliedBy.some(application => 
        application.userId.toString() === userId.toString()
    );
};

// Static methods
jobPostingSchema.statics.findMatchingJobs = async function(criteria) {
    const query = {
        status: 'active',
        'salary.min': { $gte: criteria.minSalary || 0 },
        distance: { $lte: criteria.maxDistance || Infinity },
        platform: { $in: criteria.platforms || [] }
    };

    if (criteria.keywords?.length > 0) {
        query.keywords = { $in: criteria.keywords };
    }

    if (criteria.experienceLevel) {
        query.experienceLevel = criteria.experienceLevel;
    }

    if (criteria.employmentType) {
        query.employmentType = criteria.employmentType;
    }

    if (criteria.remote !== undefined) {
        query['metadata.remote'] = criteria.remote;
    }

    return this.find(query)
        .sort({ postedDate: -1 })
        .limit(criteria.limit || 50);
};

// Middleware
jobPostingSchema.pre('save', function(next) {
    // Auto-generate keywords from title and description if not provided
    if (!this.keywords || this.keywords.length === 0) {
        const text = `${this.title} ${this.description}`.toLowerCase();
        // Simple keyword extraction (you might want to use a more sophisticated approach)
        this.keywords = [...new Set(
            text.split(/\W+/)
                .filter(word => word.length > 3)
                .filter(word => !commonWords.includes(word))
        )];
    }
    next();
});

// Common words to filter out from auto-generated keywords
const commonWords = [
    'the', 'and', 'for', 'that', 'with', 'you', 'this', 'but', 'from',
    'they', 'will', 'would', 'there', 'their', 'what', 'about', 'which',
    'when', 'make', 'like', 'time', 'just', 'know', 'take', 'into'
];

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
module.exports = JobPosting; 