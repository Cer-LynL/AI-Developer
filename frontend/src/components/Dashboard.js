import React, { useState } from 'react';
import { Activity, GitBranch, Zap, Clock, Play, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { formatters } from '../services/api';

const Dashboard = ({ repositories, jobs, stats, onTriggerDemo }) => {
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTriggerDemo = async () => {
    setIsTriggering(true);
    try {
      await onTriggerDemo();
    } finally {
      setIsTriggering(false);
    }
  };

  const recentJobs = jobs.slice(0, 5);
  const runningJobs = jobs.filter(job => job.status === 'running');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Autonomous Developer Agent</h1>
          <p className="text-gray-400 mt-2">AI-powered code analysis, fixes, and optimizations</p>
        </div>
        
        <button
          onClick={handleTriggerDemo}
          disabled={isTriggering || repositories.length === 0}
          className="flex items-center space-x-2 bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isTriggering ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Triggering...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Trigger Demo</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Connected Repos"
          value={stats.total_repositories || 0}
          icon={<GitBranch className="h-6 w-6" />}
          color="text-blue-400"
          bgColor="bg-blue-400/10"
        />
        <StatCard
          title="Total Jobs"
          value={stats.total_jobs || 0}
          icon={<Activity className="h-6 w-6" />}
          color="text-purple-400"
          bgColor="bg-purple-400/10"
        />
        <StatCard
          title="Completed"
          value={stats.completed_jobs || 0}
          icon={<CheckCircle className="h-6 w-6" />}
          color="text-accent-green"
          bgColor="bg-accent-green/10"
        />
        <StatCard
          title="Success Rate"
          value={`${Math.round(stats.success_rate || 0)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="text-yellow-400"
          bgColor="bg-yellow-400/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-lg p-6 border border-app">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Activity className="h-5 w-5 text-accent-green" />
          </div>
          
          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-sm text-gray-500 mt-2">
                {repositories.length === 0 
                  ? "Connect a repository to get started"
                  : "Trigger a demo to see the agent in action"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Repository Status */}
        <div className="bg-card rounded-lg p-6 border border-app">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Connected Repositories</h2>
            <GitBranch className="h-5 w-5 text-accent-green" />
          </div>
          
          {repositories.length === 0 ? (
            <div className="text-center py-8">
              <GitBranch className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No repositories connected</p>
              <p className="text-sm text-gray-500 mt-2">
                Connect your first repository to enable autonomous development
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {repositories.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Running Jobs */}
      {runningJobs.length > 0 && (
        <div className="bg-card rounded-lg p-6 border border-app">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Active Jobs</h2>
            <div className="flex items-center space-x-2">
              <div className="animate-pulse h-2 w-2 bg-accent-green rounded-full"></div>
              <span className="text-sm text-accent-green">Running</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runningJobs.map((job) => (
              <RunningJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <div className="bg-card rounded-lg p-6 border border-app">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`${bgColor} ${color} p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const JobCard = ({ job }) => {
  const statusInfo = formatters.formatJobStatus(job.status);
  
  return (
    <div className="flex items-center justify-between p-4 bg-hover rounded-lg border border-app">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.label}
          </div>
          <span className="text-white font-medium">
            {job.commit_hash?.substring(0, 8) || 'Unknown'}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          {formatters.formatDate(job.created_at)}
        </p>
      </div>
      
      {job.status === 'running' && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-green"></div>
      )}
      
      {job.status === 'completed' && (
        <CheckCircle className="h-4 w-4 text-accent-green" />
      )}
      
      {job.status === 'failed' && (
        <AlertCircle className="h-4 w-4 text-red-400" />
      )}
    </div>
  );
};

const RepositoryCard = ({ repository }) => (
  <div className="flex items-center justify-between p-4 bg-hover rounded-lg border border-app">
    <div className="flex-1">
      <h3 className="text-white font-medium">{repository.name}</h3>
      <p className="text-gray-400 text-sm mt-1">
        Connected {formatters.formatDate(repository.connected_at)}
      </p>
    </div>
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 bg-accent-green rounded-full"></div>
      <span className="text-sm text-accent-green">Active</span>
    </div>
  </div>
);

const RunningJobCard = ({ job }) => (
  <div className="bg-hover rounded-lg p-4 border border-app">
    <div className="flex items-center justify-between mb-3">
      <span className="text-white font-medium">
        {job.commit_hash?.substring(0, 8) || 'Processing...'}
      </span>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-green"></div>
    </div>
    
    {job.logs && job.logs.length > 0 && (
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Latest:</p>
        <p className="text-sm text-gray-300">
          {formatters.truncateText(job.logs[job.logs.length - 1], 60)}
        </p>
      </div>
    )}
  </div>
);

export default Dashboard;
