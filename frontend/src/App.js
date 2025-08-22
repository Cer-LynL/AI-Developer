import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Repositories from './components/Repositories';
import Jobs from './components/Jobs';
import Integrations from './components/Integrations';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { apiService } from './services/api';
import './App.css';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    loadInitialData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      refreshData();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadRepositories(),
        loadJobs(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      await Promise.all([
        loadJobs(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const loadRepositories = async () => {
    try {
      const response = await apiService.getRepositories();
      setRepositories(response.repositories || []);
    } catch (error) {
      console.error('Failed to load repositories:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await apiService.getJobs();
      setJobs(response.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleConnectRepository = async (repoData) => {
    try {
      await apiService.connectRepository(repoData);
      await loadRepositories();
      return true;
    } catch (error) {
      console.error('Failed to connect repository:', error);
      return false;
    }
  };

  const handleTriggerDemo = async () => {
    try {
      await apiService.triggerDemoCommit();
      // Refresh jobs after triggering demo
      setTimeout(() => {
        loadJobs();
        loadStats();
      }, 1000);
      return true;
    } catch (error) {
      console.error('Failed to trigger demo:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Autonomous Agent Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-app text-white">
        <div className="flex">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          
          <div className="flex-1 flex flex-col">
            <Header 
              stats={stats} 
              onTriggerDemo={handleTriggerDemo}
              repositories={repositories}
            />
            
            <main className="flex-1 p-6">
              <Routes>
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <Dashboard 
                      repositories={repositories}
                      jobs={jobs}
                      stats={stats}
                      onTriggerDemo={handleTriggerDemo}
                    />
                  } 
                />
                <Route 
                  path="/repositories" 
                  element={
                    <Repositories 
                      repositories={repositories}
                      onConnectRepository={handleConnectRepository}
                      onRefresh={loadRepositories}
                    />
                  } 
                />
                <Route 
                  path="/jobs" 
                  element={
                    <Jobs 
                      jobs={jobs}
                      onRefresh={loadJobs}
                    />
                  } 
                />
                <Route 
                  path="/integrations" 
                  element={<Integrations />} 
                />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
