const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { isDemoMode, getDemoUsers, getDemoUser } = require('../demo-data');
const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    
    // Demo mode
    if (isDemoMode()) {
      let users = getDemoUsers(role);
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter(user => 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.studentId && user.studentId.toLowerCase().includes(searchLower))
        );
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = users.slice(startIndex, endIndex);
      
      return res.json({
        users: paginatedUsers,
        totalPages: Math.ceil(users.length / limit),
        currentPage: parseInt(page),
        total: users.length
      });
    }

    // Production mode
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role = 'student', studentId, department, year, section } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        ...(studentId ? [{ studentId }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or student ID already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      studentId,
      department,
      year,
      section
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toJSON(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role, studentId, department, year, section, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (studentId !== undefined) user.studentId = studentId;
    if (department) user.department = department;
    if (year) user.year = year;
    if (section) user.section = section;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: { ...user.toJSON(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// Get students statistics
router.get('/stats/students', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const faceRegisteredStudents = await User.countDocuments({ 
      role: 'student', 
      isFaceRegistered: true 
    });

    const studentsByDepartment = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const studentsByYear = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      total: totalStudents,
      active: activeStudents,
      faceRegistered: faceRegisteredStudents,
      byDepartment: studentsByDepartment,
      byYear: studentsByYear
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get student statistics', error: error.message });
  }
});

module.exports = router;


