const express = require('express');
const router = express.Router();
const PDFService = require('../services/PDFService');
const Resume = require('../models/Resume');
const { authenticateUser, allowUnauthenticatedAccess } = require('../middleware/auth');
const ResumeScoreService = require('../services/ResumeScoreService');

// Save resume
router.post('/save', authenticateUser, async (req, res) => {
    try {
        const resumeData = req.body;
        let resume = await Resume.findOne({ userId: req.user._id });

        if (resume) {
            // Update existing resume
            resume = await Resume.findOneAndUpdate(
                { userId: req.user._id },
                resumeData,
                { new: true }
            );
        } else {
            // Create new resume
            resume = new Resume({
                userId: req.user._id,
                ...resumeData
            });
            await resume.save();
        }

        res.json({ success: true, resume });
    } catch (error) {
        console.error('Error saving resume:', error);
        res.status(500).json({ error: 'Failed to save resume' });
    }
});

// Generate PDF
router.post('/generate-pdf', authenticateUser, async (req, res) => {
    try {
        const resumeData = req.body;
        const pdfBuffer = await PDFService.generateResumePDF(resumeData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// Get resume
router.get('/', authenticateUser, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

// Add this new route
router.get('/score', authenticateUser, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        const scores = await ResumeScoreService.scoreResume(resume);
        res.json(scores);
    } catch (error) {
        console.error('Error scoring resume:', error);
        res.status(500).json({ error: 'Failed to score resume' });
    }
});

module.exports = router; 