import React, { useState } from 'react';
import { StarIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import SecondOpinionForm from './SecondOpinionForm';
import Button from '../Common/Button';

const DoctorModal = ({ doctor, onClose }) => {
  const [showForm, setShowForm] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-5 h-5 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOutlineIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (showForm) {
    return (
      <SecondOpinionForm
        doctor={doctor}
        onClose={onClose}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Doctor Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            {/* Doctor Avatar */}
            <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            {/* Doctor Basic Info */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
            <p className="text-lg text-primary-600 font-medium mb-4">{doctor.specialty}</p>
            
            {/* Rating */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex space-x-1">
                {renderStars(doctor.rating)}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {doctor.rating} ({doctor.reviews} reviews)
              </span>
            </div>
          </div>
          
          {/* Doctor Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Qualifications
                </h4>
                <p className="text-gray-900">{doctor.qualifications || 'MD, Board Certified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Experience
                </h4>
                <p className="text-gray-900">{doctor.yearsOfExperience || 'N/A'} years</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Consultation Fee
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">${doctor.fee}</span>
                  <span className="text-sm text-gray-500">per consultation</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  License Number
                </h4>
                <p className="text-gray-900 font-mono text-sm">{doctor.licenseNumber || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Bio Section */}
          {doctor.bio && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                About Dr. {doctor.name.split(' ').pop()}
              </h4>
              <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            </div>
          )}
          
          {/* Specialization Highlight */}
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-primary-900 mb-2">Specialization</h4>
            <p className="text-primary-700">
              Expert in {doctor.specialty.toLowerCase()} with extensive experience in diagnosis and treatment.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Available for second opinion consultations
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setShowForm(true)}
              className="px-6"
            >
              Request Second Opinion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorModal;