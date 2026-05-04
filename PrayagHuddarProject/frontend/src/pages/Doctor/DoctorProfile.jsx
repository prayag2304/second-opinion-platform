import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import doctorService from '../../services/doctorService';

const DoctorProfile = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const specialties = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Oncology',
    'Gastroenterology',
    'Endocrinology',
  ];

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      specialty: user?.specialty || '',
      qualifications: '',
      experience: '',
      fee: 50,
      bio: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      specialty: Yup.string().required('Specialty is required'),
      qualifications: Yup.string().required('Qualifications are required'),
      experience: Yup.string(),
      fee: Yup.number()
        .min(25, 'Minimum fee is $25')
        .max(500, 'Maximum fee is $500')
        .required('Fee is required'),
      bio: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await doctorService.updateProfile(values);
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
      <div className="doctor-profile">
        <h1>My Profile</h1>

        <div className="card">
          <h2>Professional Information</h2>

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
                  disabled
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error-text">{formik.errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="specialty" className="form-label">
                  Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  className={`form-control ${
                    formik.touched.specialty && formik.errors.specialty
                      ? 'error'
                      : ''
                  }`}
                  value={formik.values.specialty}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                {formik.touched.specialty && formik.errors.specialty && (
                  <div className="error-text">{formik.errors.specialty}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fee" className="form-label">
                  Consultation Fee ($)
                </label>
                <input
                  type="number"
                  id="fee"
                  name="fee"
                  min="25"
                  max="500"
                  className={`form-control ${
                    formik.touched.fee && formik.errors.fee ? 'error' : ''
                  }`}
                  value={formik.values.fee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fee && formik.errors.fee && (
                  <div className="error-text">{formik.errors.fee}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="qualifications" className="form-label">
                Qualifications
              </label>
              <input
                type="text"
                id="qualifications"
                name="qualifications"
                className={`form-control ${
                  formik.touched.qualifications && formik.errors.qualifications
                    ? 'error'
                    : ''
                }`}
                value={formik.values.qualifications}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., MD, FACC, Board Certified"
              />
              {formik.touched.qualifications &&
                formik.errors.qualifications && (
                  <div className="error-text">
                    {formik.errors.qualifications}
                  </div>
                )}
            </div>

            <div className="form-group">
              <label htmlFor="experience" className="form-label">
                Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                className="form-control"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., 15 years of experience in cardiovascular medicine"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                className="form-control"
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Brief description of your expertise and approach to patient care..."
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

export default DoctorProfile;
