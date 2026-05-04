import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/Layout/DashboardLayout';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import FormField from '../components/Common/FormField';
import Pagination from '../components/Common/Pagination';
import StatusBadge from '../components/Common/StatusBadge';
import apiClient from '../services/apiClient';

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState('preferences');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    pushEnabled: true,
    categories: {
      general: true,
      payment: true,
      application: true,
      medical: true,
      system: false,
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'preferences':
          const prefsResponse = await apiClient.get('/notifications/preferences');
          setPreferences(prefsResponse.data);
          break;
        case 'history':
          const historyResponse = await apiClient.get('/notifications/history', {
            params: {
              page: pagination.currentPage,
              limit: pagination.pageSize,
            },
          });
          setNotifications(historyResponse.data.notifications);
          setPagination(prev => ({
            ...prev,
            totalPages: historyResponse.data.totalPages,
            totalCount: historyResponse.data.totalCount,
          }));
          break;
        case 'templates':
          const templatesResponse = await apiClient.get('/notifications/templates');
          setTemplates(templatesResponse.data);
          break;
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setSubmitting(true);
    try {
      await apiClient.put('/notifications/preferences', preferences);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePushSubscribe = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
          });

          await apiClient.post('/notifications/push/subscribe', {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
              auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
            },
          });

          toast.success('Push notifications enabled');
        } else {
          toast.error('Notification permission denied');
        }
      } else {
        toast.error('Push notifications not supported');
      }
    } catch (error) {
      toast.error('Failed to enable push notifications');
    }
  };

  const handlePushUnsubscribe = async () => {
    try {
      await apiClient.post('/notifications/push/unsubscribe');
      toast.success('Push notifications disabled');
    } catch (error) {
      toast.error('Failed to disable push notifications');
    }
  };

  const handleTestPush = async () => {
    try {
      await apiClient.post('/notifications/push/test');
      toast.success('Test notification sent');
    } catch (error) {
      toast.error('Failed to send test notification');
    }
  };

  const handleExportNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications/export', {
        params: { format: 'csv' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `notifications_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Notifications exported successfully');
    } catch (error) {
      toast.error('Failed to export notifications');
    }
  };

  const handleClearNotifications = async () => {
    if (window.confirm('Are you sure you want to clear old notifications?')) {
      try {
        await apiClient.delete('/notifications/clear', {
          params: { days: 30 },
        });
        toast.success('Old notifications cleared');
        fetchData();
      } catch (error) {
        toast.error('Failed to clear notifications');
      }
    }
  };

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'push', label: 'Push Settings', icon: '📱' },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading notification settings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="notification-management">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
          <div className="flex space-x-2">
            <Button onClick={handleExportNotifications} variant="outline" size="sm">
              Export History
            </Button>
            <Button onClick={handleClearNotifications} variant="outline" size="sm">
              Clear Old
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); handlePreferencesUpdate(); }} className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.emailEnabled}
                      onChange={(e) => setPreferences(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                      className="form-checkbox"
                    />
                    <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                  </label>
                </div>

                {/* Push Notifications */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences.pushEnabled}
                      onChange={(e) => setPreferences(prev => ({ ...prev, pushEnabled: e.target.checked }))}
                      className="form-checkbox"
                    />
                    <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                  </label>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Categories</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(preferences.categories).map(([category, enabled]) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            categories: { ...prev.categories, [category]: e.target.checked }
                          }))}
                          className="form-checkbox"
                        />
                        <span className="text-sm text-gray-900 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <FormField
                  label="Notification Frequency"
                  type="select"
                  value={preferences.frequency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
                  options={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'hourly', label: 'Hourly Digest' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Digest' },
                  ]}
                />

                {/* Quiet Hours */}
                <div>
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={preferences.quietHours.enabled}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, enabled: e.target.checked }
                      }))}
                      className="form-checkbox"
                    />
                    <span className="text-sm font-medium text-gray-900">Quiet Hours</span>
                  </label>
                  
                  {preferences.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <FormField
                        label="Start Time"
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, start: e.target.value }
                        }))}
                      />
                      <FormField
                        label="End Time"
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, end: e.target.value }
                        }))}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Preferences'}
                </Button>
              </form>
            </Card>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Notification History</h2>
                <p className="text-sm text-gray-600">Showing {notifications.length} of {pagination.totalCount} notifications</p>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        {notification.category && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {notification.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                  />
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Notification Templates</h2>
                <Button variant="primary" size="sm">
                  Add Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <StatusBadge status={template.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <span className="font-medium">Subject:</span> {template.subject}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Type:</span> {template.type}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Category:</span> {template.category}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Test</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Push Settings Tab */}
          {activeTab === 'push' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Push Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-blue-900">Push Notifications</h3>
                      <p className="text-sm text-blue-700">Receive real-time notifications in your browser</p>
                    </div>
                    <Button onClick={handlePushSubscribe} variant="primary" size="sm">
                      Enable Push
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Test Notifications</h3>
                      <p className="text-sm text-gray-600">Send a test notification to verify settings</p>
                    </div>
                    <Button onClick={handleTestPush} variant="outline" size="sm">
                      Send Test
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-red-900">Disable Push Notifications</h3>
                      <p className="text-sm text-red-700">Stop receiving push notifications</p>
                    </div>
                    <Button onClick={handlePushUnsubscribe} variant="danger" size="sm">
                      Disable Push
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Compatibility</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${'serviceWorker' in navigator ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span>Service Worker: {('serviceWorker' in navigator ? 'Supported' : 'Not Supported')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${'PushManager' in window ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span>Push Manager: {('PushManager' in window ? 'Supported' : 'Not Supported')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${Notification.permission === 'granted' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span>Permission: {Notification.permission}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationManagement; 