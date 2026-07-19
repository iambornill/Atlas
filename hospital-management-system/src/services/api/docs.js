/**
 * API Documentation for Backend Implementation
 * =============================================
 * 
 * This file documents all API endpoints required for the Hospital Management System.
 * A backend developer can use this as a reference to implement the actual API.
 */

/**
 * =========================================
 * AUTHENTICATION ENDPOINTS
 * =========================================
 */

/**
 * POST /api/v1/auth/login
 * Purpose: Authenticate user and return JWT token
 * 
 * Request Body:
 * {
 *   "email": "string (required)",
 *   "password": "string (required)"
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "token": "string",
 *     "user": {
 *       "id": "string",
 *       "email": "string",
 *       "name": "string",
 *       "role": "admin | doctor | receptionist",
 *       "avatar": "string (url)"
 *     }
 *   }
 * }
 * 
 * Status Codes:
 * - 200: Success
 * - 401: Invalid credentials
 * - 400: Validation error
 */

/**
 * POST /api/v1/auth/logout
 * Purpose: Invalidate current session/token
 * 
 * Headers: Authorization: Bearer <token>
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 */

/**
 * GET /api/v1/auth/me
 * Purpose: Get current authenticated user details
 * 
 * Headers: Authorization: Bearer <token>
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "email": "string",
 *     "name": "string",
 *     "role": "string",
 *     "avatar": "string"
 *   }
 * }
 */

/**
 * =========================================
 * PATIENTS ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/patients
 * Purpose: Get list of all patients with pagination and filters
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - search: string (search by name, email, phone)
 * - status: string (Active | Critical | Discharged)
 * - sortBy: string (name | registrationDate | age)
 * - sortOrder: asc | desc
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "patients": [PatientObject],
 *     "pagination": {
 *       "currentPage": 1,
 *       "totalPages": 5,
 *       "totalItems": 50,
 *       "itemsPerPage": 10
 *     }
 *   }
 * }
 */

/**
 * GET /api/v1/patients/:id
 * Purpose: Get single patient details by ID
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "firstName": "string",
 *     "lastName": "string",
 *     "email": "string",
 *     "phone": "string",
 *     "dateOfBirth": "YYYY-MM-DD",
 *     "gender": "Male | Female | Other",
 *     "bloodGroup": "string",
 *     "age": "number",
 *     "address": "string",
 *     "emergencyContact": "string",
 *     "assignedDoctorId": "string",
 *     "medicalHistory": ["string"],
 *     "allergies": ["string"],
 *     "insuranceProvider": "string",
 *     "insuranceId": "string",
 *     "registrationDate": "YYYY-MM-DD",
 *     "status": "Active | Critical | Discharged"
 *   }
 * }
 */

/**
 * POST /api/v1/patients
 * Purpose: Create a new patient
 * 
 * Request Body:
 * {
 *   "firstName": "string (required)",
 *   "lastName": "string (required)",
 *   "email": "string (required, unique)",
 *   "phone": "string (required)",
 *   "dateOfBirth": "YYYY-MM-DD (required)",
 *   "gender": "string (required)",
 *   "bloodGroup": "string",
 *   "address": "string",
 *   "emergencyContact": "string",
 *   "assignedDoctorId": "string",
 *   "medicalHistory": ["string"],
 *   "allergies": ["string"],
 *   "insuranceProvider": "string",
 *   "insuranceId": "string"
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "data": { PatientObject },
 *   "message": "Patient created successfully"
 * }
 */

/**
 * PUT /api/v1/patients/:id
 * Purpose: Update existing patient
 * 
 * Request Body: Same as POST (all fields optional)
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": { PatientObject },
 *   "message": "Patient updated successfully"
 * }
 */

/**
 * DELETE /api/v1/patients/:id
 * Purpose: Delete a patient (soft delete recommended)
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Patient deleted successfully"
 * }
 */

/**
 * =========================================
 * DOCTORS ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/doctors
 * Purpose: Get list of all doctors
 * 
 * Query Parameters:
 * - departmentId: string (filter by department)
 * - search: string (search by name, specialization)
 * - sortBy: string (name | experience)
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": [DoctorObject]
 * }
 */

