import { ERROR_MESSAGES } from '../config/constants';
import toast from 'react-hot-toast';

export class ErrorHandler {
  static getUserFriendlyMessage(error) {
    if (!error) return 'An unexpected error occurred';

    const errorString = error.message?.toLowerCase() || String(error).toLowerCase();
    
    // Check for known error patterns
    for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
      if (errorString.includes(key.toLowerCase())) {
        return message;
      }
    }

    // Check error code
    if (error.code) {
      const codeMessage = ERROR_MESSAGES[error.code];
      if (codeMessage) return codeMessage;
    }

    // Parse revert reasons
    if (errorString.includes('execution reverted')) {
      const match = errorString.match(/execution reverted: (.*?)"/);
      if (match && match[1]) {
        return `Contract error: ${match[1]}`;
      }
      return 'This action is not allowed. Please check the requirements.';
    }

    // Gas estimation failures
    if (errorString.includes('gas')) {
      return 'Transaction would fail. Please check your parameters and try again.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  }

  static handleTransactionError(error, customMessage) {
    const message = customMessage || this.getUserFriendlyMessage(error);
    console.error('Transaction error:', error);
    toast.error(message);
    return message;
  }

  static handleApiError(error, customMessage) {
    console.error('API error:', error);
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        toast.error('Please connect your wallet');
        return 'Authentication required';
      } else if (status === 404) {
        toast.error('Resource not found');
        return 'Not found';
      } else if (status === 500) {
        toast.error('Server error. Please try again later');
        return 'Server error';
      } else if (message) {
        toast.error(message);
        return message;
      }
    } else if (error.request) {
      toast.error('Network error. Check your connection');
      return 'Network error';
    }

    const fallback = customMessage || 'An error occurred';
    toast.error(fallback);
    return fallback;
  }

  static async withRetry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        
        console.log(`Retry attempt ${attempt}/${maxAttempts}...`);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      }
    }
  }

  static logError(context, error, additionalData = {}) {
    console.error(`[${context}]`, {
      error,
      message: error.message,
      stack: error.stack,
      ...additionalData,
      timestamp: new Date().toISOString()
    });
  }
}

export default ErrorHandler;
