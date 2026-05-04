import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import patientService from '../../services/patientService';

const PatientProfile = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      medicalHistory: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string(),
      address: Yup.string(),
      medicalHistory: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await patientService.updateProfile(values);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <DashboardLayout>
      <div className="patient-profile">
        <h1>My Profile</h1>

        <div className="card">
          <h2>Personal Information</h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${
                    formik.touched.name && formik.errors.name ? 'error' : ''
                  }`}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error-text">{formik.errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email ? 'error' : ''
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-text">{formik.errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="medicalHistory" className="form-label">
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows="6"
                className="form-control"
                value={formik.values.medicalHistory}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Please provide any relevant medical history, allergies, current medications, etc."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formik.isValid}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
