const AutomationSettings = require('../../models/AutomationSettings');
const JobPosting = require('../../models/JobPosting');
const { applicationQueue } = require('./queue/AutomationQueue');
const cron = require('node-cron');

class AutomationService {
    static async initialize() {
        // Schedule job scanning every hour
        cron.schedule('0 * * * *', async () => {
            await this.scanAndQueueJobs();
        });

        // Schedule daily stats reset at midnight
        cron.schedule('0 0 * * *', async () => {
            await this.resetDailyStats();
        });
    }

    static async scanAndQueueJobs() {
        try {
            const activeUsers = await AutomationSettings.find({ enabled: true });

            for (const userSettings of activeUsers) {
                if (userSettings.statistics.applicationsToday >= userSettings.dailyLimit) {
                    continue;
                }

                const matchingJobs = await this.findMatchingJobs(userSettings);
                const remainingApplications = userSettings.dailyLimit - userSettings.statistics.applicationsToday;
                const jobsToApply = matchingJobs.slice(0, remainingApplications);

                for (const job of jobsToApply) {
                    await applicationQueue.add({
                        userId: userSettings.userId,
                        jobPosting: job
                    }, {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 2000
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error in scanAndQueueJobs:', error);
        }
    }

    static async findMatchingJobs(settings) {
        const query = {
            salary: { $gte: settings.matchingCriteria.minSalary },
            distance: { $lte: settings.matchingCriteria.maxDistance },
            $and: [
                { keywords: { $in: settings.matchingCriteria.requiredKeywords } },
                { keywords: { $nin: settings.matchingCriteria.excludedKeywords } }
            ],
            platform: {
                $in: Object.entries(settings.platforms)
                    .filter(([_, enabled]) => enabled)
                    .map(([platform]) => platform)
            }
        };

        return await JobPosting.find(query)
            .sort({ postedDate: -1 })
            .limit(settings.dailyLimit);
    }

    static async submitApplication(userId, jobPosting) {
        // Implement application submission logic for different platforms
        const platform = jobPosting.platform;
        switch (platform) {
            case 'linkedin':
                return await this.submitLinkedInApplication(userId, jobPosting);
            case 'indeed':
                return await this.submitIndeedApplication(userId, jobPosting);
            case 'glassdoor':
                return await this.submitGlassdoorApplication(userId, jobPosting);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    static async resetDailyStats() {
        await AutomationSettings.updateMany(
            {},
            { 
                $set: { 
                    'statistics.applicationsToday': 0,
                    'statistics.lastReset': new Date()
                }
            }
        );
    }
}

module.exports = AutomationService; 