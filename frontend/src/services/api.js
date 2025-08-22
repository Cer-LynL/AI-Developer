import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Repository endpoints
  async getRepositories() {
    const response = await api.get('/repositories');
    return response.data;
  },

  async connectRepository(repoData) {
    const response = await api.post('/repositories/connect', repoData);
    return response.data;
  },

  // Job endpoints
  async getJobs() {
    const response = await api.get('/jobs');
    return response.data;
  },

  async getJob(jobId) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Dashboard endpoints
  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Demo endpoints
  async triggerDemoCommit() {
    const response = await api.post('/demo/trigger-commit');
    return response.data;
  },

  // Webhook simulation
  async simulateWebhook(payload) {
    const response = await api.post('/webhook/github', payload);
    return response.data;
  },

  // Health check
  async healthCheck() {
    const response = await api.get('/');
    return response.data;
  },

  // Integration status checks
  async checkIntegrations() {
    try {
      const [ollama, slack, jira] = await Promise.allSettled([
        api.get('/integrations/ollama/health'),
        api.get('/integrations/slack/health'),
        api.get('/integrations/jira/health')
      ]);

      return {
        ollama: ollama.status === 'fulfilled' ? ollama.value.data : { status: 'error' },
        slack: slack.status === 'fulfilled' ? slack.value.data : { status: 'error' },
        jira: jira.status === 'fulfilled' ? jira.value.data : { status: 'error' }
      };
    } catch (error) {
      console.error('Failed to check integrations:', error);
      return {
        ollama: { status: 'error' },
        slack: { status: 'error' },
        jira: { status: 'error' }
      };
    }
  }
};

// Utility functions for data formatting
export const formatters = {
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  },

  formatDuration(seconds) {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  },

  formatJobStatus(status) {
    const statusMap = {
      'pending': { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
      'running': { label: 'Running', color: 'text-blue-400', bg: 'bg-blue-400/10' },
      'completed': { label: 'Completed', color: 'text-accent-green', bg: 'bg-accent-green/10' },
      'failed': { label: 'Failed', color: 'text-red-400', bg: 'bg-red-400/10' }
    };
    return statusMap[status] || { label: status, color: 'text-gray-400', bg: 'bg-gray-400/10' };
  },

  formatRepoName(url) {
    if (!url) return 'Unknown Repository';
    const parts = url.split('/');
    return parts[parts.length - 1].replace('.git', '');
  },

  truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

export default api;
