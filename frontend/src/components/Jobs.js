import React, { useState } from 'react';
import { Activity, Clock, CheckCircle, AlertCircle, Eye, RefreshCw, Filter } from 'lucide-react';
import { formatters } from '../services/api';

const Jobs = ({ jobs, onRefresh }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const statusCounts = {
    all: jobs.length,
    running: jobs.filter(j => j.status === 'running').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    pending: jobs.filter(j => j.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Jobs</h1>
          <p className="text-gray-400 mt-2">Monitor autonomous agent analysis and processing jobs</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-card rounded-lg p-1 border border-app">
        {[
          { key: 'all', label: 'All Jobs', count: statusCounts.all },
          { key: 'running', label: 'Running', count: statusCounts.running },
          { key: 'completed', label: 'Completed', count: statusCounts.completed },
          { key: 'failed', label: 'Failed', count: statusCounts.failed },
          { key: 'pending', label: 'Pending', count: statusCounts.pending }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-accent-green text-white'
                : 'text-gray-400 hover:text-white hover:bg-hover'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === tab.key ? 'bg-white/20' : 'bg-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <Activity className="h-16 w-16 text-gray-500 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">
            {filter === 'all' ? 'No Jobs Found' : `No ${filter} Jobs`}
          </h2>
          <p className="text-gray-400 mb-6">
            {filter === 'all' 
              ? 'Jobs will appear here when the agent processes commits'
              : `No jobs with status "${filter}" found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onViewDetails={() => setSelectedJob(job)}
            />
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};

const JobCard = ({ job, onViewDetails }) => {
  const statusInfo = formatters.formatJobStatus(job.status);
  const duration = job.completed_at 
    ? new Date(job.completed_at) - new Date(job.created_at)
    : Date.now() - new Date(job.created_at);

  return (
    <div className="bg-card rounded-lg p-6 border border-app hover:border-accent-green transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
            {job.status === 'running' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-green"></div>}
            {job.status === 'completed' && <CheckCircle className="h-5 w-5 text-accent-green" />}
            {job.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-400" />}
            {job.status === 'pending' && <Clock className="h-5 w-5 text-yellow-400" />}
          </div>
          
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-white font-semibold">
                Job {job.commit_hash?.substring(0, 8) || job.id.substring(0, 8)}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                {statusInfo.label}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Started {formatters.formatDate(job.created_at)}
            </p>
          </div>
        </div>
        
        <button
          onClick={onViewDetails}
          className="flex items-center space-x-2 px-3 py-2 bg-hover hover:bg-accent-green/10 text-gray-300 hover:text-accent-green rounded-lg transition-colors text-sm"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Duration</span>
          <p className="text-white font-medium">{formatters.formatDuration(duration / 1000)}</p>
        </div>
        
        <div>
          <span className="text-gray-400">Repository</span>
          <p className="text-white font-medium">{job.repository_id?.substring(0, 8) || 'Unknown'}</p>
        </div>
        
        <div>
          <span className="text-gray-400">Logs</span>
          <p className="text-white font-medium">{job.logs?.length || 0} entries</p>
        </div>
      </div>
      
      {job.logs && job.logs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-app">
          <p className="text-xs text-gray-500 mb-2">Latest Log:</p>
          <p className="text-sm text-gray-300 bg-hover p-3 rounded-lg">
            {formatters.truncateText(job.logs[job.logs.length - 1], 120)}
          </p>
        </div>
      )}
      
      {job.error && (
        <div className="mt-4 pt-4 border-t border-app">
          <p className="text-xs text-red-400 mb-2">Error:</p>
          <p className="text-sm text-red-300 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
            {job.error}
          </p>
        </div>
      )}
    </div>
  );
};

const JobDetailsModal = ({ job, onClose }) => {
  const statusInfo = formatters.formatJobStatus(job.status);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-app">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-app">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
              {job.status === 'running' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-green"></div>}
              {job.status === 'completed' && <CheckCircle className="h-5 w-5 text-accent-green" />}
              {job.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-400" />}
              {job.status === 'pending' && <Clock className="h-5 w-5 text-yellow-400" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Job Details - {job.commit_hash?.substring(0, 8) || job.id.substring(0, 8)}
              </h2>
              <div className="flex items-center space-x-3 mt-1">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.label}
                </div>
                <span className="text-gray-400 text-sm">
                  {formatters.formatDate(job.created_at)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Job Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Job ID</label>
                <p className="text-white font-mono">{job.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Repository ID</label>
                <p className="text-white font-mono">{job.repository_id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Commit Hash</label>
                <p className="text-white font-mono">{job.commit_hash || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Started</label>
                <p className="text-white">{formatters.formatDate(job.created_at)}</p>
              </div>
              {job.completed_at && (
                <div>
                  <label className="text-sm text-gray-400">Completed</label>
                  <p className="text-white">{formatters.formatDate(job.completed_at)}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-400">Duration</label>
                <p className="text-white">
                  {formatters.formatDuration(
                    (job.completed_at 
                      ? new Date(job.completed_at) - new Date(job.created_at)
                      : Date.now() - new Date(job.created_at)
                    ) / 1000
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Execution Logs</h3>
            {job.logs && job.logs.length > 0 ? (
              <div className="bg-hover rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                {job.logs.map((log, index) => (
                  <div key={index} className="text-gray-300 mb-2">
                    <span className="text-gray-500">[{index + 1}]</span> {log}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">No logs available</p>
            )}
          </div>
          
          {/* Error Details */}
          {job.error && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Error Details</h3>
              <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                <p className="text-red-300 font-mono text-sm">{job.error}</p>
              </div>
            </div>
          )}
          
          {/* Result */}
          {job.result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
              <div className="bg-hover rounded-lg p-4">
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  {JSON.stringify(job.result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
