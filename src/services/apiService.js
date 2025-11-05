import axios from 'axios';
import { API_URL } from '../config/constants';
import ErrorHandler from './errorHandler';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add wallet address to headers if available
        const address = localStorage.getItem('walletAddress');
        if (address) {
          config.headers['X-Wallet-Address'] = address;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.data?.error;

          if (status === 401) {
            // Unauthorized - clear auth state
            localStorage.removeItem('walletAddress');
            window.location.href = '/';
          } else if (status === 404) {
            console.warn('Resource not found:', error.config.url);
          } else if (status === 500) {
            console.error('Server error:', error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Projects
  async createProject(data) {
    const response = await this.client.post('/api/projects', data);
    return response.data;
  }

  async getProjects(params = {}) {
    const response = await this.client.get('/api/projects', { params });
    return response.data;
  }

  async getProject(id) {
    const response = await this.client.get(`/api/projects/${id}`);
    return response.data;
  }

  async getMyProjects(role = 'all') {
    const response = await this.client.get(`/api/projects/my?role=${role}`);
    return response.data;
  }

  async updateProject(id, data) {
    const response = await this.client.put(`/api/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id) {
    const response = await this.client.delete(`/api/projects/${id}`);
    return response.data;
  }

  // Applications
  async submitApplication(projectId, data) {
    const response = await this.client.post(`/api/projects/${projectId}/apply`, data);
    return response.data;
  }

  async getApplications(projectId) {
    const response = await this.client.get(`/api/projects/${projectId}/applications`);
    return response.data;
  }

  async getMyApplications() {
    const response = await this.client.get('/api/applications/my');
    return response.data;
  }

  async approveApplication(applicationId) {
    const response = await this.client.put(`/api/applications/${applicationId}/approve`);
    return response.data;
  }

  async rejectApplication(applicationId, reason) {
    const response = await this.client.put(`/api/applications/${applicationId}/reject`, { reason });
    return response.data;
  }

  async withdrawApplication(applicationId) {
    const response = await this.client.delete(`/api/applications/${applicationId}`);
    return response.data;
  }

  // Milestones
  async getMilestones(projectId) {
    const response = await this.client.get(`/api/projects/${projectId}/milestones`);
    return response.data;
  }

  async submitMilestone(milestoneId, data) {
    const response = await this.client.put(`/api/milestones/${milestoneId}/submit`, data);
    return response.data;
  }

  async approveMilestone(milestoneId, txHash) {
    const response = await this.client.put(`/api/milestones/${milestoneId}/approve`, { txHash });
    return response.data;
  }

  async rejectMilestone(milestoneId, reason) {
    const response = await this.client.put(`/api/milestones/${milestoneId}/reject`, { reason });
    return response.data;
  }

  // Disputes
  async fileDispute(data) {
    const response = await this.client.post('/api/disputes', data);
    return response.data;
  }

  async getDisputes(params = {}) {
    const response = await this.client.get('/api/disputes', { params });
    return response.data;
  }

  async getDispute(id) {
    const response = await this.client.get(`/api/disputes/${id}`);
    return response.data;
  }

  async resolveDispute(id, resolution) {
    const response = await this.client.put(`/api/disputes/${id}/resolve`, resolution);
    return response.data;
  }

  // IP Assets
  async getIPAssets(owner) {
    const response = await this.client.get(`/api/ip-assets?owner=${owner}`);
    return response.data;
  }

  async getIPAsset(id) {
    const response = await this.client.get(`/api/ip-assets/${id}`);
    return response.data;
  }

  async registerIPAsset(data) {
    const response = await this.client.post('/api/ip-assets', data);
    return response.data;
  }

  // Earnings
  async getEarnings(address) {
    const response = await this.client.get(`/api/earnings/${address}`);
    return response.data;
  }

  async getTransactionHistory(address) {
    const response = await this.client.get(`/api/transactions/${address}`);
    return response.data;
  }

  // User Profile
  async getProfile(address) {
    const response = await this.client.get(`/api/users/${address}`);
    return response.data;
  }

  async updateProfile(address, data) {
    const response = await this.client.put(`/api/users/${address}`, data);
    return response.data;
  }

  async createProfile(data) {
    const response = await this.client.post('/api/users', data);
    return response.data;
  }

  // Notifications
  async getNotifications(address) {
    const response = await this.client.get(`/api/notifications/${address}`);
    return response.data;
  }

  async markNotificationRead(id) {
    const response = await this.client.put(`/api/notifications/${id}/read`);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export default new APIService();
