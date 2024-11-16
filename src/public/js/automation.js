class AutomationManager {
    constructor() {
        this.form = document.getElementById('automationForm');
        this.saveButton = document.getElementById('saveAutomationSettings');
        this.initializeEventListeners();
        this.loadSettings();
    }

    initializeEventListeners() {
        this.saveButton.addEventListener('click', () => this.saveSettings());
        
        // Toggle dependent fields based on automation status
        document.getElementById('enableAutomation').addEventListener('change', (e) => {
            const formInputs = this.form.querySelectorAll('input:not(#enableAutomation), select');
            formInputs.forEach(input => {
                input.disabled = !e.target.checked;
            });
        });

        // Update daily progress when limit changes
        document.getElementById('dailyLimit').addEventListener('change', (e) => {
            this.updateDailyProgress();
        });
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/automation/settings');
            if (!response.ok) throw new Error('Failed to load settings');
            
            const settings = await response.json();
            this.populateForm(settings);
            this.updateDailyProgress();
        } catch (error) {
            console.error('Error loading automation settings:', error);
        }
    }

    async saveSettings() {
        try {
            const settings = this.getFormData();
            const response = await fetch('/api/automation/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to save settings');
            
            alert('Automation settings saved successfully!');
        } catch (error) {
            console.error('Error saving automation settings:', error);
            alert('Failed to save settings. Please try again.');
        }
    }

    getFormData() {
        return {
            enabled: document.getElementById('enableAutomation').checked,
            dailyLimit: parseInt(document.getElementById('dailyLimit').value),
            applicationInterval: parseInt(document.getElementById('applicationInterval').value),
            minSalary: parseInt(document.getElementById('minSalary').value),
            maxDistance: parseInt(document.getElementById('maxDistance').value),
            requiredKeywords: document.getElementById('requiredKeywords').value.split(',').map(k => k.trim()),
            excludedKeywords: document.getElementById('excludedKeywords').value.split(',').map(k => k.trim()),
            platforms: {
                linkedin: document.getElementById('linkedinEnabled').checked,
                indeed: document.getElementById('indeedEnabled').checked,
                glassdoor: document.getElementById('glassdoorEnabled').checked
            }
        };
    }

    populateForm(settings) {
        document.getElementById('enableAutomation').checked = settings.enabled;
        document.getElementById('dailyLimit').value = settings.dailyLimit;
        document.getElementById('applicationInterval').value = settings.applicationInterval;
        document.getElementById('minSalary').value = settings.minSalary;
        document.getElementById('maxDistance').value = settings.maxDistance;
        document.getElementById('requiredKeywords').value = settings.requiredKeywords.join(', ');
        document.getElementById('excludedKeywords').value = settings.excludedKeywords.join(', ');
        document.getElementById('linkedinEnabled').checked = settings.platforms.linkedin;
        document.getElementById('indeedEnabled').checked = settings.platforms.indeed;
        document.getElementById('glassdoorEnabled').checked = settings.platforms.glassdoor;
    }

    updateDailyProgress() {
        // Implementation to update daily progress
    }
} 