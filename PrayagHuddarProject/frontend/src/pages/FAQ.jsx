import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CookieConsent from '../components/Common/CookieConsent';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const faqData = [
    {
      category: 'General',
      question: 'What is Second Opinion?',
      answer: 'Second Opinion is a platform that connects patients with verified medical specialists for second opinions. We help you get expert medical advice from qualified doctors through secure online consultations.'
    },
    {
      category: 'General',
      question: 'How does the consultation process work?',
      answer: 'The process is simple: 1) Upload your medical reports and describe your case, 2) Choose a specialist from our network, 3) Make secure payment, 4) Receive detailed medical opinion within 24-48 hours.'
    },
    {
      category: 'General',
      question: 'Are the doctors qualified and verified?',
      answer: 'Yes, all doctors on our platform are verified specialists with proper credentials. We thoroughly vet each doctor to ensure they meet our quality standards and have the necessary qualifications.'
    },
    {
      category: 'Security & Privacy',
      question: 'Is my medical information secure?',
      answer: 'Absolutely. We use bank-level security and are HIPAA compliant. Your medical information is encrypted and protected. We never share your data with third parties without your explicit consent.'
    },
    {
      category: 'Security & Privacy',
      question: 'How do you protect my privacy?',
      answer: 'Your privacy is our top priority. All consultations are confidential, and your personal information is protected with industry-standard encryption. We follow strict privacy protocols.'
    },
    {
      category: 'Consultations',
      question: 'What types of medical opinions do you offer?',
      answer: 'We offer second opinions across various medical specialties including cardiology, oncology, neurology, orthopedics, and more. Our specialists can review your case and provide detailed recommendations.'
    },
    {
      category: 'Consultations',
      question: 'How long does it take to get my opinion?',
      answer: 'Most consultations are completed within 24-48 hours. The exact timeframe depends on the complexity of your case and the specialist\'s availability. You\'ll be notified once your opinion is ready.'
    },
    {
      category: 'Consultations',
      question: 'Can I ask follow-up questions?',
      answer: 'Yes, you can ask follow-up questions through our platform. The specialist will provide comprehensive answers to ensure you have all the information you need about your medical case.'
    },
    {
      category: 'Payment & Billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept secure payments through UPI and other digital payment methods. All transactions are encrypted and secure. Payment is required before the consultation begins.'
    },
    {
      category: 'Payment & Billing',
      question: 'Do you offer refunds?',
      answer: 'We offer a satisfaction guarantee. If you\'re not satisfied with your consultation, you may request a refund within 30 days. Please contact our support team for assistance.'
    },
    {
      category: 'Technical',
      question: 'What file formats can I upload?',
      answer: 'You can upload medical reports in PDF format. We recommend uploading all relevant test results, imaging reports, and medical records to help the specialist provide the most accurate opinion.'
    },
    {
      category: 'Technical',
      question: 'How do I access my consultation results?',
      answer: 'Once your consultation is complete, you\'ll receive a notification. You can then log into your account to view the detailed medical opinion and recommendations from the specialist.'
    }
  ];

  const toggleItem = (key) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about Second Opinion. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {faqData.map((item, index) => {
              const key = `faq-${index}`;
              const isOpen = openItems.has(key);

              return (
                <div key={key} className="mb-4">
                  <button
                    onClick={() => toggleItem(key)}
                    className="w-full text-left p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {item.question}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-2 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn btn-primary">
                Contact Support
              </Link>
              <Link to="/support" className="btn btn-secondary">
                Visit Support Center
              </Link>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Still Have Questions?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 12C7 11.4 7.4 11 8 11H16C16.6 11 17 11.4 17 12C17 12.6 16.6 13 16 13H8C7.4 13 7 12.6 7 12ZM7 16C7 15.4 7.4 15 8 15H16C16.6 15 17 15.4 17 16C17 16.6 16.6 17 16 17H8C7.4 17 7 16.6 7 16Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Support</h3>
                <p className="text-gray-600 mb-4">
                  Get in touch with our support team for personalized assistance.
                </p>
                <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                  Contact Us →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h3>
                <p className="text-gray-600 mb-4">
                  Learn more about our process and how to get started.
                </p>
                <Link to="/how-it-works" className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn More →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 12C7 11.4 7.4 11 8 11H16C16.6 11 17 11.4 17 12C17 12.6 16.6 13 16 13H8C7.4 13 7 12.6 7 12ZM7 16C7 15.4 7.4 15 8 15H16C16.6 15 17 15.4 17 16C17 16.6 16.6 17 16 17H8C7.4 17 7 16.6 7 16Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Started</h3>
                <p className="text-gray-600 mb-4">
                  Ready to get your second opinion? Register now.
                </p>
                <Link to="/register/patient" className="text-primary-600 hover:text-primary-700 font-medium">
                  Register Now →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default FAQ; 