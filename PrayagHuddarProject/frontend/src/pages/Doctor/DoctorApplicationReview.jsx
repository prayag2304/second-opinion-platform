import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import FormField from '../../components/Common/FormField';
import PDFViewer from '../../components/Common/PDFViewer';
import StatusBadge from '../../components/Common/StatusBadge';
import apiClient from '../../services/apiClient';

const DoctorApplicationReview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState({
    status: 'pending',
    comments: '',
    recommendations: '',
    estimatedTime: '',
    additionalRequirements: '',
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await apiClient.get(`/doctor/applications/${applicationId}`);
      setApplication(response.data);
      setReview(prev => ({
        ...prev,
        status: response.data.status,
      }));
    } catch (error) {
      toast.error('Failed to fetch application details');
      navigate('/doctor/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post(`/doctor/applications/${applicationId}/review`, review);
      toast.success('Application review submitted successfully');
      navigate('/doctor/applications');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (status) => {
    setReview(prev => ({ ...prev, status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading application..." />
      </DashboardLayout>
    );
  }

  if (!application) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h2>
          <Button onClick={() => navigate('/doctor/applications')} variant="primary">
            Back to Applications
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="doctor-application-review">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Review Application</h1>
          <Button onClick={() => navigate('/doctor/applications')} variant="outline">
            Back to Applications
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Details */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
                <StatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <p className="text-gray-900">{application.patient?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                  <p className="text-gray-900">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-gray-900">₹{application.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                  <p className="text-gray-900 font-mono">{application.id}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Description</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{application.description}</p>
                </div>
              </div>

              {application.symptoms && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{application.symptoms}</p>
                  </div>
                </div>
              )}

              {/* Medical Reports */}
              {application.files && application.files.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Reports</label>
                  <div className="space-y-2">
                    {application.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            📄
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                            <p className="text-xs text-gray-500">{file.fileSize} bytes</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => window.open(`/files/preview/${file.id}`, '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            Preview
                          </Button>
                          <Button
                            onClick={() => window.open(`/files/download/${file.id}`, '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Response</h3>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['approved', 'rejected', 'pending', 'completed'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                          review.status === status
                            ? getStatusColor(status)
                            : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <FormField
                  label="Comments"
                  type="textarea"
                  value={review.comments}
                  onChange={(e) => setReview(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Provide detailed comments about the application..."
                  rows={4}
                  required
                />

                {/* Recommendations */}
                <FormField
                  label="Recommendations"
                  type="textarea"
                  value={review.recommendations}
                  onChange={(e) => setReview(prev => ({ ...prev, recommendations: e.target.value }))}
                  placeholder="Provide medical recommendations..."
                  rows={3}
                />

                {/* Estimated Time */}
                <FormField
                  label="Estimated Review Time"
                  type="select"
                  value={review.estimatedTime}
                  onChange={(e) => setReview(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  options={[
                    { value: '', label: 'Select time' },
                    { value: '1-2 days', label: '1-2 days' },
                    { value: '3-5 days', label: '3-5 days' },
                    { value: '1 week', label: '1 week' },
                    { value: '2 weeks', label: '2 weeks' },
                  ]}
                />

                {/* Additional Requirements */}
                <FormField
                  label="Additional Requirements"
                  type="textarea"
                  value={review.additionalRequirements}
                  onChange={(e) => setReview(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                  placeholder="Any additional requirements or information needed..."
                  rows={3}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  onClick={() => window.open(`/patient/applications/${applicationId}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  View Patient Details
                </Button>
                <Button
                  onClick={() => window.open(`/files/application/${applicationId}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  View All Files
                </Button>
                <Button
                  onClick={() => window.open(`/payments/status/${application.paymentId}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Check Payment Status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorApplicationReview; 