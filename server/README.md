# Hospital Management System - Backend API

## Overview
This is a complete backend API for a Hospital Management System built with Node.js, Express, and SQLite (using sql.js).

## Features
- **Authentication & Authorization**: JWT-based authentication with role-based access control (admin, doctor, receptionist)
- **Dashboard**: Statistics, revenue tracking, recent appointments, notifications
- **Patient Management**: CRUD operations for patients
- **Doctor Management**: CRUD operations for doctors with department associations
- **Department Management**: Manage hospital departments
- **Appointment Scheduling**: Create, update, and manage appointments
- **Billing/Invoices**: Invoice management with payment tracking
- **Bed Management**: Track hospital bed availability

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via sql.js - pure JavaScript implementation)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend integration

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` by default.

## Default Users

After seeding, the following users are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | password123 |
| Doctor | doctor@hospital.com | password123 |
| Receptionist | receptionist@hospital.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/revenue` - Get revenue data
- `GET /api/dashboard/recent-appointments` - Get recent appointments
- `GET /api/dashboard/notifications` - Get user notifications

### Patients
- `GET /api/patients` - List all patients (with pagination and search)
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient (admin, receptionist)
- `PUT /api/patients/:id` - Update patient (admin, receptionist)
- `DELETE /api/patients/:id` - Delete patient (admin only)

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create new doctor (admin only)
- `PUT /api/doctors/:id` - Update doctor (admin only)
- `DELETE /api/doctors/:id` - Delete doctor (admin only)

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get department details with doctors
- `POST /api/departments` - Create new department (admin only)
- `PUT /api/departments/:id` - Update department (admin only)
- `DELETE /api/departments/:id` - Delete department (admin only)

### Appointments
- `GET /api/appointments` - List appointments (filterable)
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Create appointment (admin, receptionist)
- `PUT /api/appointments/:id` - Update appointment (admin, receptionist, doctor)
- `DELETE /api/appointments/:id` - Delete appointment (admin, receptionist)

### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice (admin, receptionist)
- `PUT /api/invoices/:id` - Update invoice status/payment (admin, receptionist)
- `DELETE /api/invoices/:id` - Delete invoice (admin only)

## Authentication

All endpoints (except `/api/auth/login`) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Example Usage

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"password123"}'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Patient
```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "age": 35,
    "gender": "male",
    "blood_group": "A+",
    "phone": "555-1234",
    "email": "test@email.com"
  }'
```

## Database

The database is stored as a file (`hospital.db`) in the server directory. It's automatically created and seeded on first run.

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

## Project Structure

```
server/
├── index.js          # Main server file with all routes
├── database.js       # Database initialization and helpers
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── hospital.db       # SQLite database file (auto-generated)
```

## Notes

- The database uses sql.js which is a pure JavaScript implementation of SQLite, making it portable and easy to deploy
- All passwords are hashed using bcrypt before storage
- The API includes proper error handling and validation
- Role-based access control ensures only authorized users can perform specific actions
