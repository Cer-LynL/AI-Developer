import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Bot, MessageSquare, Clipboard } from 'lucide-react';
import { apiService } from '../services/api';

const Integrations = () => {
  const [integrations, setIntegrations] = useState({
    ollama: { status: 'checking', name: 'Ollama LLM', description: 'AI model for code analysis and fixes' },
    slack: { status: 'checking', name: 'Slack', description: 'Team notifications and updates' },
    jira: { status: 'checking', name: 'Jira', description: 'Roadmap and ticket management' },
    github: { status: 'connected', name: 'GitHub', description: 'Git repository integration' }
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkIntegrationStatus();
  }, []);

  const checkIntegrationStatus = async () => {
    setIsRefreshing(true);
    try {
      // Simulate checking integrations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => ({
        ...prev,
        ollama: { ...prev.ollama, status: 'connected', version: 'codellama:7b', uptime: '2h 15m' },
        slack: { ...prev.slack, status: 'connected', webhook: 'configured', notifications: 12 },
        jira: { ...prev.jira, status: 'connected', project: 'PROJ', tickets: 5 },
        github: { ...prev.github, status: 'connected', repos: 1, webhooks: 'active' }
      }));
    } catch (error) {
      console.error('Failed to check integrations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-accent-green" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'checking':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-green"></div>;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-accent-green bg-accent-green/10';
      case 'error':
        return 'text-red-400 bg-red-400/10';
      case 'checking':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Integrations</h1>
          <p className="text-gray-400 mt-2">Manage external service connections and configurations</p>
        </div>
        
        <button
          onClick={checkIntegrationStatus}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ollama Integration */}
        <IntegrationCard
          icon={<Bot className="h-6 w-6" />}
          name={integrations.ollama.name}
          description={integrations.ollama.description}
          status={integrations.ollama.status}
          statusIcon={getStatusIcon(integrations.ollama.status)}
          statusColor={getStatusColor(integrations.ollama.status)}
          details={[
            { label: 'Model', value: integrations.ollama.version || 'N/A' },
            { label: 'Uptime', value: integrations.ollama.uptime || 'N/A' },
            { label: 'Endpoint', value: 'http://localhost:11434' }
          ]}
          actions={[
            { label: 'Test Connection', action: () => console.log('Testing Ollama') },
            { label: 'View Logs', action: () => console.log('Viewing Ollama logs') }
          ]}
        />

        {/* Slack Integration */}
        <IntegrationCard
          icon={<MessageSquare className="h-6 w-6" />}
          name={integrations.slack.name}
          description={integrations.slack.description}
          status={integrations.slack.status}
          statusIcon={getStatusIcon(integrations.slack.status)}
          statusColor={getStatusColor(integrations.slack.status)}
          details={[
            { label: 'Webhook', value: integrations.slack.webhook || 'Not configured' },
            { label: 'Notifications Sent', value: integrations.slack.notifications || 0 },
            { label: 'Channel', value: '#dev-team' }
          ]}
          actions={[
            { label: 'Send Test Message', action: () => console.log('Testing Slack') },
            { label: 'Configure Webhook', action: () => console.log('Configuring Slack') }
          ]}
        />

        {/* Jira Integration */}
        <IntegrationCard
          icon={<Clipboard className="h-6 w-6" />}
          name={integrations.jira.name}
          description={integrations.jira.description}
          status={integrations.jira.status}
          statusIcon={getStatusIcon(integrations.jira.status)}
          statusColor={getStatusColor(integrations.jira.status)}
          details={[
            { label: 'Project', value: integrations.jira.project || 'N/A' },
            { label: 'Active Tickets', value: integrations.jira.tickets || 0 },
            { label: 'Base URL', value: 'demo-company.atlassian.net' }
          ]}
          actions={[
            { label: 'View Roadmap', action: () => console.log('Viewing Jira roadmap') },
            { label: 'Sync Tickets', action: () => console.log('Syncing Jira tickets') }
          ]}
        />

        {/* GitHub Integration */}
        <IntegrationCard
          icon={<ExternalLink className="h-6 w-6" />}
          name={integrations.github.name}
          description={integrations.github.description}
          status={integrations.github.status}
          statusIcon={getStatusIcon(integrations.github.status)}
          statusColor={getStatusColor(integrations.github.status)}
          details={[
            { label: 'Connected Repos', value: integrations.github.repos || 0 },
            { label: 'Webhooks', value: integrations.github.webhooks || 'Inactive' },
            { label: 'API Rate Limit', value: '4,987/5,000' }
          ]}
          actions={[
            { label: 'Manage Webhooks', action: () => console.log('Managing GitHub webhooks') },
            { label: 'View API Usage', action: () => console.log('Viewing GitHub API usage') }
          ]}
        />
      </div>

      {/* System Health */}
      <div className="bg-card rounded-lg p-6 border border-app">
        <h2 className="text-xl font-semibold text-white mb-4">System Health</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-green mb-2">
              {Object.values(integrations).filter(i => i.status === 'connected').length}/4
            </div>
            <p className="text-gray-400 text-sm">Connected Services</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">99.9%</div>
            <p className="text-gray-400 text-sm">System Uptime</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">< 100ms</div>
            <p className="text-gray-400 text-sm">Avg Response Time</p>
          </div>
        </div>
      </div>

      {/* Configuration Tips */}
      <div className="bg-card rounded-lg p-6 border border-app">
        <h2 className="text-xl font-semibold text-white mb-4">Configuration Tips</h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-accent-green/10 p-2 rounded-lg mt-1">
              <Bot className="h-4 w-4 text-accent-green" />
            </div>
            <div>
              <h3 className="text-white font-medium">Ollama Setup</h3>
              <p className="text-gray-400 text-sm mt-1">
                Ensure Ollama is running locally with the codellama model installed. 
                Run <code className="bg-hover px-2 py-1 rounded text-accent-green">ollama pull codellama:7b</code> to get started.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-accent-green/10 p-2 rounded-lg mt-1">
              <MessageSquare className="h-4 w-4 text-accent-green" />
            </div>
            <div>
              <h3 className="text-white font-medium">Slack Notifications</h3>
              <p className="text-gray-400 text-sm mt-1">
                Create a Slack app and configure an incoming webhook to receive notifications 
                about agent activities and pull requests.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-accent-green/10 p-2 rounded-lg mt-1">
              <Clipboard className="h-4 w-4 text-accent-green" />
            </div>
            <div>
              <h3 className="text-white font-medium">Jira Integration</h3>
              <p className="text-gray-400 text-sm mt-1">
                Connect your Jira instance to enable roadmap-aware development. 
                The agent will consider upcoming features when making improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationCard = ({ 
  icon, 
  name, 
  description, 
  status, 
  statusIcon, 
  statusColor, 
  details, 
  actions 
}) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-app hover:border-accent-green transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-accent-green/10 p-2 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold">{name}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {statusIcon}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{detail.label}</span>
            <span className="text-white font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex-1 px-3 py-2 bg-hover hover:bg-accent-green/10 text-gray-300 hover:text-accent-green rounded-lg transition-colors text-sm"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
