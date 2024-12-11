// import { preferencesService } from '../services/preferences.service.js';

let currentPreferences = null;
let hasUnsavedChanges = false;

export async function loadPreferences() {
    try {
        showLoadingState(true);
        const preferences = await preferencesService.getPreferences();
        currentPreferences = preferences;
        updateFormWithPreferences(preferences);
        hasUnsavedChanges = false;
        updateSaveButton();
    } catch (error) {
        console.error('Error loading preferences:', error);
        showError('Failed to load preferences');
    } finally {
        showLoadingState(false);
    }
}

export function setupEventListeners() {
    const form = document.getElementById('preferencesForm');
    
    // Track changes on all form inputs
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', () => {
            hasUnsavedChanges = true;
            updateSaveButton();
        });
    });

    // Save button handler
    document.getElementById('savePreferences').addEventListener('click', savePreferences);
}

async function savePreferences() {
    const saveButton = document.getElementById('savePreferences');
    try {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="bi bi-hourglass me-2"></i>Saving...';

        const preferences = getFormData();
        await preferencesService.updatePreferences(preferences);
        
        currentPreferences = preferences;
        hasUnsavedChanges = false;
        updateSaveButton();
        showNotification('Preferences saved successfully');
    } catch (error) {
        console.error('Error saving preferences:', error);
        showError('Failed to save preferences');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = '<i class="bi bi-save me-2"></i>Save Changes';
    }
}

function getFormData() {
    return {
        jobTypes: {
            fullTime: document.getElementById('fullTime').checked,
            contract: document.getElementById('contract').checked,
            remote: document.getElementById('remote').checked,
            hybrid: document.getElementById('hybrid').checked
        },
        location: {
            preferred: document.querySelector('input[placeholder="Add locations (comma-separated)"]')
                .value.split(',').map(loc => loc.trim()).filter(Boolean),
            maxDistance: parseInt(document.querySelector('.form-select').value)
        },
        salary: {
            min: parseInt(document.querySelector('input[value="80000"]').value),
            max: parseInt(document.querySelector('input[value="120000"]').value)
        },
        keywords: {
            include: document.querySelector('input[placeholder="Required keywords (comma-separated)"]')
                .value.split(',').map(kw => kw.trim()).filter(Boolean),
            exclude: document.querySelector('input[placeholder="Keywords to avoid (comma-separated)"]')
                .value.split(',').map(kw => kw.trim()).filter(Boolean)
        }
    };
}

function updateFormWithPreferences(preferences) {
    // Job Types
    document.getElementById('fullTime').checked = preferences.jobTypes.fullTime;
    document.getElementById('contract').checked = preferences.jobTypes.contract;
    document.getElementById('remote').checked = preferences.jobTypes.remote;
    document.getElementById('hybrid').checked = preferences.jobTypes.hybrid;

    // Location
    document.querySelector('input[placeholder="Add locations (comma-separated)"]')
        .value = preferences.location.preferred.join(', ');
    document.querySelector('.form-select').value = preferences.location.maxDistance;

    // Salary
    document.querySelector('input[value="80000"]').value = preferences.salary.min;
    document.querySelector('input[value="120000"]').value = preferences.salary.max;

    // Keywords
    document.querySelector('input[placeholder="Required keywords (comma-separated)"]')
        .value = preferences.keywords.include.join(', ');
    document.querySelector('input[placeholder="Keywords to avoid (comma-separated)"]')
        .value = preferences.keywords.exclude.join(', ');
}

function updateSaveButton() {
    const saveButton = document.getElementById('savePreferences');
    saveButton.disabled = !hasUnsavedChanges;
}

function showLoadingState(isLoading) {
    const form = document.getElementById('preferencesForm');
    const saveButton = document.getElementById('savePreferences');
    
    form.querySelectorAll('input, select').forEach(input => {
        input.disabled = isLoading;
    });
    
    saveButton.disabled = isLoading;
}

export function showNotification(message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    const toastBody = toast.querySelector('.toast-body');
    toast.className = `toast bg-${type} text-white`;
    toastBody.textContent = message;
    new bootstrap.Toast(toast).show();
}

export function showError(message) {
    showNotification(message, 'danger');
} 