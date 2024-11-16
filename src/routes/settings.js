const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { authenticateUser, allowUnauthenticatedAccess } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Get settings
router.get('/', authenticateUser, async (req, res) => {
    try {
        let settings = await Settings.findOne({ userId: req.user._id });
        if (!settings) {
            settings = new Settings({ userId: req.user._id });
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
router.put('/', authenticateUser, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { userId: req.user._id },
            { 
                $set: {
                    privacy: req.body.privacy,
                    notifications: req.body.notifications,
                    jobPreferences: req.body.jobPreferences
                }
            },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Change password
router.post('/change-password', authenticateUser, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, req.user.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user password
        await User.findByIdAndUpdate(req.user._id, {
            password: hashedPassword
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle 2FA
router.post('/2fa/toggle', authenticateUser, async (req, res) => {
    try {
        const settings = await Settings.findOne({ userId: req.user._id });
        settings.account.twoFactorEnabled = !settings.account.twoFactorEnabled;
        
        if (settings.account.twoFactorEnabled) {
            // Generate new 2FA secret
            const secret = speakeasy.generateSecret();
            settings.account.twoFactorSecret = secret.base32;
            
            // Generate QR code
            const qrCode = await QRCode.toDataURL(
                speakeasy.otpauthURL({
                    secret: secret.base32,
                    label: req.user.email,
                    issuer: 'Qravity'
                })
            );
            
            await settings.save();
            res.json({ enabled: true, qrCode });
        } else {
            settings.account.twoFactorSecret = null;
            await settings.save();
            res.json({ enabled: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 