const Queue = require('bull');
const config = require('../../../config');

// Create queues
const applicationQueue = new Queue('automated-applications', {
    redis: config.redis.url
});

const notificationQueue = new Queue('automation-notifications', {
    redis: config.redis.url
});

// Define queue processors
applicationQueue.process(async (job) => {
    const { userId, jobPosting } = job.data;
    try {
        await AutomationService.submitApplication(userId, jobPosting);
        await notificationQueue.add('application-submitted', {
            userId,
            jobTitle: jobPosting.title,
            company: jobPosting.company
        });
    } catch (error) {
        await notificationQueue.add('application-failed', {
            userId,
            jobTitle: jobPosting.title,
            company: jobPosting.company,
            error: error.message
        });
        throw error;
    }
});

notificationQueue.process('application-submitted', async (job) => {
    const { userId, jobTitle, company } = job.data;
    await NotificationService.notify(userId, {
        type: 'application-submitted',
        title: 'Application Submitted',
        message: `Successfully applied to ${jobTitle} at ${company}`,
        data: job.data
    });
});

notificationQueue.process('application-failed', async (job) => {
    const { userId, jobTitle, company, error } = job.data;
    await NotificationService.notify(userId, {
        type: 'application-failed',
        title: 'Application Failed',
        message: `Failed to apply to ${jobTitle} at ${company}: ${error}`,
        data: job.data
    });
});

module.exports = {
    applicationQueue,
    notificationQueue
}; 