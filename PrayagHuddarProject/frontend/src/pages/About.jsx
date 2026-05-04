import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CookieConsent from '../components/Common/CookieConsent';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-20 lg:py-32">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-primary-800 opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                About Second Opinion
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed animate-slide-up">
                Revolutionizing healthcare access through expert medical opinions,
                making quality healthcare advice accessible to everyone, everywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
                <Link
                  to="/register/patient"
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started Today
                </Link>
                <Link
                  to="/how-it-works"
                  className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-300"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in">
                <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Empowering Patients with Expert Medical Opinions
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  At Second Opinion, we believe that every patient deserves access to expert medical advice,
                  regardless of their location or circumstances. Our platform bridges the gap between patients
                  and verified medical specialists, providing second opinions that can make life-changing
                  differences in healthcare decisions.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We're committed to making quality medical consultations accessible, affordable, and
                  convenient for patients worldwide, ensuring that expert healthcare advice is just a
                  click away.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register/patient"
                    className="btn btn-primary btn-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    to="/contact"
                    className="btn btn-outline-primary btn-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Contact Our Team
                  </Link>
                </div>
              </div>
              <div className="relative animate-slide-up">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 lg:p-12 shadow-beautiful">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient-Centric Care</h3>
                      <p className="text-gray-600 text-sm">Putting patients first with compassionate, personalized care</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Opinions</h3>
                      <p className="text-gray-600 text-sm">Verified specialists providing evidence-based advice</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                      <p className="text-gray-600 text-sm">Your health information is protected with highest security</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Efficient</h3>
                      <p className="text-gray-600 text-sm">Quick turnaround times for expert medical opinions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Our Core Values
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Drives Us Forward
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our values guide every decision we make and every interaction we have with our patients and partners.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card hover-lift group animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Quality Excellence</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  We maintain the highest standards of medical expertise and professional conduct,
                  ensuring every opinion meets rigorous quality benchmarks.
                </p>
              </div>
              <div className="card hover-lift group animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Privacy & Security</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Your health information is protected with the highest security standards and
                  strict privacy protocols that exceed industry requirements.
                </p>
              </div>
              <div className="card hover-lift group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Compassionate Care</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  We approach every case with empathy and understanding, recognizing that
                  behind every medical question is a person seeking answers and peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                Meet Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Minds Behind Second Opinion
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our dedicated team is committed to revolutionizing healthcare access and making expert medical opinions available to everyone.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                  RG
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rohit Gaikwad</h3>
                <p className="text-primary-600 mb-3 font-medium">Team Member</p>
                <p className="text-gray-600 leading-relaxed">
                  Contributing to the development and success of Second Opinion platform with innovative solutions.
                </p>
              </div>
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                  PH
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Prayag Huddar</h3>
                <p className="text-primary-600 mb-3 font-medium">Team Member</p>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated to creating seamless user experiences and robust healthcare technology solutions.
                </p>
              </div>
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                  PM
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Paras Mahajan</h3>
                <p className="text-primary-600 mb-3 font-medium">Team Member</p>
                <p className="text-gray-600 leading-relaxed">
                  Focused on building robust and scalable healthcare technology solutions for better patient care.
                </p>
              </div>
              <div className="text-center group animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-beautiful">
                  TM
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Member</h3>
                <p className="text-primary-600 mb-3 font-medium">Team Member</p>
                <p className="text-gray-600 leading-relaxed">
                  Committed to delivering quality healthcare solutions and ensuring exceptional user satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Making a Difference
              </h2>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Our platform has already helped thousands of patients access expert medical opinions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
                <div className="text-primary-100">Patients Helped</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">250+</div>
                <div className="text-primary-100">Expert Doctors</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-primary-100">Medical Specialties</div>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-primary-100">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Get Your Expert Medical Opinion?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of patients who trust Second Opinion for their medical consultations.
                Get started today and take the first step towards better healthcare decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register/patient"
                  className="btn btn-primary btn-lg transform hover:scale-105 transition-all duration-300 shadow-beautiful"
                >
                  Get Started Today
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-outline-primary btn-lg transform hover:scale-105 transition-all duration-300"
                >
                  Learn More
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

export default About;
