import { apiService } from './api.service.js';

export const dashboardService = {
  async getOverviewStats() {
    try {
      const stats = await apiService.get('dashboard/stats');
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getRecentApplications() {
    try {
      const applications = await apiService.get('applications/recent');
      return applications;
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      throw error;
    }
  },

  async getAutomationStatus() {
    try {
      const status = await apiService.get('automation/status');
      return status;
    } catch (error) {
      console.error('Error fetching automation status:', error);
      throw error;
    }
  },

  async toggleAutomation(enabled) {
    try {
      const status = await apiService.put('automation/settings', { enabled });
      return status;
    } catch (error) {
      console.error('Error updating automation status:', error);
      throw error;
    }
  },

  async getAutomationLimits() {
    try {
      const limits = await apiService.get('automation/limits');
      return limits;
    } catch (error) {
      console.error('Error fetching automation limits:', error);
      throw error;
    }
  }
};