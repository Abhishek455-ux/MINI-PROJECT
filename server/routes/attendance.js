const express = require('express');
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { isDemoMode, getDemoStats, getDemoUsers } = require('../demo-data');
const router = express.Router();

// Mark attendance
router.post('/mark', async (req, res) => {
  try {
    const { 
      studentId, 
      status = 'present', 
      latitude, 
      longitude, 
      accuracy,
      faceConfidence,
      classSessionId 
    } = req.body;

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create attendance record
    const attendance = new Attendance({
      student: studentId,
      status,
      checkInTime: status === 'present' || status === 'late' ? new Date() : null,
      faceRecognitionUsed: !!faceConfidence,
      faceConfidence,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
      },
      isLocationValid: true,
      gpsAccuracy: accuracy,
      classSession: classSessionId,
      deviceInfo: {
        userAgent: req.get('User-Agent'),
        platform: req.get('Platform') || 'unknown',
        timestamp: new Date()
      }
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: {
        id: attendance._id,
        status: attendance.status,
        time: attendance.checkInTime,
        location: attendance.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
});

// Get attendance summary
router.get('/summary', async (req, res) => {
  try {
    // Demo mode
    if (isDemoMode()) {
      const demoStats = getDemoStats();
      return res.json(demoStats);
    }

    // Production mode
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    });

    const summary = {
      present: todayAttendance.filter(a => a.status === 'present').length,
      absent: todayAttendance.filter(a => a.status === 'absent').length,
      late: todayAttendance.filter(a => a.status === 'late').length,
      excused: todayAttendance.filter(a => a.status === 'excused').length
    };

    // Get weekly trend (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyAttendance = await Attendance.find({
      date: { $gte: weekAgo, $lt: tomorrow }
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAttendance = weeklyAttendance.filter(a => 
        a.date >= dayStart && a.date <= dayEnd
      );
      
      weeklyTrend.push(dayAttendance.filter(a => a.status === 'present').length);
    }

    res.json({
      today: summary,
      weeklyTrend,
      totalStudents: await User.countDocuments({ role: 'student' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get attendance summary', error: error.message });
  }
});

// Get attendance history
router.get('/history', async (req, res) => {
  try {
    const { studentId, startDate, endDate, limit = 50 } = req.query;

    let query = {};
    
    if (studentId) {
      query.student = studentId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email studentId')
      .populate('classSession', 'name subject')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get attendance history', error: error.message });
  }
});

// Get student's attendance
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const attendance = await Attendance.find({
      student: studentId,
      date: { $gte: startDate }
    })
    .populate('classSession', 'name subject')
    .sort({ date: -1 });

    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      excused: attendance.filter(a => a.status === 'excused').length
    };

    const attendanceRate = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

    res.json({
      student: studentId,
      attendance,
      stats: {
        ...stats,
        attendanceRate: Math.round(attendanceRate * 100) / 100
      },
      period: `${days} days`
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get student attendance', error: error.message });
  }
});

module.exports = router;


