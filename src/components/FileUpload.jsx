import { useState, useRef } from 'react';
import { uploadFile, validateFile, generateFileHash, uploadFileWithProgress } from '../services/ipfsService';
import { Upload, X, CheckCircle, AlertCircle, Loader, File, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export function FileUpload({ 
  onUploadComplete, 
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  showProgress = true,
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    // Validate each file
    const validatedFiles = fileArray.map(file => {
      const validation = validateFile(file, { maxSize, allowedTypes: acceptedTypes });
      return {
        file,
        ...validation,
        id: Date.now() + Math.random(),
        progress: 0,
      };
    });
    
    setFiles(prev => multiple ? [...prev, ...validatedFiles] : validatedFiles);
    
    // Show validation errors
    validatedFiles.forEach(fileData => {
      if (!fileData.valid) {
        toast.error(`${fileData.file.name}: ${fileData.error}`);
      }
    });
  };
  
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };
  
  const handleUpload = async () => {
    const validFiles = files.filter(f => f.valid && !progress[f.id]);
    
    if (validFiles.length === 0) {
      toast.error('No valid files to upload');
      return;
    }
    
    setUploading(true);
    const toastId = toast.loading(`Uploading ${validFiles.length} file(s)...`);
    
    try {
      for (const fileData of validFiles) {
        const { file, id } = fileData;
        
        setProgress(prev => ({ ...prev, [id]: { status: 'uploading', percent: 0 } }));
        
        // Generate file hash
        const fileHash = await generateFileHash(file);
        
        // Upload to IPFS with progress
        const result = showProgress 
          ? await uploadFileWithProgress(file, (percent) => {
              setProgress(prev => ({ 
                ...prev, 
                [id]: { status: 'uploading', percent } 
              }));
            })
          : await uploadFile(file);
        
        if (result.success) {
          setProgress(prev => ({ 
            ...prev, 
            [id]: { status: 'success', percent: 100 } 
          }));
          
          // Callback with complete result
          onUploadComplete?.({
            ...result,
            fileHash,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          });
          
          toast.success(`${file.name} uploaded!`, { id: toastId });
        } else {
          setProgress(prev => ({ 
            ...prev, 
            [id]: { status: 'error', percent: 0, error: result.error } 
          }));
          
          toast.error(`Failed to upload ${file.name}`, { id: toastId });
        }
      }
      
      toast.success('All files uploaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed: ' + error.message, { id: toastId });
    } finally {
      setUploading(false);
    }
  };
  
  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };
  
  const clearAll = () => {
    setFiles([]);
    setProgress({});
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    }
    return <File className="w-5 h-5 text-gray-600" />;
  };
  
  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
          accept={acceptedTypes?.join(',')}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer block"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            {dragActive ? 'Drop files here' : 'Drag & drop files here or click to browse'}
          </p>
          <p className="text-xs text-slate-500">
            Max size: {formatFileSize(maxSize)} per file
          </p>
        </label>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            {files.length > 1 && !uploading && (
              <button
                onClick={clearAll}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          
          {files.map(({ file, id, valid, error }) => {
            const fileProgress = progress[id];
            const isUploading = fileProgress?.status === 'uploading';
            const isSuccess = fileProgress?.status === 'success';
            const isError = fileProgress?.status === 'error';
            
            return (
              <div
                key={id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  !valid ? 'bg-red-50 border border-red-200' :
                  isSuccess ? 'bg-green-50 border border-green-200' :
                  isError ? 'bg-red-50 border border-red-200' :
                  'bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="shrink-0">
                    {isUploading && <Loader className="w-5 h-5 text-indigo-600 animate-spin" />}
                    {isSuccess && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isError && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {!fileProgress && valid && getFileIcon(file.type)}
                    {!valid && <AlertCircle className="w-5 h-5 text-red-600" />}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {/* Error Message */}
                    {!valid && (
                      <p className="text-xs text-red-600 mt-1">{error}</p>
                    )}
                    
                    {/* Upload Status */}
                    {isUploading && (
                      <div className="mt-1">
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${fileProgress.percent}%` }}
                          />
                        </div>
                        <p className="text-xs text-indigo-600 mt-1">
                          Uploading... {fileProgress.percent}%
                        </p>
                      </div>
                    )}
                    
                    {isSuccess && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Uploaded successfully
                      </p>
                    )}
                    
                    {isError && (
                      <p className="text-xs text-red-600 mt-1">
                        {fileProgress.error || 'Upload failed'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Remove Button */}
                {!isUploading && (
                  <button
                    onClick={() => removeFile(id)}
                    className="text-slate-400 hover:text-red-600 transition-colors shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Upload Button */}
      {files.length > 0 && files.some(f => f.valid && !progress[f.id]) && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload {files.filter(f => f.valid && !progress[f.id]).length} file(s) to IPFS
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default FileUpload;
