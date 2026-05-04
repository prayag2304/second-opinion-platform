import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CookieConsent from '../Common/CookieConsent';

const DashboardLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-gray-50 animate-fade-in">
      <h1 className="sr-only">Dashboard</h1>
      <Header />
      <div className="flex pt-16">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="main-content flex-1">{children}</div>
      </div>
      <CookieConsent />
    </main>
  );
};

export default DashboardLayout;
