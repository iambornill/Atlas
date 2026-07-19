// Mock Users Data
export const users = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'password123',
    role: 'admin',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: '2',
    email: 'doctor@hospital.com',
    password: 'password123',
    role: 'doctor',
    name: 'Dr. Michael Chen',
    avatar: 'https://i.pravatar.cc/150?u=doctor',
    departmentId: '1'
  },
  {
    id: '3',
    email: 'receptionist@hospital.com',
    password: 'password123',
    role: 'receptionist',
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?u=receptionist'
  }
];

// Mock Departments Data
export const departments = [
  {
    id: '1',
    name: 'Cardiology',
    headDoctorId: '2',
    description: 'Heart and cardiovascular system care',
    floor: '3rd Floor',
    contact: 'ext. 301'
  },
  {
    id: '2',
    name: 'Neurology',
    headDoctorId: '4',
    description: 'Brain and nervous system disorders',
    floor: '4th Floor',
    contact: 'ext. 401'
  },
  {
    id: '3',
    name: 'Pediatrics',
    headDoctorId: '5',
    description: 'Child healthcare and development',
    floor: '2nd Floor',
    contact: 'ext. 201'
  },
  {
    id: '4',
    name: 'Orthopedics',
    headDoctorId: '6',
    description: 'Bone, joint, and muscle care',
    floor: '1st Floor',
    contact: 'ext. 101'
  },
  {
    id: '5',
    name: 'Emergency',
    headDoctorId: '7',
    description: '24/7 emergency care',
    floor: 'Ground Floor',
    contact: 'ext. 911'
  }
];

// Mock Doctors Data
export const doctors = [
  {
    id: '2',
    userId: '2',
    name: 'Dr. Michael Chen',
    email: 'doctor@hospital.com',
    phone: '+1 (555) 123-4567',
    departmentId: '1',
    specialization: 'Cardiologist',
    experience: 12,
    qualification: 'MD, FACC',
    availability: 'Mon-Fri, 9AM-5PM',
    consultationFee: 150,
    avatar: 'https://i.pravatar.cc/150?u=doctor',
    bio: 'Specialist in interventional cardiology with over 12 years of experience.'
  },
  {
    id: '4',
    userId: '4',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@hospital.com',
    phone: '+1 (555) 234-5678',
    departmentId: '2',
    specialization: 'Neurologist',
    experience: 8,
    qualification: 'MD, PhD',
    availability: 'Mon-Wed-Fri, 10AM-6PM',
    consultationFee: 175,
    avatar: 'https://i.pravatar.cc/150?u=lisa',
    bio: 'Expert in treating neurological disorders and brain injuries.'
  },
  {
    id: '5',
    userId: '5',
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    phone: '+1 (555) 345-6789',
    departmentId: '3',
    specialization: 'Pediatrician',
    experience: 15,
    qualification: 'MD, FAAP',
    availability: 'Tue-Thu-Sat, 8AM-4PM',
    consultationFee: 125,
    avatar: 'https://i.pravatar.cc/150?u=james',
    bio: 'Dedicated to providing comprehensive care for children of all ages.'
  },
  {
    id: '6',
    userId: '6',
    name: 'Dr. Robert Brown',
    email: 'robert.brown@hospital.com',
    phone: '+1 (555) 456-7890',
    departmentId: '4',
    specialization: 'Orthopedic Surgeon',
    experience: 20,
    qualification: 'MD, FAAOS',
    availability: 'Mon-Fri, 7AM-3PM',
    consultationFee: 200,
    avatar: 'https://i.pravatar.cc/150?u=robert',
    bio: 'Specializing in sports medicine and joint replacement surgery.'
  },
  {
    id: '7',
    userId: '7',
    name: 'Dr. Amanda Lee',
    email: 'amanda.lee@hospital.com',
    phone: '+1 (555) 567-8901',
    departmentId: '5',
    specialization: 'Emergency Physician',
    experience: 10,
    qualification: 'MD, FACEP',
    availability: '24/7 Rotating Shifts',
    consultationFee: 100,
    avatar: 'https://i.pravatar.cc/150?u=amanda',
    bio: 'Experienced in trauma care and emergency medicine.'
  }
];

