import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatusBadge from '../../components/Common/StatusBadge';
import PDFViewer from '../../components/Common/PDFViewer';
import Button from '../../components/Common/Button';
import apiClient from '../../services/apiClient';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { API_ENDPOINTS } from '../../config/api';

const PatientApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Use consultations endpoint instead of applications
      const response = await apiClient.get(API_ENDPOINTS.CONSULTATIONS.LIST);
      // Extract data from ApiResponse wrapper
      const consultationsData = response.data?.data?.content || response.data?.data || response.data || [];
      // Transform consultations to match application structure
      const transformedApplications = Array.isArray(consultationsData)
        ? consultationsData.map(consultation => ({
          id: consultation.id,
          doctorName: consultation.doctorName || 'Not Assigned',
          doctorSpecialty: 'N/A', // Backend doesn't provide specialty in response
          submittedAt: consultation.createdAt || new Date().toISOString(),
          status: consultation.status || 'pending',
          fee: 0, // No fee in consultations
          description: consultation.description,
          title: consultation.title,
          files: consultation.files || [],
          opinion: consultation.opinion
        }))
        : [];
      setApplications(transformedApplications);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = async (applicationId) => {
    try {
      // Use consultations endpoint
      const response = await apiClient.get(API_ENDPOINTS.CONSULTATIONS.GET_BY_ID(applicationId));
      // Extract data from ApiResponse wrapper
      const consultation = response.data?.data || response.data;
      // Transform to match application structure
      const transformedApplication = {
        id: consultation.id,
        doctorName: consultation.doctorName || 'Not Assigned',
        doctorSpecialty: 'N/A', // Backend doesn't provide specialty in response
        submittedAt: consultation.createdAt || new Date().toISOString(),
        status: consultation.status || 'pending',
        fee: 0, // No fee in consultations
        description: consultation.description,
        title: consultation.title,
        review: consultation.opinion,
        reports: consultation.files?.map(file => file.filename) || []
      };
      setSelectedApplication(transformedApplication);
    } catch (error) {
      console.error('Failed to fetch consultation details:', error);
      toast.error('Failed to fetch application details');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading applications..." />
      </DashboardLayout>
    );
  }

  if (applications.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          title="No applications found"
          description="You have not submitted any applications yet."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="patient-applications">
        <h1>My Applications</h1>

        <div className="card">
          <div className="table-responsive">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className={
                      application.status === 'cancelled' ? 'cancelled-row' : ''
                    }
                  >
                    <td>#{application.id}</td>
                    <td>{application.doctorName}</td>
                    <td>{application.doctorSpecialty}</td>
                    <td>
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={application.status} />
                    </td>
                    <td>
                      <span className="font-semibold text-gray-600">
                        Free
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewApplication(application.id)}
                        className="btn btn-primary"
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

        {selectedApplication && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedApplication(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Application Details</h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedApplication(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="application-details">
                  <div className="detail-row">
                    <label>Application ID:</label>
                    <span>#{selectedApplication.id}</span>
                  </div>

                  <div className="detail-row">
                    <label>Doctor:</label>
                    <span>
                      {selectedApplication.doctorName} (
                      {selectedApplication.doctorSpecialty})
                    </span>
                  </div>

                  <div className="detail-row">
                    <label>Submitted:</label>
                    <span>
                      {new Date(
                        selectedApplication.submittedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="detail-row">
                    <label>Status:</label>
                    <StatusBadge status={selectedApplication.status} />
                  </div>

                  <div className="detail-row">
                    <label>Fee:</label>
                    <span>Free</span>
                  </div>

                  <div className="detail-section">
                    <label>Case Description:</label>
                    <p className="description-text">
                      {selectedApplication.description}
                    </p>
                  </div>

                  <div className="detail-section">
                    <label>Uploaded Reports:</label>
                    <ul className="reports-list">
                      {selectedApplication.reports?.map((report, index) => (
                        <li key={index}>
                          <span className="file-icon">📄</span>
                          <span
                            className="file-link"
                            onClick={() => setSelectedPDF(report)}
                          >
                            {report}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedApplication.review && (
                    <div className="detail-section review-section">
                      <label>Doctor's Review:</label>
                      <div className="review-content">
                        <p>{selectedApplication.review}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedPDF && (
          <PDFViewer file={selectedPDF} onClose={() => setSelectedPDF(null)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientApplications;
