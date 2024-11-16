const express = require('express');
const router = express.Router();
const AutomationSettings = require('../models/AutomationSettings');
const { authenticateUser, allowUnauthenticatedAccess } = require('../middleware/auth');

// Get automation settings
router.get('/settings', authenticateUser, async (req, res) => {
    try {
        let settings = await AutomationSettings.findOne({ userId: req.user._id });
        
        // Create default settings if none exist
        if (!settings) {
            settings = new AutomationSettings({ userId: req.user._id });
            await settings.save();
        }

        // Reset daily applications if needed
        await settings.resetDailyApplications();

        res.json(settings);
    } catch (error) {
        console.error('Error fetching automation settings:', error);
        res.status(500).json({ error: 'Failed to fetch automation settings' });
    }
});

// Update automation settings
router.post('/settings', authenticateUser, async (req, res) => {
    try {
        const {
            enabled,
            dailyLimit,
            applicationInterval,
            minSalary,
            maxDistance,
            requiredKeywords,
            excludedKeywords,
            platforms
        } = req.body;

        const settings = await AutomationSettings.findOneAndUpdate(
            { userId: req.user._id },
            {
                $set: {
                    enabled,
                    dailyLimit,
                    applicationInterval,
                    'matchingCriteria.minSalary': minSalary,
                    'matchingCriteria.maxDistance': maxDistance,
                    'matchingCriteria.requiredKeywords': requiredKeywords,
                    'matchingCriteria.excludedKeywords': excludedKeywords,
                    platforms,
                    lastUpdated: new Date()
                }
            },
            { new: true, upsert: true }
        );

        res.json(settings);
    } catch (error) {
        console.error('Error updating automation settings:', error);
        res.status(500).json({ error: 'Failed to update automation settings' });
    }
});

// Toggle automation status
router.post('/toggle', authenticateUser, async (req, res) => {
    try {
        const { enabled } = req.body;
        
        const settings = await AutomationSettings.findOneAndUpdate(
            { userId: req.user._id },
            { 
                $set: { 
                    enabled,
                    lastUpdated: new Date()
                }
            },
            { new: true, upsert: true }
        );

        res.json({ success: true, enabled: settings.enabled });
    } catch (error) {
        console.error('Error toggling automation:', error);
        res.status(500).json({ error: 'Failed to toggle automation' });
    }
});

// Get automation statistics
router.get('/statistics', authenticateUser, async (req, res) => {
    try {
        const settings = await AutomationSettings.findOne({ userId: req.user._id });
        if (!settings) {
            return res.status(404).json({ error: 'Automation settings not found' });
        }

        await settings.resetDailyApplications();
        res.json(settings.statistics);
    } catch (error) {
        console.error('Error fetching automation statistics:', error);
        res.status(500).json({ error: 'Failed to fetch automation statistics' });
    }
});

module.exports = router; 