/**
 * GET /api/v1/doctors/:id
 * Purpose: Get single doctor details
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "userId": "string",
 *     "name": "string",
 *     "email": "string",
 *     "phone": "string",
 *     "departmentId": "string",
 *     "specialization": "string",
 *     "experience": "number",
 *     "qualification": "string",
 *     "availability": "string",
 *     "consultationFee": "number",
 *     "avatar": "string",
 *     "bio": "string"
 *   }
 * }
 */

/**
 * POST /api/v1/doctors
 * Purpose: Create a new doctor
 * 
 * Request Body:
 * {
 *   "userId": "string (required)",
 *   "departmentId": "string (required)",
 *   "specialization": "string (required)",
 *   "experience": "number",
 *   "qualification": "string",
 *   "availability": "string",
 *   "consultationFee": "number",
 *   "bio": "string"
 * }
 */

/**
 * PUT /api/v1/doctors/:id
 * Purpose: Update doctor details
 */

/**
 * DELETE /api/v1/doctors/:id
 * Purpose: Delete/deactivate a doctor
 */

/**
 * =========================================
 * APPOINTMENTS ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/appointments
 * Purpose: Get list of appointments
 * 
 * Query Parameters:
 * - date: YYYY-MM-DD (filter by date)
 * - doctorId: string
 * - patientId: string
 * - status: Scheduled | In Progress | Completed | Cancelled
 * - type: string
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": [AppointmentObject]
 * }
 */

/**
 * GET /api/v1/appointments/:id
 * Purpose: Get single appointment details
 */

/**
 * POST /api/v1/appointments
 * Purpose: Book a new appointment
 * 
 * Request Body:
 * {
 *   "patientId": "string (required)",
 *   "doctorId": "string (required)",
 *   "departmentId": "string (required)",
 *   "date": "YYYY-MM-DD (required)",
 *   "time": "HH:mm (required)",
 *   "type": "string (required)",
 *   "notes": "string"
 * }
 */

/**
 * PUT /api/v1/appointments/:id
 * Purpose: Update appointment
 * 
 * Request Body: All fields optional
 */

/**
 * DELETE /api/v1/appointments/:id
 * Purpose: Cancel/delete appointment
 */

/**
 * PATCH /api/v1/appointments/:id/status
 * Purpose: Update appointment status only
 * 
 * Request Body:
 * {
 *   "status": "Scheduled | In Progress | Completed | Cancelled"
 * }
 */

/**
 * =========================================
 * DEPARTMENTS ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/departments
 * Purpose: Get list of all departments
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "string",
 *       "name": "string",
 *       "headDoctorId": "string",
 *       "description": "string",
 *       "floor": "string",
 *       "contact": "string",
 *       "doctorCount": "number"
 *     }
 *   ]
 * }
 */

/**
 * GET /api/v1/departments/:id
 * Purpose: Get single department details
 */

/**
 * POST /api/v1/departments
 * Purpose: Create new department
 */

/**
 * PUT /api/v1/departments/:id
 * Purpose: Update department
 */

/**
 * DELETE /api/v1/departments/:id
 * Purpose: Delete department
 */

/**
 * =========================================
 * BILLING/INVOICES ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/invoices
 * Purpose: Get list of invoices
 * 
 * Query Parameters:
 * - patientId: string
 * - status: Paid | Pending | Overdue
 * - dateFrom: YYYY-MM-DD
 * - dateTo: YYYY-MM-DD
 */

/**
 * GET /api/v1/invoices/:id
 * Purpose: Get single invoice details
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "string",
 *     "patientId": "string",
 *     "appointmentId": "string",
 *     "doctorId": "string",
 *     "items": [
 *       { "description": "string", "amount": "number" }
 *     ],
 *     "subtotal": "number",
 *     "tax": "number",
 *     "total": "number",
 *     "status": "Paid | Pending | Overdue",
 *     "paymentMethod": "string",
 *     "issueDate": "YYYY-MM-DD",
 *     "dueDate": "YYYY-MM-DD"
 *   }
 * }
 */

