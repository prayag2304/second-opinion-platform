import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { patientRegistrationSchema } from '../utils/validation';
import authService from '../services/authService';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FormField from '../components/Common/FormField';
import Button from '../components/Common/Button';
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline';

const PatientRegister = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      termsAccepted: false,
    },
    validationSchema: patientRegistrationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await authService.registerPatient(values);

        setSuccess(true);
        toast.success('Registration successful!');
      } catch (error) {
        toast.error(error.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen pt-16 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h3>
              <p className="text-gray-600 mb-8">
                Your patient account has been created successfully. Please log
                in to continue.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Registration</h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FormField
                label="Full Name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.name}
                touched={formik.touched.name}
                required
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.email}
                touched={formik.touched.email}
                required
              />

              <div>
                <FormField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  required
                  children={
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                          sm:text-sm transition-colors duration-200 pr-10
                          ${formik.touched.password && formik.errors.password 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300'
                          }`}
                        placeholder="Create a strong password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                  }
                />
              </div>

              <FormField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
                required
              />

              <FormField
                label="Phone Number (Optional)"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.phoneNumber}
                touched={formik.touched.phoneNumber}
              />

              <div>
                <div className="flex items-start">
                  <input
                    className="mt-1 mr-3"
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                  />
                  <label className="text-sm text-gray-600" htmlFor="termsAccepted">
                    I accept the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500 transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.termsAccepted}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={!formik.isValid}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientRegister;
