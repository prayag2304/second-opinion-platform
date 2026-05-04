import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  CalendarIcon, 
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_CATEGORIES, 
  NOTIFICATION_PRIORITIES 
} from '../../config/constants';
import EnhancedNotificationsList from './EnhancedNotificationsList';
import Button from './Button';
import FormField from './FormField';

const NotificationHistory = () => {
  const { 
    notifications, 
    loading, 
    error, 
    getHistory, 
    exportNotifications,
    clearOldNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [filters, setFilters] = useState({
    type: '',
    category: '',
    priority: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [filters, pagination]);

  const loadHistory = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      await getHistory(activeFilters, pagination);
    } catch (error) {
      toast.error('Failed to load notification history');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, page: 1, pageSize: newPageSize }));
  };

  const handleExport = async (format = 'csv') => {
    setIsExporting(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await exportNotifications(activeFilters, format);
      
      // Create download link
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notification_history_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Notification history exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export notification history');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearOld = async () => {
    setIsClearing(true);
    try {
      await clearOldNotifications(30); // Clear notifications older than 30 days
      toast.success('Old notifications cleared successfully');
      loadHistory(); // Reload the list
    } catch (error) {
      toast.error('Failed to clear old notifications');
    } finally {
      setIsClearing(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading notification history: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification History</h2>
          <p className="text-gray-600 mt-1">
            View and manage your notification history
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<FunnelIcon className="h-4 w-4" />}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            loading={isExporting}
            disabled={isExporting}
            icon={<DocumentArrowDownIcon className="h-4 w-4" />}
          >
            Export CSV
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            loading={isExporting}
            disabled={isExporting}
            icon={<DocumentArrowDownIcon className="h-4 w-4" />}
          >
            Export Excel
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearOld}
            loading={isClearing}
            disabled={isClearing}
          >
            Clear Old
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <FormField
                type="text"
                label="Search"
                placeholder="Search notifications..."
                value={filters.search}
                onChange={(value) => handleFilterChange('search', value)}
                icon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>

            {/* Type */}
            <div>
              <FormField
                type="select"
                label="Type"
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
                options={[
                  { value: '', label: 'All Types' },
                  ...Object.entries(NOTIFICATION_TYPES).map(([key, value]) => ({
                    value,
                    label: key.replace('_', ' ')
                  }))
                ]}
              />
            </div>

            {/* Category */}
            <div>
              <FormField
                type="select"
                label="Category"
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                options={[
                  { value: '', label: 'All Categories' },
                  ...Object.entries(NOTIFICATION_CATEGORIES).map(([key, value]) => ({
                    value,
                    label: key.replace('_', ' ')
                  }))
                ]}
              />
            </div>

            {/* Priority */}
            <div>
              <FormField
                type="select"
                label="Priority"
                value={filters.priority}
                onChange={(value) => handleFilterChange('priority', value)}
                options={[
                  { value: '', label: 'All Priorities' },
                  ...Object.entries(NOTIFICATION_PRIORITIES).map(([key, value]) => ({
                    value,
                    label: key
                  }))
                ]}
              />
            </div>

            {/* Date Range */}
            <div>
              <FormField
                type="date"
                label="Start Date"
                value={filters.startDate}
                onChange={(value) => handleFilterChange('startDate', value)}
                icon={<CalendarIcon className="h-4 w-4" />}
              />
            </div>

            <div>
              <FormField
                type="date"
                label="End Date"
                value={filters.endDate}
                onChange={(value) => handleFilterChange('endDate', value)}
                icon={<CalendarIcon className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setFilters({
                  type: '',
                  category: '',
                  priority: '',
                  startDate: '',
                  endDate: '',
                  search: ''
                });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <EnhancedNotificationsList
        notifications={notifications}
        loading={loading}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        showFilters={false}
        showActions={true}
      />

      {/* Pagination */}
      {notifications.length > 0 && (
        <div className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, notifications.length)} of{' '}
              {notifications.length} notifications
            </span>
            
            <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            
            <span className="flex items-center px-3 py-1 text-sm text-gray-700">
              Page {pagination.page} of {Math.ceil(notifications.length / pagination.pageSize)}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(notifications.length / pagination.pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationHistory; 