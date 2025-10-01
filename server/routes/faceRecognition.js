const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/faces';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'face-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Register face
router.post('/register-face', upload.single('faceImage'), async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No face image provided' });
    }

    const user = await User.findById(userId);
    if (!user) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user with face image path
    user.faceImage = req.file.path;
    user.isFaceRegistered = true;
    
    // Generate mock face descriptor (in real implementation, use face-api.js)
    const mockDescriptor = Array.from({ length: 128 }, () => Math.random());
    user.faceDescriptor = mockDescriptor;
    
    await user.save();

    res.json({
      success: true,
      message: 'Face registered successfully',
      faceImage: req.file.path
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Face registration failed', error: error.message });
  }
});

// Verify face for attendance
router.post('/verify-face', upload.single('faceImage'), async (req, res) => {
  try {
    const { userId, classSessionId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No face image provided' });
    }

    const user = await User.findById(userId);
    if (!user || !user.isFaceRegistered) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'User face not registered' });
    }

    // Mock face verification (in real implementation, compare descriptors)
    const mockConfidence = 0.85 + Math.random() * 0.1; // 85-95% confidence
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    if (mockConfidence > 0.8) {
      res.json({
        success: true,
        confidence: mockConfidence,
        message: 'Face verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        confidence: mockConfidence,
        message: 'Face verification failed - low confidence'
      });
    }
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Face verification failed', error: error.message });
  }
});

// Get face registration status
router.get('/status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      isFaceRegistered: user.isFaceRegistered,
      hasFaceImage: !!user.faceImage,
      faceImage: user.faceImage
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get face status', error: error.message });
  }
});

module.exports = router;


