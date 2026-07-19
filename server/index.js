const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initDB, createTables, seedData, getOne, getAll, runQuery } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'hospital-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = getOne('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get doctor info if user is a doctor
    let doctorInfo = null;
    if (user.role === 'doctor') {
      doctorInfo = getOne('SELECT * FROM doctors WHERE user_id = ?', [user.id]);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        doctorInfo
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = getOne('SELECT id, email, name, role, avatar, created_at FROM users WHERE id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update profile
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const { name, avatar } = req.body;

  try {
    runQuery(
      'UPDATE users SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name || req.user.name, avatar, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Change password
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  try {
    const user = getOne('SELECT * FROM users WHERE id = ?', [req.user.id]);

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    runQuery(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  try {
    const stats = {};

    const patientCount = getOne('SELECT COUNT(*) as count FROM patients');
    stats.totalPatients = patientCount.count;

    const doctorCount = getOne('SELECT COUNT(*) as count FROM doctors');
    stats.totalDoctors = doctorCount.count;

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = getOne('SELECT COUNT(*) as count FROM appointments WHERE date = ?', [today]);
    stats.todayAppointments = todayAppointments.count;

    const availableBeds = getOne("SELECT COUNT(*) as count FROM beds WHERE status = 'available'");
    stats.availableBeds = availableBeds.count;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard/revenue', authenticateToken, (req, res) => {
  try {
    const revenue = getAll(
      `SELECT strftime('%Y-%m', created_at) as month, SUM(amount) as revenue 
       FROM invoices 
       WHERE status = 'paid'
       GROUP BY month 
       ORDER BY month DESC 
       LIMIT 6`
    );
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard/recent-appointments', authenticateToken, (req, res) => {
  try {
    const appointments = getAll(
      `SELECT a.*, p.name as patient_name, u.name as doctor_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 5`
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/dashboard/notifications', authenticateToken, (req, res) => {
  try {
    const notifications = getAll(
      'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== PATIENTS ROUTES ====================

app.get('/api/patients', authenticateToken, (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const patients = getAll(
      `SELECT * FROM patients ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const countResult = getOne(`SELECT COUNT(*) as count FROM patients ${whereClause}`, search ? params : []);

    res.json({
      patients,
      total: countResult.count,
      page: parseInt(page),
      totalPages: Math.ceil(countResult.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/patients/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const patient = getOne('SELECT * FROM patients WHERE id = ?', [id]);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const doctor = getOne(
      `SELECT u.name, d.specialization 
       FROM doctors d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.id = ?`,
      [patient.assigned_doctor_id]
    );

    res.json({ patient, doctor });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/patients', authenticateToken, authorizeRole('admin', 'receptionist'), (req, res) => {
  const { name, age, gender, blood_group, phone, email, address, medical_history, assigned_doctor_id, emergency_contact } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({ error: 'Name, age, and gender are required' });
  }

  try {
    runQuery(
      `INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history, assigned_doctor_id, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, age, gender, blood_group, phone, email, address, medical_history, assigned_doctor_id, emergency_contact]
    );

    const result = getOne('SELECT last_insert_rowid() as id');
    
    res.status(201).json({
      message: 'Patient created successfully',
      id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/patients/:id', authenticateToken, authorizeRole('admin', 'receptionist'), (req, res) => {
  const { id } = req.params;
  const { name, age, gender, blood_group, phone, email, address, medical_history, assigned_doctor_id, emergency_contact } = req.body;

  try {
    runQuery(
      `UPDATE patients 
       SET name = ?, age = ?, gender = ?, blood_group = ?, phone = ?, email = ?, address = ?, medical_history = ?, assigned_doctor_id = ?, emergency_contact = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, age, gender, blood_group, phone, email, address, medical_history, assigned_doctor_id, emergency_contact, id]
    );

    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/patients/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;

  try {
    runQuery('DELETE FROM patients WHERE id = ?', [id]);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== DOCTORS ROUTES ====================

app.get('/api/doctors', authenticateToken, (req, res) => {
  try {
    const { department_id } = req.query;

    let query = `
      SELECT d.*, u.name, u.email, dep.name as department_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dep ON d.department_id = dep.id
      WHERE 1=1
    `;
    const params = [];

    if (department_id) {
      query += ' AND d.department_id = ?';
      params.push(department_id);
    }

    const doctors = getAll(query, params);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/doctors/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const doctor = getOne(
      `SELECT d.*, u.name, u.email, u.avatar, dep.name as department_name
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.id = ?`,
      [id]
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/doctors', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { email, password, name, department_id, specialization, experience_years, qualification, availability, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    runQuery(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'doctor']
    );

    const userResult = getOne('SELECT last_insert_rowid() as id');
    const userId = userResult.id;

    runQuery(
      `INSERT INTO doctors (user_id, department_id, specialization, experience_years, qualification, availability, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, department_id, specialization, experience_years, qualification, availability, phone]
    );

    const doctorResult = getOne('SELECT last_insert_rowid() as id');

    res.status(201).json({
      message: 'Doctor created successfully',
      id: doctorResult.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/doctors/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;
  const { department_id, specialization, experience_years, qualification, availability, phone } = req.body;

  try {
    runQuery(
      `UPDATE doctors 
       SET department_id = ?, specialization = ?, experience_years = ?, qualification = ?, availability = ?, phone = ?
       WHERE id = ?`,
      [department_id, specialization, experience_years, qualification, availability, phone, id]
    );

    res.json({ message: 'Doctor updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/doctors/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;

  try {
    const doctor = getOne('SELECT user_id FROM doctors WHERE id = ?', [id]);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    runQuery('DELETE FROM doctors WHERE id = ?', [id]);
    runQuery('DELETE FROM users WHERE id = ?', [doctor.user_id]);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== APPOINTMENTS ROUTES ====================

app.get('/api/appointments', authenticateToken, (req, res) => {
  try {
    const { status, doctor_id, patient_id, date } = req.query;

    let query = `
      SELECT a.*, p.name as patient_name, u.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (doctor_id) {
      query += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }

    if (patient_id) {
      query += ' AND a.patient_id = ?';
      params.push(patient_id);
    }

    if (date) {
      query += ' AND a.date = ?';
      params.push(date);
    }

    query += ' ORDER BY a.date DESC, a.time DESC';

    const appointments = getAll(query, params);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/appointments/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const appointment = getOne(
      `SELECT a.*, p.name as patient_name, p.phone as patient_phone, u.name as doctor_name, d.specialization
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/appointments', authenticateToken, authorizeRole('admin', 'receptionist'), (req, res) => {
  const { patient_id, doctor_id, date, time, notes } = req.body;

  if (!patient_id || !doctor_id || !date || !time) {
    return res.status(400).json({ error: 'Patient ID, Doctor ID, date, and time are required' });
  }

  try {
    runQuery(
      `INSERT INTO appointments (patient_id, doctor_id, date, time, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [patient_id, doctor_id, date, time, notes]
    );

    const result = getOne('SELECT last_insert_rowid() as id');

    res.status(201).json({
      message: 'Appointment created successfully',
      id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/appointments/:id', authenticateToken, authorizeRole('admin', 'receptionist', 'doctor'), (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, date, time, status, notes } = req.body;

  try {
    runQuery(
      `UPDATE appointments 
       SET patient_id = ?, doctor_id = ?, date = ?, time = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [patient_id, doctor_id, date, time, status, notes, id]
    );

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/appointments/:id', authenticateToken, authorizeRole('admin', 'receptionist'), (req, res) => {
  const { id } = req.params;

  try {
    runQuery('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== DEPARTMENTS ROUTES ====================

app.get('/api/departments', authenticateToken, (req, res) => {
  try {
    const departments = getAll(
      `SELECT d.*, u.name as head_name, COUNT(doc.id) as doctor_count
       FROM departments d
       LEFT JOIN doctors doc ON d.id = doc.department_id
       LEFT JOIN users u ON d.head_doctor_id = u.id
       GROUP BY d.id`
    );
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/departments/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const department = getOne(
      `SELECT d.*, u.name as head_name
       FROM departments d
       LEFT JOIN users u ON d.head_doctor_id = u.id
       WHERE d.id = ?`,
      [id]
    );

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const doctors = getAll(
      `SELECT doc.*, u.name as doctor_name
       FROM doctors doc
       JOIN users u ON doc.user_id = u.id
       WHERE doc.department_id = ?`,
      [id]
    );

    res.json({ department, doctors });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/departments', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { name, description, head_doctor_id } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    runQuery(
      'INSERT INTO departments (name, description, head_doctor_id) VALUES (?, ?, ?)',
      [name, description, head_doctor_id]
    );

    const result = getOne('SELECT last_insert_rowid() as id');

    res.status(201).json({
      message: 'Department created successfully',
      id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/departments/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;
  const { name, description, head_doctor_id } = req.body;

  try {
    runQuery(
      'UPDATE departments SET name = ?, description = ?, head_doctor_id = ? WHERE id = ?',
      [name, description, head_doctor_id, id]
    );

    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/departments/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;

  try {
    runQuery('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== INVOICES/BILLING ROUTES ====================

app.get('/api/invoices', authenticateToken, (req, res) => {
  try {
    const { status, patient_id } = req.query;

    let query = `
      SELECT i.*, p.name as patient_name
       FROM invoices i
       JOIN patients p ON i.patient_id = p.id
       WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }

    if (patient_id) {
      query += ' AND i.patient_id = ?';
      params.push(patient_id);
    }

    query += ' ORDER BY i.created_at DESC';

    const invoices = getAll(query, params);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/invoices/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const invoice = getOne(
      `SELECT i.*, p.name as patient_name, p.phone, p.email, a.date as appointment_date
       FROM invoices i
       JOIN patients p ON i.patient_id = p.id
       LEFT JOIN appointments a ON i.appointment_id = a.id
       WHERE i.id = ?`,
      [id]
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/invoices', authenticateToken, authorizeRole('admin', 'receptionist'), (req, res) => {
  const { patient_id, appointment_id, amount, description } = req.body;

  if (!patient_id || !amount) {
    return res.status(400).json({ error: 'Patient ID and amount are required' });
  }

  try {
    runQuery(
      `INSERT INTO invoices (patient_id, appointment_id, amount, description)
       VALUES (?, ?, ?, ?)`,
      [patient_id, appointment_id, amount, description]
    );

    const result = getOne('SELECT last_insert_rowid() as id');

    res.status(201).json({
      message: 'Invoice created successfully',
      id: result.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/invoices/:id', authenticateToken, authorizeRole('admin', 'receptionist'), (req, res) => {
  const { id } = req.params;
  const { status, payment_method } = req.body;

  try {
    let query = 'UPDATE invoices SET ';
    const params = [];

    if (status) {
      query += 'status = ?';
      params.push(status);
      if (status === 'paid') {
        query += ', paid_at = CURRENT_TIMESTAMP';
      }
    }

    if (payment_method) {
      query += query.includes('status') ? ', payment_method = ?' : 'payment_method = ?';
      params.push(payment_method);
    }

    query += ' WHERE id = ?';
    params.push(id);

    runQuery(query, params);

    res.json({ message: 'Invoice updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/invoices/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
  const { id } = req.params;

  try {
    runQuery('DELETE FROM invoices WHERE id = ?', [id]);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const startServer = async () => {
  try {
    const dbInitialized = await initDB();
    if (!dbInitialized) {
      console.error('Failed to initialize database');
      process.exit(1);
    }

    createTables();
    await seedData();

    app.listen(PORT, () => {
      console.log(`🏥 Hospital Management Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
