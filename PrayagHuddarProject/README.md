# Prayag Hudar Project

A full-stack healthcare application with a **React frontend** and **Spring Boot backend**. The project includes patient registration, authentication, and a doctor directory with a working login flow.

## Folder Structure

- `backend/` - Spring Boot API and database integration
- `frontend/` - React application built with Vite and Tailwind CSS
- `README.md` - Project setup and instructions

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Security, Spring Data JPA, Flyway, MySQL
- Frontend: React, Vite, Tailwind CSS, Axios, Formik, Yup
- Database: MySQL

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Maven 3.6+ (or use the included Maven wrapper)
- MySQL 8+ installed locally

## Backend Setup

1. Make sure a local MySQL server is running.

2. Create or verify the database and user:

```sql
CREATE DATABASE IF NOT EXISTS appdb;
CREATE USER IF NOT EXISTS 'appuser'@'localhost' IDENTIFIED BY 'apppassword';
GRANT ALL PRIVILEGES ON appdb.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

3. Build and run the backend:

```powershell
cd backend
.\mvnw clean package -DskipTests
.\mvnw spring-boot:run
```

4. Backend URL:

- `http://localhost:8080`

## Frontend Setup

1. Create or copy environment variables:

```powershell
cd frontend
copy .env.example .env
```

2. Install dependencies:

```powershell
npm install
```

3. Start the frontend:

```powershell
npm start
```

4. Frontend URL:

- `http://localhost:5173`

## Environment Files

- `frontend/.env` - Local frontend environment settings
- `frontend/.env.example` - Example environment variables
- `backend/src/main/resources/application.yml` - Backend configuration for Spring Boot
- `backend/src/main/resources/application.properties` - Clear fallback properties for backend configuration

## Database Details

- Database name: `appdb`
- Default database user: `appuser`
- Default password: `apppassword`

### Main tables used

- `users`
- `profiles`
- `consultations`
- `files`

### Check data

- Use MySQL commands:

```sql
USE appdb;
SHOW TABLES;
SELECT * FROM users LIMIT 10;
```

- Or use the MySQL client of your choice.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/doctors` - Retrieve available doctors

## Demo Credentials

The database includes seeded demo accounts from `backend/src/main/resources/data.sql`.

### Patient
- Email: `patient@example.com`
- Password: `password`

### Doctors
- Email: `dr.smith@example.com`
- Password: `password`

- Email: `dr.johnson@example.com`
- Password: `password`

- Email: `dr.williams@example.com`
- Password: `password`

## Notes

- The frontend now supports `npm start` for development.
- Toast notifications are disabled for a quieter UI; error and status handling remain in console and inline.
- The backend uses environment variables for database and JWT configuration.

## Common Commands

```powershell
# Backend
cd backend
.\mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm start
```

## Troubleshooting

- If frontend cannot reach backend, verify `VITE_API_BASE_URL` in `frontend/.env`.
- If backend cannot connect to MySQL, verify the database is running and the connection URL matches `jdbc:mysql://localhost:3306/appdb`.