/**
 * POST /api/v1/invoices
 * Purpose: Generate new invoice
 * 
 * Request Body:
 * {
 *   "patientId": "string (required)",
 *   "appointmentId": "string",
 *   "doctorId": "string (required)",
 *   "items": [
 *     { "description": "string (required)", "amount": "number (required)" }
 *   ],
 *   "tax": "number"
 * }
 */

/**
 * PUT /api/v1/invoices/:id
 * Purpose: Update invoice
 */

/**
 * PATCH /api/v1/invoices/:id/payment
 * Purpose: Record payment for invoice
 * 
 * Request Body:
 * {
 *   "paymentMethod": "Credit Card | Cash | Insurance | Debit Card",
 *   "amount": "number"
 * }
 */

/**
 * DELETE /api/v1/invoices/:id
 * Purpose: Delete invoice
 */

/**
 * =========================================
 * DASHBOARD ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/dashboard/stats
 * Purpose: Get dashboard statistics
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "totalPatients": "number",
 *     "totalDoctors": "number",
 *     "todaysAppointments": "number",
 *     "availableBeds": "number",
 *     "totalBeds": "number",
 *     "occupancyRate": "number",
 *     "monthlyRevenue": "number"
 *   }
 * }
 */

/**
 * GET /api/v1/dashboard/revenue-chart
 * Purpose: Get revenue data for chart
 * 
 * Query Parameters:
 * - period: day | week | month | year
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": [
 *     { "date": "YYYY-MM-DD", "revenue": "number" }
 *   ]
 * }
 */

/**
 * GET /api/v1/dashboard/recent-appointments
 * Purpose: Get recent appointments for dashboard
 * 
 * Query Parameters:
 * - limit: number (default: 5)
 */

/**
 * GET /api/v1/dashboard/notifications
 * Purpose: Get notifications for current user
 */

/**
 * =========================================
 * SETTINGS ENDPOINTS
 * =========================================
 */

/**
 * GET /api/v1/settings/profile
 * Purpose: Get current user profile settings
 */

/**
 * PUT /api/v1/settings/profile
 * Purpose: Update user profile
 * 
 * Request Body:
 * {
 *   "name": "string",
 *   "email": "string",
 *   "phone": "string",
 *   "avatar": "string (url or base64)"
 * }
 */

/**
 * PUT /api/v1/settings/change-password
 * Purpose: Change user password
 * 
 * Request Body:
 * {
 *   "currentPassword": "string (required)",
 *   "newPassword": "string (required, min 8 chars)"
 * }
 */

/**
 * PUT /api/v1/settings/preferences
 * Purpose: Update user preferences (theme, notifications)
 * 
 * Request Body:
 * {
 *   "theme": "light | dark",
 *   "emailNotifications": "boolean",
 *   "smsNotifications": "boolean"
 * }
 */

