import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, Clock, CheckCircle, XCircle, AlertCircle, Eye, Menu } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getUser, getSubmissionJobs, getSubmissionResults } from '../lib/supabase';
import { SubmissionJob, SubmissionResult } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<SubmissionJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<SubmissionJob | null>(null);
  const [results, setResults] = useState<SubmissionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await getUser();
      if (currentUser) {
        setUser(currentUser);
        const userJobs = await getSubmissionJobs(currentUser.id);
        setJobs(userJobs);
        
        if (userJobs.length > 0) {
          setSelectedJob(userJobs[0]);
          const jobResults = await getSubmissionResults(userJobs[0].id);
          setResults(jobResults);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = async (job: SubmissionJob) => {
    setSelectedJob(job);
    setSidebarOpen(false);
    try {
      const jobResults = await getSubmissionResults(job.id);
      setResults(jobResults);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case 'pending_review':
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending_review':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <Link to="/submit">
            <Button className="flex items-center space-x-2 w-full sm:w-auto" size="sm">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>New Campaign</span>
            </Button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          // Empty State
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No campaigns yet</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
              Start your first directory submission campaign to see your results here.
            </p>
            <Link to="/submit">
              <Button size="lg">
                Create Your First Campaign
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Mobile Jobs Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center space-x-2 w-full"
                size="sm"
              >
                <Menu className="w-4 h-4" />
                <span>View Campaigns</span>
              </Button>
            </div>

            {/* Jobs Sidebar */}
            <div className={`lg:w-80 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Campaigns</h2>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleJobSelect(job)}
                      className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedJob?.id === job.id
                          ? 'bg-purple-100 border-purple-500 border'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                          {job.package_type} Plan
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {job.completed_directories}/{job.total_directories} completed
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(job.completed_directories / job.total_directories) * 100}%`
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {selectedJob && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    <Card className="p-3 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Total</p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-900">{selectedJob.total_directories}</p>
                        </div>
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                      </div>
                    </Card>
                    
                    <Card className="p-3 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-900">{selectedJob.completed_directories}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                      </div>
                    </Card>
                    
                    <Card className="p-3 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Successful</p>
                          <p className="text-lg sm:text-2xl font-bold text-green-600">{selectedJob.successful_submissions}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                      </div>
                    </Card>
                    
                    <Card className="p-3 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Failed</p>
                          <p className="text-lg sm:text-2xl font-bold text-red-600">{selectedJob.failed_submissions}</p>
                        </div>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                      </div>
                    </Card>
                  </div>

                  {/* Results Table */}
                  <Card className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                      <h2 className="text-lg font-semibold text-gray-900">Submission Results</h2>
                      <div className="text-sm text-gray-500">
                        {results.length} directories
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Directory</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Status</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base hidden sm:table-cell">Notes</th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result) => (
                            <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 sm:py-4 px-2 sm:px-4">
                                <div>
                                  <div className="font-medium text-gray-900 text-sm sm:text-base">{result.directory_name}</div>
                                  <div className="text-xs sm:text-sm text-gray-500 truncate max-w-xs">
                                    {result.directory_url}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(result.status)}
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                                    {result.status.replace('_', ' ')}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
                                <span className="text-sm text-gray-600">
                                  {result.notes || result.error_message || 'No notes'}
                                </span>
                              </td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4">
                                <div className="flex items-center space-x-2">
                                  {result.submission_url && (
                                    <a
                                      href={result.submission_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-purple-600 hover:text-purple-800"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};