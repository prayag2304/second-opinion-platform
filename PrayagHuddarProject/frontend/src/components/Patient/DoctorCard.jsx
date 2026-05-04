import React from 'react';

const DoctorCard = ({ doctor, onSelect }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="doctor-card card" onClick={onSelect}>
      <div className="doctor-avatar">
        <div className="avatar-placeholder">
          {doctor.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
      </div>

      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>

        <div className="doctor-rating">
          <div className="stars">{renderStars(doctor.rating)}</div>
          <span className="rating-text">
            {doctor.rating} ({doctor.reviews} reviews)
          </span>
        </div>

        <div className="doctor-fee">
          <span className="fee-label">Consultation Fee:</span>
          <span className="fee-amount">${doctor.fee}</span>
        </div>

        <button className="btn btn-primary btn-select">View Profile</button>
      </div>
    </div>
  );
};

export default DoctorCard;
