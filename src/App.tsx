import React, { useState, useEffect } from 'react';
import { GitCommit, GitPullRequest, MessageSquare, CheckCircle, AlertTriangle, Zap, Clock, Bot, ExternalLink, Play, Pause, Plus, Users, Settings, Search, Send, Eye, ChevronRight, Activity, Database, Shield } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  description: string;
  lastCommit: string;
  status: 'active' | 'analyzing' | 'idle';
  language: string;
  commits: number;
  prs: number;
  issues: number;
  teamMembers: string[];
}

interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  files: string[];
  analysisStatus: 'pending' | 'analyzing' | 'completed';
  analysisLogs?: AnalysisLog[];
}

interface AnalysisLog {
  id: string;
  timestamp: string;
  phase: 'detection' | 'testing' | 'optimization' | 'validation';
  action: string;
  result: 'success' | 'failed' | 'in_progress';
  details: string;
  reasoning: string;
}

interface AgentActivity {
  id: string;
  commitId: string;
  type: 'bug_fix' | 'optimization' | 'feature';
  status: 'analyzing' | 'testing' | 'creating_pr' | 'completed';
  title: string;
  description: string;
  impact: string;
  progress: number;
  estimatedTime: string;
}

interface PullRequest {
  id: string;
  title: string;
  description: string;
  type: 'bug_fix' | 'optimization' | 'feature';
  impact: string;
  reasoning: string;
  files: number;
  additions: number;
  deletions: number;
  timestamp: string;
  status: 'open' | 'merged';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  type?: 'info' | 'question' | 'update';
}

const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'enterprise-api',
    description: 'Main API service for enterprise platform',
    lastCommit: '2 minutes ago',
    status: 'analyzing',
    language: 'TypeScript',
    commits: 1247,
    prs: 23,
    issues: 5,
    teamMembers: ['Sarah Chen', 'Mike Rodriguez', 'Alex Kim', 'You']
  },
  {
    id: 'repo-2',
    name: 'frontend-dashboard',
    description: 'React dashboard for admin panel',
    lastCommit: '1 hour ago',
    status: 'active',
    language: 'React',
    commits: 892,
    prs: 12,
    issues: 2,
    teamMembers: ['Alex Kim', 'Emma Wilson', 'You']
  },
  {
    id: 'repo-3',
    name: 'data-pipeline',
    description: 'ETL pipeline for analytics',
    lastCommit: '3 hours ago',
    status: 'idle',
    language: 'Python',
    commits: 456,
    prs: 8,
    issues: 1,
    teamMembers: ['Mike Rodriguez', 'David Park', 'You']
  }
];

const mockCommits: Commit[] = [
  {
    id: 'c1',
    message: 'Add user authentication endpoint',
    author: 'Sarah Chen',
    timestamp: '2 minutes ago',
    files: ['auth/login.ts', 'middleware/auth.ts'],
    analysisStatus: 'analyzing',
    analysisLogs: [
      {
        id: 'log1',
        timestamp: '1 minute ago',
        phase: 'detection',
        action: 'Scanning for potential null pointer exceptions',
        result: 'success',
        details: 'Found 2 potential null reference issues in auth/login.ts lines 42, 67',
        reasoning: 'User object could be undefined when network request fails'
      },
      {
        id: 'log2',
        timestamp: '30 seconds ago',
        phase: 'testing',
        action: 'Testing fix: Added null checks and error handling',
        result: 'in_progress',
        details: 'Running test suite in sandbox environment...',
        reasoning: 'Need to ensure fix doesn\'t break existing authentication flow'
      }
    ]
  },
  {
    id: 'c2',
    message: 'Update payment processing logic',
    author: 'Mike Rodriguez',
    timestamp: '15 minutes ago',
    files: ['payments/stripe.ts', 'utils/validation.ts'],
    analysisStatus: 'completed',
    analysisLogs: [
      {
        id: 'log3',
        timestamp: '10 minutes ago',
        phase: 'detection',
        action: 'Analyzing database query patterns',
        result: 'success',
        details: 'Detected N+1 query pattern in payment validation',
        reasoning: 'Multiple individual queries instead of batch operation causing performance issues'
      },
      {
        id: 'log4',
        timestamp: '8 minutes ago',
        phase: 'optimization',
        action: 'Implementing query batching and Redis caching',
        result: 'success',
        details: 'Reduced queries from 15 to 2, added caching layer',
        reasoning: 'Batch loading payment methods and cache frequently accessed data'
      },
      {
        id: 'log5',
        timestamp: '5 minutes ago',
        phase: 'validation',
        action: 'Performance testing optimized code',
        result: 'success',
        details: '40% improvement in response time, all tests passing',
        reasoning: 'Optimization successful, creating pull request'
      }
    ]
  }
];

