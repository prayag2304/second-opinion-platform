import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { loginSchema } from '../utils/validation';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CookieConsent from '../components/Common/CookieConsent';
import FormField from '../components/Common/FormField';
import Button from '../components/Common/Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { USER_ROLES } from '../config/constants';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authService.login(values.email, values.password);

        // Backend returns: { success: true, data: { token, user, expiresIn } }
        // Axios wraps it: response.data = { success: true, data: {...} }
        // So we need: response.data.data to get the actual login data
        const responseData = response.data || response;
        const loginData = responseData?.data || responseData;

        if (!loginData) {
          console.error('Login response structure:', response);
          throw new Error('Invalid login response: no data received');
        }

        if (!loginData.user) {
          console.error('Login response missing user:', loginData);
          throw new Error('Invalid login response: user data missing');
        }

        if (!loginData.token) {
          console.error('Login response missing token:', loginData);
          throw new Error('Invalid login response: token missing');
        }

        // Convert role from backend format (PATIENT) to frontend format (patient)
        const userData = {
          ...loginData.user,
          role: loginData.user.role?.toLowerCase() || loginData.user.role
        };

        // Store token and user data
        login(userData, loginData.token);

        // Navigate based on role
        const role = userData.role?.toLowerCase();
        if (role === USER_ROLES.ADMIN || role === 'admin') {
          navigate('/admin');
        } else if (role === USER_ROLES.DOCTOR || role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/patient');
        }
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.email}
                touched={formik.touched.email}
                required
                autoComplete="username"
              />

              <div>
                <FormField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  required
                  autoComplete="current-password"
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
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="current-password"
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
                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={!formik.isValid}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register/patient" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                  Register as Patient
                </Link>
                {' '}or{' '}
                <Link to="/register/doctor" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
                  Register as Doctor
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Login;