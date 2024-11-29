import { apiService } from './api.service.js';

export const applicationsService = {
  async getAllApplications() {
    try {
      return await apiService.get('applications');
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  async getApplicationById(id) {
    try {
      return await apiService.get(`applications/${id}`);
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  async updateApplication(id, data) {
    try {
      return await apiService.put(`applications/${id}`, data);
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  async deleteApplication(id) {
    try {
      return await apiService.delete(`applications/${id}`);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  async createApplication(data) {
    try {
      return await apiService.post('applications', data);
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }
}; 