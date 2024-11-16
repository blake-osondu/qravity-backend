const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalInfo: {
        firstName: String,
        lastName: String,
        title: String,
        summary: String,
        phone: String,
        location: String,
        profilePicture: String
    },
    contact: {
        email: String,
        phone: String,
        location: {
            city: String,
            state: String,
            country: String
        },
        website: String,
        linkedin: String
    },
    social: {
        github: String,
        twitter: String,
        stackoverflow: String
    },
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
    }],
    profileCompletion: {
        percentage: {
            type: Number,
            default: 0
        },
        missingFields: [String]
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'public'
    }
}, {
    timestamps: true
});

// Calculate profile completion percentage
profileSchema.methods.calculateCompletion = function() {
    const requiredFields = [
        'personalInfo.firstName',
        'personalInfo.lastName',
        'personalInfo.title',
        'personalInfo.summary',
        'contact.email',
        'contact.location',
        'skills'
    ];

    const missingFields = requiredFields.filter(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], this);
        return !value || (Array.isArray(value) && value.length === 0);
    });

    this.profileCompletion = {
        percentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100),
        missingFields
    };

    return this.profileCompletion;
};

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile; 