const mockPullRequests: PullRequest[] = [
  {
    id: 'pr-1',
    title: 'Fix: Add null checks to authentication flow',
    description: 'Detected potential null pointer exceptions in the new authentication endpoint. Added comprehensive error handling and input validation.',
    type: 'bug_fix',
    impact: 'Prevents authentication crashes for edge cases',
    reasoning: 'Analysis showed that the login endpoint could receive undefined user objects in certain network conditions. Added null checks and proper error responses.',
    files: 2,
    additions: 23,
    deletions: 5,
    timestamp: '5 minutes ago',
    status: 'open'
  },
  {
    id: 'pr-2',
    title: 'Optimize: Implement query batching for payment processing',
    description: 'Optimized database queries in payment flow to reduce response time by 40% and decrease database load.',
    type: 'optimization',
    impact: '40% faster payment processing, 60% less DB queries',
    reasoning: 'Detected N+1 query pattern in payment validation. Implemented batch loading and added Redis caching for frequently accessed payment methods.',
    files: 4,
    additions: 67,
    deletions: 23,
    timestamp: '25 minutes ago',
    status: 'open'
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'chat1',
    sender: 'agent',
    message: "Hey! 👋 Just found a potential null pointer issue in the new auth endpoint. Already tested the fix in sandbox - it's solid! Check out the PR when you have a moment.",
    timestamp: '3 minutes ago',
    type: 'update'
  },
  {
    id: 'chat2',
    sender: 'agent',
    message: "Nice work on the payment logic, Mike! 🚀 I optimized the database queries and got a 40% performance boost. The tests are all green - take a look!",
    timestamp: '20 minutes ago',
    type: 'update'
  },
  {
    id: 'chat3',
    sender: 'user',
    message: "Can you focus more on security vulnerabilities in the auth module? We're launching next week.",
    timestamp: '1 hour ago'
  },
  {
    id: 'chat4',
    sender: 'agent',
    message: "Absolutely! I'll prioritize security analysis for the auth module. I'll scan for common vulnerabilities like SQL injection, XSS, and authentication bypasses. Should have results within the hour.",
    timestamp: '58 minutes ago',
    type: 'info'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'repositories' | 'repository'>('repositories');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectedTab, setSelectedTab] = useState<'commits' | 'activity' | 'prs' | 'chat'>('commits');
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [showAnalysisLogs, setShowAnalysisLogs] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo);
    setCurrentView('repository');
    setSelectedTab('commits');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: chatInput,
      timestamp: 'just now'
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        message: "Got it! I'll adjust my analysis focus based on your feedback. Let me work on that and I'll update you with the results.",
        timestamp: 'just now',
        type: 'info'
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const handleAddRepository = () => {
    if (!newRepoUrl.trim()) return;
    // Simulate adding repository
    setShowAddRepo(false);
    setNewRepoUrl('');
    // In real app, would make API call to connect repository
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug_fix': return 'text-red-400 bg-red-400/10';
      case 'optimization': return 'text-emerald-400 bg-emerald-400/10';
      case 'feature': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing': return 'text-yellow-400';
      case 'testing': return 'text-blue-400';
      case 'creating_pr': return 'text-purple-400';
      case 'completed': return 'text-emerald-400';
      case 'open': return 'text-emerald-400';
      case 'merged': return 'text-purple-400';
      case 'active': return 'text-emerald-400';
      case 'idle': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (currentView === 'repositories') {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">DevAgent Pro</h1>
                  <p className="text-sm text-gray-400">Autonomous Development Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Team: Engineering</span>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Repository Management */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Repositories</h2>
              <p className="text-gray-400">Repositories you have access to with autonomous agent integration</p>
            </div>
            <button
              onClick={() => setShowAddRepo(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Repository</span>
            </button>
          </div>

          {/* Add Repository Modal */}
          {showAddRepo && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Connect New Repository</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Repository URL
                    </label>
                    <input
                      type="text"
                      value={newRepoUrl}
                      onChange={(e) => setNewRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Agent will run in isolated container environment</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddRepo(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRepository}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Repository Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRepositories.map(repo => (
              <div
                key={repo.id}
                onClick={() => handleRepoSelect(repo)}
                className="p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-gray-400">{repo.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      repo.status === 'active' ? 'bg-emerald-400' :
                      repo.status === 'analyzing' ? 'bg-yellow-400 animate-pulse' :
                      'bg-gray-400'
                    }`}></div>
                    <span className={`text-xs ${getStatusColor(repo.status)}`}>
                      {repo.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{repo.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-emerald-400">{repo.commits}</div>
                    <div className="text-xs text-gray-400">Commits</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-emerald-400">{repo.prs}</div>
                    <div className="text-xs text-gray-400">PRs</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-emerald-400">{repo.issues}</div>
                    <div className="text-xs text-gray-400">Issues</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{repo.teamMembers.length} members</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <span>{repo.lastCommit}</span>
                    <ChevronRight className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise Features */}
          <div className="mt-12 p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Enterprise Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <GitCommit className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold mb-2">Git Integration</h4>
                <p className="text-sm text-gray-400">Automatic triggers on commits, branches, and merges</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold mb-2">Team Communication</h4>
                <p className="text-sm text-gray-400">Slack, Teams, Discord integration for notifications</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold mb-2">Isolated Environment</h4>
                <p className="text-sm text-gray-400">Runs in separate containers/VMs for security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('repositories')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Repositories
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{selectedRepo?.name}</h1>
                <p className="text-sm text-gray-400">Autonomous agent active</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Agent Running</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
            {[
              { id: 'commits', label: 'Recent Commits', icon: GitCommit },
              { id: 'activity', label: 'Agent Activity', icon: Activity },
              { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
              { id: 'chat', label: 'Agent Chat', icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Analysis Logs Modal */}
        {showAnalysisLogs && selectedCommit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Analysis Logs - {selectedCommit.message}</h3>
                <button
                  onClick={() => setShowAnalysisLogs(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {selectedCommit.analysisLogs?.map(log => (
                  <div key={log.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getResultIcon(log.result)}
                        <span className="font-semibold capitalize">{log.phase}</span>
                        <span className="text-sm text-gray-400">{log.timestamp}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        log.result === 'success' ? 'bg-emerald-600/20 text-emerald-400' :
                        log.result === 'failed' ? 'bg-red-600/20 text-red-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {log.result}
                      </span>
                    </div>
                    <h4 className="font-medium mb-2">{log.action}</h4>
                    <p className="text-gray-300 mb-2">{log.details}</p>
                    <div className="bg-gray-700 p-3 rounded text-sm">
                      <span className="text-emerald-400 font-medium">Reasoning: </span>
                      <span className="text-gray-300">{log.reasoning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content based on selected tab */}
        {selectedTab === 'commits' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Recent Commits</h3>
            {mockCommits.map(commit => (
              <div key={commit.id} className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <GitCommit className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-semibold">{commit.message}</h4>
                      <p className="text-sm text-gray-400">by {commit.author} • {commit.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {commit.analysisStatus === 'analyzing' && (
                      <button
                        onClick={() => {
                          setSelectedCommit(commit);
                          setShowAnalysisLogs(true);
                        }}
                        className="flex items-center space-x-2 px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Analysis</span>
                      </button>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        commit.analysisStatus === 'analyzing' ? 'bg-yellow-400 animate-pulse' :
                        commit.analysisStatus === 'completed' ? 'bg-emerald-400' :
                        'bg-gray-400'
                      }`}></div>
                      <span className={`text-xs ${
                        commit.analysisStatus === 'analyzing' ? 'text-yellow-400' :
                        commit.analysisStatus === 'completed' ? 'text-emerald-400' :
                        'text-gray-400'
                      }`}>
                        {commit.analysisStatus === 'analyzing' ? 'Agent analyzing' :
                         commit.analysisStatus === 'completed' ? 'Analysis complete' :
                         'Pending analysis'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commit.files.map(file => (
                    <span key={file} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Agent Activity (Background Processing)</h3>
            <div className="p-8 bg-gray-900 rounded-xl border border-gray-800 text-center">
              <Bot className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Agent is continuously monitoring commits</p>
              <p className="text-gray-400 text-sm">Running in isolated container environment</p>
            </div>
          </div>
        )}

        {selectedTab === 'prs' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Agent-Generated Pull Requests</h3>
            {mockPullRequests.map(pr => (
              <div key={pr.id} className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <GitPullRequest className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-semibold">{pr.title}</h4>
                      <p className="text-sm text-gray-400">{pr.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(pr.type)}`}>
                      {pr.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`text-sm ${getStatusColor(pr.status)}`}>
                      {pr.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{pr.description}</p>
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <h5 className="font-semibold mb-2 text-emerald-400">Agent Reasoning:</h5>
                  <p className="text-sm text-gray-300">{pr.reasoning}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">{pr.files} files changed</span>
                    <span className="text-emerald-400">+{pr.additions}</span>
                    <span className="text-red-400">-{pr.deletions}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">{pr.impact}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'chat' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Chat with Agent</h3>
            <div className="bg-gray-900 rounded-xl border border-gray-800 h-96 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {chatMessages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-800 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask the agent about analysis, give directions, or request specific focus areas..."
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;