import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNotificationPreferences } from '../../hooks/useNotifications';
import { 
  NOTIFICATION_CATEGORIES, 
  NOTIFICATION_CHANNELS, 
  NOTIFICATION_FREQUENCIES 
} from '../../config/constants';
import Button from './Button';
import FormField from './FormField';

const NotificationPreferences = () => {
  const { preferences, loading, error, updatePreferences } = useNotificationPreferences();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category, enabled) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: enabled
      }
    }));
  };

  const handleChannelChange = (channel, enabled) => {
    setFormData(prev => ({
      ...prev,
      [`${channel}Enabled`]: enabled
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updatePreferences(formData);
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (preferences) {
      setFormData(preferences);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading preferences: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Notification Channels */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
          <div className="space-y-3">
            {Object.entries(NOTIFICATION_CHANNELS).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {value.replace('_', ' ')} Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive notifications via {value.replace('_', ' ')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData[`${value}Enabled`] || false}
                    onChange={(e) => handleChannelChange(value, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Categories */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Categories</h4>
          <div className="space-y-3">
            {Object.entries(NOTIFICATION_CATEGORIES).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {value.replace('_', ' ')} Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive notifications about {value.replace('_', ' ')} activities
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.categories?.[value] || false}
                    onChange={(e) => handleCategoryChange(value, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Frequency */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Frequency</h4>
          <FormField
            type="select"
            label="How often should we send notifications?"
            value={formData.frequency || NOTIFICATION_FREQUENCIES.IMMEDIATE}
            onChange={(value) => handleInputChange('frequency', value)}
            options={[
              { value: NOTIFICATION_FREQUENCIES.IMMEDIATE, label: 'Immediately' },
              { value: NOTIFICATION_FREQUENCIES.DAILY, label: 'Daily Digest' },
              { value: NOTIFICATION_FREQUENCIES.WEEKLY, label: 'Weekly Digest' }
            ]}
          />
        </div>

        {/* Quiet Hours */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Quiet Hours</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="time"
              label="Start Time"
              value={formData.quietHoursStart || '22:00'}
              onChange={(value) => handleInputChange('quietHoursStart', value)}
            />
            <FormField
              type="time"
              label="End Time"
              value={formData.quietHoursEnd || '08:00'}
              onChange={(value) => handleInputChange('quietHoursEnd', value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Notifications will be delayed during quiet hours (except urgent ones)
          </p>
        </div>

        {/* Timezone */}
        <div>
          <FormField
            type="select"
            label="Timezone"
            value={formData.timezone || 'UTC'}
            onChange={(value) => handleInputChange('timezone', value)}
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'America/New_York', label: 'Eastern Time' },
              { value: 'America/Chicago', label: 'Central Time' },
              { value: 'America/Denver', label: 'Mountain Time' },
              { value: 'America/Los_Angeles', label: 'Pacific Time' },
              { value: 'Europe/London', label: 'London' },
              { value: 'Europe/Paris', label: 'Paris' },
              { value: 'Asia/Tokyo', label: 'Tokyo' },
              { value: 'Asia/Shanghai', label: 'Shanghai' },
              { value: 'Asia/Kolkata', label: 'India' }
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationPreferences; 