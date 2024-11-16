class ResumeScoreService {
    static async scoreResume(resumeData) {
        const scores = {
            completeness: this.calculateCompleteness(resumeData),
            keywordOptimization: await this.analyzeKeywords(resumeData),
            experienceImpact: this.scoreExperience(resumeData),
            skillsMatch: await this.analyzeSkills(resumeData),
            overallScore: 0,
            suggestions: []
        };

        // Calculate overall score (weighted average)
        scores.overallScore = Math.round(
            (scores.completeness * 0.3) +
            (scores.keywordOptimization * 0.3) +
            (scores.experienceImpact * 0.25) +
            (scores.skillsMatch * 0.15)
        );

        // Generate improvement suggestions
        scores.suggestions = this.generateSuggestions(resumeData, scores);

        return scores;
    }

    static calculateCompleteness(resumeData) {
        const requiredSections = {
            personalInfo: ['fullName', 'email', 'phone'],
            professionalSummary: ['summary'],
            experience: ['company', 'jobTitle', 'description'],
            education: ['institution', 'degree'],
            skills: ['technicalSkills', 'softSkills']
        };

        let totalFields = 0;
        let completedFields = 0;

        for (const [section, fields] of Object.entries(requiredSections)) {
            fields.forEach(field => {
                totalFields++;
                if (section === 'experience' || section === 'education') {
                    if (resumeData[section] && resumeData[section].length > 0) {
                        if (resumeData[section][0][field]) completedFields++;
                    }
                } else {
                    if (resumeData[field] && resumeData[field].length > 0) completedFields++;
                }
            });
        }

        return Math.round((completedFields / totalFields) * 100);
    }

    static async analyzeKeywords(resumeData) {
        // Common industry keywords and their weights
        const industryKeywords = {
            technical: {
                'developed': 2,
                'implemented': 2,
                'managed': 2,
                'led': 2,
                'created': 1,
                'designed': 2,
                'optimized': 2,
                'improved': 2,
                'increased': 2,
                'decreased': 2,
                'achieved': 2,
                'launched': 2,
                'coordinated': 1,
                'supervised': 1,
                'mentored': 1
            },
            metrics: {
                '%': 2,
                'percent': 2,
                '$': 2,
                'million': 2,
                'billion': 2,
                'reduced': 2,
                'increased': 2,
                'improved': 2,
                'under budget': 2,
                'ahead of schedule': 2
            }
        };

        let score = 0;
        let maxScore = 0;

        // Analyze experience descriptions
        if (resumeData.experience) {
            resumeData.experience.forEach(exp => {
                const description = exp.description.toLowerCase();
                
                // Check for technical keywords
                Object.entries(industryKeywords.technical).forEach(([keyword, weight]) => {
                    maxScore += weight;
                    if (description.includes(keyword.toLowerCase())) {
                        score += weight;
                    }
                });

                // Check for metrics
                Object.entries(industryKeywords.metrics).forEach(([keyword, weight]) => {
                    maxScore += weight;
                    if (description.includes(keyword.toLowerCase())) {
                        score += weight;
                    }
                });
            });
        }

        return Math.round((score / maxScore) * 100) || 0;
    }

    static scoreExperience(resumeData) {
        let score = 0;
        const experience = resumeData.experience || [];

        // Score based on number of experiences
        score += Math.min(experience.length * 20, 60);

        // Score based on description length and quality
        experience.forEach(exp => {
            const words = exp.description.split(' ').length;
            score += Math.min(words / 20, 10); // Up to 10 points for good length
            
            // Check for duration
            if (exp.startDate && exp.endDate) {
                const duration = new Date(exp.endDate) - new Date(exp.startDate);
                const years = duration / (1000 * 60 * 60 * 24 * 365);
                score += Math.min(years * 5, 10); // Up to 10 points for longer experiences
            }
        });

        return Math.min(Math.round(score), 100);
    }

    static async analyzeSkills(resumeData) {
        const inDemandSkills = {
            technical: [
                'javascript', 'python', 'java', 'react', 'node.js', 'aws', 
                'docker', 'kubernetes', 'sql', 'nosql', 'machine learning',
                'ai', 'cloud', 'devops', 'ci/cd', 'agile'
            ],
            soft: [
                'leadership', 'communication', 'problem solving', 'teamwork',
                'project management', 'time management', 'analytical',
                'critical thinking', 'adaptability', 'collaboration'
            ]
        };

        let score = 0;
        const technicalSkills = resumeData.technicalSkills.toLowerCase().split(',');
        const softSkills = resumeData.softSkills.toLowerCase().split(',');

        // Score technical skills
        inDemandSkills.technical.forEach(skill => {
            if (technicalSkills.some(s => s.trim().includes(skill))) {
                score += 4;
            }
        });

        // Score soft skills
        inDemandSkills.soft.forEach(skill => {
            if (softSkills.some(s => s.trim().includes(skill))) {
                score += 2;
            }
        });

        return Math.min(Math.round(score), 100);
    }

    static generateSuggestions(resumeData, scores) {
        const suggestions = [];

        // Completeness suggestions
        if (scores.completeness < 100) {
            if (!resumeData.professionalSummary || resumeData.professionalSummary.length < 50) {
                suggestions.push({
                    category: 'Completeness',
                    suggestion: 'Add a detailed professional summary (recommended length: 3-5 sentences)'
                });
            }
            if (!resumeData.experience || resumeData.experience.length < 2) {
                suggestions.push({
                    category: 'Completeness',
                    suggestion: 'Add more work experiences to showcase your career progression'
                });
            }
        }

        // Keyword optimization suggestions
        if (scores.keywordOptimization < 70) {
            suggestions.push({
                category: 'Keywords',
                suggestion: 'Include more action verbs and measurable achievements in your experience descriptions'
            });
            suggestions.push({
                category: 'Keywords',
                suggestion: 'Add specific metrics and quantifiable results to your achievements'
            });
        }

        // Experience impact suggestions
        if (scores.experienceImpact < 70) {
            suggestions.push({
                category: 'Experience',
                suggestion: 'Elaborate on your responsibilities and achievements in each role'
            });
            suggestions.push({
                category: 'Experience',
                suggestion: 'Focus on highlighting leadership and project management experiences'
            });
        }

        // Skills suggestions
        if (scores.skillsMatch < 70) {
            suggestions.push({
                category: 'Skills',
                suggestion: 'Add more in-demand technical skills relevant to your field'
            });
            suggestions.push({
                category: 'Skills',
                suggestion: 'Balance your technical skills with essential soft skills'
            });
        }

        return suggestions;
    }
}

module.exports = ResumeScoreService; 