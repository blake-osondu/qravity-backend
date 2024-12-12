const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const Application = require('../models/Application');

// GET all applications
router.get('/', authenticateUser, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET application by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST new application
router.post('/', authenticateUser, async (req, res) => {
    try {
        const newApplication = new Application({
            userId: req.user._id,
            ...req.body
        });
        console.log(newApplication);
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error) {
        console.error('Error creating application:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT update application
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Error updating application:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE application
router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 