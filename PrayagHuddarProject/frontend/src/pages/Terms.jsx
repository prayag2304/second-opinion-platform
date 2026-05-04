import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CookieConsent from '../components/Common/CookieConsent';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms of service carefully before using Second Opinion. By accessing or using our platform, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-4">
                  By using Second Opinion, you agree to comply with and be legally bound by these terms. If you do not agree to these terms, please do not use our services.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Services Provided</h2>
                <p className="text-gray-600 mb-4">
                  Second Opinion provides online medical consultation services, including second opinions from board-certified specialists. Our services are for informational purposes only and do not replace in-person medical care.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>You must provide accurate and complete information when registering and using our services.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>You agree not to use our services for any unlawful or prohibited purpose.</li>
                  <li>You must be at least 18 years old to use our services.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Medical Disclaimer</h2>
                <p className="text-gray-600 mb-4">
                  The information provided by Second Opinion is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Payment Terms</h2>
                <p className="text-gray-600 mb-4">
                  Payment is required for consultations. We offer a 100% satisfaction guarantee. If you are not satisfied with your consultation, you may request a refund within 30 days.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Privacy</h2>
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Please review our <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link> to understand how we collect, use, and protect your information.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Intellectual Property</h2>
                <p className="text-gray-600 mb-4">
                  All content on Second Opinion, including text, graphics, logos, and software, is the property of Second Opinion or its licensors and is protected by copyright and other intellectual property laws.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
                <p className="text-gray-600 mb-4">
                  To the fullest extent permitted by law, Second Opinion and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Changes to Terms</h2>
                <p className="text-gray-600 mb-4">
                  We may update these terms from time to time. We will notify you of any material changes by posting the new terms on our website and updating the "Last updated" date.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Contact Us</h2>
                <p className="text-gray-600 mb-6">
                  If you have any questions about these terms, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <strong>Email:</strong> legal@secondopinion.com<br />
                    <strong>Phone:</strong> +91 9561146009<br />
                    <strong>Address:</strong> 123 Medical Center Healthcare City, 425201
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Questions About Our Terms?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Please contact us if you have any questions about our terms of service or your rights as a user.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                Contact Us
              </Link>
              <Link to="/privacy" className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600">
                View Privacy Policy
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

export default Terms; 