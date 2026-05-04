import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PDFViewer from '../../components/Common/PDFViewer';
import Pagination from '../../components/Common/Pagination';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import apiClient from '../../services/apiClient';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });

  const trackAdminAction = async (action, details) => {
    try {
      await apiClient.post('/api/admin/analytics', {
        action,
        details,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track admin action:', error);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, [pagination.currentPage, pagination.pageSize]);
  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/admin/doctors/pending', {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
        },
      });
      setPendingDoctors(response.data.doctors);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount,
      }));
    } catch (error) {
      toast.error('Failed to fetch pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId) => {
    setActionLoading((prev) => ({ ...prev, [doctorId]: 'approving' }));
    try {
      await apiClient.post('/api/admin/doctors/approve', { doctorId });
      toast.success('Doctor approved successfully');
      await trackAdminAction('approve_doctor', { doctorId });
      setPendingDoctors((prev) =>
        prev.filter((doctor) => doctor.id !== doctorId)
      );
    } catch (error) {
      toast.error('Failed to approve doctor');
    } finally {
      setActionLoading((prev) => ({ ...prev, [doctorId]: null }));
    }
  };

  const handleReject = async (doctorId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setActionLoading((prev) => ({ ...prev, [doctorId]: 'rejecting' }));
    try {
      await apiClient.post('/api/admin/doctors/reject', { doctorId, reason });
      toast.success('Doctor rejected successfully');
      await trackAdminAction('reject_doctor', { doctorId, reason });
      setPendingDoctors((prev) =>
        prev.filter((doctor) => doctor.id !== doctorId)
      );
    } catch (error) {
      toast.error('Failed to reject doctor');
    } finally {
      setActionLoading((prev) => ({ ...prev, [doctorId]: null }));
    }
  };

  const handleSelectDoctor = (doctorId, checked) => {
    setSelectedDoctors((prev) =>
      checked ? [...prev, doctorId] : prev.filter((id) => id !== doctorId)
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedDoctors(checked ? pendingDoctors.map((d) => d.id) : []);
  };

  const handleBulkAction = async () => {
    if (selectedDoctors.length === 0) {
      toast.warning('Please select doctors first');
      return;
    }

    if (!bulkAction) {
      toast.warning('Please select an action');
      return;
    }

    let reason = '';
    if (bulkAction === 'reject') {
      reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;
    }

    try {
      const response = await apiClient.post('/api/admin/doctors/bulk', {
        doctorIds: selectedDoctors,
        action: bulkAction,
        reason,
      });

      toast.success(response.data.message);
      if (response.data.errors) {
        response.data.errors.forEach((error) => toast.error(error));
      }

      await trackAdminAction('bulk_action', {
        action: bulkAction,
        count: selectedDoctors.length,
      });

      // Refresh the list
      fetchPendingDoctors();
      setSelectedDoctors([]);
      setBulkAction('');
      setShowBulkConfirm(false);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };
  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading pending doctors..." />
      </DashboardLayout>
    );
  }

  if (pendingDoctors.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          title="No pending doctors"
          description="There are no doctors awaiting approval at this time."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <i className="bi bi-person-check me-2"></i>
            Pending Doctor Registrations
          </h1>
        </div>

        {pendingDoctors.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="bi bi-person-check display-4 text-muted mb-3"></i>
              <h4 className="text-muted">No pending registrations</h4>
              <p className="text-muted">
                All doctor registrations have been processed.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-muted">
                        {selectedDoctors.length} of {pendingDoctors.length}{' '}
                        selected
                      </span>
                      {selectedDoctors.length > 0 && (
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm"
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            style={{ width: 'auto' }}
                          >
                            <option value="">Select Action</option>
                            <option value="approve">Approve Selected</option>
                            <option value="reject">Reject Selected</option>
                          </select>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowBulkConfirm(true)}
                            disabled={!bulkAction}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={
                                selectedDoctors.length === pendingDoctors.length
                              }
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                            />
                          </div>
                        </th>
                        <th>Doctor</th>
                        <th>Email</th>
                        <th>Specialty</th>
                        <th>License</th>
                        <th>Experience</th>
                        <th>Credentials</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDoctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedDoctors.includes(doctor.id)}
                                onChange={(e) =>
                                  handleSelectDoctor(
                                    doctor.id,
                                    e.target.checked
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="w-8 h-8 text-sm bg-blue-400 text-white rounded-full flex items-center justify-center mr-2">
                                {doctor.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-medium">{doctor.name}</div>
                                <small className="text-muted">
                                  ID: {doctor.id}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{doctor.email}</td>
                          <td>
                            <span className="badge bg-primary">
                              {doctor.specialty}
                            </span>
                          </td>
                          <td>
                            <code className="small">
                              {doctor.licenseNumber}
                            </code>
                          </td>
                          <td>{doctor.yearsOfExperience || 'N/A'} years</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => setSelectedPDF(doctor.credentials)}
                            >
                              <i className="bi bi-file-earmark-pdf me-1"></i>
                              View PDF
                            </button>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                onClick={() => handleApprove(doctor.id)}
                                className="btn btn-outline-success btn-sm"
                                disabled={actionLoading[doctor.id]}
                              >
                                {actionLoading[doctor.id] === 'approving' ? (
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                ) : (
                                  <i className="bi bi-check-circle me-1"></i>
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(doctor.id)}
                                className="btn btn-outline-danger btn-sm"
                                disabled={actionLoading[doctor.id]}
                              >
                                {actionLoading[doctor.id] === 'rejecting' ? (
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                ) : (
                                  <i className="bi bi-x-circle me-1"></i>
                                )}
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalCount}
              pageSize={pagination.pageSize}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, currentPage: page }))
              }
              onPageSizeChange={(size) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: size,
                  currentPage: 1,
                }))
              }
            />
          </>
        )}

        {selectedPDF && (
          <PDFViewer file={selectedPDF} onClose={() => setSelectedPDF(null)} />
        )}

        <ConfirmDialog
          show={showBulkConfirm}
          title={`${
            bulkAction === 'approve' ? 'Approve' : 'Reject'
          } Selected Doctors`}
          message={`Are you sure you want to ${bulkAction} ${selectedDoctors.length} selected doctor(s)?`}
          confirmLabel={bulkAction === 'approve' ? 'Approve All' : 'Reject All'}
          confirmVariant={bulkAction === 'approve' ? 'success' : 'danger'}
          onConfirm={handleBulkAction}
          onCancel={() => setShowBulkConfirm(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
