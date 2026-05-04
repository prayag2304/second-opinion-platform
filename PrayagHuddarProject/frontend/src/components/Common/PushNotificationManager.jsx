import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  BellIcon, 
  BellSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  isFirebaseConfigured, 
  isPushNotificationsEnabled,
  requestNotificationPermission 
} from '../../utils/firebase';
import Button from './Button';

const PushNotificationManager = () => {
  const { 
    subscribeToPush, 
    unsubscribeFromPush, 
    testPushNotification,
    preferences,
    loading 
  } = useNotifications();

  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [permission, setPermission] = useState('default');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPushSupport();
    checkPermission();
  }, []);

  useEffect(() => {
    if (preferences) {
      setIsSubscribed(preferences.pushEnabled || false);
    }
  }, [preferences]);

  const checkPushSupport = () => {
    const browserSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    const firebaseConfigured = isFirebaseConfigured();
    const pushEnabled = isPushNotificationsEnabled();
    
    const supported = browserSupported && firebaseConfigured && pushEnabled;
    setIsSupported(supported);
    
    if (!browserSupported) {
      setError('Push notifications are not supported in this browser');
    } else if (!firebaseConfigured) {
      setError('Firebase is not properly configured');
    } else if (!pushEnabled) {
      setError('Push notifications are disabled');
    }
  };

  const checkPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'denied') {
        setError('Push notification permission was denied. Please enable it in your browser settings.');
      }
    } catch (error) {
      setError('Failed to check notification permission');
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return;
    }

    try {
      const token = await requestNotificationPermission();
      if (token) {
        setPermission('granted');
        toast.success('Push notification permission granted!');
        setError(null);
      } else {
        setPermission('denied');
        setError('Push notification permission was denied. Please enable it in your browser settings.');
        toast.error('Push notification permission denied');
      }
    } catch (error) {
      setError('Failed to request notification permission');
      toast.error('Failed to request notification permission');
    }
  };

  const handleSubscribe = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported');
      return;
    }

    if (permission !== 'granted') {
      toast.error('Please grant notification permission first');
      return;
    }

    setIsSubscribing(true);
    setError(null);

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY)
      });

      // Send subscription to backend
      await subscribeToPush({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
        }
      });

      setIsSubscribed(true);
      toast.success('Successfully subscribed to push notifications!');
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to subscribe to push notifications. Please try again.');
      toast.error('Failed to subscribe to push notifications');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true);
    setError(null);

    try {
      // Get current subscription
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      // Notify backend
      await unsubscribeFromPush();

      setIsSubscribed(false);
      toast.success('Successfully unsubscribed from push notifications');
    } catch (error) {
      console.error('Unsubscription error:', error);
      setError('Failed to unsubscribe from push notifications');
      toast.error('Failed to unsubscribe from push notifications');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    setError(null);

    try {
      await testPushNotification();
      toast.success('Test notification sent successfully!');
    } catch (error) {
      console.error('Test notification error:', error);
      setError('Failed to send test notification');
      toast.error('Failed to send test notification');
    } finally {
      setIsTesting(false);
    }
  };

  // Convert VAPID public key to Uint8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage your push notification settings
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Browser Support Status */}
        <div className="flex items-center space-x-3">
          {isSupported ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              Browser Support: {isSupported ? 'Supported' : 'Not Supported'}
            </p>
            {!isSupported && (
              <p className="text-xs text-gray-500">
                Your browser doesn't support push notifications
              </p>
            )}
          </div>
        </div>

        {/* Permission Status */}
        <div className="flex items-center space-x-3">
          {permission === 'granted' ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : permission === 'denied' ? (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              Permission: {permission === 'granted' ? 'Granted' : permission === 'denied' ? 'Denied' : 'Not Requested'}
            </p>
            {permission === 'denied' && (
              <p className="text-xs text-gray-500">
                Please enable notifications in your browser settings
              </p>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="flex items-center space-x-3">
          {isSubscribed ? (
            <BellIcon className="h-5 w-5 text-green-500" />
          ) : (
            <BellSlashIcon className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              Subscription: {isSubscribed ? 'Active' : 'Inactive'}
            </p>
            <p className="text-xs text-gray-500">
              {isSubscribed 
                ? 'You will receive push notifications' 
                : 'You are not subscribed to push notifications'
              }
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {permission !== 'granted' && (
            <Button
              variant="primary"
              onClick={requestPermission}
              disabled={!isSupported}
              className="w-full"
            >
              Request Permission
            </Button>
          )}

          {permission === 'granted' && !isSubscribed && (
            <Button
              variant="primary"
              onClick={handleSubscribe}
              loading={isSubscribing}
              disabled={isSubscribing || !isSupported}
              className="w-full"
            >
              Subscribe to Push Notifications
            </Button>
          )}

          {isSubscribed && (
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleUnsubscribe}
                loading={isUnsubscribing}
                disabled={isUnsubscribing}
                className="w-full"
              >
                Unsubscribe from Push Notifications
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTestNotification}
                loading={isTesting}
                disabled={isTesting}
                className="w-full"
              >
                Send Test Notification
              </Button>
            </div>
          )}
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">About Push Notifications</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Receive instant notifications even when the app is closed</li>
            <li>• Notifications are sent through your browser's push service</li>
            <li>• You can unsubscribe at any time</li>
            <li>• Notifications respect your quiet hours settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationManager; 