const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Applied', 'Interviewing', 'Offered', 'Rejected', 'Withdrawn'],
        default: 'Pending'
    },
    source: {
        type: String,
        required: true
    },
    nextStep: {
        type: String,
        default: ''
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application; 