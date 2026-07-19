import {
  users,
  departments,
  doctors,
  patients,
  appointments,
  invoices,
  dashboardStats,
  notifications
} from '../data/mock';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Mock Authentication Service
 */
export const authService = {
  async login(email, password) {
    await delay();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    }));
    
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    };
  },

  async logout() {
    await delay(200);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true, message: 'Logged out successfully' };
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

/**
 * Mock Patients Service
 */
export const patientsService = {
  async getAll(params = {}) {
    await delay();
    let result = [...patients];
    
    // Search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(p => 
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.phone.includes(params.search)
      );
    }
    
    // Status filter
    if (params.status) {
      result = result.filter(p => p.status === params.status);
    }
    
    // Sorting
    if (params.sortBy) {
      result.sort((a, b) => {
        let aVal = a[params.sortBy];
        let bVal = b[params.sortBy];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (params.sortOrder === 'desc') {
          return aVal > bVal ? -1 : 1;
        }
        return aVal < bVal ? -1 : 1;
      });
    }
    
    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResult = result.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      data: {
        patients: paginatedResult,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      }
    };
  },

  async getById(id) {
    await delay();
    const patient = patients.find(p => p.id === id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return { success: true, data: patient };
  },

  async create(patientData) {
    await delay();
    const newPatient = {
      id: generateId(),
      ...patientData,
      age: new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear(),
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    patients.push(newPatient);
    return { success: true, data: newPatient, message: 'Patient created successfully' };
  },

  async update(id, patientData) {
    await delay();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    patients[index] = { ...patients[index], ...patientData };
    return { success: true, data: patients[index], message: 'Patient updated successfully' };
  },

  async delete(id) {
    await delay();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    patients.splice(index, 1);
    return { success: true, message: 'Patient deleted successfully' };
  }
};

/**
 * Mock Doctors Service
 */
export const doctorsService = {
  async getAll(params = {}) {
    await delay();
    let result = [...doctors];
    
    if (params.departmentId) {
      result = result.filter(d => d.departmentId === params.departmentId);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.specialization.toLowerCase().includes(searchLower)
      );
    }
    
    return { success: true, data: result };
  },

  async getById(id) {
    await delay();
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return { success: true, data: doctor };
  }
};

/**
 * Mock Appointments Service
 */
export const appointmentsService = {
  async getAll(params = {}) {
    await delay();
    let result = [...appointments];
    
    if (params.date) {
      result = result.filter(a => a.date === params.date);
    }
    
    if (params.doctorId) {
      result = result.filter(a => a.doctorId === params.doctorId);
    }
    
    if (params.patientId) {
      result = result.filter(a => a.patientId === params.patientId);
    }
    
    if (params.status) {
      result = result.filter(a => a.status === params.status);
    }
    
    return { success: true, data: result };
  },

  async getById(id) {
    await delay();
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return { success: true, data: appointment };
  },

  async create(appointmentData) {
    await delay();
    const newAppointment = {
      id: generateId(),
      ...appointmentData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    appointments.push(newAppointment);
    return { success: true, data: newAppointment, message: 'Appointment booked successfully' };
  },

  async update(id, appointmentData) {
    await delay();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    appointments[index] = { ...appointments[index], ...appointmentData };
    return { success: true, data: appointments[index], message: 'Appointment updated successfully' };
  },

  async updateStatus(id, status) {
    await delay();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    appointments[index].status = status;
    return { success: true, data: appointments[index], message: 'Status updated successfully' };
  },

  async delete(id) {
    await delay();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    appointments.splice(index, 1);
    return { success: true, message: 'Appointment cancelled successfully' };
  }
};

/**
 * Mock Departments Service
 */
export const departmentsService = {
  async getAll() {
    await delay();
    const result = departments.map(dept => ({
      ...dept,
      doctorCount: doctors.filter(d => d.departmentId === dept.id).length
    }));
    return { success: true, data: result };
  },

  async getById(id) {
    await delay();
    const department = departments.find(d => d.id === id);
    if (!department) {
      throw new Error('Department not found');
    }
    return { success: true, data: department };
  }
};

/**
 * Mock Invoices/Billing Service
 */
export const invoicesService = {
  async getAll(params = {}) {
    await delay();
    let result = [...invoices];
    
    if (params.patientId) {
      result = result.filter(i => i.patientId === params.patientId);
    }
    
    if (params.status) {
      result = result.filter(i => i.status === params.status);
    }
    
    return { success: true, data: result };
  },

  async getById(id) {
    await delay();
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return { success: true, data: invoice };
  },

  async create(invoiceData) {
    await delay();
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = invoiceData.tax || subtotal * 0.08;
    const newInvoice = {
      id: generateId(),
      ...invoiceData,
      subtotal,
      tax,
      total: subtotal + tax,
      status: 'Pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    invoices.push(newInvoice);
    return { success: true, data: newInvoice, message: 'Invoice generated successfully' };
  },

  async recordPayment(id, paymentData) {
    await delay();
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    invoices[index].status = 'Paid';
    invoices[index].paymentMethod = paymentData.paymentMethod;
    invoices[index].paidAt = new Date().toISOString();
    return { success: true, data: invoices[index], message: 'Payment recorded successfully' };
  }
};

/**
 * Mock Dashboard Service
 */
export const dashboardService = {
  async getStats() {
    await delay();
    return { success: true, data: dashboardStats };
  },

  async getRevenueChart(period = 'month') {
    await delay();
    // Generate mock revenue data
    const data = [];
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 2000
      });
    }
    
    return { success: true, data };
  },

  async getRecentAppointments(limit = 5) {
    await delay();
    const recent = [...appointments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    return { success: true, data: recent };
  },

  async getNotifications() {
    await delay();
    return { success: true, data: notifications };
  }
};

/**
 * Mock Settings Service
 */
export const settingsService = {
  async updateProfile(profileData) {
    await delay();
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { success: true, data: updatedUser, message: 'Profile updated successfully' };
  },

  async changePassword(passwordData) {
    await delay();
    // In real app, verify current password
    if (passwordData.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }
    return { success: true, message: 'Password changed successfully' };
  },

  async updatePreferences(preferences) {
    await delay();
    localStorage.setItem('preferences', JSON.stringify(preferences));
    return { success: true, message: 'Preferences updated successfully' };
  },

  getPreferences() {
    const prefs = localStorage.getItem('preferences');
    return prefs ? JSON.parse(prefs) : { theme: 'light', emailNotifications: true, smsNotifications: false };
  }
};
