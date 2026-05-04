import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  XMarkIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import FileUploadWithProgress from '../Common/FileUploadWithProgress';
import Button from '../Common/Button';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

const SecondOpinionForm = ({ doctor, onClose, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reports, setReports] = useState([]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      description: ''
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .required('Case description is required')
        .min(50, 'Please provide a detailed description (at least 50 characters)')
        .max(1000, 'Description must be less than 1000 characters')
    }),
    onSubmit: async (values) => {
      if (reports.length === 0) {
        toast.warning('Please upload at least one medical report');
        return;
      }
      // Automatically submit consultation after files are uploaded
      await submitConsultation();
    }
  });

  const submitConsultation = async () => {
    setSubmitting(true);
    try {
      // Extract file IDs from uploaded files
      const fileIds = reports
        .filter(file => file.fileId)
        .map(file => file.fileId);

      // Create consultation request
      const consultationData = {
        title: `Second Opinion Request - ${doctor.name || doctor.profile?.fullName || 'Doctor'}`,
        description: formik.values.description,
        fileIds: fileIds.length > 0 ? fileIds : null
      };

      // Create the consultation
      const response = await apiClient.post(API_ENDPOINTS.CONSULTATIONS.CREATE, consultationData);

      // Note: Doctor assignment is typically done by admin, but we can try to assign if the endpoint allows
      // For now, the consultation is created and can be assigned later by admin
      const consultationId = response.data?.data?.id;

      if (consultationId) {
        setSuccess(true);
        toast.success('Second opinion request submitted successfully! The doctor will be notified.');
      } else {
        throw new Error('Failed to create consultation');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'Failed to submit consultation request';
      toast.error(errorMessage);
      console.error('Consultation submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilesUploaded = (uploadedFiles) => {
    // Update reports with newly uploaded files
    // Note: uploadedFiles is an array of file objects from the upload component
    setReports(prev => {
      // Merge with existing files, avoiding duplicates
      const existingIds = new Set(prev.map(f => f.fileId).filter(Boolean));
      const newFiles = uploadedFiles.filter(f => !existingIds.has(f.fileId));
      return [...prev, ...newFiles];
    });
    // Don't auto-submit - let user review and click submit button
  };

  const steps = [
    {
      number: 1,
      title: 'Case Details',
      icon: DocumentTextIcon,
      description: 'Describe your medical case'
    },
    {
      number: 2,
      title: 'Upload Reports',
      icon: CloudArrowUpIcon,
      description: 'Upload medical documents'
    }
  ];

  const canProceedToStep2 = formik.isValid && formik.values.description.length >= 50;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your second opinion request has been submitted to <strong>{doctor.name}</strong>.
              You will be notified once the review is complete.
            </p>
            <Button variant="primary" onClick={onClose} fullWidth>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Request Second Opinion
              </h2>
              <p className="text-sm text-gray-500">Dr. {doctor.name} - {doctor.specialty}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const IconComponent = step.icon;

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${isCompleted ? 'bg-green-600 text-white' :
                      isActive ? 'bg-primary-600 text-white' :
                        'bg-gray-200 text-gray-500'}
                  `}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${isActive ? 'text-primary-600' :
                        isCompleted ? 'text-green-600' :
                          'text-gray-500'
                      }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Case Details */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <DocumentTextIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Describe Your Medical Case
                </h3>
                <p className="text-gray-600">
                  Please provide detailed information about your condition and what you'd like the doctor to review.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Case Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={8}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${formik.touched.description && formik.errors.description
                        ? 'border-red-500'
                        : 'border-gray-300'
                      }`}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Please describe your medical condition, symptoms, previous treatments, test results, and specific questions you'd like the doctor to address..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {formik.touched.description && formik.errors.description && (
                        <p className="text-sm text-red-600">{formik.errors.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formik.values.description.length}/1000 characters
                      {formik.values.description.length >= 50 && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for a good description:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Include your symptoms and when they started</li>
                    <li>• Mention any previous treatments or medications</li>
                    <li>• Describe what specific advice you're seeking</li>
                    <li>• Include relevant medical history</li>
                  </ul>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Upload Reports */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <CloudArrowUpIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Medical Reports
                </h3>
                <p className="text-gray-600">
                  Upload your medical reports, test results, or any relevant documents (PDF format only).
                </p>
              </div>

              <div className="mb-6">
                <FileUploadWithProgress
                  onFilesChange={setReports}
                  onUploadComplete={handleFilesUploaded}
                  acceptedFiles={reports}
                  multiple={true}
                  maxSize={5 * 1024 * 1024} // 5MB
                  category="medical_report"
                />
              </div>

              {reports.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Medical reports required
                      </h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Please upload at least one medical report to proceed with your consultation request.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Accepted file types:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PDF documents only</li>
                  <li>• Maximum file size: 5MB per file</li>
                  <li>• Multiple files allowed</li>
                  <li>• Ensure documents are clear and readable</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>

            <div className="flex space-x-3">
              {currentStep === 1 && (
                <Button
                  variant="primary"
                  onClick={() => {
                    if (canProceedToStep2) {
                      setCurrentStep(2);
                    } else {
                      formik.handleSubmit();
                    }
                  }}
                  disabled={!canProceedToStep2}
                >
                  Next: Upload Reports
                </Button>
              )}

              {currentStep === 2 && (
                <Button
                  variant="primary"
                  onClick={submitConsultation}
                  disabled={!canProceedToStep2 || reports.length === 0 || submitting}
                  loading={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondOpinionForm;