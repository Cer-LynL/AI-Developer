import React, { useState } from 'react';
import { Bell, RefreshCw, Play, Users, GitBranch } from 'lucide-react';

const Header = ({ stats, onTriggerDemo, repositories }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      message: "🤖 Agent created 2 pull requests for demo-app",
      time: "2 minutes ago",
      type: "success"
    },
    {
      id: 2,
      message: "🚀 Performance optimization completed (+23% improvement)",
      time: "5 minutes ago",
      type: "info"
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  const runningJobs = stats.total_jobs - stats.completed_jobs - (stats.failed_jobs || 0);

  return (
    <header className="bg-card border-b border-app px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Status indicators */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">System Online</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <GitBranch className="h-4 w-4" />
              <span>{repositories.length} repos</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{stats.total_jobs || 0} jobs</span>
            </div>
            
            {runningJobs > 0 && (
              <div className="flex items-center space-x-1 text-accent-green">
                <div className="animate-spin rounded-full h-3 w-3 border border-accent-green border-t-transparent"></div>
                <span>{runningJobs} running</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Actions and notifications */}
        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-white font-semibold">{stats.success_rate || 0}%</div>
              <div className="text-gray-400 text-xs">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-accent-green font-semibold">{stats.completed_jobs || 0}</div>
              <div className="text-gray-400 text-xs">Completed</div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent-green text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Quick Demo Trigger */}
          <button
            onClick={onTriggerDemo}
            disabled={repositories.length === 0}
            className="flex items-center space-x-2 bg-accent-green hover:bg-accent-green-dark disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            title={repositories.length === 0 ? "Connect a repository first" : "Trigger demo analysis"}
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Demo</span>
          </button>
        </div>
      </div>

      {/* Notifications Dropdown (hidden by default, would show on bell click) */}
      <div className="hidden absolute right-6 top-16 w-80 bg-card border border-app rounded-lg shadow-lg z-50">
        <div className="p-4 border-b border-app">
          <h3 className="text-white font-medium">Recent Notifications</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 border-b border-app last:border-b-0 hover:bg-hover">
              <p className="text-sm text-gray-300">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-app">
          <button className="text-sm text-accent-green hover:text-accent-green-light">
            View all notifications
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
