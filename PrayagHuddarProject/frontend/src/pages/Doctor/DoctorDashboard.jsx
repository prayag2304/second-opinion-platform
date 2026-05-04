import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PDFViewer from '../../components/Common/PDFViewer';
import StatusBadge from '../../components/Common/StatusBadge';
import apiClient from '../../services/apiClient';

const DoctorDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiClient.get('/doctor/applications');
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = async (applicationId) => {
    try {
      const response = await apiClient.get(`/doctor/applications/${applicationId}`);
      setSelectedApplication(response.data);
    } catch (error) {
      toast.error('Failed to fetch application details');
    }
  };

  const handleSubmitReview = async (applicationId, review) => {
    try {
      await apiClient.post(`/doctor/applications/${applicationId}/review`, {
        review,
      });
      toast.success('Review submitted successfully');
      setSelectedApplication(null);
      fetchApplications(); // Refresh the list
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      reviewed: 'status-reviewed',
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="doctor-dashboard">
        <h1>Patient Cases</h1>

        {applications.length === 0 ? (
          <div className="card text-center">
            <p>No patient cases found</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-responsive">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>{application.patientName}</td>
                      <td>
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td>
                        <button
                          onClick={() => handleViewApplication(application.id)}
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedApplication && (
          <ApplicationModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onSubmitReview={handleSubmitReview}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const ApplicationModal = ({ application, onClose, onSubmitReview }) => {
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);

  const handleSubmit = async () => {
    if (!review.trim()) {
      toast.error('Please enter a review');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitReview(application.id, review);
    } finally {
      setSubmitting(false);
    }
  };

  const isReviewed = application.status === 'reviewed';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Patient Case Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Patient Name</label>
              <span className="text-lg font-semibold text-gray-900">{application.patientName}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Submitted Date</label>
              <span className="text-gray-900">
                {new Date(application.submittedAt).toLocaleDateString()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Consultation Fee</label>
              <span className="text-lg font-semibold text-green-600">${application.fee}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Case Description</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{application.description}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Medical Reports</label>
            <div className="space-y-2">
              {application.reports?.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="w-6 h-6 text-red-500" />
                    <span className="text-gray-900">{report}</span>
                  </div>
                  <button
                    onClick={() => setSelectedPDF(report)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View PDF
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Your Review</label>
            {isReviewed ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Review has already been submitted for this application.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your detailed medical review and recommendations..."
                />
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitting || !review.trim()}
                    loading={submitting}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {selectedPDF && (
        <PDFViewer file={selectedPDF} onClose={() => setSelectedPDF(null)} />
      )}
    </div>
  );
};

export default DoctorDashboard;
