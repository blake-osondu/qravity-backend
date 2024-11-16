const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
    try {
        // Check if user is already authenticated
        if (req.path === '/login' && req.session.userId) {
            return res.redirect('/dashboard');
        }

        // For dashboard and protected routes
        if (req.path.includes('/dashboard') || req.path.includes('/api/')) {
            if (!req.session.userId) {
                if (req.path.includes('/api/')) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                return res.redirect('/login');
            }
            
            // Attach user to request object
            const user = await User.findById(req.session.userId);
            if (!user) {
                req.session.destroy();
                return res.redirect('/login');
            }
            req.user = user;
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (req.path.includes('/api/')) {
            return res.status(500).json({ error: 'Authentication error' });
        }
        res.redirect('/login');
    }
};

const allowUnauthenticatedAccess = (req, res, next) => {
    // Allow access to login/register pages even if authenticated
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = {
    authenticateUser,
    allowUnauthenticatedAccess
};