import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DoctorOpinionDashboard from '../../components/Doctor/DoctorOpinionDashboard';

const DoctorDashboard = () => {
  return (
    <DashboardLayout>
      <DoctorOpinionDashboard />
    </DashboardLayout>
  );
};

export default DoctorDashboard;