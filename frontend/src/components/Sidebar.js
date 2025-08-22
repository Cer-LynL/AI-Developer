import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  Activity, 
  Settings, 
  Bot,
  Zap
} from 'lucide-react';

const Sidebar = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 'repositories',
      label: 'Repositories',
      icon: GitBranch,
      path: '/repositories'
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Activity,
      path: '/jobs'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Settings,
      path: '/integrations'
    }
  ];

  const handleNavigation = (item) => {
    onPageChange(item.id);
    navigate(item.path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-card border-r border-app flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-app">
        <div className="flex items-center space-x-3">
          <div className="bg-accent-green p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">AI Agent</h1>
            <p className="text-gray-400 text-sm">Autonomous Dev</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    active
                      ? 'bg-accent-green text-white'
                      : 'text-gray-300 hover:bg-hover hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status Indicator */}
      <div className="p-4 border-t border-app">
        <div className="flex items-center space-x-3 p-3 bg-hover rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Agent Active</span>
          </div>
          <Zap className="h-4 w-4 text-accent-green ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
