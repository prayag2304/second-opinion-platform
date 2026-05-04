import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import apiClient from '../../services/apiClient';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    dashboard: null,
    users: null,
    applications: null,
    revenue: null,
    health: null,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [dashboard, users, applications, revenue, health] = await Promise.all([
        apiClient.get('/admin/analytics/dashboard'),
        apiClient.get('/admin/analytics/users', { params: dateRange }),
        apiClient.get('/admin/analytics/applications', { params: dateRange }),
        apiClient.get('/admin/analytics/revenue', { params: dateRange }),
        apiClient.get('/admin/analytics/health'),
      ]);

      setAnalytics({
        dashboard: dashboard.data,
        users: users.data,
        applications: applications.data,
        revenue: revenue.data,
        health: health.data,
      });
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    setExportLoading(true);
    try {
      const response = await apiClient.get('/admin/analytics/export', {
        params: { type, format: 'csv', ...dateRange },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_analytics_${dateRange.startDate}_${dateRange.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const getHealthStatus = (status) => {
    switch (status) {
      case 'healthy':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' };
      case 'warning':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '🟡' };
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: '⚪' };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading analytics..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="admin-analytics">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex space-x-4">
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="form-input"
              />
            </div>
            <Button onClick={fetchAnalytics} variant="primary" size="sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* System Health */}
        {analytics.health && (
          <div className="mb-6">
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">System Health</h3>
                <div className={`px-3 py-1 rounded-full ${getHealthStatus(analytics.health.status).bg}`}>
                  <span className={`font-medium ${getHealthStatus(analytics.health.status).color}`}>
                    {getHealthStatus(analytics.health.status).icon} {analytics.health.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.health.uptime}%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.health.database.status}</div>
                  <div className="text-sm text-gray-600">Database</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.health.responseTime}ms</div>
                  <div className="text-sm text-gray-600">Avg Response</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Dashboard Overview */}
        {analytics.dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analytics.dashboard.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analytics.dashboard.totalDoctors}</div>
                <div className="text-sm text-gray-600">Total Doctors</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analytics.dashboard.totalApplications}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">₹{analytics.dashboard.totalRevenue?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </Card>
          </div>
        )}

        {/* User Analytics */}
        {analytics.users && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">User Analytics</h2>
              <Button 
                onClick={() => handleExport('users')} 
                variant="outline" 
                size="sm"
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Users'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h4 className="font-semibold mb-2">User Growth</h4>
                <div className="text-2xl font-bold text-green-600">+{analytics.users.growth?.monthly}%</div>
                <div className="text-sm text-gray-600">This month</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">Active Users</h4>
                <div className="text-2xl font-bold text-blue-600">{analytics.users.stats?.active}</div>
                <div className="text-sm text-gray-600">Last 30 days</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">New Registrations</h4>
                <div className="text-2xl font-bold text-purple-600">{analytics.users.stats?.new}</div>
                <div className="text-sm text-gray-600">This month</div>
              </Card>
            </div>
          </div>
        )}

        {/* Application Analytics */}
        {analytics.applications && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Application Analytics</h2>
              <Button 
                onClick={() => handleExport('applications')} 
                variant="outline" 
                size="sm"
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Applications'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <h4 className="font-semibold mb-2">Total Applications</h4>
                <div className="text-2xl font-bold text-blue-600">{analytics.applications.stats?.total}</div>
                <div className="text-sm text-gray-600">All time</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">Pending</h4>
                <div className="text-2xl font-bold text-yellow-600">{analytics.applications.stats?.pending}</div>
                <div className="text-sm text-gray-600">Awaiting review</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">Completed</h4>
                <div className="text-2xl font-bold text-green-600">{analytics.applications.stats?.completed}</div>
                <div className="text-sm text-gray-600">Successfully processed</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">Success Rate</h4>
                <div className="text-2xl font-bold text-purple-600">{analytics.applications.trends?.successRate}%</div>
                <div className="text-sm text-gray-600">This month</div>
              </Card>
            </div>
          </div>
        )}

        {/* Revenue Analytics */}
        {analytics.revenue && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
              <Button 
                onClick={() => handleExport('revenue')} 
                variant="outline" 
                size="sm"
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export Revenue'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <h4 className="font-semibold mb-2">Total Revenue</h4>
                <div className="text-2xl font-bold text-green-600">₹{analytics.revenue.totalRevenue?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">All time</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">Monthly Revenue</h4>
                <div className="text-2xl font-bold text-blue-600">₹{analytics.revenue.monthlyRevenue?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">This month</div>
              </Card>
              <Card>
                <h4 className="font-semibold mb-2">Growth</h4>
                <div className="text-2xl font-bold text-purple-600">+{analytics.revenue.growth}%</div>
                <div className="text-sm text-gray-600">vs last month</div>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleExport('all')} 
              variant="primary"
              disabled={exportLoading}
              className="w-full"
            >
              {exportLoading ? 'Exporting...' : 'Export All Data'}
            </Button>
            <Button 
              onClick={() => window.open('/admin/analytics/audit', '_blank')} 
              variant="outline"
              className="w-full"
            >
              View Audit Logs
            </Button>
            <Button 
              onClick={() => window.open('/admin/analytics/settings', '_blank')} 
              variant="outline"
              className="w-full"
            >
              Analytics Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics; 