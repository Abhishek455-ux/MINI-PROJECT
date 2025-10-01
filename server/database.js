const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbPath = path.join(__dirname, 'attendance.db');
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('✅ SQLite database connected successfully');
                this.createTables();
            }
        });
    }

    createTables() {
        // Users table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                role TEXT NOT NULL CHECK(role IN ('student', 'admin', 'employee')),
                student_id TEXT,
                department TEXT,
                year TEXT,
                section TEXT,
                admin_id TEXT,
                institution TEXT,
                position TEXT,
                employee_id TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Attendance table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                class_session_id INTEGER,
                check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                check_out_time DATETIME,
                status TEXT DEFAULT 'present' CHECK(status IN ('present', 'late', 'absent')),
                location_lat REAL,
                location_lng REAL,
                location_address TEXT,
                face_verified BOOLEAN DEFAULT 0,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        // Class sessions table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS class_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                location TEXT,
                instructor_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (instructor_id) REFERENCES users (id)
            )
        `);

        // User sessions table for login management
        this.db.run(`
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        console.log('✅ Database tables created successfully');
    }

    // User operations
    async createUser(userData) {
        return new Promise((resolve, reject) => {
            const {
                name, email, password, phone, role,
                student_id, department, year, section,
                admin_id, institution, position, employee_id
            } = userData;

            // Hash password
            const hashedPassword = bcrypt.hashSync(password, 10);

            const sql = `
                INSERT INTO users (
                    name, email, password, phone, role,
                    student_id, department, year, section,
                    admin_id, institution, position, employee_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.run(sql, [
                name, email, hashedPassword, phone, role,
                student_id, department, year, section,
                admin_id, institution, position, employee_id
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...userData });
                }
            });
        });
    }

    async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            this.db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async updateUser(id, userData) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            Object.keys(userData).forEach(key => {
                if (userData[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(userData[key]);
                }
            });

            if (fields.length === 0) {
                resolve({ id, ...userData });
                return;
            }

            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.push(id);

            const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
            
            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, ...userData });
                }
            });
        });
    }

    // Session management
    async createSession(userId, token, expiresAt) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)';
            this.db.run(sql, [userId, token, expiresAt], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, userId, token, expiresAt });
                }
            });
        });
    }

    async getSessionByToken(token) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, u.* FROM user_sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.token = ? AND s.expires_at > datetime('now')
            `;
            this.db.get(sql, [token], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async deleteSession(token) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM user_sessions WHERE token = ?';
            this.db.run(sql, [token], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    async cleanupExpiredSessions() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM user_sessions WHERE expires_at <= datetime("now")';
            this.db.run(sql, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ deleted: this.changes });
                }
            });
        });
    }

    // Attendance operations
    async createAttendance(attendanceData) {
        return new Promise((resolve, reject) => {
            const {
                user_id, class_session_id, check_in_time, check_out_time,
                status, location_lat, location_lng, location_address,
                face_verified, notes
            } = attendanceData;

            const sql = `
                INSERT INTO attendance (
                    user_id, class_session_id, check_in_time, check_out_time,
                    status, location_lat, location_lng, location_address,
                    face_verified, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.run(sql, [
                user_id, class_session_id, check_in_time, check_out_time,
                status, location_lat, location_lng, location_address,
                face_verified, notes
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...attendanceData });
                }
            });
        });
    }

    async getAttendanceByUserId(userId, limit = 50) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT a.*, cs.name as session_name, cs.start_time, cs.end_time
                FROM attendance a
                LEFT JOIN class_sessions cs ON a.class_session_id = cs.id
                WHERE a.user_id = ?
                ORDER BY a.created_at DESC
                LIMIT ?
            `;
            this.db.all(sql, [userId, limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Class session operations
    async createClassSession(sessionData) {
        return new Promise((resolve, reject) => {
            const { name, description, start_time, end_time, location, instructor_id } = sessionData;
            
            const sql = `
                INSERT INTO class_sessions (name, description, start_time, end_time, location, instructor_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            this.db.run(sql, [name, description, start_time, end_time, location, instructor_id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...sessionData });
                }
            });
        });
    }

    async getClassSessions() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT cs.*, u.name as instructor_name
                FROM class_sessions cs
                LEFT JOIN users u ON cs.instructor_id = u.id
                ORDER BY cs.start_time DESC
            `;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Statistics
    async getStats() {
        return new Promise((resolve, reject) => {
            const stats = {};
            
            // Get user counts
            this.db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                stats.totalUsers = row.total;
                
                // Get attendance counts
                this.db.get('SELECT COUNT(*) as total FROM attendance', (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    stats.totalAttendance = row.total;
                    
                    // Get today's attendance
                    this.db.get(`
                        SELECT COUNT(*) as total FROM attendance 
                        WHERE date(created_at) = date('now')
                    `, (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats.todayAttendance = row.total;
                        
                        // Get active sessions
                        this.db.get(`
                            SELECT COUNT(*) as total FROM class_sessions 
                            WHERE datetime('now') BETWEEN start_time AND end_time
                        `, (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            stats.activeSessions = row.total;
                            
                            resolve(stats);
                        });
                    });
                });
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
}

module.exports = Database;
