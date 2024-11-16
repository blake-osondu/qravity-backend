const puppeteer = require('puppeteer');
const axios = require('axios');

class JobScraperService {
    constructor() {
        this.scrapers = {
            linkedin: this.scrapeLinkedIn,
            dice: this.scrapeDice,
            indeed: this.scrapeIndeed
        };
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
    }

    async scrapeLinkedIn(searchCriteria) {
        const page = await this.browser.newPage();
        try {
            // Login to LinkedIn
            await page.goto('https://www.linkedin.com/login');
            // ... login logic ...

            // Search for jobs
            const jobs = [];
            // ... job searching logic ...
            return jobs;
        } catch (error) {
            console.error('LinkedIn scraping error:', error);
            throw error;
        } finally {
            await page.close();
        }
    }

    async scrapeDice(searchCriteria) {
        // Similar implementation for Dice
    }

    async scrapeIndeed(searchCriteria) {
        // Similar implementation for Indeed
    }

    async findMatchingJobs(searchCriteria) {
        const allJobs = [];
        for (const platform of Object.keys(this.scrapers)) {
            const jobs = await this.scrapers[platform](searchCriteria);
            allJobs.push(...jobs);
        }
        return this.filterJobs(allJobs, searchCriteria);
    }

    filterJobs(jobs, criteria) {
        return jobs.filter(job => {
            // Check must-include keywords
            const hasMustKeywords = criteria.mustIncludeKeywords.every(keyword =>
                job.description.toLowerCase().includes(keyword.toLowerCase())
            );

            // Check exclude keywords
            const hasExcludeKeywords = criteria.excludeKeywords.some(keyword =>
                job.description.toLowerCase().includes(keyword.toLowerCase())
            );

            // Salary check (if available)
            const meetsMinSalary = !criteria.salaryRange.min || 
                (job.salary && job.salary >= criteria.salaryRange.min);

            return hasMustKeywords && !hasExcludeKeywords && meetsMinSalary;
        });
    }
}

module.exports = new JobScraperService(); 