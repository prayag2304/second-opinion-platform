import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CookieConsent from '../components/Common/CookieConsent';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  BoltIcon,
  LockClosedIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  StarIcon,
  CheckCircleIcon,
  HeartIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const Landing = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    reviews: 0,
    rating: 0
  });

  useEffect(() => {
    // Fetch real stats from backend
    const fetchStats = async () => {
      try {
        const { API_ENDPOINTS } = await import('../config/api');
        const { API_CONFIG } = await import('../config/constants');
        const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.PUBLIC.STATS}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const result = await response.json();
        // Backend returns { success: true, data: { doctors, patients, consultations, satisfaction } }
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set default stats on error
        setStats({ doctors: 50, patients: 1000, consultations: 500, satisfaction: 98 });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
                <HeartIcon className="w-4 h-4 mr-2" />
                Trusted by 1000+ patients worldwide
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Get Second Opinion Platform for Patient Healthcare
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto animate-slide-up leading-relaxed">
                Connect with top doctors and specialists for expert advice on your health concerns.
                Fast, secure, and completely confidential.
              </p>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-3xl mx-auto">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-white">{stats.doctors}+</div>
                  <div className="text-sm opacity-90">Expert Doctors</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-white">{stats.patients}+</div>
                  <div className="text-sm opacity-90">Happy Patients</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-white">{stats.reviews}+</div>
                  <div className="text-sm opacity-90">Reviews</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-center mb-1">
                    <StarIcon className="w-5 h-5 text-yellow-300 fill-current" />
                    <span className="text-3xl font-bold ml-1">{stats.rating}</span>
                  </div>
                  <div className="text-sm opacity-90">Average Rating</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  to="/register/patient"
                  className="group inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <BoltIcon className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Get Started Today
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="group inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Learn How It Works
                </Link>
              </div>

              {/* Doctor Registration Promo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Are you a Doctor?</h3>
                  <p className="text-white/90 mb-4">Join our network of expert specialists and help patients get the care they need.</p>
                  <Link
                    to="/register/doctor"
                    className="group inline-flex items-center px-6 py-3 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <UserGroupIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Register as Doctor
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Registration Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <UserGroupIcon className="w-4 h-4 mr-2" />
                For Healthcare Professionals
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Join Our Network of Expert Doctors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Expand your practice and help patients worldwide get the expert opinions they need.
                Join our platform and start making a difference today.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Practice</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Work from anywhere, anytime. Review cases at your convenience and provide expert opinions
                      without disrupting your existing practice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCardIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Earnings</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Earn competitive rates for your expertise. Set your own fees and get paid promptly
                      for every consultation you complete.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
                    <p className="text-gray-600 leading-relaxed">
                      HIPAA-compliant platform with bank-level security. Your credentials and patient data
                      are protected with the highest standards.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to="/register/doctor"
                    className="group inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <UserGroupIcon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Join as Doctor
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <UserGroupIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Doctors Choose Us</h3>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Simple registration process</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Flexible working hours</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Competitive compensation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Secure patient data</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Professional support team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Why Choose Our Platform?
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Health, Our Priority
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get expert opinions from verified specialists with complete privacy and security.
                We're here to make healthcare accessible and trustworthy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Expert Doctors</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Consult with experienced and verified professionals across various specialties.
                  All doctors are carefully vetted for expertise and credentials.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <LockClosedIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Secure & Confidential</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Your health information is protected with bank-level encryption and consultations
                  are completely confidential. HIPAA compliant for your peace of mind.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-200">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ClockIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Quick Turnaround</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Receive expert opinions and recommendations within 24-48 hours.
                  Premium plans offer even faster response times for urgent cases.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <DocumentCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Easy Upload</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Simply upload your medical reports and get expert analysis from specialists.
                  Support for PDF, JPG, and PNG files up to 10MB each.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CreditCardIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Secure Payments</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Pay securely through UPI with transparent pricing set by doctors.
                  No hidden fees, clear pricing before you proceed.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-200">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Verified Specialists</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  All doctors are verified professionals with proven expertise in their fields.
                  Regular credential verification ensures quality care.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Your Expert Opinion?
            </h2>
            <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of patients who trust Second Opinion for their medical consultations.
              Get started today and experience the difference expert care can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/register/patient"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <BoltIcon className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Get Started Today
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Contact Support
              </Link>
            </div>

            {/* Doctor CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Are you a Healthcare Professional?</h3>
              <p className="text-white/90 mb-6">
                Join our network of expert doctors and help patients worldwide get the care they need.
                Start earning while making a difference.
              </p>
              <Link
                to="/register/doctor"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <UserGroupIcon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Join as Doctor
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Landing;