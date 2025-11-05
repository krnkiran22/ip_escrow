import toast from 'react-hot-toast';

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.initialized = false;
  }

  async requestPermission() {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        this.permission = permission;
        this.initialized = true;
        return permission === 'granted';
      } catch (error) {
        console.error('Notification permission error:', error);
        return false;
      }
    }
    return false;
  }

  async show(title, options = {}) {
    // Always show toast notification
    this.showToast(options.type || 'info', title, options.body);

    // Try browser notification if permitted
    if (this.permission === 'granted' && 'Notification' in window) {
      try {
        const notification = new Notification(title, {
          body: options.body,
          icon: options.icon || '/vite.svg',
          badge: options.badge || '/vite.svg',
          tag: options.tag,
          data: options.data
        });

        if (options.onClick) {
          notification.onclick = options.onClick;
        }

        if (options.autoClose !== false) {
          setTimeout(() => notification.close(), options.duration || 5000);
        }

        return notification;
      } catch (error) {
        console.error('Browser notification error:', error);
      }
    }
  }

  showToast(type, title, message) {
    const fullMessage = message ? `${title}\n${message}` : title;
    
    switch (type) {
      case 'success':
        toast.success(fullMessage);
        break;
      case 'error':
        toast.error(fullMessage);
        break;
      case 'warning':
        toast(fullMessage, { icon: '⚠️' });
        break;
      case 'info':
        toast(fullMessage, { icon: 'ℹ️' });
        break;
      default:
        toast(fullMessage);
    }
  }

  // Project notifications
  projectCreated(projectTitle) {
    this.show('Project Created! 🎉', {
      body: `"${projectTitle}" has been created successfully`,
      type: 'success',
      tag: 'project-created'
    });
  }

  applicationReceived(applicantName, projectTitle) {
    this.show('New Application 📨', {
      body: `${applicantName} applied to "${projectTitle}"`,
      type: 'info',
      tag: 'application-received'
    });
  }

  applicationAccepted(projectTitle) {
    this.show('Application Accepted! ✅', {
      body: `You've been accepted for "${projectTitle}"`,
      type: 'success',
      tag: 'application-accepted'
    });
  }

  applicationRejected(projectTitle) {
    this.show('Application Update', {
      body: `Your application for "${projectTitle}" was not accepted`,
      type: 'warning',
      tag: 'application-rejected'
    });
  }

  // Milestone notifications
  milestoneSubmitted(milestoneNumber, projectTitle) {
    this.show('Milestone Submitted 📤', {
      body: `Milestone #${milestoneNumber} submitted for "${projectTitle}"`,
      type: 'info',
      tag: 'milestone-submitted'
    });
  }

  milestoneApproved(milestoneNumber, amount) {
    this.show('Payment Released! 💰', {
      body: `Milestone #${milestoneNumber} approved. ${amount} ETH released`,
      type: 'success',
      tag: 'milestone-approved'
    });
  }

  milestoneRejected(milestoneNumber, reason) {
    this.show('Milestone Rejected', {
      body: `Milestone #${milestoneNumber} needs revision: ${reason}`,
      type: 'warning',
      tag: 'milestone-rejected'
    });
  }

  // Transaction notifications
  transactionPending(action) {
    return toast.loading(`${action}... Please confirm in your wallet`, {
      duration: Infinity
    });
  }

  transactionConfirmed(toastId, action) {
    toast.success(`${action} confirmed! ✅`, { id: toastId });
  }

  transactionFailed(toastId, action, error) {
    toast.error(`${action} failed: ${error}`, { id: toastId });
  }

  // Dispute notifications
  disputeFiled(projectTitle) {
    this.show('Dispute Filed ⚠️', {
      body: `A dispute has been filed for "${projectTitle}"`,
      type: 'warning',
      tag: 'dispute-filed'
    });
  }

  disputeResolved(projectTitle, resolution) {
    this.show('Dispute Resolved', {
      body: `Dispute for "${projectTitle}" has been resolved: ${resolution}`,
      type: 'info',
      tag: 'dispute-resolved'
    });
  }

  // Payment notifications
  paymentReceived(amount, projectTitle) {
    this.show('Payment Received! 💸', {
      body: `You received ${amount} ETH from "${projectTitle}"`,
      type: 'success',
      tag: 'payment-received'
    });
  }

  // Connection notifications
  walletConnected(address) {
    toast.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
  }

  walletDisconnected() {
    toast('Wallet disconnected', { icon: '👋' });
  }

  networkSwitched(networkName) {
    toast.success(`Switched to ${networkName}`);
  }

  wrongNetwork(expected) {
    toast.error(`Please switch to ${expected} network`);
  }

  // Generic notifications
  success(message) {
    toast.success(message);
  }

  error(message) {
    toast.error(message);
  }

  warning(message) {
    toast(message, { icon: '⚠️' });
  }

  info(message) {
    toast(message, { icon: 'ℹ️' });
  }

  loading(message) {
    return toast.loading(message);
  }

  dismiss(toastId) {
    toast.dismiss(toastId);
  }

  dismissAll() {
    toast.dismiss();
  }

  // Sound effects (optional)
  playNotificationSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore if autoplay is blocked
      });
    } catch (error) {
      // Ignore sound errors
    }
  }
}

export default new NotificationService();
