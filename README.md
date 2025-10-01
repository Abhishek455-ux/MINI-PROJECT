# Smart Attendance System

A comprehensive web-based attendance management system with face recognition, GPS tracking, and real-time notifications.

## Features

### 🎯 Core Features
- **Face Recognition**: Register and verify student faces for attendance
- **GPS Tracking**: Geofencing to ensure students are within classroom boundaries
- **Real-time Notifications**: Instant alerts for attendance updates and GPS violations
- **Dual Interface**: Separate dashboards for administrators and students
- **Database Integration**: MongoDB for storing user data, attendance records, and GPS coordinates

### 👨‍💼 Admin Features
- Dashboard with attendance overview and statistics
- User management (create, update, delete students)
- Attendance history and reports
- GPS boundary configuration
- Real-time monitoring of attendance

### 👨‍🎓 Student Features
- Face registration for attendance verification
- GPS-based attendance marking
- Personal attendance statistics
- Recent attendance history
- Profile management

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Multer** for file uploads
- **Geolib** for GPS calculations

### Frontend
- **HTML5** with modern CSS3
- **JavaScript ES6+** for interactivity
- **WebRTC** for camera access
- **Geolocation API** for GPS tracking
- Responsive design for mobile and desktop

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Modern web browser with camera support

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-attendance-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart_attendance
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # GPS Configuration
   CLASSROOM_LAT=40.7128
   CLASSROOM_LNG=-74.0060
   GEOFENCE_RADIUS=100
   
   # Admin Configuration
   ADMIN_EMAIL=admin@school.edu
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Admin Dashboard: http://localhost:5000/
   - Student Portal: http://localhost:5000/student.html
   - API Documentation: http://localhost:5000/api/

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### User Management
- `GET /api/users` - Get all users (admin)
- `POST /api/users` - Create new user (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/students` - Get student statistics

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/summary` - Get attendance summary
- `GET /api/attendance/history` - Get attendance history
- `GET /api/attendance/student/:id` - Get student attendance

### Face Recognition
- `POST /api/face-recognition/register-face` - Register face
- `POST /api/face-recognition/verify-face` - Verify face
- `GET /api/face-recognition/status/:userId` - Get face registration status

### GPS Tracking
- `POST /api/gps/check-location` - Check if location is within bounds
- `GET /api/gps/classroom-bounds` - Get classroom boundaries
- `POST /api/gps/update-classroom` - Update classroom location (admin)

## Usage Guide

### For Administrators

1. **Access Admin Dashboard**
   - Navigate to http://localhost:5000/
   - Use demo login buttons or create admin account

2. **Manage Students**
   - View student list and statistics
   - Add new students with face registration
   - Monitor attendance in real-time

3. **Configure System**
   - Set classroom GPS boundaries
   - Manage class sessions
   - View attendance reports

### For Students

1. **Access Student Portal**
   - Navigate to http://localhost:5000/student.html
   - Login with student credentials

2. **Register Face**
   - Allow camera access
   - Capture clear face photo
   - Submit for registration

3. **Mark Attendance**
   - Select class session
   - Ensure GPS location is within classroom bounds
   - Capture face photo for verification
   - Submit attendance

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin resource sharing protection
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file upload with type validation

## GPS Configuration

The system uses geofencing to ensure students are within classroom boundaries:

1. **Set Classroom Location**: Configure latitude and longitude in `.env`
2. **Set Geofence Radius**: Define acceptable distance in meters
3. **Real-time Verification**: System checks location before accepting attendance

## Face Recognition

The system includes mock face recognition capabilities:

1. **Face Registration**: Students register their face photos
2. **Face Verification**: System verifies face during attendance marking
3. **Confidence Scoring**: Face verification includes confidence scores

*Note: This implementation uses mock face recognition. For production use, integrate with actual face recognition services like AWS Rekognition, Azure Face API, or Google Cloud Vision.*

## Development

### Project Structure
```
smart-attendance-system/
├── server/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── public/              # Static frontend files
├── uploads/             # File uploads
├── package.json
├── .env.example
└── README.md
```

### Adding New Features

1. **Backend**: Add routes in `server/routes/`
2. **Frontend**: Update HTML files in `public/`
3. **Database**: Modify models in `server/models/`

## Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart_attendance
   ```

2. **Build and Start**
   ```bash
   npm install --production
   npm start
   ```

3. **Process Management**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server/index.js --name smart-attendance
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact: admin@school.edu

## Roadmap

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with school management systems
- [ ] Multi-language support
- [ ] Advanced face recognition with liveness detection
- [ ] Biometric authentication
- [ ] Automated attendance reports
- [ ] Parent/guardian notifications

---

**Smart Attendance System** - Making attendance management smarter, more secure, and more efficient.
#   M i n i p r o j e c t  
 