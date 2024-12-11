
class ComponentLoader {
    static async loadAllComponents() {
        try {
            // Load all components
            await Promise.all([
                this.loadComponent('navbar-component', '/components/navbar.html'),
                this.loadComponent('sidebar-component', '/components/sidebar.html'),
                this.loadComponent('applications-component', '/components/applications.html'),
                this.loadComponent('preferences-component', '/components/preferences.html'),
                this.loadComponent('automation-component', '/components/automation.html'),
                this.loadComponent('subscription-component', '/components/subscription.html'),
                this.loadComponent('resume-component', '/components/resume.html'),
                this.loadComponent('profile-component', '/components/profile.html'),
                this.loadComponent('settings-component', '/components/settings.html'),
                this.loadComponent('application-details-modal', '/modals/application-details.html'),
                this.loadComponent('billing-history-modal', '/modals/billing-history.html'),
            ]);
            
            
           
           
            // Initialize navigation after components are loaded
            this.initializeNavigation();
            
            // Show initial section
            const initialSection = window.location.hash.slice(1) || 'applications';
            this.showSection(initialSection);
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    static async loadComponent(elementId, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load ${path}`);
            const html = await response.text();
            const container = document.getElementById(elementId);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component ${path}:`, error);
        }
    }

    static initializeNavigation() {
        // Add click handlers to all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const section = window.location.hash.slice(1) || 'applications';
            this.showSection(section);
        });
    }

    static showSection(sectionId) {
        // Update active state in sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Hide all sections
        document.querySelectorAll('[id$="-component"] section').forEach(section => {
            section.classList.add('d-none');
        });

        // Show selected section
        const targetSection = document.querySelector(`#${sectionId}-component section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        // Update URL hash without triggering a scroll
        window.history.pushState(null, '', `#${sectionId}`);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
});

