import { useState } from 'react';
import ipfsService from '../services/ipfsService';
import ErrorHandler from '../services/errorHandler';
import { APP_CONFIG } from '../config/constants';

export function useIPFS() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    const validation = ipfsService.validateFile(file, APP_CONFIG.maxFileSize);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    setUploading(true);
    setProgress(0);

    try {
      const result = await ipfsService.uploadFileWithProgress(file, (percent) => {
        setProgress(percent);
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      ErrorHandler.logError('IPFS Upload', error);
      throw new Error('Failed to upload file to IPFS: ' + error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleFiles = async (files) => {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    // Validate all files first
    for (const file of files) {
      const validation = ipfsService.validateFile(file, APP_CONFIG.maxFileSize);
      if (!validation.valid) {
        throw new Error(`${file.name}: ${validation.error}`);
      }
    }

    // Check total size
    const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
    if (totalSize > APP_CONFIG.maxTotalFileSize) {
      throw new Error(`Total file size exceeds maximum of ${APP_CONFIG.maxTotalFileSize / (1024 * 1024)}MB`);
    }

    setUploading(true);
    setProgress(0);

    try {
      const results = await ipfsService.uploadMultipleFiles(files, (percent) => {
        setProgress(percent);
      });

      if (!results || results.failed?.length > 0) {
        throw new Error('Some files failed to upload');
      }

      return results;
    } catch (error) {
      ErrorHandler.logError('IPFS Upload Multiple', error);
      throw new Error('Failed to upload files to IPFS: ' + error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadJSON = async (data, name = 'metadata') => {
    setUploading(true);

    try {
      const result = await ipfsService.uploadJSON(data, name);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      ErrorHandler.logError('IPFS Upload JSON', error);
      throw new Error('Failed to upload JSON to IPFS: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchFromIPFS = async (hash) => {
    try {
      const data = await ipfsService.fetchJSONFromIPFS(hash);
      
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      ErrorHandler.logError('IPFS Fetch', error);
      throw new Error('Failed to fetch from IPFS: ' + error.message);
    }
  };

  const getIPFSUrl = (hash) => {
    return ipfsService.getFileURL(hash);
  };

  const formatFileSize = (bytes) => {
    return ipfsService.formatFileSize(bytes);
  };

  return {
    uploading,
    progress,
    uploadFile,
    uploadMultipleFiles,
    uploadJSON,
    fetchFromIPFS,
    getIPFSUrl,
    formatFileSize
  };
}

export default useIPFS;
