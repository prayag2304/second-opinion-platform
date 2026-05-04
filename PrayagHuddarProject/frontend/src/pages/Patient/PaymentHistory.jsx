import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import StatusBadge from '../../components/Common/StatusBadge';
import Pagination from '../../components/Common/Pagination';
import EmptyState from '../../components/Common/EmptyState';
import apiClient from '../../services/apiClient';
import { PAYMENT_STATUS } from '../../config/constants';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  useEffect(() => {
    fetchPayments();
  }, [pagination.currentPage, pagination.pageSize]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/patient/payments', {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize
        }
      });

      setPayments(response.data.payments);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      }));
    } catch (error) {
      toast.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case PAYMENT_STATUS.SUCCESS:
        return 'success';
      case PAYMENT_STATUS.FAILED:
        return 'danger';
      case PAYMENT_STATUS.REFUNDED:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading payment history..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="payment-history">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <i className="bi bi-credit-card me-2"></i>
            Payment History
          </h1>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon="bi-credit-card-2-front"
            title="No payments found"
            description="You haven't made any payments yet. Start by requesting a second opinion from a doctor."
          />
        ) : (
          <>
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Doctor</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td>
                            <div>
                              <div className="fw-medium">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </div>
                              <small className="text-muted">
                                {new Date(payment.createdAt).toLocaleTimeString()}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                {payment.doctorName?.charAt(0) || 'D'}
                              </div>
                              <div>
                                <div className="fw-medium">{payment.doctorName || 'Unknown Doctor'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <code className="small">{payment.transactionId}</code>
                          </td>
                          <td>
                            <span className="fw-bold text-success">
                              {formatAmount(payment.amount)}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusVariant(payment.status)}`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  // In a real app, this would download a receipt
                                  toast.info('Receipt download feature coming soon');
                                }}
                              >
                                <i className="bi bi-download me-1"></i>
                                Receipt
                              </button>
                              {payment.status === PAYMENT_STATUS.SUCCESS && (
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => {
                                    // In a real app, this would show refund options
                                    toast.info('Refund requests can be made by contacting support');
                                  }}
                                >
                                  <i className="bi bi-arrow-return-left me-1"></i>
                                  Refund
                                </button>
                              )}
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
              onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
              onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }))}
            />
          </>
        )}

        {/* Payment Summary Card */}
        {payments.length > 0 && (
          <div className="row mt-4">
            <div className="col-md-6 col-lg-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Total Spent</h6>
                  <h3 className="text-primary mb-0">
                    {formatAmount(
                      payments
                        .filter(p => p.status === PAYMENT_STATUS.SUCCESS)
                        .reduce((sum, p) => sum + p.amount, 0)
                    )}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Successful Payments</h6>
                  <h3 className="text-success mb-0">
                    {payments.filter(p => p.status === PAYMENT_STATUS.SUCCESS).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistory;