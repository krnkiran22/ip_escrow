import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export function useNotifications() {
  const [permission, setPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('ip_escrow_notifications_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('ip_escrow_sound_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('ip_escrow_notifications_enabled', JSON.stringify(enabled));
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('ip_escrow_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await notificationService.requestPermission();
      setPermission(result ? 'granted' : 'denied');
      return result;
    }

    return false;
  }, []);

  const toggleNotifications = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Toast notifications
  const showSuccess = useCallback((message, options = {}) => {
    if (enabled) {
      notificationService.success(message, options);
    }
  }, [enabled]);

  const showError = useCallback((message, options = {}) => {
    if (enabled) {
      notificationService.error(message, options);
    }
  }, [enabled]);

  const showWarning = useCallback((message, options = {}) => {
    if (enabled) {
      notificationService.warning(message, options);
    }
  }, [enabled]);

  const showInfo = useCallback((message, options = {}) => {
    if (enabled) {
      notificationService.info(message, options);
    }
  }, [enabled]);

  const showLoading = useCallback((message) => {
    if (enabled) {
      return notificationService.loading(message);
    }
    return null;
  }, [enabled]);

  // Browser notifications
  const showBrowserNotification = useCallback((title, options = {}) => {
    if (enabled && permission === 'granted') {
      notificationService.show(title, {
        ...options,
        playSound: soundEnabled && options.playSound !== false
      });
    }
  }, [enabled, permission, soundEnabled]);

  // Event-specific notifications
  const notifyProjectCreated = useCallback((projectName, projectId) => {
    if (enabled) {
      notificationService.projectCreated(projectName, projectId);
      if (permission === 'granted') {
        showBrowserNotification('Project Created', {
          body: `Your project "${projectName}" has been created successfully`,
          icon: '/project-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyApplicationReceived = useCallback((projectName, applicantName) => {
    if (enabled) {
      notificationService.applicationReceived(projectName, applicantName);
      if (permission === 'granted') {
        showBrowserNotification('New Application', {
          body: `${applicantName} applied to "${projectName}"`,
          icon: '/application-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyApplicationAccepted = useCallback((projectName) => {
    if (enabled) {
      notificationService.applicationAccepted(projectName);
      if (permission === 'granted') {
        showBrowserNotification('Application Accepted', {
          body: `Your application to "${projectName}" was accepted!`,
          icon: '/success-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyMilestoneSubmitted = useCallback((milestoneName, projectName) => {
    if (enabled) {
      notificationService.milestoneSubmitted(milestoneName, projectName);
      if (permission === 'granted') {
        showBrowserNotification('Milestone Submitted', {
          body: `"${milestoneName}" submitted for "${projectName}"`,
          icon: '/milestone-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyMilestoneApproved = useCallback((milestoneName, amount) => {
    if (enabled) {
      notificationService.milestoneApproved(milestoneName, amount);
      if (permission === 'granted') {
        showBrowserNotification('Milestone Approved', {
          body: `"${milestoneName}" approved! ${amount} ETH released`,
          icon: '/success-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyPaymentReceived = useCallback((amount, projectName) => {
    if (enabled) {
      notificationService.paymentReceived(amount, projectName);
      if (permission === 'granted') {
        showBrowserNotification('Payment Received', {
          body: `You received ${amount} ETH from "${projectName}"`,
          icon: '/payment-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyDisputeFiled = useCallback((projectName, reason) => {
    if (enabled) {
      notificationService.disputeFiled(projectName, reason);
      if (permission === 'granted') {
        showBrowserNotification('Dispute Filed', {
          body: `A dispute was filed for "${projectName}"`,
          icon: '/warning-icon.png',
          playSound: soundEnabled
        });
      }
    }
  }, [enabled, permission, soundEnabled, showBrowserNotification]);

  const notifyWalletConnected = useCallback((address) => {
    if (enabled) {
      notificationService.walletConnected(address);
    }
  }, [enabled]);

  const notifyNetworkSwitched = useCallback((networkName) => {
    if (enabled) {
      notificationService.networkSwitched(networkName);
    }
  }, [enabled]);

  const notifyWrongNetwork = useCallback((expectedNetwork) => {
    if (enabled) {
      notificationService.wrongNetwork(expectedNetwork);
    }
  }, [enabled]);

  return {
    permission,
    enabled,
    soundEnabled,
    requestPermission,
    toggleNotifications,
    toggleSound,
    // Toast methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    // Browser notification
    showBrowserNotification,
    // Event-specific
    notifyProjectCreated,
    notifyApplicationReceived,
    notifyApplicationAccepted,
    notifyMilestoneSubmitted,
    notifyMilestoneApproved,
    notifyPaymentReceived,
    notifyDisputeFiled,
    notifyWalletConnected,
    notifyNetworkSwitched,
    notifyWrongNetwork
  };
}

export default useNotifications;
