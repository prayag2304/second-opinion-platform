import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../config/constants';
import { navigateWithScrollToTop } from '../../utils/helpers';
import {
  HeartIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Reusable footer section component
const FooterSection = ({ title, links, onLinkClick, icon: Icon }) => (
  <div className="group">
    <div className="flex items-center mb-4">
      {Icon && <Icon className="w-5 h-5 text-primary-400 mr-2 group-hover:scale-110 transition-transform duration-300" />}
      <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors duration-300">{title}</h3>
    </div>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <button
            onClick={() => onLinkClick(link.to)}
            className="text-gray-400 hover:text-primary-400 transition-all duration-300 text-left w-full flex items-center group/link"
          >
            <span className="group-hover/link:translate-x-1 transition-transform duration-300">{link.label}</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

// Social media links component
const SocialLinks = ({ links }) => (
  <div className="flex space-x-4">
    {links.map((social) => (
      <a
        key={social.name}
        href={social.href}
        className="w-10 h-10 bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
        aria-label={social.name}
      >
        {social.icon}
      </a>
    ))}
  </div>
);

// Newsletter signup component
const NewsletterSignup = () => (
  <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
    </div>

    <div className="relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="mb-6 lg:mb-0 lg:mr-8">
          <div className="flex items-center mb-2">
            <EnvelopeIcon className="w-6 h-6 text-white mr-2" />
            <h3 className="text-xl font-semibold text-white">Stay Updated</h3>
          </div>
          <p className="text-primary-100 max-w-md">
            Get the latest health tips, platform updates, and expert medical insights delivered to your inbox.
          </p>
        </div>
        <div className="flex w-full lg:w-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-primary-200"
          />
          <button className="px-6 py-3 bg-white text-primary-600 rounded-r-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Security badges component
const SecurityBadges = () => (
  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
    <div className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-300">
      <ShieldCheckIcon className="w-4 h-4" />
      <span className="text-sm font-medium">HIPAA Compliant</span>
    </div>
    <div className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-300">
      <LockClosedIcon className="w-4 h-4" />
      <span className="text-sm font-medium">SSL Secured</span>
    </div>
    <div className="flex items-center space-x-2 text-gray-400">
      <HeartIcon className="w-4 h-4 text-red-400" />
      <span className="text-sm font-medium">Made with ❤️ for better healthcare</span>
    </div>
  </div>
);

// Contact info component
const ContactInfo = () => (
  <div className="space-y-3">
    <div className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors duration-300">
      <EnvelopeIcon className="w-4 h-4" />
      <span className="text-sm">support@secondopinion.com</span>
    </div>
    <div className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors duration-300">
      <PhoneIcon className="w-4 h-4" />
      <span className="text-sm">+1 (555) 123-4567</span>
    </div>
    <div className="flex items-center space-x-3 text-gray-400 hover:text-primary-400 transition-colors duration-300">
      <MapPinIcon className="w-4 h-4" />
      <span className="text-sm">Healthcare City, HC 12345</span>
    </div>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (path) => {
    // If we're already on the target page, just scroll to top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to the page and scroll to top
      navigateWithScrollToTop(navigate, path);
    }
  };

  const footerSections = [
    {
      title: 'Company',
      icon: HeartIcon,
      links: [
        { label: 'About Us', to: '/about' },
      ]
    },
    {
      title: 'Support',
      icon: ChatBubbleLeftRightIcon,
      links: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQ', to: '/faq' },
      ]
    },
    {
      title: 'Legal',
      icon: ShieldCheckIcon,
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Cookie Policy', to: '/privacy#cookies' },
        { label: 'Disclaimer', to: '/terms#disclaimer' },
      ]
    },
    {
      title: 'Get Started',
      icon: HeartIcon,
      links: [
        { label: 'Patient Registration', to: '/register/patient' },
        { label: 'Doctor Registration', to: '/register/doctor' },
        { label: 'Login', to: '/login' },
        { label: 'Forgot Password', to: '/forgot-password' },
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.864 3.708 13.713 3.708 12.416s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.275c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.608c-.49 0-.928-.438-.928-.928 0-.49.438-.928.928-.928.49 0 .928.438.928.928 0 .49-.438.928-.928.928zm-4.262 9.608c-2.448 0-4.426-1.978-4.426-4.426s1.978-4.426 4.426-4.426 4.426 1.978 4.426 4.426-1.978 4.426-4.426 4.426z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center space-x-3 mb-6 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">{APP_NAME}</span>
            </button>
            <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
              Get expert medical opinions from verified specialists. Fast, secure, and confidential consultations for better healthcare decisions.
            </p>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Contact Information</h4>
              <ContactInfo />
            </div>
            <SocialLinks links={socialLinks} />
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <FooterSection
              key={section.title}
              {...section}
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
          </div>
          <SecurityBadges />
        </div>
      </div>
    </footer>
  );
};

export default Footer;