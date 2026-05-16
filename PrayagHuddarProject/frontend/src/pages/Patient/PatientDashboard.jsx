import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DoctorCard from '../../components/Patient/DoctorCard';
import DoctorModal from '../../components/Patient/DoctorModal';
import apiClient from '../../services/apiClient';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filters, setFilters] = useState({
    specialty: '',
    rating: '',
    maxFee: 1000,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, filters]);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/api/doctors');
      // Handle ApiResponse wrapper
      const doctors = response.data?.data || response.data || [];
      // Transform backend data to match frontend expectations
      const transformedDoctors = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.profile?.fullName || doctor.email,
        email: doctor.email,
        specialty: doctor.profile?.specialty || 'General',
        rating: 4.5, // Default rating (not in backend)
        reviews: 0, // Default reviews (not in backend)
        fee: 499, // Default fee (not in backend)
        bio: doctor.profile?.bio || '',
        phone: doctor.profile?.phone || '',
        ...doctor // Include all other fields
      }));
      setDoctors(transformedDoctors);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    if (filters.specialty) {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === filters.specialty
      );
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((doctor) => doctor.rating >= minRating);
    }

    filtered = filtered.filter((doctor) => doctor.fee <= filters.maxFee);

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDoctorSelect = async (doctorId) => {
    try {
      const response = await apiClient.get(`/api/doctors/${doctorId}`);
      // Handle ApiResponse wrapper
      const doctor = response.data?.data || response.data;
      // Transform backend data to match frontend expectations
      const transformedDoctor = {
        id: doctor.id,
        name: doctor.profile?.fullName || doctor.email,
        email: doctor.email,
        specialty: doctor.profile?.specialty || 'General',
        rating: 4.5, // Default rating (not in backend)
        reviews: 0, // Default reviews (not in backend)
        fee: 499, // Default fee (not in backend)
        bio: doctor.profile?.bio || '',
        phone: doctor.profile?.phone || '',
        licenseNumber: doctor.profile?.licenseNumber || '',
        ...doctor // Include all other fields
      };
      setSelectedDoctor(transformedDoctor);
    } catch (error) {
      toast.error('Failed to fetch doctor details');
    }
  };

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner loading={true} message="Loading doctors..." />
      </DashboardLayout>
    );
  }

  if (doctors.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState title="No doctors found" description="No doctors match your filters or are available at this time." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="patient-dashboard">
        <h1>Browse Doctors</h1>

        <div className="filters-section card">
          <h3>Filters</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Specialty</label>
              <select
                className="form-control"
                value={filters.specialty}
                onChange={(e) =>
                  handleFilterChange('specialty', e.target.value)
                }
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Rating</label>
              <select
                className="form-control"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Fee: ₹{filters.maxFee}</label>
              <input
                type="range"
                min="25"
                max="1000"
                value={filters.maxFee}
                onChange={(e) =>
                  handleFilterChange('maxFee', parseInt(e.target.value))
                }
                className="fee-slider"
              />
            </div>
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.length === 0 ? (
            <div className="card text-center">
              <p>No doctors found matching your criteria</p>
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelect={() => handleDoctorSelect(doctor.id)}
              />
            ))
          )}
        </div>

        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
