import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../config/api';

const DoctorsList = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await apiClient.get('/doctors');
                setDoctors(response.data);
            } catch (err) {
                setError('Failed to load doctors');
                console.error('Error fetching doctors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading doctors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Our Doctors</h1>
                    <p className="mt-2 text-gray-600">Meet our qualified medical professionals</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.userId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-blue-600 font-bold">
                                        {doctor.fullName?.charAt(0) || 'D'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {doctor.fullName || 'Doctor'}
                                </h3>
                                <p className="text-blue-600 font-medium mb-2">
                                    {doctor.specialty || 'General Medicine'}
                                </p>
                                <p className="text-gray-600 text-sm mb-4">
                                    License: {doctor.licenseNumber || 'N/A'}
                                </p>
                                {doctor.bio && (
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {doctor.bio}
                                    </p>
                                )}
                                <div className="mt-4 text-sm text-gray-500">
                                    <p>{doctor.phone || 'Phone not available'}</p>
                                    <p className="truncate">{doctor.address || 'Address not available'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {doctors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No doctors available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;