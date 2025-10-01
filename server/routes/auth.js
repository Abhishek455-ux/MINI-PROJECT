const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('../database');
const { isDemoMode, getDemoUser } = require('../demo-data');
const router = express.Router();

// Initialize database
const db = new Database();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { 
      name, email, password, phone, role = 'student',
      student_id, department, year, section,
      admin_id, institution, position, employee_id
    } = req.body;
    
    // Demo mode - simulate registration
    if (isDemoMode()) {
      const demoUser = {
        id: `demo-user-${Date.now()}`,
        name,
        email,
        student_id,
        role,
        department,
        year,
        section,
        phone,
        created_at: new Date()
      };
      
      const token = jwt.sign(
        { userId: demoUser.id, role: demoUser.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return res.status(201).json({
        message: 'User registered successfully (Demo Mode)',
        token,
        user: { ...demoUser, password: undefined }
      });
    }

    // Production mode - use database
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      phone,
      role,
      student_id,
      department,
      year,
      section,
      admin_id,
      institution,
      position,
      employee_id
    };

    const user = await db.createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.createSession(user.id, token, expiresAt);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { ...user, password: undefined }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo mode - use demo credentials
    if (isDemoMode()) {
      const demoUser = getDemoUser(email);
      if (demoUser && (password === 'demo123' || email === 'admin@school.edu' && password === 'admin123')) {
        const token = jwt.sign(
          { userId: demoUser.id, role: demoUser.role },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        return res.json({
          message: 'Login successful (Demo Mode)',
          token,
          user: { ...demoUser, password: undefined }
        });
      }
      return res.status(400).json({ 
        message: 'Invalid credentials. Demo credentials: admin@school.edu/admin123 or any@email.com/demo123' 
      });
    }

    // Production mode - use database
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await db.updateUser(user.id, { updated_at: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.createSession(user.id, token, expiresAt);

    res.json({
      message: 'Login successful',
      token,
      user: { ...user, password: undefined }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Check if token is valid in database
    const session = await db.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user data
    const user = await db.getUserById(session.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: { ...user, password: undefined } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Delete session from database
    await db.deleteSession(token);

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Check if token is valid in database
    const session = await db.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { name, phone, department, year, section, institution, position } = req.body;
    
    // Update user data
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (department) updateData.department = department;
    if (year) updateData.year = year;
    if (section) updateData.section = section;
    if (institution) updateData.institution = institution;
    if (position) updateData.position = position;

    const updatedUser = await db.updateUser(session.user_id, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: { ...updatedUser, password: undefined }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Profile update failed', error: error.message });
  }
});

// Health
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = router;