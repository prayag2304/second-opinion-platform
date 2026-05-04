CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('PATIENT','DOCTOR','ADMIN') NOT NULL DEFAULT 'PATIENT',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

CREATE TABLE profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  address TEXT,
  date_of_birth DATE,
  license_number VARCHAR(128),
  specialty VARCHAR(128),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

CREATE TABLE consultations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  opinion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_consult_patient FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_consult_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_status (status)
);

CREATE TABLE files (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  consultation_id BIGINT,
  uploaded_by BIGINT NOT NULL,
  filename VARCHAR(512) NOT NULL,
  content_type VARCHAR(128),
  size BIGINT,
  file_data LONGBLOB NOT NULL,
  category VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_file_consult FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
  CONSTRAINT fk_file_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_consultation_id (consultation_id),
  INDEX idx_uploaded_by (uploaded_by)
);