// Mock Patients Data
export const patients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 111-2222',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    bloodGroup: 'O+',
    age: 39,
    address: '123 Main St, New York, NY 10001',
    emergencyContact: '+1 (555) 111-3333',
    assignedDoctorId: '2',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin'],
    insuranceProvider: 'Blue Cross',
    insuranceId: 'BC123456789',
    registrationDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 222-3333',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    bloodGroup: 'A+',
    age: 34,
    address: '456 Oak Ave, Los Angeles, CA 90001',
    emergencyContact: '+1 (555) 222-4444',
    assignedDoctorId: '4',
    medicalHistory: ['Migraine'],
    allergies: ['None'],
    insuranceProvider: 'Aetna',
    insuranceId: 'AE987654321',
    registrationDate: '2024-02-20',
    status: 'Active'
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@email.com',
    phone: '+1 (555) 333-4444',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    bloodGroup: 'B+',
    age: 46,
    address: '789 Pine Rd, Chicago, IL 60601',
    emergencyContact: '+1 (555) 333-5555',
    assignedDoctorId: '6',
    medicalHistory: ['Arthritis', 'Previous knee surgery'],
    allergies: ['Aspirin'],
    insuranceProvider: 'UnitedHealth',
    insuranceId: 'UH456789123',
    registrationDate: '2024-03-10',
    status: 'Active'
  },
  {
    id: '4',
    firstName: 'Emma',
    lastName: 'Williams',
    email: 'emma.williams@email.com',
    phone: '+1 (555) 444-5555',
    dateOfBirth: '2015-05-30',
    gender: 'Female',
    bloodGroup: 'AB+',
    age: 9,
    address: '321 Elm St, Houston, TX 77001',
    emergencyContact: '+1 (555) 444-6666',
    assignedDoctorId: '5',
    medicalHistory: ['Asthma'],
    allergies: ['Peanuts', 'Shellfish'],
    insuranceProvider: 'Cigna',
    insuranceId: 'CI789123456',
    registrationDate: '2024-04-05',
    status: 'Active'
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@email.com',
    phone: '+1 (555) 555-6666',
    dateOfBirth: '1965-09-12',
    gender: 'Male',
    bloodGroup: 'O-',
    age: 59,
    address: '654 Maple Dr, Phoenix, AZ 85001',
    emergencyContact: '+1 (555) 555-7777',
    assignedDoctorId: '2',
    medicalHistory: ['Heart Disease', 'High Cholesterol'],
    allergies: ['Latex'],
    insuranceProvider: 'Medicare',
    insuranceId: 'MC321654987',
    registrationDate: '2024-05-18',
    status: 'Critical'
  },
  {
    id: '6',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@email.com',
    phone: '+1 (555) 666-7777',
    dateOfBirth: '1995-02-28',
    gender: 'Female',
    bloodGroup: 'A-',
    age: 29,
    address: '987 Cedar Ln, Philadelphia, PA 19101',
    emergencyContact: '+1 (555) 666-8888',
    assignedDoctorId: '7',
    medicalHistory: [],
    allergies: ['None'],
    insuranceProvider: 'Humana',
    insuranceId: 'HU654987321',
    registrationDate: '2024-06-22',
    status: 'Discharged'
  }
];

// Mock Appointments Data
export const appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    departmentId: '1',
    date: '2025-01-20',
    time: '09:00',
    type: 'Follow-up',
    status: 'Scheduled',
    notes: 'Regular checkup for hypertension management',
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '4',
    departmentId: '2',
    date: '2025-01-20',
    time: '10:30',
    type: 'Consultation',
    status: 'In Progress',
    notes: 'Initial consultation for chronic migraines',
    createdAt: '2025-01-12'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '6',
    departmentId: '4',
    date: '2025-01-20',
    time: '14:00',
    type: 'Surgery Consultation',
    status: 'Scheduled',
    notes: 'Discuss knee replacement options',
    createdAt: '2025-01-08'
  },
  {
    id: '4',
    patientId: '4',
    doctorId: '5',
    departmentId: '3',
    date: '2025-01-21',
    time: '11:00',
    type: 'Vaccination',
    status: 'Scheduled',
    notes: 'Annual flu shot and routine checkup',
    createdAt: '2025-01-15'
  },
  {
    id: '5',
    patientId: '5',
    doctorId: '2',
    departmentId: '1',
    date: '2025-01-19',
    time: '15:30',
    type: 'Emergency',
    status: 'Completed',
    notes: 'Chest pain evaluation',
    createdAt: '2025-01-19'
  },
  {
    id: '6',
    patientId: '6',
    doctorId: '7',
    departmentId: '5',
    date: '2025-01-18',
    time: '22:00',
    type: 'Emergency',
    status: 'Cancelled',
    notes: 'Patient left before treatment',
    createdAt: '2025-01-18'
  },
  {
    id: '7',
    patientId: '1',
    doctorId: '2',
    departmentId: '1',
    date: '2025-01-22',
    time: '09:00',
    type: 'Follow-up',
    status: 'Scheduled',
    notes: 'Review test results',
    createdAt: '2025-01-16'
  },
  {
    id: '8',
    patientId: '2',
    doctorId: '4',
    departmentId: '2',
    date: '2025-01-23',
    time: '14:30',
    type: 'MRI Review',
    status: 'Scheduled',
    notes: 'Review MRI scan results',
    createdAt: '2025-01-17'
  }
];

