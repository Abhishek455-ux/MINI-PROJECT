const mongoose = require('mongoose');

const classSessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  classroom: {
    name: String,
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
    radius: {
      type: Number,
      default: 100 // meters
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attendanceRequired: {
    type: Boolean,
    default: true
  },
  faceRecognitionRequired: {
    type: Boolean,
    default: true
  },
  gpsTrackingRequired: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: null
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: null
    },
    daysOfWeek: [{
      type: Number, // 0-6 (Sunday-Saturday)
      min: 0,
      max: 6
    }]
  }
}, {
  timestamps: true
});

// Index for efficient queries
classSessionSchema.index({ startTime: 1, endTime: 1 });
classSessionSchema.index({ teacher: 1, isActive: 1 });
classSessionSchema.index({ students: 1 });
classSessionSchema.index({ classroom: '2dsphere' });

// Virtual for duration
classSessionSchema.virtual('duration').get(function() {
  return this.endTime - this.startTime;
});

// Virtual for current status
classSessionSchema.virtual('status').get(function() {
  const now = new Date();
  if (now < this.startTime) return 'upcoming';
  if (now >= this.startTime && now <= this.endTime) return 'active';
  return 'completed';
});

// Ensure virtual fields are serialized
classSessionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ClassSession', classSessionSchema);