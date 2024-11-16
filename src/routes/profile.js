const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const ImageService = require('../services/ImageService');
const { authenticateUser, allowUnauthenticatedAccess } = require('../middleware/auth');

// Get profile
router.get('/', authenticateUser, async (req, res) => {
    try {
        let profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            profile = new Profile({ userId: req.user._id });
            await profile.save();
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
router.put('/', authenticateUser, async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            { 
                $set: {
                    personalInfo: req.body.personalInfo,
                    contact: req.body.contact,
                    social: req.body.social,
                    skills: req.body.skills
                }
            },
            { new: true, upsert: true }
        );

        profile.calculateCompletion();
        await profile.save();

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload profile picture
router.post('/picture', authenticateUser, 
    ImageService.upload.single('profilePicture'), 
    async (req, res) => {
        try {
            if (!req.file) {
                throw new Error('No image file provided');
            }

            const imagePath = await ImageService.processAndSaveImage(req.file, {
                width: 300,
                height: 300
            });

            const profile = await Profile.findOne({ userId: req.user._id });
            if (profile.personalInfo.profilePicture) {
                await ImageService.deleteImage(profile.personalInfo.profilePicture);
            }

            profile.personalInfo.profilePicture = imagePath;
            await profile.save();

            res.json({ imageUrl: imagePath });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router; 