class DashboardManager {

    constructor() {
        this.initializeListerEvents()
    }

    
    initializeListerEvents() {
        // Add active class to current nav item
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                document.querySelector('.nav-link.active').classList.remove('active');
                this.classList.add('active');
            });
        });

        // Toggle automation
        document.getElementById('automationToggle').addEventListener('change', async function() {
            try {
                const response = await fetch('/api/automation/toggle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        enabled: this.checked
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update automation status');
                }
            } catch (error) {
                console.error('Error:', error);
                this.checked = !this.checked; // Revert the toggle if there's an error
            }
        });

        // Add this to your existing script section
        document.addEventListener('DOMContentLoaded', function() {
            // Section Navigation
            const sections = ['overview', 'applications', 'preferences', 'resume', 'automation', 'subscription', 'profile', 'settings'];
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    sections.forEach(section => {
                        const element = document.getElementById(section);
                        if (element) {
                            if (section === targetId) {
                                element.classList.remove('d-none');
                            } else {
                                element.classList.add('d-none');
                            }
                        }
                    });
                });
            });

            // Add Experience Button
            document.getElementById('addExperience')?.addEventListener('click', function() {
                const container = document.getElementById('experienceContainer');
                const experienceCard = container.children[0].cloneNode(true);
                // Clear input values
                experienceCard.querySelectorAll('input, textarea').forEach(input => input.value = '');
                container.appendChild(experienceCard);
            });

            // Add Education Button
            document.getElementById('addEducation')?.addEventListener('click', function() {
                const container = document.getElementById('educationContainer');
                const educationCard = container.children[0].cloneNode(true);
                // Clear input values
                educationCard.querySelectorAll('input').forEach(input => input.value = '');
                container.appendChild(educationCard);
            });

            // Save Preferences
            document.getElementById('savePreferences')?.addEventListener('click', async function() {
                try {
                    // Collect form data and send to server
                    const formData = new FormData(document.getElementById('preferencesForm'));
                    const response = await fetch('/api/preferences/save', {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        // Show success message
                        alert('Preferences saved successfully!');
                    }
                } catch (error) {
                    console.error('Error saving preferences:', error);
                    alert('Failed to save preferences. Please try again.');
                }
            });

            // Save Resume
            document.getElementById('saveResume')?.addEventListener('click', async function() {
                try {
                    // Collect form data and send to server
                    const formData = new FormData(document.getElementById('resumeForm'));
                    const response = await fetch('/api/resume/save', {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        // Show success message
                        alert('Resume saved successfully!');
                    }
                } catch (error) {
                    console.error('Error saving resume:', error);
                    alert('Failed to save resume. Please try again.');
                }
            });

            // Logout Button Handler
            document.getElementById('logoutBtn')?.addEventListener('click', async function() {
                if (confirm('Are you sure you want to logout?')) {
                    try {
                        const response = await fetch('/auth/logout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            // Redirect to login page after successful logout
                            window.location.href = '/login';
                        } else {
                            throw new Error('Logout failed');
                        }
                    } catch (error) {
                        console.error('Error during logout:', error);
                        alert('Failed to logout. Please try again.');
                    }
                }
            });
        });
    }
}