/**
 * =========================================
 * DATABASE SCHEMA
 * =========================================
 * 
 * -- Users table (for authentication)
 * CREATE TABLE users (
 *   id VARCHAR(36) PRIMARY KEY,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   password_hash VARCHAR(255) NOT NULL,
 *   name VARCHAR(255) NOT NULL,
 *   role ENUM('admin', 'doctor', 'receptionist') NOT NULL,
 *   avatar VARCHAR(500),
 *   phone VARCHAR(20),
 *   is_active BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 * );
 * 
 * -- Departments table
 * CREATE TABLE departments (
 *   id VARCHAR(36) PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL,
 *   head_doctor_id VARCHAR(36),
 *   description TEXT,
 *   floor VARCHAR(50),
 *   contact VARCHAR(50),
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (head_doctor_id) REFERENCES doctors(id)
 * );
 * 
 * -- Doctors table
 * CREATE TABLE doctors (
 *   id VARCHAR(36) PRIMARY KEY,
 *   user_id VARCHAR(36) UNIQUE NOT NULL,
 *   department_id VARCHAR(36),
 *   specialization VARCHAR(100),
 *   experience INT,
 *   qualification VARCHAR(255),
 *   availability TEXT,
 *   consultation_fee DECIMAL(10,2),
 *   bio TEXT,
 *   avatar VARCHAR(500),
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id),
 *   FOREIGN KEY (department_id) REFERENCES departments(id)
 * );
 * 
 * -- Patients table
 * CREATE TABLE patients (
 *   id VARCHAR(36) PRIMARY KEY,
 *   first_name VARCHAR(100) NOT NULL,
 *   last_name VARCHAR(100) NOT NULL,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   phone VARCHAR(20) NOT NULL,
 *   date_of_birth DATE NOT NULL,
 *   gender ENUM('Male', 'Female', 'Other') NOT NULL,
 *   blood_group VARCHAR(5),
 *   address TEXT,
 *   emergency_contact VARCHAR(20),
 *   assigned_doctor_id VARCHAR(36),
 *   medical_history JSON,
 *   allergies JSON,
 *   insurance_provider VARCHAR(100),
 *   insurance_id VARCHAR(50),
 *   status ENUM('Active', 'Critical', 'Discharged') DEFAULT 'Active',
 *   registration_date DATE,
 *   is_deleted BOOLEAN DEFAULT false,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id)
 * );
 * 
 * -- Appointments table
 * CREATE TABLE appointments (
 *   id VARCHAR(36) PRIMARY KEY,
 *   patient_id VARCHAR(36) NOT NULL,
 *   doctor_id VARCHAR(36) NOT NULL,
 *   department_id VARCHAR(36) NOT NULL,
 *   appointment_date DATE NOT NULL,
 *   appointment_time TIME NOT NULL,
 *   type VARCHAR(50) NOT NULL,
 *   status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
 *   notes TEXT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   FOREIGN KEY (patient_id) REFERENCES patients(id),
 *   FOREIGN KEY (doctor_id) REFERENCES doctors(id),
 *   FOREIGN KEY (department_id) REFERENCES departments(id)
 * );
 * 
 * -- Invoices table
 * CREATE TABLE invoices (
 *   id VARCHAR(36) PRIMARY KEY,
 *   patient_id VARCHAR(36) NOT NULL,
 *   appointment_id VARCHAR(36),
 *   doctor_id VARCHAR(36) NOT NULL,
 *   subtotal DECIMAL(10,2) NOT NULL,
 *   tax DECIMAL(10,2) DEFAULT 0,
 *   total DECIMAL(10,2) NOT NULL,
 *   status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
 *   payment_method VARCHAR(50),
 *   issue_date DATE NOT NULL,
 *   due_date DATE NOT NULL,
 *   paid_at TIMESTAMP,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (patient_id) REFERENCES patients(id),
 *   FOREIGN KEY (appointment_id) REFERENCES appointments(id),
 *   FOREIGN KEY (doctor_id) REFERENCES doctors(id)
 * );
 * 
 * -- Invoice Items table
 * CREATE TABLE invoice_items (
 *   id VARCHAR(36) PRIMARY KEY,
 *   invoice_id VARCHAR(36) NOT NULL,
 *   description VARCHAR(255) NOT NULL,
 *   amount DECIMAL(10,2) NOT NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
 * );
 * 
 * -- Notifications table
 * CREATE TABLE notifications (
 *   id VARCHAR(36) PRIMARY KEY,
 *   user_id VARCHAR(36) NOT NULL,
 *   type VARCHAR(50) NOT NULL,
 *   title VARCHAR(255) NOT NULL,
 *   message TEXT NOT NULL,
 *   is_read BOOLEAN DEFAULT false,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id)
 * );
 * 
 * RELATIONSHIPS:
 * - User (1) ---- (1) Doctor
 * - Department (1) ---- (M) Doctors
 * - Doctor (1) ---- (M) Patients (assigned)
 * - Doctor (1) ---- (M) Appointments
 * - Patient (1) ---- (M) Appointments
 * - Patient (1) ---- (M) Invoices
 * - Appointment (1) ---- (0..1) Invoice
 * - Invoice (1) ---- (M) Invoice Items
 */

export const API_DOCS = {
  version: '1.0.0',
  baseUrl: '/api/v1',
  lastUpdated: '2025-01-20'
};
