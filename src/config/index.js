require('dotenv').config();

const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    
    // Application
    app: {
        name: 'Qravity',
        port: process.env.PORT || 3000,
        url: process.env.APP_URL || 'http://localhost:3000'
    },

    // Database
    mongodb: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/qravity'
    },

    // Redis
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        options: {
            maxRetriesPerRequest: 3,
            enableReadyCheck: true
        }
    },

    // Email
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        from: process.env.EMAIL_FROM || 'noreply@qravity.com'
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },

    // Queue
    queue: {
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: 100,
            removeOnFail: 1000
        }
    },

    // Automation
    automation: {
        maxDailyApplications: 50,
        defaultInterval: 2, // hours
        platforms: {
            linkedin: {
                enabled: true,
                apiKey: process.env.LINKEDIN_API_KEY,
                apiSecret: process.env.LINKEDIN_API_SECRET
            },
            indeed: {
                enabled: true,
                apiKey: process.env.INDEED_API_KEY,
                apiSecret: process.env.INDEED_API_SECRET
            },
            glassdoor: {
                enabled: true,
                apiKey: process.env.GLASSDOOR_API_KEY,
                apiSecret: process.env.GLASSDOOR_API_SECRET
            }
        }
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },

    // Notifications
    notifications: {
        enabled: true,
        channels: {
            email: true,
            push: true,
            inApp: true
        }
    }
};

// Environment-specific overrides
if (config.env === 'production') {
    // Production-specific settings
    config.app.url = 'https://qravity.com';
    config.queue.defaultJobOptions.removeOnComplete = 10;
} else if (config.env === 'test') {
    // Test-specific settings
    config.mongodb.url = 'mongodb://localhost:27017/qravity_test';
    config.notifications.enabled = false;
}

// Validation
const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI',
    'REDIS_URL'
];

if (config.env === 'production') {
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    });
}

module.exports = config; 