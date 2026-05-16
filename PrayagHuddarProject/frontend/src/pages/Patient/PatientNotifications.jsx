import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import EnhancedNotificationsList from '../../components/Common/EnhancedNotificationsList';
import apiClient from '../../services/apiClient';

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/api/notifications/patient');

console.log(response.data);

setNotifications(response.data);
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <DashboardLayout>
      <div className="patient-notifications">
        <h1>Notifications</h1>
        <div>
  {notifications.map((notification) => (
    <div
  key={notification.id}
  style={{
    border: '1px solid #ccc',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '6px',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}
>
  <span>🔔 {notification.message}</span>

  <button
    onClick={() => handleDelete(notification.id)}
    style={{
      background: 'red',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      cursor: 'pointer'
    }}
  >
    ×
  </button>
</div>
  ))}
</div>
      </div>
    </DashboardLayout>
  );
};

export default PatientNotifications;
