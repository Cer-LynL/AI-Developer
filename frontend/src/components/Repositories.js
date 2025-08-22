import React, { useState } from 'react';
import { GitBranch, Plus, ExternalLink, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { formatters } from '../services/api';

const Repositories = ({ repositories, onConnectRepository, onRefresh }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [formData, setFormData] = useState({
    repo_name: '',
    repo_url: '',
    access_token: ''
  });

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    
    try {
      const success = await onConnectRepository(formData);
      if (success) {
        setShowConnectModal(false);
        setFormData({ repo_name: '', repo_url: '', access_token: '' });
      }
    } catch (error) {
      console.error('Failed to connect repository:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill repo name from URL
    if (name === 'repo_url' && value) {
      const repoName = formatters.formatRepoName(value);
      if (repoName !== 'Unknown Repository') {
        setFormData(prev => ({ ...prev, repo_name: repoName }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Connected Repositories</h1>
          <p className="text-gray-400 mt-2">Manage repositories monitored by the autonomous agent</p>
        </div>
        
        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center space-x-2 bg-accent-green hover:bg-accent-green-dark px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Connect Repository</span>
        </button>
      </div>

      {/* Repository Grid */}
      {repositories.length === 0 ? (
        <div className="text-center py-16">
          <GitBranch className="h-16 w-16 text-gray-500 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">No Repositories Connected</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Connect your first repository to start autonomous development monitoring and improvements.
          </p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="bg-accent-green hover:bg-accent-green-dark px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Connect Your First Repository
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      )}

      {/* Connect Repository Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-app">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Connect Repository</h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repository URL
                </label>
                <input
                  type="url"
                  name="repo_url"
                  value={formData.repo_url}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-2 bg-hover border border-app rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repository Name
                </label>
                <input
                  type="text"
                  name="repo_name"
                  value={formData.repo_name}
                  onChange={handleInputChange}
                  placeholder="my-awesome-project"
                  className="w-full px-3 py-2 bg-hover border border-app rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Token (Optional)
                </label>
                <input
                  type="password"
                  name="access_token"
                  value={formData.access_token}
                  onChange={handleInputChange}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 bg-hover border border-app rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for private repositories
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 px-4 py-2 border border-app text-gray-300 rounded-lg hover:bg-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="flex-1 bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RepositoryCard = ({ repository }) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-app hover:border-accent-green transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-accent-green/10 p-2 rounded-lg">
            <GitBranch className="h-5 w-5 text-accent-green" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{repository.name}</h3>
            <p className="text-gray-400 text-sm">Connected Repository</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-accent-green rounded-full"></div>
          <span className="text-xs text-accent-green">Active</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Status</span>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-accent-green" />
            <span className="text-accent-green">Connected</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Connected</span>
          <span className="text-white">{formatters.formatDate(repository.connected_at)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Last Commit</span>
          <span className="text-white">{repository.last_commit || 'N/A'}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-app">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-hover hover:bg-accent-green/10 text-gray-300 hover:text-accent-green rounded-lg transition-colors text-sm">
            <ExternalLink className="h-4 w-4" />
            <span>View Repository</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Repositories;
