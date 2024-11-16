class ProfileSettingsManager {
    constructor() {
        this.initializeEventListeners();
        this.loadProfileAndSettings();
    }

    initializeEventListeners() {
        // Profile form submissions
        document.getElementById('saveProfile')?.addEventListener('click', () => {
            this.saveProfile();
        });

        // Settings form submissions
        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.saveSettings();
        });

        // Profile picture upload
        document.getElementById('profilePictureInput')?.addEventListener('change', (e) => {
            this.handleProfilePictureUpload(e.target.files[0]);
        });

        // Password change
        document.getElementById('accountSettingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // 2FA toggle
        document.getElementById('enable2FA')?.addEventListener('change', (e) => {
            this.toggle2FA(e.target.checked);
        });

        // Form field changes for profile completion calculation
        document.querySelectorAll('#summaryForm input, #summaryForm textarea')
            .forEach(input => {
                input.addEventListener('change', () => this.updateProfileCompletion());
            });

        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    async loadProfileAndSettings() {
        try {
            const [profile, settings] = await Promise.all([
                fetch('/api/profile').then(res => res.json()),
                fetch('/api/settings').then(res => res.json())
            ]);

            this.populateProfile(profile);
            this.populateSettings(settings);
        } catch (error) {
            console.error('Error loading profile and settings:', error);
            this.showError('Failed to load profile and settings');
        }
    }

    async saveProfile() {
        try {
            const profileData = {
                personalInfo: {
                    title: document.querySelector('[name="title"]').value,
                    summary: document.querySelector('[name="summary"]').value
                },
                contact: {
                    email: document.querySelector('[name="email"]').value,
                    phone: document.querySelector('[name="phone"]').value,
                    location: document.querySelector('[name="location"]').value,
                    website: document.querySelector('[name="website"]').value,
                    linkedin: document.querySelector('[name="linkedin"]').value
                },
                social: {
                    github: document.querySelector('[name="github"]').value,
                    twitter: document.querySelector('[name="twitter"]').value,
                    stackoverflow: document.querySelector('[name="stackoverflow"]').value
                },
                skills: document.querySelector('[name="skills"]').value
                    .split(',')
                    .map(skill => ({ name: skill.trim() }))
            };

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) throw new Error('Failed to save profile');

            this.showSuccess('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showError('Failed to save profile');
        }
    }

    async saveSettings() {
        try {
            const settingsData = {
                privacy: {
                    profileVisibility: document.querySelector('[name="profileVisibility"]').value,
                    showEmail: document.getElementById('showEmail').checked,
                    showPhone: document.getElementById('showPhone').checked
                },
                notifications: {
                    email: {
                        jobAlerts: document.getElementById('emailJobAlerts').checked,
                        applicationUpdates: document.getElementById('emailApplicationUpdates').checked,
                        messages: document.getElementById('emailMessages').checked
                    },
                    push: {
                        jobAlerts: document.getElementById('pushJobAlerts').checked,
                        applicationUpdates: document.getElementById('pushApplicationUpdates').checked,
                        messages: document.getElementById('pushMessages').checked
                    }
                },
                jobPreferences: {
                    jobTypes: Array.from(document.querySelector('[name="jobType"]').selectedOptions)
                        .map(option => option.value),
                    workLocations: Array.from(document.querySelector('[name="workLocation"]').selectedOptions)
                        .map(option => option.value),
                    salary: {
                        min: document.querySelector('[name="minSalary"]').value,
                        max: document.querySelector('[name="maxSalary"]').value
                    },
                    industries: document.querySelector('[name="industries"]').value
                        .split(',')
                        .map(industry => industry.trim())
                }
            };

            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settingsData)
            });

            if (!response.ok) throw new Error('Failed to save settings');

            this.showSuccess('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showError('Failed to save settings');
        }
    }

    async handleProfilePictureUpload(file) {
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await fetch('/api/profile/picture', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload profile picture');

            const { imageUrl } = await response.json();
            document.getElementById('profilePicture').src = imageUrl;
            this.showSuccess('Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            this.showError('Failed to upload profile picture');
        }
    }

    async changePassword() {
        try {
            const currentPassword = document.querySelector('[name="currentPassword"]').value;
            const newPassword = document.querySelector('[name="newPassword"]').value;
            const confirmPassword = document.querySelector('[name="confirmPassword"]').value;

            if (newPassword !== confirmPassword) {
                throw new Error('New passwords do not match');
            }

            const response = await fetch('/api/settings/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!response.ok) throw new Error('Failed to change password');

            this.showSuccess('Password changed successfully');
            document.getElementById('accountSettingsForm').reset();
        } catch (error) {
            console.error('Error changing password:', error);
            this.showError(error.message);
        }
    }

    async toggle2FA(enabled) {
        try {
            const response = await fetch('/api/settings/2fa/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled })
            });

            if (!response.ok) throw new Error('Failed to toggle 2FA');

            const result = await response.json();
            if (result.enabled && result.qrCode) {
                this.show2FAQRCode(result.qrCode);
            }

            this.showSuccess(`2FA ${enabled ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            console.error('Error toggling 2FA:', error);
            this.showError('Failed to toggle 2FA');
            document.getElementById('enable2FA').checked = !enabled;
        }
    }

    async handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Redirect to login page
                    window.location.href = '/login';
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                this.showError('Failed to logout. Please try again.');
            }
        }
    }

    // Helper methods
    showSuccess(message) {
        // Implement your success notification
        console.log('Success:', message);
    }

    showError(message) {
        // Implement your error notification
        console.error('Error:', message);
    }

    show2FAQRCode(qrCode) {
        // Implement QR code display modal
        console.log('QR Code:', qrCode);
    }

    updateProfileCompletion() {
        // Calculate and update profile completion percentage
        const totalFields = document.querySelectorAll('#summaryForm [required]').length;
        const completedFields = Array.from(document.querySelectorAll('#summaryForm [required]'))
            .filter(input => input.value.trim() !== '').length;
        
        const percentage = Math.round((completedFields / totalFields) * 100);
        document.querySelector('.progress-bar').style.width = `${percentage}%`;
        document.querySelector('.progress-bar').textContent = `${percentage}%`;
    }
}

// Initialize the manager
const profileSettingsManager = new ProfileSettingsManager(); 