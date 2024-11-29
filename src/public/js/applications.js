import { applicationsService } from '../services/applications.service.js';

// State management
let currentApplications = [];
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let refreshInterval;

// Main functions
export async function loadApplications() {
    try {
        showLoadingStates();
        const applications = await applicationsService.getAllApplications();
        currentApplications = applications;
        
        if (!applications || applications.length === 0) {
            showEmptyState();
            return;
        }
        
        updateStatistics(applications);
        updateApplicationsTable(applications);
        updatePagination(applications.length);
        
    } catch (error) {
        console.error('Error loading applications:', error);
        showError('Failed to load applications');
    }
}

export function setupEventListeners() {
    setupSearch();
    setupStatusFilter();
    setupApplicationForm();
}

export function startAutoRefresh(interval) {
    stopAutoRefresh();
    refreshInterval = setInterval(loadApplications, interval);
}

export function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// UI Update functions
function showLoadingStates() {
    document.querySelectorAll('.stats-card h2').forEach(el => {
        el.innerHTML = '<div class="spinner-border spinner-border-sm"></div>';
    });
    
    document.querySelector('#applicationsTableBody').innerHTML = createLoadingRow(7);
}

function updateStatistics(applications) {
    const stats = calculateStats(applications);
    updateStatsDisplay(stats);
}

function updateApplicationsTable(applications) {
    const tableBody = document.querySelector('#applicationsTableBody');
    const paginatedApps = paginateApplications(applications);
    
    if (paginatedApps.length === 0) {
        tableBody.innerHTML = createEmptyRow();
        return;
    }
    
    tableBody.innerHTML = paginatedApps.map(createApplicationRow).join('');
    updatePaginationInfo(applications.length);
}

// Event Listeners
function setupSearch() {
    const searchInput = document.getElementById('applicationSearch');
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = filterApplications(searchTerm);
        updateApplicationsTable(filtered);
        updatePagination(filtered.length);
    }, 300));
}

function setupStatusFilter() {
    document.querySelector('.dropdown-menu').addEventListener('click', (e) => {
        if (e.target.matches('[data-filter]')) {
            e.preventDefault();
            const filter = e.target.dataset.filter;
            const filtered = filterByStatus(filter);
            updateApplicationsTable(filtered);
            updatePagination(filtered.length);
        }
    });
}

function setupApplicationForm() {
    const saveButton = document.getElementById('saveApplication');
    if (!saveButton) return;

    saveButton.addEventListener('click', handleApplicationSubmit);
}

// Helper functions
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

// ... other helper functions ... 