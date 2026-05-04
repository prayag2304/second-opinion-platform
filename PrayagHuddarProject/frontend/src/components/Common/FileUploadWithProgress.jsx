import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import fileService from '../../services/fileService';
import { FILE_CATEGORIES, ERROR_MESSAGES } from '../../config/constants';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced file upload component with progress tracking
 */
const FileUploadWithProgress = ({
  onUploadComplete,
  onUploadError,
  onFilesChange, // New prop for backward compatibility
  acceptedFiles, // New prop for pre-populated files
  category = FILE_CATEGORIES.MEDICAL_REPORT,
  applicationId = null,
  consultationId = null, // Support consultationId (preferred over applicationId)
  description = '',
  multiple = false,
  maxFiles = 5,
  maxSize = null, // New prop for max file size
  className = '',
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(acceptedFiles || []);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Use consultationId if provided, otherwise fall back to applicationId
  const effectiveConsultationId = consultationId || applicationId;

  const handleFileSelect = async (files) => {
    if (disabled || isUploading) return;

    const fileArray = Array.from(files);

    // Validate number of files
    if (multiple && fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (multiple) {
        // Upload multiple files
        const result = await fileService.uploadFiles(fileArray, {
          category,
          description,
          applicationId: effectiveConsultationId,
          onProgress: (progress) => {
            setUploadProgress(progress);
          },
          onError: (error) => {
            toast.error(error);
            if (onUploadError) onUploadError(error);
          }
        });

        if (result.success) {
          const newFiles = result.results.filter(r => r.success);
          setUploadedFiles(prev => [...prev, ...newFiles]);
          toast.success(`${result.successfulUploads} files uploaded successfully`);
          if (onUploadComplete) onUploadComplete(newFiles);
          if (onFilesChange) onFilesChange([...uploadedFiles, ...newFiles]);
        }
      } else {
        // Upload single file
        const file = fileArray[0];
        const result = await fileService.uploadFile(file, {
          category,
          description,
          applicationId: effectiveConsultationId,
          onProgress: (progress) => {
            setUploadProgress(progress);
          },
          onError: (error) => {
            toast.error(error);
            if (onUploadError) onUploadError(error);
          }
        });

        if (result.success) {
          const newFiles = [...uploadedFiles, result];
          setUploadedFiles(newFiles);
          toast.success('File uploaded successfully');
          if (onUploadComplete) onUploadComplete([result]);
          if (onFilesChange) onFilesChange(newFiles);
        }
      }
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.FILE_UPLOAD_FAILED);
      if (onUploadError) onUploadError(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.fileId !== fileId));
  };

  const getFileIcon = (mimeType) => {
    // Handle undefined or null mimeType
    if (!mimeType) {
      return <DocumentIcon className="w-6 h-6 text-gray-500" />;
    }

    if (mimeType.startsWith('image/')) {
      return <PhotoIcon className="w-6 h-6 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <DocumentIcon className="w-6 h-6 text-red-500" />;
    } else {
      return <DocumentIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      [FILE_CATEGORIES.MEDICAL_REPORT]: 'Medical Report',
      [FILE_CATEGORIES.LAB_RESULT]: 'Lab Result',
      [FILE_CATEGORIES.IMAGING]: 'Imaging',
      [FILE_CATEGORIES.PRESCRIPTION]: 'Prescription',
      [FILE_CATEGORIES.CERTIFICATE]: 'Certificate',
      [FILE_CATEGORIES.OTHER]: 'Other'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
          disabled={disabled || isUploading}
        />

        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <p className="font-medium">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs">
              {multiple ? `Up to ${maxFiles} files` : 'Single file'} •
              PDF, Images up to 10MB each
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {uploadProgress}% complete
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.fileId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.mimeType || file.contentType)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.originalFilename || file.filename || 'Unknown file'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size ? formatFileSize(file.size) : 'Unknown size'} • {getCategoryName(file.category)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <button
                    type="button"
                    onClick={() => removeFile(file.fileId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadedFiles.some(file => file.error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">
              Some files failed to upload. Please try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithProgress; 