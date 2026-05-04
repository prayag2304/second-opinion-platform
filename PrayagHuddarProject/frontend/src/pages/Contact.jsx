import React, { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { contactSchema } from '../utils/validation';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import FormField from '../components/Common/FormField';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BoltIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    validationSchema: contactSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch('/api/public/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        formik.resetForm();
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });



  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      contact: 'Available 24/7',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      availability: 'Instant',
      badge: 'Recommended'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      contact: 'support@secondopinion.com',
      icon: EnvelopeIcon,
      color: 'blue',
      availability: '24 hours',
      badge: null
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      contact: '+1 (555) 123-4567',
      icon: PhoneIcon,
      color: 'purple',
      availability: '9 AM - 6 PM EST',
      badge: 'Business Hours'
    }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/secondopinion',
      icon: '🐦',
      color: 'blue'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/secondopinion',
      icon: '💼',
      color: 'indigo'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/secondopinion',
      icon: '📘',
      color: 'blue'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/secondopinion',
      icon: '📷',
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600'
    };
    return colors[color] || colors.blue;
  };

  const getBgColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200',
      purple: 'bg-purple-50 border-purple-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      pink: 'bg-pink-50 border-pink-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8 animate-fade-in border border-white/30">
                <SparklesIcon className="w-5 h-5 mr-2" />
                We're here to help you succeed
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto animate-slide-up leading-relaxed">
                Have questions? Need support? We're here to help you get the most out of Second Opinion.
                Our dedicated team is ready to assist you 24/7.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">Support Available</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">&lt; 2hr</div>
                  <div className="text-sm opacity-90">Average Response</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">99%</div>
                  <div className="text-sm opacity-90">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <RocketLaunchIcon className="w-4 h-4 mr-2" />
                Multiple Ways to Reach Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Choose Your Preferred Method
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We offer multiple channels to ensure you get the help you need, when you need it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  {method.badge && (
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-4">
                      {method.badge}
                    </div>
                  )}
                  <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(method.color)} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{method.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                  <p className="text-primary-600 font-semibold mb-2">{method.contact}</p>
                  <p className="text-sm text-gray-500">Response: {method.availability}</p>
                </div>
              ))}
            </div>

            <div className="container mx-auto px-4 mt-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information Column */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
                        <EnvelopeIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-3 group">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email</h4>
                          <p className="text-gray-600">support@secondopinion.com</p>
                          <p className="text-gray-600">info@secondopinion.com</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 group">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <PhoneIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Phone</h4>
                          <p className="text-gray-600">+1 (555) 123-4567</p>
                          <p className="text-gray-600">+1 (555) 987-6543</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 group">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <MapPinIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Address</h4>
                          <p className="text-gray-600">
                            123 Medical Center Drive<br />
                            Healthcare City, HC 12345<br />
                            United States
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 group">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <ClockIcon className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Business Hours</h4>
                          <p className="text-gray-600">
                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                            Saturday: 10:00 AM - 4:00 PM<br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                        <GlobeAltIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="text-lg mr-2">{social.icon}</span>
                          <span className="font-medium text-gray-700">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* FAQ Link */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
                        <StarIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Quick Answers</h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Check out our frequently asked questions for immediate answers to common queries.
                    </p>
                    <a
                      href="/faq"
                      className="w-full bg-white text-yellow-600 border border-yellow-300 rounded-xl px-6 py-3 font-semibold hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                    >
                      <StarIcon className="w-5 h-5 mr-2" />
                      View FAQ
                    </a>
                  </div>
                </div>

                {/* Contact Form Column */}
                <div className="lg:col-span-2">
                  <form onSubmit={formik.handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Full Name"
                        name="name"
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
                    </div>

                    <FormField
                      label="Subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors.subject}
                      touched={formik.touched.subject}
                      required
                    />

                    <FormField
                      label="Message"
                      name="message"
                      type="textarea"
                      rows={6}
                      placeholder="Please describe your question or concern in detail..."
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.errors.message}
                      touched={formik.touched.message}
                      required
                    />

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <InformationCircleIcon className="w-4 h-4 mr-2" />
                        We typically respond within 24 hours
                      </div>
                      <button
                        type="submit"
                        disabled={!formik.isValid || loading}
                        className="group bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl px-8 py-4 font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <EnvelopeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        {loading ? 'Sending...' : 'Send Message'}
                        <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
                <StarIcon className="w-4 h-4 mr-2" />
                Common Questions
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Quick answers to the most common questions about our platform and services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I upload my medical documents?</h3>
                <p className="text-gray-600 leading-relaxed">
                  You can upload your medical documents securely through your dashboard. We accept PDF, JPG, and PNG files up to 10MB each.
                </p>
              </div>
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does a consultation take?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Most consultations are completed within 24-48 hours. Premium plans offer faster turnaround times of 12-24 hours.
                </p>
              </div>
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my medical information secure?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, we use bank-level encryption and are fully HIPAA compliant to protect your medical information.
                </p>
              </div>
              <div className="text-center mt-8">
                <a href="/faq" className="group inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <StarIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  View All FAQs
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;