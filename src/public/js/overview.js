import { dashboardService } from '../../services/dashboard.service.js';

// Export initialization function
export function initializeOverview() {
  loadDashboardData();
  setupEventListeners();
}

async function loadDashboardData() {
  try {
      // Show loading state (already in place)
      document.querySelectorAll('.stats-card .card-text').forEach(el => {
          el.innerHTML = `
              <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
          `;
      });

      // Fetch all dashboard data
      const [stats, recentApplications, automationStatus, automationLimits] = await Promise.all([
          dashboardService.getOverviewStats(),
          dashboardService.getRecentApplications(),
          dashboardService.getAutomationStatus(),
          dashboardService.getAutomationLimits()
      ]);

      // Update UI with fetched data
      updateStatsCards(stats);
      updateRecentApplications(recentApplications);
      updateAutomationStatus(automationStatus, automationLimits);

  } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Failed to load dashboard data');
  } finally {
    setAutomationLoadingState(false);
  }
}

function updateStatsCards(stats) {
  const {
    totalApplications,
    positiveResponses,
    scheduledInterviews,
    profileViews
  } = stats;

  document.querySelector('#applications-count').textContent = totalApplications;
  document.querySelector('#responses-count').textContent = positiveResponses;
  document.querySelector('#interviews-count').textContent = scheduledInterviews;
  document.querySelector('#views-count').textContent = profileViews;
}

function updateRecentApplications(applications) {
  const tbody = document.querySelector('#recent-applications');
  const actionsContainer = document.querySelector('#applications-actions');
  
  // Update the actions section
  actionsContainer.innerHTML = applications && applications.length > 0 
    ? '<a href="/applications" class="btn btn-sm btn-primary">View All</a>'
    : ''; // Empty if no applications

  // Check if there are no applications
  if (!applications || applications.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          <div class="no-data-state">
            <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No Applications Yet</h5>
            <p class="text-muted mb-3">You haven't submitted any job applications yet.</p>
            <a href="/jobs" class="btn btn-primary">
              <i class="fas fa-search"></i> Browse Jobs
            </a>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // If there are applications, show them as before
  tbody.innerHTML = applications.map(app => `
    <tr>
      <td>${escapeHtml(app.company)}</td>
      <td>${escapeHtml(app.position)}</td>
      <td>${new Date(app.date).toLocaleDateString()}</td>
      <td><span class="badge bg-${getStatusColor(app.status)}">${escapeHtml(app.status)}</span></td>
      <td><button class="btn btn-sm btn-outline-primary" data-id="${app.id}">View</button></td>
    </tr>
  `).join('');
}

function setAutomationLoadingState(isLoading) {
  const toggle = document.querySelector('#automationToggle');
  const progressBar = document.querySelector('.progress-bar');
  const remainingText = document.querySelector('.text-muted');

  toggle.disabled = isLoading;
  
  if (isLoading) {
    progressBar.style.width = '0%';
    progressBar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
    remainingText.textContent = 'Loading automation status...';
  }
}

function updateAutomationStatus(status, limits) {
  const toggle = document.querySelector('#automationToggle');
  const progressBar = document.querySelector('.progress-bar');
  const remainingText = document.querySelector('.text-muted');
  const statusLabel = document.querySelector('label[for="automationToggle"]');

  // Enable the toggle
  toggle.disabled = false;
  toggle.checked = status.enabled;

  // Update progress bar
  const usagePercentage = Math.round((limits.used / limits.daily) * 100);
  progressBar.style.width = `${usagePercentage}%`;
  progressBar.textContent = `${usagePercentage}% of daily limit used`;
  
  // Update color based on usage
  if (usagePercentage >= 90) {
    progressBar.className = 'progress-bar bg-danger';
  } else if (usagePercentage >= 70) {
    progressBar.className = 'progress-bar bg-warning';
  } else {
    progressBar.className = 'progress-bar bg-success';
  }

  // Update remaining applications text
  const remaining = limits.daily - limits.used;
  remainingText.textContent = `${remaining} applications remaining today`;

  // Update status label
  statusLabel.textContent = `Auto-apply ${status.enabled ? 'enabled' : 'disabled'}`;
}

function setupEventListeners() {
 // Automation toggle with loading state
 document.querySelector('#automationToggle').addEventListener('change', async (e) => {
  const toggle = e.target;
  const originalState = toggle.checked;
  
  try {
    toggle.disabled = true; // Disable during update
    const status = await dashboardService.toggleAutomation(originalState);
    
    // Fetch fresh limits after toggle
    const limits = await dashboardService.getAutomationLimits();
    
    // Update UI with new status
    updateAutomationStatus(status, limits);
    
      // Show success message
      showNotification(`Auto-apply ${status.enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling automation:', error);
      showError('Failed to update automation status');
      // Revert toggle state
      toggle.checked = !originalState;
    } finally {
      toggle.disabled = false;
    }
  });
  // View application buttons
  document.querySelector('#recent-applications').addEventListener('click', (e) => {
    if (e.target.matches('.btn-outline-primary')) {
      const applicationId = e.target.dataset.id;
      window.location.href = `/applications/${applicationId}`;
    }
  });
}

function getStatusColor(status) {
  const colors = {
    'Pending': 'warning',
    'Responded': 'success',
    'Rejected': 'danger',
    'Interview': 'info'
  };
  return colors[status] || 'secondary';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showError(message) {
  // Add error notification implementation
  alert(message); // Replace with your preferred notification system
}

// Add refresh functionality
export function refreshDashboard() {
  loadDashboardData();
}

// Optional: Add auto-refresh
let refreshInterval;

export function startAutoRefresh(intervalMs = 30000) {
  stopAutoRefresh(); // Clear any existing interval
  refreshInterval = setInterval(loadDashboardData, intervalMs);
}

export function stopAutoRefresh() {
  if (refreshInterval) {
      clearInterval(refreshInterval);
  }
}

function showNotification(message, type = 'success') {
  const toast = document.getElementById('notification-toast');
  const toastBody = toast.querySelector('.toast-body');
  
  toast.className = `toast bg-${type} text-white`;
  toastBody.textContent = message;
  
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}