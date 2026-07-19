const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

let db;

const dbPath = path.join(__dirname, 'hospital.db');

// Initialize database
const initDB = async () => {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  try {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('Database loaded from file');
    } else {
      db = new SQL.Database();
      console.log('New database created');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Save database to file
const saveDB = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
};

// Create tables
const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'doctor', 'receptionist')) NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      head_doctor_id INTEGER,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (head_doctor_id) REFERENCES doctors(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      department_id INTEGER,
      specialization TEXT,
      experience_years INTEGER DEFAULT 0,
      qualification TEXT,
      availability TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT CHECK(gender IN ('male', 'female', 'other')) NOT NULL,
      blood_group TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      medical_history TEXT,
      assigned_doctor_id INTEGER,
      emergency_contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      appointment_id INTEGER,
      amount REAL NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME,
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS beds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bed_number TEXT UNIQUE NOT NULL,
      ward TEXT,
      status TEXT CHECK(status IN ('available', 'occupied')) DEFAULT 'available',
      patient_id INTEGER,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  saveDB();
  console.log('Tables created successfully');
};

// Seed initial data
const seedData = async () => {
  // Check if users already exist
  const result = db.exec('SELECT COUNT(*) as count FROM users');
  const count = result[0]?.values[0]?.[0] || 0;

  if (count > 0) {
    console.log('Database already seeded');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Insert admin user
  db.run(
    `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
    ['admin@hospital.com', hashedPassword, 'Admin User', 'admin']
  );

  // Insert doctor user
  db.run(
    `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
    ['doctor@hospital.com', hashedPassword, 'Dr. Sarah Johnson', 'doctor']
  );

  // Insert receptionist user
  db.run(
    `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
    ['receptionist@hospital.com', hashedPassword, 'Jane Smith', 'receptionist']
  );

  // Get doctor user ID
  const doctorResult = db.exec("SELECT id FROM users WHERE email = 'doctor@hospital.com'");
  const doctorUserId = doctorResult[0]?.values[0]?.[0];

  // Insert department
  db.run(
    `INSERT INTO departments (name, description) VALUES (?, ?)`,
    ['Cardiology', 'Heart care department']
  );

  const deptResult = db.exec("SELECT id FROM departments WHERE name = 'Cardiology'");
  const deptId = deptResult[0]?.values[0]?.[0];

  // Insert doctor record
  if (doctorUserId && deptId) {
    db.run(
      `INSERT INTO doctors (user_id, department_id, specialization, experience_years, qualification, availability, phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [doctorUserId, deptId, 'Cardiologist', 10, 'MD, DM Cardiology', 'Mon-Fri 9AM-5PM', '+1234567890']
    );
  }

  // Insert more departments
  db.run(`INSERT INTO departments (name, description) VALUES ('Neurology', 'Brain and nervous system')`);
  db.run(`INSERT INTO departments (name, description) VALUES ('Orthopedics', 'Bone and joint care')`);
  db.run(`INSERT INTO departments (name, description) VALUES ('Pediatrics', 'Child care')`);

  // Insert sample patients
  db.run(
    `INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history, emergency_contact) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['John Doe', 45, 'male', 'A+', '555-0101', 'john@email.com', '123 Main St', 'Hypertension', '555-0102']
  );

  db.run(
    `INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history, emergency_contact) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Mary Wilson', 32, 'female', 'B+', '555-0201', 'mary@email.com', '456 Oak Ave', 'Diabetes Type 2', '555-0202']
  );

  db.run(
    `INSERT INTO patients (name, age, gender, blood_group, phone, email, address, medical_history, emergency_contact) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['Robert Brown', 58, 'male', 'O+', '555-0301', 'robert@email.com', '789 Pine Rd', 'Heart Disease', '555-0302']
  );

  // Insert sample beds
  db.run(`INSERT INTO beds (bed_number, ward, status) VALUES ('ICU-001', 'ICU', 'occupied')`);
  db.run(`INSERT INTO beds (bed_number, ward, status) VALUES ('ICU-002', 'ICU', 'available')`);
  db.run(`INSERT INTO beds (bed_number, ward, status) VALUES ('WARD-A-001', 'General Ward A', 'available')`);
  db.run(`INSERT INTO beds (bed_number, ward, status) VALUES ('WARD-A-002', 'General Ward A', 'occupied')`);
  db.run(`INSERT INTO beds (bed_number, ward, status) VALUES ('WARD-B-001', 'General Ward B', 'available')`);

  // Insert sample notifications
  const adminResult = db.exec("SELECT id FROM users WHERE role = 'admin'");
  const adminId = adminResult[0]?.values[0]?.[0];
  if (adminId) {
    db.run(
      `INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)`,
      [adminId, 'New patient registered today', 'info']
    );
  }

  saveDB();
  console.log('Database seeded successfully');
};

// Helper function to run queries
const runQuery = (sql, params = []) => {
  db.run(sql, params);
  saveDB();
};

// Helper function to get single row
const getOne = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
};

// Helper function to get all rows
const getAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
};

module.exports = { initDB, createTables, seedData, runQuery, getOne, getAll, saveDB };