// Mock Invoices/Billing Data
export const invoices = [
  {
    id: '1',
    patientId: '1',
    appointmentId: '5',
    doctorId: '2',
    items: [
      { description: 'Consultation Fee', amount: 150 },
      { description: 'ECG Test', amount: 75 },
      { description: 'Blood Test', amount: 50 }
    ],
    subtotal: 275,
    tax: 22,
    total: 297,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    issueDate: '2025-01-19',
    dueDate: '2025-02-19'
  },
  {
    id: '2',
    patientId: '3',
    appointmentId: '3',
    doctorId: '6',
    items: [
      { description: 'Surgery Consultation', amount: 200 },
      { description: 'X-Ray', amount: 120 }
    ],
    subtotal: 320,
    tax: 25.6,
    total: 345.6,
    status: 'Pending',
    paymentMethod: null,
    issueDate: '2025-01-20',
    dueDate: '2025-02-20'
  },
  {
    id: '3',
    patientId: '2',
    appointmentId: '2',
    doctorId: '4',
    items: [
      { description: 'Neurology Consultation', amount: 175 },
      { description: 'MRI Scan', amount: 800 }
    ],
    subtotal: 975,
    tax: 78,
    total: 1053,
    status: 'Pending',
    paymentMethod: null,
    issueDate: '2025-01-20',
    dueDate: '2025-02-20'
  },
  {
    id: '4',
    patientId: '4',
    appointmentId: null,
    doctorId: '5',
    items: [
      { description: 'Vaccination', amount: 50 },
      { description: 'Routine Checkup', amount: 125 }
    ],
    subtotal: 175,
    tax: 14,
    total: 189,
    status: 'Paid',
    paymentMethod: 'Insurance',
    issueDate: '2025-01-15',
    dueDate: '2025-02-15'
  }
];

// Mock Dashboard Stats
export const dashboardStats = {
  totalPatients: 1250,
  totalDoctors: 45,
  todaysAppointments: 28,
  availableBeds: 156,
  totalBeds: 200,
  occupancyRate: 78
};

// Mock Notifications
export const notifications = [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Scheduled',
    message: 'John Smith has scheduled an appointment with Dr. Chen',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of $297 received from Robert Brown',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Low Bed Availability',
    message: 'Only 15 beds available in ICU',
    time: '3 hours ago',
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'Staff Meeting',
    message: 'Monthly staff meeting scheduled for tomorrow at 10 AM',
    time: '1 day ago',
    read: true
  }
];

// Helper function to get related data
export const getDoctorById = (id) => doctors.find(d => d.id === id);
export const getPatientById = (id) => patients.find(p => p.id === id);
export const getDepartmentById = (id) => departments.find(d => d.id === id);
export const getUserByEmail = (email) => users.find(u => u.email === email);

export const getDoctorsByDepartment = (deptId) => doctors.filter(d => d.departmentId === deptId);
export const getAppointmentsByDoctor = (doctorId) => appointments.filter(a => a.doctorId === doctorId);
export const getAppointmentsByPatient = (patientId) => appointments.filter(a => a.patientId === patientId);
export const getInvoicesByPatient = (patientId) => invoices.filter(i => i.patientId === patientId);
