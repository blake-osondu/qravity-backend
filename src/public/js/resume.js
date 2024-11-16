class ResumeManager {
    constructor() {
        this.form = document.getElementById('resumeForm');
        this.previewBtn = document.getElementById('previewResume');
        this.downloadBtn = document.getElementById('downloadPDF');
        this.saveBtn = document.getElementById('saveResume');
        
        this.initializeValidation();
        this.initializeEventListeners();
    }

    initializeValidation() {
        // Add validation classes and attributes
        const requiredFields = this.form.querySelectorAll('input[required], textarea[required]');
        requiredFields.forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.highlightInvalidField(field);
            });
            
            field.addEventListener('input', () => {
                this.removeInvalidHighlight(field);
            });
        });

        // Custom validation rules
        this.form.querySelector('input[type="tel"]').pattern = "^[0-9-+\\s()]*$";
        this.form.querySelector('input[type="email"]').pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$";
    }

    highlightInvalidField(field) {
        field.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = field.validationMessage;
        field.parentNode.appendChild(feedback);
    }

    removeInvalidHighlight(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) feedback.remove();
    }

    async validateForm() {
        const isValid = this.form.checkValidity();
        if (!isValid) {
            this.form.reportValidity();
            return false;
        }

        // Additional custom validation
        const startDates = Array.from(this.form.querySelectorAll('input[type="date"][name*="startDate"]'));
        const endDates = Array.from(this.form.querySelectorAll('input[type="date"][name*="endDate"]'));
        
        for (let i = 0; i < startDates.length; i++) {
            if (endDates[i].value && startDates[i].value > endDates[i].value) {
                alert('End date cannot be earlier than start date');
                return false;
            }
        }

        return true;
    }

    async generatePDF() {
        try {
            const response = await fetch('/api/resume/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.getFormData())
            });

            if (!response.ok) throw new Error('Failed to generate PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (key.includes('[]')) {
                // Handle array fields
                const cleanKey = key.replace('[]', '');
                if (!data[cleanKey]) data[cleanKey] = [];
                data[cleanKey].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    initializeEventListeners() {
        this.downloadBtn.addEventListener('click', async () => {
            if (await this.validateForm()) {
                await this.generatePDF();
            }
        });

        this.saveBtn.addEventListener('click', async () => {
            if (await this.validateForm()) {
                await this.saveResume();
            }
        });

        this.previewBtn.addEventListener('click', () => {
            if (this.validateForm()) {
                this.showPreview();
            }
        });
    }

    async saveResume() {
        try {
            const response = await fetch('/api/resume/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.getFormData())
            });

            if (!response.ok) throw new Error('Failed to save resume');

            alert('Resume saved successfully!');
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume. Please try again.');
        }
    }

    showPreview() {
        const data = this.getFormData();
        const previewContent = document.getElementById('previewContent');
        const modal = new bootstrap.Modal(document.getElementById('resumePreviewModal'));

        previewContent.innerHTML = this.generatePreviewHTML(data);
        modal.show();

        // Handle download from preview
        document.getElementById('downloadFromPreview').onclick = () => this.generatePDF();
    }

    generatePreviewHTML(data) {
        return `
            <div class="text-center mb-4">
                <h1>${data.fullName}</h1>
                <div class="contact-info">
                    <span>${data.email}</span> | 
                    <span>${data.phone}</span>
                </div>
            </div>

            <div class="professional-summary mb-4">
                <h2>Professional Summary</h2>
                <p>${data.professionalSummary}</p>
            </div>

            <div class="experience-section">
                <h2>Work Experience</h2>
                ${this.generateExperienceHTML(data.experience)}
            </div>

            <div class="education-section">
                <h2>Education</h2>
                ${this.generateEducationHTML(data.education)}
            </div>

            <div class="skills-section">
                <h2>Skills</h2>
                <div class="technical-skills mb-3">
                    <h3>Technical Skills</h3>
                    <div class="skills-section">
                        ${data.technicalSkills.split(',').map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="soft-skills">
                    <h3>Soft Skills</h3>
                    <div class="skills-section">
                        ${data.softSkills.split(',').map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    generateExperienceHTML(experience) {
        return experience.map(exp => `
            <div class="experience-item">
                <h3>${exp.jobTitle}</h3>
                <div class="company-name">${exp.company}</div>
                <div class="date-range">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                <p>${exp.description}</p>
            </div>
        `).join('');
    }

    generateEducationHTML(education) {
        return education.map(edu => `
            <div class="education-item">
                <h3>${edu.degree}</h3>
                <div class="institution">${edu.institution}</div>
                <div class="date-range">Graduated: ${edu.graduationDate}</div>
                <div>${edu.fieldOfStudy}</div>
            </div>
        `).join('');
    }

    async updateScoreDisplay() {
        try {
            const response = await fetch('/api/resume/score');
            const scores = await response.json();

            // Update score circles and bars
            document.getElementById('overallScore').textContent = scores.overallScore;
            document.getElementById('completenessScore').textContent = `${scores.completeness}%`;
            document.getElementById('keywordScore').textContent = `${scores.keywordOptimization}%`;
            document.getElementById('experienceScore').textContent = `${scores.experienceImpact}%`;
            document.getElementById('skillsScore').textContent = `${scores.skillsMatch}%`;

            // Update progress bars
            document.getElementById('completenessBar').style.width = `${scores.completeness}%`;
            document.getElementById('keywordBar').style.width = `${scores.keywordOptimization}%`;
            document.getElementById('experienceBar').style.width = `${scores.experienceImpact}%`;
            document.getElementById('skillsBar').style.width = `${scores.skillsMatch}%`;

            // Update suggestions
            const suggestionsList = document.getElementById('suggestionsList');
            suggestionsList.innerHTML = scores.suggestions.map(suggestion => `
                <li class="list-group-item">
                    <span class="badge bg-primary me-2">${suggestion.category}</span>
                    ${suggestion.suggestion}
                </li>
            `).join('');
        } catch (error) {
            console.error('Error updating score:', error);
        }
    }
}

// Initialize the resume manager
const resumeManager = new ResumeManager(); 