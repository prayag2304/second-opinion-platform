import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { doctorRegistrationSchema } from '../utils/validation';
import authService from '../services/authService';
import Header from '../components/Layout/Header';
import FileUploadWithProgress from '../components/Common/FileUploadWithProgress';
import { SPECIALTIES } from '../config/constants';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ClipLoader } from 'react-spinners';

const DoctorRegister = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      specialty: '',
      licenseNumber: '',
      yearsOfExperience: '',
      qualifications: '',
      fee: 50,
      termsAccepted: false,
    },
    validationSchema: doctorRegistrationSchema,
    onSubmit: async (values) => {
      if (credentials.length === 0) {
        toast.error('Please upload your medical credentials');
        return;
      }

      setLoading(true);
      try {
        await authService.registerDoctor({
          ...values,
          credentials: credentials[0].name,
        });

        setSuccess(true);
        toast.success('Registration submitted for approval!');
      } catch (error) {
        toast.error(error.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-16 px-4">
          <div className="max-w-md w-full">
            <div className="card text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Registration Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your doctor registration has been submitted for approval.
                  You'll be notified once your credentials are verified.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary w-full"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="max-w-2xl w-full">
          <div className="card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Doctor Registration
              </h2>
              <p className="text-gray-600 mt-2">
                Join our network of medical professionals
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-input ${
                      formik.touched.name && formik.errors.name ? 'error' : ''
                    }`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your full name"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="form-error">{formik.errors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${
                      formik.touched.email && formik.errors.email ? 'error' : ''
                    }`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email address"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="form-error">{formik.errors.email}</div>
                  )}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`form-input pr-10 ${
                        formik.touched.password && formik.errors.password
                          ? 'error'
                          : ''
                      }`}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="form-error">{formik.errors.password}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? 'error'
                        : ''
                    }`}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm your password"
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="form-error">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="specialty" className="form-label">
                    Medical Specialty
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    className={`form-input ${
                      formik.touched.specialty && formik.errors.specialty
                        ? 'error'
                        : ''
                    }`}
                    value={formik.values.specialty}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select Specialty</option>
                    {SPECIALTIES.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {formik.touched.specialty && formik.errors.specialty && (
                    <div className="form-error">{formik.errors.specialty}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="licenseNumber" className="form-label">
                    Medical License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    className={`form-input ${
                      formik.touched.licenseNumber &&
                      formik.errors.licenseNumber
                        ? 'error'
                        : ''
                    }`}
                    value={formik.values.licenseNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your medical license number"
                  />
                  {formik.touched.licenseNumber &&
                    formik.errors.licenseNumber && (
                      <div className="form-error">
                        {formik.errors.licenseNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="yearsOfExperience" className="form-label">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    min="0"
                    max="50"
                    className={`form-input ${
                      formik.touched.yearsOfExperience &&
                      formik.errors.yearsOfExperience
                        ? 'error'
                        : ''
                    }`}
                    value={formik.values.yearsOfExperience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Years of medical experience"
                  />
                  {formik.touched.yearsOfExperience &&
                    formik.errors.yearsOfExperience && (
                      <div className="form-error">
                        {formik.errors.yearsOfExperience}
                      </div>
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
                    className={`form-input ${
                      formik.touched.fee && formik.errors.fee ? 'error' : ''
                    }`}
                    value={formik.values.fee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Your consultation fee"
                  />
                  {formik.touched.fee && formik.errors.fee && (
                    <div className="form-error">{formik.errors.fee}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="qualifications" className="form-label">
                  Qualifications & Certifications
                </label>
                <input
                  type="text"
                  id="qualifications"
                  name="qualifications"
                  className={`form-input ${
                    formik.touched.qualifications &&
                    formik.errors.qualifications
                      ? 'error'
                      : ''
                  }`}
                  value={formik.values.qualifications}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., MD, FACC, Board Certified in Cardiology"
                />
                {formik.touched.qualifications &&
                  formik.errors.qualifications && (
                    <div className="form-error">
                      {formik.errors.qualifications}
                    </div>
                  )}
              </div>

              <div className="form-group">
                <label className="form-label">Upload Credentials (PDF)</label>
                <FileUploadWithProgress
                  onFilesChange={setCredentials}
                  acceptedFiles={credentials}
                  multiple={false}
                />
              </div>

              <div className="form-group">
                <div className="flex items-start">
                  <input
                    className="mt-1 mr-2"
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                  />
                  <label
                    className="text-sm text-gray-600"
                    htmlFor="termsAccepted"
                  >
                    I accept the{' '}
                    <a
                      href="#terms"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#privacy"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {formik.touched.termsAccepted &&
                  formik.errors.termsAccepted && (
                    <div className="form-error">
                      {formik.errors.termsAccepted}
                    </div>
                  )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-3 text-base font-semibold"
                disabled={
                  loading ||
                  !formik.isValid ||
                  credentials.length === 0 ||
                  !formik.values.termsAccepted
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={20} color="white" className="mr-2" />
                    Submitting for Review...
                  </div>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
