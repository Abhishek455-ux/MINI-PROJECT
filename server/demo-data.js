// Demo data for testing without MongoDB
const mongoose = require('mongoose');
const demoUsers = [
  {
    _id: 'demo-user-1',
    name: 'John Doe',
    email: 'john@student.edu',
    studentId: 'STU001',
    role: 'student',
    department: 'Computer Science',
    year: '2024',
    isFaceRegistered: true,
    isActive: true
  },
  {
    _id: 'demo-user-2',
    name: 'Jane Smith',
    email: 'jane@student.edu',
    studentId: 'STU002',
    role: 'student',
    department: 'Mathematics',
    year: '2024',
    isFaceRegistered: true,
    isActive: true
  },
  {
    _id: 'demo-user-3',
    name: 'Admin User',
    email: 'admin@school.edu',
    role: 'admin',
    isActive: true
  }
];

const demoAttendance = [
  {
    _id: 'att-1',
    student: 'demo-user-1',
    date: new Date(),
    status: 'present',
    checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    faceRecognitionUsed: true,
    faceConfidence: 0.92,
    location: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128]
    },
    isLocationValid: true
  },
  {
    _id: 'att-2',
    student: 'demo-user-2',
    date: new Date(),
    status: 'late',
    checkInTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    faceRecognitionUsed: true,
    faceConfidence: 0.88,
    location: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128]
    },
    isLocationValid: true
  }
];

const demoStats = {
  today: {
    present: 15,
    absent: 3,
    late: 2,
    excused: 1
  },
  weeklyTrend: [12, 15, 18, 14, 16, 15, 20],
  totalStudents: 25
};

// Helper functions for demo mode
const isDemoMode = () => {
  return !mongoose.connection.readyState || mongoose.connection.readyState !== 1;
};

const getDemoUser = (id) => {
  return demoUsers.find(user => user._id === id || user.email === id);
};

const getDemoUsers = (role = null) => {
  if (role) {
    return demoUsers.filter(user => user.role === role);
  }
  return demoUsers;
};

const getDemoAttendance = (studentId = null) => {
  if (studentId) {
    return demoAttendance.filter(att => att.student === studentId);
  }
  return demoAttendance;
};

const getDemoStats = () => {
  return demoStats;
};

module.exports = {
  isDemoMode,
  getDemoUser,
  getDemoUsers,
  getDemoAttendance,
  getDemoStats,
  demoUsers,
  demoAttendance,
  demoStats
};

