INSERT INTO users (email, password_hash, role, is_verified, created_at)
SELECT 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', TRUE, NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@example.com'
);

INSERT INTO profiles (user_id, full_name, phone, address)
SELECT users.id, 'Demo Admin', '+1-555-0999', 'Admin Office'
FROM users
WHERE users.email = 'admin@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = users.id
  );
