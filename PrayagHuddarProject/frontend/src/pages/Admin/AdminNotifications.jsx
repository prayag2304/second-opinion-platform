import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import apiClient from '../../services/apiClient';

const AdminNotifications = () => {
  const [loading, setLoading] = useState(false);

  const specialties = [
    'All Doctors',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Oncology',
    'Gastroenterology',
    'Endocrinology'
  ];

  const formik = useFormik({
    initialValues: {
      recipient: 'All Doctors',
      message: ''
    },
    validationSchema: Yup.object({
      recipient: Yup.string().required('Recipient is required'),
      message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await apiClient.post('/admin/notifications', values);
        toast.success('Notification sent successfully');
        resetForm();
      } catch (error) {
        toast.error('Failed to send notification');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <DashboardLayout>
      <div className="admin-notifications">
        <h1>Send Notifications</h1>
        
        <div className="card">
          <h2>Compose Notification</h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="recipient" className="form-label">Recipients</label>
              <select
                id="recipient"
                name="recipient"
                className={`form-control ${formik.touched.recipient && formik.errors.recipient ? 'error' : ''}`}
                value={formik.values.recipient}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="All Patients">All Patients</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              {formik.touched.recipient && formik.errors.recipient && (
                <div className="error-text">{formik.errors.recipient}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                className={`form-control ${formik.touched.message && formik.errors.message ? 'error' : ''}`}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your notification message..."
              />
              {formik.touched.message && formik.errors.message && (
                <div className="error-text">{formik.errors.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formik.isValid || !formik.values.recipient}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminNotifications;