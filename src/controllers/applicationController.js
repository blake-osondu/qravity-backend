const AutoApplyService = require('../services/AutoApplyService');
const Resume = require('../models/Resume');

exports.startAutoApply = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        if (!resume.applicationSettings.autoApplyEnabled) {
            return res.status(400).json({ error: 'Auto apply is disabled' });
        }

        // Start the auto-apply process
        AutoApplyService.startAutoApply(resume);

        res.json({ message: 'Auto apply process started' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getApplicationHistory = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id });
        res.json(resume.applicationHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 