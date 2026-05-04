-- Insert demo patient
INSERT INTO users (email, password_hash, role, is_verified, created_at) VALUES
('patient@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PATIENT', TRUE, NOW());

-- Insert patient profile
INSERT INTO profiles (user_id, full_name, phone, address, date_of_birth) VALUES
((SELECT id FROM users WHERE email = 'patient@example.com'), 'Demo Patient', '+1-555-0000', '123 Patient Street, Demo City, DC', '1990-01-01');

-- Insert dummy doctors
INSERT INTO users (email, password_hash, role, is_verified, created_at) VALUES
('dr.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.johnson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.williams@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.brown@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.davis@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.miller@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.garcia@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.lee@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW()),
('dr.taylor@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DOCTOR', TRUE, NOW());

-- Insert doctor profiles
INSERT INTO profiles (user_id, full_name, phone, address, date_of_birth, license_number, specialty, bio) VALUES
((SELECT id FROM users WHERE email = 'dr.smith@example.com'), 'Dr. John Smith', '+1-555-0101', '123 Medical Center, New York, NY', '1975-03-15', 'MD123456', 'Cardiology', 'Experienced cardiologist with 15+ years in heart disease treatment.'),
((SELECT id FROM users WHERE email = 'dr.johnson@example.com'), 'Dr. Sarah Johnson', '+1-555-0102', '456 Health Plaza, Los Angeles, CA', '1980-07-22', 'MD234567', 'Neurology', 'Specialist in neurological disorders and brain health.'),
((SELECT id FROM users WHERE email = 'dr.williams@example.com'), 'Dr. Michael Williams', '+1-555-0103', '789 Wellness Blvd, Chicago, IL', '1972-11-08', 'MD345678', 'Orthopedics', 'Orthopedic surgeon specializing in joint replacements and sports injuries.'),
((SELECT id FROM users WHERE email = 'dr.brown@example.com'), 'Dr. Emily Brown', '+1-555-0104', '321 Care Street, Houston, TX', '1985-01-30', 'MD456789', 'Pediatrics', 'Pediatrician dedicated to children''s health and development.'),
((SELECT id FROM users WHERE email = 'dr.davis@example.com'), 'Dr. Robert Davis', '+1-555-0105', '654 Medical Drive, Phoenix, AZ', '1978-05-12', 'MD567890', 'Dermatology', 'Dermatologist specializing in skin conditions and cosmetic procedures.'),
((SELECT id FROM users WHERE email = 'dr.miller@example.com'), 'Dr. Lisa Miller', '+1-555-0106', '987 Health Avenue, Miami, FL', '1982-09-14', 'MD678901', 'Gynecology', 'Gynecologist specializing in women''s health and reproductive medicine.'),
((SELECT id FROM users WHERE email = 'dr.garcia@example.com'), 'Dr. Carlos Garcia', '+1-555-0107', '147 Care Lane, San Francisco, CA', '1976-12-03', 'MD789012', 'Oncology', 'Oncologist focused on cancer treatment and patient care.'),
((SELECT id FROM users WHERE email = 'dr.lee@example.com'), 'Dr. Jennifer Lee', '+1-555-0108', '258 Wellness Drive, Seattle, WA', '1988-05-20', 'MD890123', 'Psychiatry', 'Psychiatrist providing mental health care and therapy services.'),
((SELECT id FROM users WHERE email = 'dr.taylor@example.com'), 'Dr. David Taylor', '+1-555-0109', '369 Medical Blvd, Boston, MA', '1979-08-11', 'MD901234', 'Radiology', 'Radiologist specializing in diagnostic imaging and interpretation.');