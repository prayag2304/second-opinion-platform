import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CookieConsent from '../components/Common/CookieConsent';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information you provide directly to us, such as when you create an account, upload medical documents, or contact our support team. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>Personal identification information (name, email address, phone number)</li>
                  <li>Medical information and documents you upload</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Communication preferences and support interactions</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>Provide our medical consultation services</li>
                  <li>Match you with appropriate medical specialists</li>
                  <li>Process payments and manage your account</li>
                  <li>Send you important updates about your consultations</li>
                  <li>Improve our services and develop new features</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>With your explicit consent</li>
                  <li>To medical specialists for consultation purposes</li>
                  <li>To service providers who assist in our operations</li>
                  <li>When required by law or to protect our rights</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>HIPAA compliance for medical information</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Port your data to another service</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Data Retention</h2>
                <p className="text-gray-600 mb-6">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Medical records are retained in accordance with healthcare regulations and our legal requirements.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how our website is used</li>
                  <li>Improve our services and user experience</li>
                  <li>Provide personalized content</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Third-Party Services</h2>
                <p className="text-gray-600 mb-6">
                  We may use third-party services for payment processing, analytics, and other functions. These services have their own privacy policies, and we encourage you to review them.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Children's Privacy</h2>
                <p className="text-gray-600 mb-6">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">10. International Transfers</h2>
                <p className="text-gray-600 mb-6">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Changes to This Policy</h2>
                <p className="text-gray-600 mb-6">
                  We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Contact Us</h2>
                <p className="text-gray-600 mb-6">
                  If you have any questions about this privacy policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <strong>Email:</strong> privacy@secondopinion.com<br />
                    <strong>Phone:</strong> +1 (555) 123-4567<br />
                    <strong>Address:</strong> 123 Medical Center Dr, Suite 100, Healthcare City, HC 12345
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
              Questions About Privacy?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              We're committed to protecting your privacy. Contact us if you have any questions about our privacy practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
                Contact Us
              </Link>
              <Link to="/terms" className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600">
                View Terms of Service
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

export default PrivacyPolicy; 