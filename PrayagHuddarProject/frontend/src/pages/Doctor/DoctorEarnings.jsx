import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../services/apiClient';
import './DoctorEarnings.css';

const DoctorEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await apiClient.get('/doctor/earnings');
      setEarnings(response.data);
    } catch (error) {
      toast.error('Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
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
      <div className="doctor-earnings">
        <h1>Earnings</h1>

        <div className="earnings-summary">
          <div className="earnings-card card">
            <h3>Total Earnings</h3>
            <div className="earnings-amount">${earnings?.total || 0}</div>
          </div>

          <div className="earnings-card card">
            <h3>This Month</h3>
            <div className="earnings-amount">${earnings?.thisMonth || 0}</div>
          </div>
        </div>

        {earnings?.transactions && earnings.transactions.length > 0 && (
          <div className="card">
            <h2>Recent Transactions</h2>
            <div className="table-responsive">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.patient}</td>
                      <td className="amount">${transaction.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorEarnings;
