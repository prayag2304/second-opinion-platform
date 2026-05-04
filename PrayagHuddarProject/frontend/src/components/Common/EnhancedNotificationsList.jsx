import React, { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  BellIcon, 
  CheckIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  NOTIFICATION_TYPES, 
  NOTIFICATION_CATEGORIES, 
  NOTIFICATION_PRIORITIES 
} from '../../config/constants';
import Button from './Button';

const EnhancedNotificationsList = ({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete,
  showFilters = true,
  showActions = true
}) => {
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    priority: 'all',
    read: 'all'
  });
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedNotifications = useMemo(() => {
    let filtered = notifications.filter(notification => {
      if (filters.type !== 'all' && notification.type !== filters.type) return false;
      if (filters.category !== 'all' && notification.category !== filters.category) return false;
      if (filters.priority !== 'all' && notification.priority !== filters.priority) return false;
      if (filters.read !== 'all') {
        const isRead = notification.isRead || notification.read;
        if (filters.read === 'read' && !isRead) return false;
        if (filters.read === 'unread' && isRead) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp || a.createdAt);
          bValue = new Date(b.timestamp || b.createdAt);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 2;
          bValue = priorityOrder[b.priority] || 2;
          break;
        case 'type':
          aValue = a.type || '';
          bValue = b.type || '';
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [notifications, filters, sortBy, sortOrder]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case NOTIFICATION_TYPES.ERROR:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case NOTIFICATION_TYPES.WARNING:
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      [NOTIFICATION_PRIORITIES.URGENT]: 'bg-red-100 text-red-800',
      [NOTIFICATION_PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800',
      [NOTIFICATION_PRIORITIES.NORMAL]: 'bg-blue-100 text-blue-800',
      [NOTIFICATION_PRIORITIES.LOW]: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || colors.normal}`}>
        {priority}
      </span>
    );
  };

  const handleMarkAsRead = async (notificationId) => {
    if (onMarkAsRead) {
      await onMarkAsRead(notificationId);
    }
  };

  const handleDelete = async (notificationId) => {
    if (onDelete) {
      await onDelete(notificationId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
        <p className="mt-1 text-sm text-gray-500">
          You're all caught up! Check back later for new updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>{key.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {Object.entries(NOTIFICATION_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={value}>{key.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                {Object.entries(NOTIFICATION_PRIORITIES).map(([key, value]) => (
                  <option key={key} value={value}>{key}</option>
                ))}
              </select>
            </div>

            {/* Read Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.read}
                onChange={(e) => setFilters(prev => ({ ...prev, read: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="timestamp-desc">Newest First</option>
                <option value="timestamp-asc">Oldest First</option>
                <option value="priority-desc">Priority (High to Low)</option>
                <option value="priority-asc">Priority (Low to High)</option>
                <option value="type-asc">Type (A-Z)</option>
                <option value="type-desc">Type (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {showActions && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredAndSortedNotifications.length} of {notifications.length} notifications
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  disabled={!notifications.some(n => !n.isRead && !n.read)}
                >
                  Mark All as Read
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredAndSortedNotifications.map(notification => {
          const isRead = notification.isRead || notification.read;
          
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
                isRead 
                  ? 'border-gray-200 opacity-75' 
                  : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title || notification.message}
                        </h4>
                        {!isRead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                            New
                          </span>
                        )}
                        {notification.priority && getPriorityBadge(notification.priority)}
                      </div>
                      
                      {notification.message && notification.title && (
                        <p className={`text-sm ${
                          isRead ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(new Date(notification.timestamp || notification.createdAt), { addSuffix: true })}
                        </span>
                        {notification.category && (
                          <span className="capitalize">{notification.category}</span>
                        )}
                        {notification.type && (
                          <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex items-center space-x-1 ml-4">
                      {!isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete notification"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedNotifications.length === 0 && notifications.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No notifications match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedNotificationsList; 