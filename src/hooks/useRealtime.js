import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import apiService from '../services/apiService';
import ErrorHandler from '../services/errorHandler';

export function useRealtime(endpoint, options = {}) {
  const {
    pollInterval = 30000, // 30 seconds default
    enabled = true,
    onUpdate = null,
    onError = null,
  } = options;

  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const fetchData = useCallback(async () => {
    if (!enabled || !address) return;

    try {
      let result;

      // Route to appropriate API endpoint
      switch (endpoint) {
        case 'myProjects':
          result = await apiService.projects.getMyProjects();
          break;
        case 'myApplications':
          result = await apiService.applications.getMyApplications();
          break;
        case 'projectApplications':
          if (options.projectId) {
            result = await apiService.applications.getProjectApplications(options.projectId);
          }
          break;
        case 'projectMilestones':
          if (options.projectId) {
            result = await apiService.milestones.getProjectMilestones(options.projectId);
          }
          break;
        case 'notifications':
          result = await apiService.notifications.getNotifications();
          break;
        case 'earnings':
          result = await apiService.earnings.getEarnings();
          break;
        case 'transactions':
          result = await apiService.earnings.getTransactionHistory();
          break;
        case 'ipAssets':
          result = await apiService.ipAssets.getMyIPAssets();
          break;
        case 'disputes':
          result = await apiService.disputes.getMyDisputes();
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      if (mountedRef.current) {
        // Check if data actually changed
        const dataChanged = JSON.stringify(data) !== JSON.stringify(result.data);
        
        if (dataChanged) {
          setData(result.data);
          setLastUpdated(Date.now());
          
          if (onUpdate) {
            onUpdate(result.data);
          }
        }

        setError(null);
        setLoading(false);
        retryCountRef.current = 0;
      }
    } catch (err) {
      ErrorHandler.logError('Realtime Polling', err);
      
      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);

        retryCountRef.current += 1;
        
        if (onError) {
          onError(err);
        }

        // Stop polling if max retries reached
        if (retryCountRef.current >= maxRetries) {
          stopPolling();
        }
      }
    }
  }, [endpoint, enabled, address, data, options.projectId, onUpdate, onError]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    // Initial fetch
    fetchData();

    // Start polling
    intervalRef.current = setInterval(fetchData, pollInterval);
  }, [fetchData, pollInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    retryCountRef.current = 0;
    await fetchData();
  }, [fetchData]);

  // Start polling on mount and when dependencies change
  useEffect(() => {
    if (enabled && address) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, address, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  // Pause polling when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (enabled && address) {
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, address, startPolling, stopPolling]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    startPolling,
    stopPolling,
    isPolling: !!intervalRef.current
  };
}

// Specialized hooks for common use cases
export function useRealtimeProjects(options = {}) {
  return useRealtime('myProjects', options);
}

export function useRealtimeApplications(options = {}) {
  return useRealtime('myApplications', options);
}

export function useRealtimeProjectApplications(projectId, options = {}) {
  return useRealtime('projectApplications', { ...options, projectId });
}

export function useRealtimeMilestones(projectId, options = {}) {
  return useRealtime('projectMilestones', { ...options, projectId });
}

export function useRealtimeNotifications(options = {}) {
  return useRealtime('notifications', options);
}

export function useRealtimeEarnings(options = {}) {
  return useRealtime('earnings', options);
}

export function useRealtimeTransactions(options = {}) {
  return useRealtime('transactions', options);
}

export function useRealtimeIPAssets(options = {}) {
  return useRealtime('ipAssets', options);
}

export function useRealtimeDisputes(options = {}) {
  return useRealtime('disputes', options);
}

export default useRealtime;
