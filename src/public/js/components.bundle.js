/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components.js":
/*!******************************!*\
  !*** ./src/js/components.js ***!
  \******************************/
/***/ (() => {

eval("\nclass ComponentLoader {\n    static async loadAllComponents() {\n        try {\n            // Load all components\n            await Promise.all([\n                this.loadComponent('navbar-component', '/components/navbar.html'),\n                this.loadComponent('sidebar-component', '/components/sidebar.html'),\n                this.loadComponent('applications-component', '/components/applications.html'),\n                this.loadComponent('preferences-component', '/components/preferences.html'),\n                this.loadComponent('automation-component', '/components/automation.html'),\n                this.loadComponent('subscription-component', '/components/subscription.html'),\n                this.loadComponent('resume-component', '/components/resume.html'),\n                this.loadComponent('profile-component', '/components/profile.html'),\n                this.loadComponent('settings-component', '/components/settings.html'),\n                this.loadComponent('application-details-modal', '/modals/application-details.html'),\n                this.loadComponent('billing-history-modal', '/modals/billing-history.html'),\n            ]);\n            \n            \n           \n           \n            // Initialize navigation after components are loaded\n            this.initializeNavigation();\n            \n            // Show initial section\n            const initialSection = window.location.hash.slice(1) || 'applications';\n            this.showSection(initialSection);\n        } catch (error) {\n            console.error('Error loading components:', error);\n        }\n    }\n\n    static async loadComponent(elementId, path) {\n        try {\n            const response = await fetch(path);\n            if (!response.ok) throw new Error(`Failed to load ${path}`);\n            const html = await response.text();\n            const container = document.getElementById(elementId);\n            if (container) {\n                container.innerHTML = html;\n            }\n        } catch (error) {\n            console.error(`Error loading component ${path}:`, error);\n        }\n    }\n\n    static initializeNavigation() {\n        // Add click handlers to all nav links\n        document.querySelectorAll('.nav-link').forEach(link => {\n            link.addEventListener('click', (e) => {\n                e.preventDefault();\n                const section = link.getAttribute('data-section');\n                if (section) {\n                    this.showSection(section);\n                }\n            });\n        });\n\n        // Handle browser back/forward buttons\n        window.addEventListener('popstate', () => {\n            const section = window.location.hash.slice(1) || 'applications';\n            this.showSection(section);\n        });\n    }\n\n    static showSection(sectionId) {\n        // Update active state in sidebar\n        document.querySelectorAll('.nav-link').forEach(link => {\n            link.classList.remove('active');\n            if (link.getAttribute('data-section') === sectionId) {\n                link.classList.add('active');\n            }\n        });\n\n        // Hide all sections\n        document.querySelectorAll('[id$=\"-component\"] section').forEach(section => {\n            section.classList.add('d-none');\n        });\n\n        // Show selected section\n        const targetSection = document.querySelector(`#${sectionId}-component section`);\n        if (targetSection) {\n            targetSection.classList.remove('d-none');\n        }\n\n        // Update URL hash without triggering a scroll\n        window.history.pushState(null, '', `#${sectionId}`);\n    }\n}\n\n// Initialize when DOM is loaded\ndocument.addEventListener('DOMContentLoaded', () => {\n    ComponentLoader.loadAllComponents();\n});\n\n\n\n//# sourceURL=webpack://qravity/./src/js/components.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/components.js"]();
/******/ 	
/******/ })()
;