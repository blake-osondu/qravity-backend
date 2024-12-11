import { applicationsService } from '../services/applications.service.js';

// State management
let currentApplications = [];
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let refreshInterval;


    // Main functions
    async function loadApplications() {
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

    function setupEventListeners() {

        setTimeout(setupSearch, 3000);
        setTimeout(setupStatusFilter, 3000);
        setTimeout(setupApplicationForm, 3000);
    }

    function startAutoRefresh(interval) {
        stopAutoRefresh();
        refreshInterval = setInterval(loadApplications, interval);
    }

    function stopAutoRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    }

    // UI Update functions
    function showLoadingStates() {
        document.querySelectorAll('.stats-card h2').forEach(el => {
            el.innerHTML = '<div class="spinner-border spinner-border-sm"></div>';
        });
        //not sure what this intented to do
        // document.querySelector('#applicationsTableBody').innerHTML = createLoadingRow(7);
    }

    function showEmptyState() {
        const tableBody = document.querySelector('#applicationsTableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <h5 class="mt-3">No Applications Found</h5>
                        <p class="text-muted">Start tracking your job applications by clicking the "Add Application" button.</p>
                    </div>
                </td>
            </tr>
        `;
    }

    function updateStatistics(applications) {
    
        const stats = calculateStats(applications);

        updateStatsDisplay(stats);
    }

    function calculateStats(applications) {
        return {
            total: applications.length,
            pending: applications.filter(app => app.status === 'Pending').length,
            applied: applications.filter(app => app.status === 'Applied').length,
            interviewing: applications.filter(app => app.status === 'Interviewing').length,
            offered: applications.filter(app => app.status === 'Offered').length,
            rejected: applications.filter(app => app.status === 'Rejected').length
        };
    }

    function updateStatsDisplay(stats) {
        document.getElementById('totalApplications').textContent = stats.total;
        document.getElementById('pendingApplications').textContent = stats.pending;
        document.getElementById('activeApplications').textContent = stats.applied + stats.interviewing;
        document.getElementById('successfulApplications').textContent = stats.offered;
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

    function createApplicationRow(application) {
        const statusClass = getStatusClass(application.status);
        const formattedDate = new Date(application.appliedDate).toLocaleDateString();
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div>
                            <h6 class="mb-0">${application.company}</h6>
                            <small class="text-muted">${application.position}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${statusClass}">${application.status}</span>
                </td>
                <td>${application.source || 'N/A'}</td>
                <td>${formattedDate}</td>
                <td>${application.nextStep || 'No next step'}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="editApplication('${application._id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="deleteApplication('${application._id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    function createEmptyRow() {
        return `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="mt-2 mb-0">No applications found</p>
                    </div>
                </td>
            </tr>
        `;
    }

    function getStatusClass(status) {
        const statusClasses = {
            'Pending': 'bg-warning text-dark',
            'Applied': 'bg-info text-white',
            'Interviewing': 'bg-primary text-white',
            'Offered': 'bg-success text-white',
            'Rejected': 'bg-danger text-white',
            'Withdrawn': 'bg-secondary text-white'
        };
        
        return statusClasses[status] || 'bg-secondary text-white';
    }

    // Add these helper functions for edit and delete operations
    async function editApplication(id) {
        try {
            const application = await applicationsService.getApplicationById(id);
            // Populate form with application data
            const form = document.getElementById('applicationForm');
            form.elements.company.value = application.company;
            form.elements.position.value = application.position;
            form.elements.status.value = application.status;
            form.elements.source.value = application.source;
            form.elements.appliedDate.value = new Date(application.appliedDate)
                .toISOString().split('T')[0];
            form.elements.notes.value = application.notes;
            
            // Store application ID for update
            form.dataset.applicationId = id;
            
            // Show modal
            new bootstrap.Modal(document.getElementById('applicationDetailsModal')).show();
        } catch (error) {
            console.error('Error loading application:', error);
            showError('Failed to load application details');
        }
    }

    async function deleteApplication(id) {
        if (!confirm('Are you sure you want to delete this application?')) {
            return;
        }
        
        try {
            await applicationsService.deleteApplication(id);
            await loadApplications();
            showNotification('Application deleted successfully');
        } catch (error) {
            console.error('Error deleting application:', error);
            showError('Failed to delete application');
        }
    }

    function paginateApplications(applications) {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return applications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }

    function updatePaginationInfo(totalApplications) {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalApplications);
        
        document.getElementById('showingStart').textContent = totalApplications ? startIndex : 0;
        document.getElementById('showingEnd').textContent = endIndex;
        document.getElementById('totalEntries').textContent = totalApplications;
    
        // Update pagination buttons
        const paginationElement = document.getElementById('applicationsPagination');
        const totalPages = Math.ceil(totalApplications / ITEMS_PER_PAGE);
        
        let paginationHTML = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;
    

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `;
        paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
        `;

        paginationElement.innerHTML = paginationHTML;

        // Add click handlers to pagination buttons
        paginationElement.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.dataset.page);
            if (newPage && newPage !== currentPage) {
                currentPage = newPage;
                updateApplicationsTable(currentApplications);
            }
        });
        });
        }
    // Event Listeners
    function setupSearch() {
       
        console.log('will setup search');

        

        function updateApplicationsTable(filteredApplications) {
            //This needs to be defined
        };

        
        function performUpdates() {
            setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                const filtered = filterApplications(searchTerm);
                updateApplicationsTable(filtered);
                updatePaginationInfo(filtered.length);
            }, 300);
        }

        const searchInput = document.getElementById('applicationSearch');
        searchInput.addEventListener('input', performUpdates);
    }

    function filterApplications(term) {
        if (!term) return currentApplications;
        
        return currentApplications.filter(app => 
            app.company.toLowerCase().includes(term) ||
            app.position.toLowerCase().includes(term) ||
            app.status.toLowerCase().includes(term)
        );
    }

    function setupStatusFilter() {
        console.log('will set up status filter');


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

    function filterByStatus(status) {
        if (status === 'all') return currentApplications;
        
        return currentApplications.filter(app => 
            app.status.toLowerCase() === status.toLowerCase()
        );
    }

    function setupApplicationForm() {
        console.log('will set up application form');
        const saveButton = document.getElementById('saveApplication');
        if (!saveButton) return;

        saveButton.addEventListener('click', handleApplicationSubmit);
    }

    async function handleApplicationSubmit(e) {
        e.preventDefault();
        
        const form = document.getElementById('applicationForm');
        const formData = new FormData(form);
        
        try {
            const applicationData = {
                company: formData.get('company'),
                position: formData.get('position'),
                status: formData.get('status'),
                source: formData.get('source'),
                appliedDate: formData.get('appliedDate'),
                notes: formData.get('notes')
            };
    
            const response = await applicationsService.createApplication(applicationData);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('applicationDetailsModal'));
            modal.hide();
            
            // Refresh applications list
            await loadApplications();
            
            showNotification('Application added successfully');
            form.reset();
            
        } catch (error) {
            console.error('Error submitting application:', error);
            showError('Failed to add application');
        }
    }
    
    // Helper functions
    function showNotification(message, type = 'success') {
        const toast = document.getElementById('notification-toast');
        const toastBody = toast.querySelector('.toast-body');
        toast.className = `toast bg-${type} text-white`;
        toastBody.textContent = message;
        new bootstrap.Toast(toast).show();
    }

    function showError(message) {
        showNotification(message, 'danger');
    }

    loadApplications();
    setupEventListeners();
    // startAutoRefresh(30000); // Refresh every 30 seconds
