const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/', express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/landing.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});

// API Routes
app.get('/api/auth/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Demo login logic
    if (email === 'admin@school.edu' && password === 'admin123') {
        res.json({
            message: 'Login successful (Demo Mode)',
            token: 'demo-token-admin',
            user: {
                _id: 'demo-admin-1',
                name: 'Admin User',
                email: 'admin@school.edu',
                role: 'admin'
            }
        });
    } else if (email === 'john@student.edu' && password === 'demo123') {
        res.json({
            message: 'Login successful (Demo Mode)',
            token: 'demo-token-student',
            user: {
                _id: 'demo-student-1',
                name: 'John Doe',
                email: 'john@student.edu',
                role: 'student',
                studentId: 'STU001',
                department: 'Computer Science'
            }
        });
    } else {
        res.status(400).json({ 
            message: 'Invalid credentials. Demo credentials: admin@school.edu/admin123 or john@student.edu/demo123' 
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, role, studentId, department, year, section, adminId, institution, position, phone } = req.body;
    
    // Validate required fields based on role
    if (role === 'student') {
        if (!studentId || !department || !year || !section) {
            return res.status(400).json({
                message: 'Please fill in all student fields (Student ID, Department, Year, Section)'
            });
        }
    } else if (role === 'admin') {
        if (!adminId || !institution || !position) {
            return res.status(400).json({
                message: 'Please fill in all admin fields (Admin ID, Institution, Position)'
            });
        }
    }
    
    // Create user object based on role
    let userData = {
        _id: 'demo-user-' + Date.now(),
        name,
        email,
        role: role || 'student',
        phone: phone || ''
    };
    
    if (role === 'student') {
        userData.studentId = studentId;
        userData.department = department;
        userData.year = year;
        userData.section = section;
    } else if (role === 'admin') {
        userData.adminId = adminId;
        userData.institution = institution;
        userData.position = position;
    }
    
    res.json({
        message: 'User registered successfully (Demo Mode)',
        token: 'demo-token-' + (role || 'student'),
        user: userData
    });
});

app.get('/api/attendance/summary', (req, res) => {
    res.json({
        today: {
            present: 15,
            absent: 3,
            late: 2,
            excused: 1
        },
        weeklyTrend: [12, 15, 18, 14, 16, 15, 20],
        totalStudents: 25
    });
});

app.post('/api/gps/check-location', (req, res) => {
    res.json({
        isWithinBounds: true,
        distance: 15,
        accuracy: 10
    });
});

app.get('/api/users', (req, res) => {
    res.json([
        {
            _id: 'demo-user-1',
            name: 'John Doe',
            email: 'john@student.edu',
            role: 'student',
            studentId: 'STU001'
        },
        {
            _id: 'demo-user-2',
            name: 'Jane Smith',
            email: 'jane@student.edu',
            role: 'student',
            studentId: 'STU002'
        }
    ]);
});

app.get('/api/gps/classroom-bounds', (req, res) => {
    res.json({
        classroom: {
            latitude: 40.7128,
            longitude: -74.0060,
            radius: 100
        }
    });
});

app.post('/api/gps/check-location', (req, res) => {
    const { latitude, longitude, accuracy } = req.body;
    
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Mock classroom location (New York City)
    const classroomLat = 40.7128;
    const classroomLng = -74.0060;
    const radius = 100; // meters
    
    // Calculate distance (simplified calculation)
    const latDiff = (parseFloat(latitude) - classroomLat) * 111320; // meters per degree
    const lngDiff = (parseFloat(longitude) - classroomLng) * 111320 * Math.cos(classroomLat * Math.PI / 180);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
    const isWithinBounds = distance <= radius;
    
    res.json({
        isWithinBounds,
        distance: Math.round(distance),
        classroomRadius: radius,
        accuracy: accuracy ? parseFloat(accuracy) : null,
        classroomLocation: {
            latitude: classroomLat,
            longitude: classroomLng
        },
        studentLocation: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Smart Attendance Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view the application`);
    console.log(`🔧 Demo Mode - No database required`);
});
