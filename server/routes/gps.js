const express = require('express');
const geolib = require('geolib');
const router = express.Router();

// Classroom location (from environment or default)
const CLASSROOM_LAT = parseFloat(process.env.CLASSROOM_LAT) || 40.7128;
const CLASSROOM_LNG = parseFloat(process.env.CLASSROOM_LNG) || -74.0060;
const GEOFENCE_RADIUS = parseInt(process.env.GEOFENCE_RADIUS) || 100; // meters

// Check if location is within classroom boundaries
router.post('/check-location', (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const classroomLocation = { latitude: CLASSROOM_LAT, longitude: CLASSROOM_LNG };
    const studentLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

    // Calculate distance in meters
    const distance = geolib.getDistance(classroomLocation, studentLocation);

    const isWithinBounds = distance <= GEOFENCE_RADIUS;
    const accuracyMeters = accuracy ? parseFloat(accuracy) : null;

    res.json({
      isWithinBounds,
      distance,
      classroomRadius: GEOFENCE_RADIUS,
      accuracy: accuracyMeters,
      classroomLocation: {
        latitude: CLASSROOM_LAT,
        longitude: CLASSROOM_LNG
      },
      studentLocation: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Location check failed', error: error.message });
  }
});

// Get classroom boundaries
router.get('/classroom-bounds', (req, res) => {
  res.json({
    classroom: {
      latitude: CLASSROOM_LAT,
      longitude: CLASSROOM_LNG,
      radius: GEOFENCE_RADIUS
    }
  });
});

// Update classroom location (admin only)
router.post('/update-classroom', (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;
    
    // In a real application, you'd save this to database
    // For demo purposes, we'll just return success
    
    res.json({
      message: 'Classroom location updated successfully',
      classroom: {
        latitude: parseFloat(latitude) || CLASSROOM_LAT,
        longitude: parseFloat(longitude) || CLASSROOM_LNG,
        radius: parseInt(radius) || GEOFENCE_RADIUS
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update classroom location', error: error.message });
  }
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;


