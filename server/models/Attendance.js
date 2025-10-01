const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true,
    default: 'absent'
  },
  checkInTime: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  faceRecognitionUsed: {
    type: Boolean,
    default: false
  },
  faceConfidence: {
    type: Number,
    default: null,
    min: 0,
    max: 1
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  isLocationValid: {
    type: Boolean,
    default: true
  },
  gpsAccuracy: {
    type: Number,
    default: null
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    timestamp: Date
  },
  classSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassSession',
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ location: '2dsphere' });

// Virtual for duration
attendanceSchema.virtual('duration').get(function() {
  if (this.checkInTime && this.checkOutTime) {
    return this.checkOutTime - this.checkInTime;
  }
  return null;
});

// Ensure virtual fields are serialized
attendanceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

