import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, FileText, CheckCircle, Upload, DollarSign, 
  XCircle, AlertTriangle, X 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import apiService from '../services/apiService';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationCenter() {
  const navigate = useNavigate();
  const { showError } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const response = await apiService.notifications.getNotifications();
      setNotifications(response.data || []);
      setUnreadCount((response.data || []).filter((n) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }

  async function markAsRead(notificationId) {
    try {
      await apiService.notifications.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      showError('Failed to mark as read');
    }
  }

  async function markAllAsRead() {
    try {
      await apiService.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      showError('Failed to mark all as read');
    }
  }

  function getNotificationIcon(type) {
    const icons = {
      application_received: <FileText className="w-5 h-5 text-cyan-600" />,
      application_approved: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      milestone_submitted: <Upload className="w-5 h-5 text-amber-600" />,
      milestone_approved: <DollarSign className="w-5 h-5 text-emerald-600" />,
      milestone_rejected: <XCircle className="w-5 h-5 text-red-600" />,
      payment_received: <DollarSign className="w-5 h-5 text-emerald-600" />,
      dispute_filed: <AlertTriangle className="w-5 h-5 text-red-600" />
    };
    return icons[type] || <Bell className="w-5 h-5 text-slate-600" />;
  }

  function handleNotificationClick(notification) {
    markAsRead(notification.id);

    // Navigate based on notification type
    const { project_id, milestone_id, application_id } = notification.data || {};

    if (project_id) {
      navigate(`/projects/${project_id}`);
    }

    setIsOpen(false);
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100 rounded-lg transition"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-slate-700" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border z-40">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      p-4 border-b cursor-pointer transition
                      hover:bg-slate-50
                      ${!notification.read ? 'bg-emerald-50' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true
                          })}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
