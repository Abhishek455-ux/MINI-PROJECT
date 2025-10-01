// Enhanced Header Component for Quick Mark System
class QuickMarkHeader {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path.includes('/admin')) return 'admin';
        if (path.includes('student.html')) return 'student';
        if (path.includes('login.html')) return 'login';
        if (path.includes('register.html')) return 'register';
        if (path.includes('about.html')) return 'about';
        if (path.includes('clients.html')) return 'clients';
        if (path.includes('careers.html')) return 'careers';
        if (path.includes('payroll.html')) return 'payroll';
        if (path.includes('employee.html')) return 'employee';
        return 'landing';
    }

    init() {
        this.createHeader();
        this.addEventListeners();
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'quick-mark-header';
        header.innerHTML = `
            <div class="header-container">
                <div class="header-brand">
                    <a href="landing.html" class="header-logo">
                        <div class="logo-icon">QM</div>
                        <span class="logo-text">Quick Mark</span>
                    </a>
                </div>
                
                <nav class="header-nav">
                    <a href="landing.html" class="nav-link ${this.currentPage === 'landing' ? 'active' : ''}">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="about.html" class="nav-link ${this.currentPage === 'about' ? 'active' : ''}">
                        <i class="fas fa-info-circle"></i>
                        <span>About</span>
                    </a>
                    <a href="clients.html" class="nav-link ${this.currentPage === 'clients' ? 'active' : ''}">
                        <i class="fas fa-building"></i>
                        <span>Clients</span>
                    </a>
                    <a href="careers.html" class="nav-link ${this.currentPage === 'careers' ? 'active' : ''}">
                        <i class="fas fa-briefcase"></i>
                        <span>Careers</span>
                    </a>
                    ${this.getFeatureLinks()}
                    ${this.getRoleSpecificLinks()}
                    <button class="nav-link mobile-menu-toggle" onclick="this.closest('.header-nav').classList.toggle('mobile-open')">
                        <i class="fas fa-bars"></i>
                        <span>Menu</span>
                    </button>
                </nav>
                
                <div class="header-actions">
                    ${this.getServerStatus()}
                    ${this.getUserInfo()}
                    ${this.getActionButtons()}
                </div>
            </div>
        `;

        // Insert header at the beginning of body
        document.body.insertBefore(header, document.body.firstChild);
    }

    getFeatureLinks() {
        return `
            <div class="nav-dropdown">
                <a href="#" class="nav-link dropdown-trigger">
                    <i class="fas fa-cog"></i>
                    <span>Features</span>
                    <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="student.html" class="dropdown-item">
                        <i class="fas fa-camera"></i>
                        <div>
                            <strong>Face Recognition</strong>
                            <span>AI-powered attendance</span>
                        </div>
                    </a>
                    <a href="student.html" class="dropdown-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>GPS Tracking</strong>
                            <span>Location verification</span>
                        </div>
                    </a>
                    <a href="index.html" class="dropdown-item">
                        <i class="fas fa-chart-line"></i>
                        <div>
                            <strong>Analytics</strong>
                            <span>Real-time reports</span>
                        </div>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-mobile-alt"></i>
                        <div>
                            <strong>Mobile App</strong>
                            <span>Coming soon</span>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }

    getRoleSpecificLinks() {
        if (this.currentPage === 'admin') {
            return `
                <a href="index.html" class="nav-link active">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="payroll.html" class="nav-link">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Payroll</span>
                </a>
                <a href="#" class="nav-link" onclick="exportAttendanceData()">
                    <i class="fas fa-download"></i>
                    <span>Export</span>
                </a>
                <a href="#" class="nav-link" onclick="openSettings()">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
            `;
        } else if (this.currentPage === 'student') {
            return `
                <a href="student.html" class="nav-link active">
                    <i class="fas fa-user-graduate"></i>
                    <span>Student Portal</span>
                </a>
                <a href="#" class="nav-link" onclick="viewAttendanceHistory()">
                    <i class="fas fa-history"></i>
                    <span>History</span>
                </a>
                <a href="#" class="nav-link" onclick="showProfile()">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </a>
            `;
        } else if (this.currentPage === 'employee') {
            return `
                <a href="employee.html" class="nav-link active">
                    <i class="fas fa-users"></i>
                    <span>Employee Portal</span>
                </a>
                <a href="payroll.html" class="nav-link">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Payroll</span>
                </a>
                <a href="#" class="nav-link" onclick="viewAttendanceHistory()">
                    <i class="fas fa-history"></i>
                    <span>History</span>
                </a>
            `;
        }
        return '';
    }

    getServerStatus() {
        return `
            <div class="server-status" id="serverStatus">
                <i class="fas fa-circle status-indicator"></i>
                <span class="status-text">Checking...</span>
            </div>
        `;
    }

    getUserInfo() {
        const user = this.getUser();
        if (user) {
            return `
                <div class="user-info">
                    <div class="user-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="user-details">
                        <div class="user-name">${user.name}</div>
                        <div class="user-role">${user.role.toUpperCase()}</div>
                    </div>
                </div>
            `;
        }
        return '';
    }

    getActionButtons() {
        const user = this.getUser();
        if (user) {
            return `
                <div class="action-buttons">
                    <button class="btn btn-outline" onclick="showNotifications()">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                    <button class="btn btn-outline" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="action-buttons">
                    <a href="login.html" class="btn btn-outline">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Login</span>
                    </a>
                    <a href="register.html" class="btn btn-primary">
                        <i class="fas fa-user-plus"></i>
                        <span>Register</span>
                    </a>
                </div>
            `;
        }
    }

    getUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    }

    addEventListeners() {
        // Add scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.quick-mark-header');
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Add dropdown functionality
        this.addDropdownHandlers();
        
        // Check server status
        this.checkServerStatus();
        
        // Add notification handlers
        this.addNotificationHandlers();
    }

    addDropdownHandlers() {
        document.addEventListener('click', (e) => {
            const dropdown = e.target.closest('.nav-dropdown');
            if (dropdown) {
                const trigger = dropdown.querySelector('.dropdown-trigger');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (e.target.closest('.dropdown-trigger')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            } else {
                // Close all dropdowns when clicking outside
                document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
            }
        });
    }

    async checkServerStatus() {
        const statusEl = document.getElementById('serverStatus');
        if (!statusEl) return;

        try {
            const response = await fetch('/api/auth/health');
            if (response.ok) {
                statusEl.innerHTML = `
                    <i class="fas fa-circle status-indicator online"></i>
                    <span class="status-text">Online</span>
                `;
            } else {
                throw new Error('Server offline');
            }
        } catch (error) {
            statusEl.innerHTML = `
                <i class="fas fa-circle status-indicator offline"></i>
                <span class="status-text">Offline</span>
            `;
        }
    }

    addNotificationHandlers() {
        // Simulate real-time notifications
        setInterval(() => {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                const count = Math.floor(Math.random() * 5);
                badge.textContent = count > 0 ? count : '';
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        }, 30000); // Update every 30 seconds
    }
}

// Enhanced global functions
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'landing.html';
    }, 1000);
}

function exportAttendanceData() {
    showNotification('Preparing attendance export...', 'info');
    // Simulate export
    setTimeout(() => {
        const data = 'Student Name,Date,Status,Time\nJohn Doe,2025-01-01,Present,08:30\nJane Smith,2025-01-01,Late,08:35';
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'attendance_report.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showNotification('Attendance data exported successfully!', 'success');
    }, 2000);
}

function openSettings() {
    showModal('Settings', `
        <div class="settings-form">
            <div class="form-group">
                <label>Classroom Radius (meters)</label>
                <input type="number" value="100" min="10" max="500">
            </div>
            <div class="form-group">
                <label>Auto-mark Late After (minutes)</label>
                <input type="number" value="15" min="1" max="60">
            </div>
            <div class="form-group">
                <label>Enable Face Recognition</label>
                <input type="checkbox" checked>
            </div>
            <div class="form-group">
                <label>Enable GPS Tracking</label>
                <input type="checkbox" checked>
            </div>
        </div>
    `);
}

function viewAttendanceHistory() {
    showModal('Attendance History', `
        <div class="attendance-history">
            <div class="history-item">
                <span class="date">Today</span>
                <span class="subject">Math 101</span>
                <span class="status present">Present</span>
                <span class="time">08:30 AM</span>
            </div>
            <div class="history-item">
                <span class="date">Yesterday</span>
                <span class="subject">Physics 201</span>
                <span class="status late">Late</span>
                <span class="time">08:35 AM</span>
            </div>
            <div class="history-item">
                <span class="date">2 days ago</span>
                <span class="subject">Chemistry</span>
                <span class="status absent">Absent</span>
                <span class="time">-</span>
            </div>
        </div>
    `);
}

function showProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    showModal('Profile', `
        <div class="profile-form">
            <div class="profile-avatar">
                <img src="https://via.placeholder.com/100" alt="Profile">
                <button class="btn btn-sm">Change Photo</button>
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" value="${user.name || 'John Doe'}">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" value="${user.email || 'john@student.edu'}">
            </div>
            <div class="form-group">
                <label>Student ID</label>
                <input type="text" value="${user.studentId || 'STU001'}">
            </div>
            <div class="form-group">
                <label>Department</label>
                <input type="text" value="${user.department || 'Computer Science'}">
            </div>
        </div>
    `);
}

function showNotifications() {
    showModal('Notifications', `
        <div class="notifications-list">
            <div class="notification-item unread">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Attendance Marked</strong>
                    <p>Your attendance for Math 101 has been recorded.</p>
                    <span class="time">2 minutes ago</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>Low Attendance Warning</strong>
                    <p>Your attendance is below 75% for Physics 201.</p>
                    <span class="time">1 hour ago</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-calendar"></i>
                <div>
                    <strong>New Class Schedule</strong>
                    <p>Chemistry lab has been moved to Room 205.</p>
                    <span class="time">1 day ago</span>
                </div>
            </div>
        </div>
    `);
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Save</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuickMarkHeader();
});
