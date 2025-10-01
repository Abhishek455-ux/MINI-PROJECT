// Enhanced Profile Component for Quick Mark System
class QuickMarkProfile {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.createProfileDropdown();
        this.setupEventListeners();
    }

    loadUserData() {
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            this.user = JSON.parse(userData);
        }
    }

    createProfileDropdown() {
        // Find the header to add profile dropdown
        const header = document.querySelector('.quick-mark-header');
        if (!header) return;

        // Check if profile dropdown already exists
        if (document.querySelector('.profile-dropdown')) return;

        // Create profile section
        const profileSection = document.createElement('div');
        profileSection.className = 'profile-section';
        profileSection.innerHTML = `
            <div class="profile-trigger" id="profileTrigger">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <span class="profile-name" id="profileName">${this.user ? this.user.name : 'Guest'}</span>
                <i class="fas fa-chevron-down profile-arrow"></i>
            </div>
            <div class="profile-dropdown" id="profileDropdown">
                <div class="profile-info">
                    <div class="profile-avatar-large">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="profile-details">
                        <h4 class="profile-full-name">${this.user ? this.user.name : 'Guest User'}</h4>
                        <p class="profile-email">${this.user ? this.user.email : 'guest@example.com'}</p>
                        <span class="profile-role">${this.user ? this.user.role : 'guest'}</span>
                    </div>
                </div>
                <div class="profile-menu">
                    <a href="#" class="profile-menu-item" id="viewProfile">
                        <i class="fas fa-user-circle"></i>
                        <span>View Profile</span>
                    </a>
                    <a href="#" class="profile-menu-item" id="editProfile">
                        <i class="fas fa-edit"></i>
                        <span>Edit Profile</span>
                    </a>
                    <a href="#" class="profile-menu-item" id="attendanceHistory">
                        <i class="fas fa-history"></i>
                        <span>Attendance History</span>
                    </a>
                    <a href="#" class="profile-menu-item" id="settings">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                    <div class="profile-menu-divider"></div>
                    <a href="#" class="profile-menu-item logout" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>
        `;

        // Add to header
        const nav = header.querySelector('.nav-links');
        if (nav) {
            nav.appendChild(profileSection);
        }
    }

    setupEventListeners() {
        // Profile dropdown toggle
        const profileTrigger = document.getElementById('profileTrigger');
        const profileDropdown = document.getElementById('profileDropdown');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        // Profile menu actions
        this.setupProfileMenuActions();
    }

    setupProfileMenuActions() {
        // View Profile
        const viewProfile = document.getElementById('viewProfile');
        if (viewProfile) {
            viewProfile.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfileModal();
            });
        }

        // Edit Profile
        const editProfile = document.getElementById('editProfile');
        if (editProfile) {
            editProfile.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEditProfileModal();
            });
        }

        // Attendance History
        const attendanceHistory = document.getElementById('attendanceHistory');
        if (attendanceHistory) {
            attendanceHistory.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAttendanceHistory();
            });
        }

        // Settings
        const settings = document.getElementById('settings');
        if (settings) {
            settings.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSettings();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    showProfileModal() {
        if (!this.user) {
            alert('Please login to view your profile');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content profile-modal">
                <div class="modal-header">
                    <h3>User Profile</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="profile-display">
                        <div class="profile-avatar-section">
                            <div class="profile-avatar-large">
                                <i class="fas fa-user"></i>
                            </div>
                            <button class="change-avatar-btn">Change Avatar</button>
                        </div>
                        <div class="profile-info-section">
                            <div class="info-group">
                                <label>Full Name</label>
                                <p>${this.user.name || 'Not provided'}</p>
                            </div>
                            <div class="info-group">
                                <label>Email</label>
                                <p>${this.user.email || 'Not provided'}</p>
                            </div>
                            <div class="info-group">
                                <label>Phone</label>
                                <p>${this.user.phone || 'Not provided'}</p>
                            </div>
                            <div class="info-group">
                                <label>Role</label>
                                <p class="role-badge ${this.user.role}">${this.user.role || 'Not specified'}</p>
                            </div>
                            ${this.user.student_id ? `
                                <div class="info-group">
                                    <label>Student ID</label>
                                    <p>${this.user.student_id}</p>
                                </div>
                            ` : ''}
                            ${this.user.department ? `
                                <div class="info-group">
                                    <label>Department</label>
                                    <p>${this.user.department}</p>
                                </div>
                            ` : ''}
                            ${this.user.year ? `
                                <div class="info-group">
                                    <label>Year</label>
                                    <p>${this.user.year}</p>
                                </div>
                            ` : ''}
                            ${this.user.section ? `
                                <div class="info-group">
                                    <label>Section</label>
                                    <p>${this.user.section}</p>
                                </div>
                            ` : ''}
                            ${this.user.institution ? `
                                <div class="info-group">
                                    <label>Institution</label>
                                    <p>${this.user.institution}</p>
                                </div>
                            ` : ''}
                            ${this.user.position ? `
                                <div class="info-group">
                                    <label>Position</label>
                                    <p>${this.user.position}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">Close</button>
                    <button class="btn btn-primary" id="editProfileBtn">Edit Profile</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners for modal
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });

        modal.querySelector('#editProfileBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showEditProfileModal();
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showEditProfileModal() {
        if (!this.user) {
            alert('Please login to edit your profile');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content edit-profile-modal">
                <div class="modal-header">
                    <h3>Edit Profile</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editProfileForm">
                        <div class="form-group">
                            <label for="editName">Full Name</label>
                            <input type="text" id="editName" value="${this.user.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editPhone">Phone</label>
                            <input type="tel" id="editPhone" value="${this.user.phone || ''}">
                        </div>
                        ${this.user.role === 'student' ? `
                            <div class="form-group">
                                <label for="editDepartment">Department</label>
                                <select id="editDepartment">
                                    <option value="">Select Department</option>
                                    <option value="Computer Science" ${this.user.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                                    <option value="Information Technology" ${this.user.department === 'Information Technology' ? 'selected' : ''}>Information Technology</option>
                                    <option value="Electronics" ${this.user.department === 'Electronics' ? 'selected' : ''}>Electronics</option>
                                    <option value="Mechanical" ${this.user.department === 'Mechanical' ? 'selected' : ''}>Mechanical</option>
                                    <option value="Civil" ${this.user.department === 'Civil' ? 'selected' : ''}>Civil</option>
                                    <option value="Electrical" ${this.user.department === 'Electrical' ? 'selected' : ''}>Electrical</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editYear">Year</label>
                                <select id="editYear">
                                    <option value="">Select Year</option>
                                    <option value="2024" ${this.user.year === '2024' ? 'selected' : ''}>2024</option>
                                    <option value="2025" ${this.user.year === '2025' ? 'selected' : ''}>2025</option>
                                    <option value="2026" ${this.user.year === '2026' ? 'selected' : ''}>2026</option>
                                    <option value="2027" ${this.user.year === '2027' ? 'selected' : ''}>2027</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editSection">Section</label>
                                <select id="editSection">
                                    <option value="">Select Section</option>
                                    <option value="A" ${this.user.section === 'A' ? 'selected' : ''}>Section A</option>
                                    <option value="B" ${this.user.section === 'B' ? 'selected' : ''}>Section B</option>
                                    <option value="C" ${this.user.section === 'C' ? 'selected' : ''}>Section C</option>
                                    <option value="D" ${this.user.section === 'D' ? 'selected' : ''}>Section D</option>
                                </select>
                            </div>
                        ` : ''}
                        ${this.user.role === 'admin' ? `
                            <div class="form-group">
                                <label for="editInstitution">Institution</label>
                                <input type="text" id="editInstitution" value="${this.user.institution || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editPosition">Position</label>
                                <select id="editPosition">
                                    <option value="">Select Position</option>
                                    <option value="Principal" ${this.user.position === 'Principal' ? 'selected' : ''}>Principal</option>
                                    <option value="Vice Principal" ${this.user.position === 'Vice Principal' ? 'selected' : ''}>Vice Principal</option>
                                    <option value="Head of Department" ${this.user.position === 'Head of Department' ? 'selected' : ''}>Head of Department</option>
                                    <option value="Professor" ${this.user.position === 'Professor' ? 'selected' : ''}>Professor</option>
                                    <option value="Assistant Professor" ${this.user.position === 'Assistant Professor' ? 'selected' : ''}>Assistant Professor</option>
                                    <option value="Administrator" ${this.user.position === 'Administrator' ? 'selected' : ''}>Administrator</option>
                                </select>
                            </div>
                        ` : ''}
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">Cancel</button>
                    <button class="btn btn-primary" id="saveProfileBtn">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners for modal
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });

        modal.querySelector('#saveProfileBtn').addEventListener('click', async () => {
            await this.saveProfileChanges();
            document.body.removeChild(modal);
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    async saveProfileChanges() {
        const form = document.getElementById('editProfileForm');
        const formData = new FormData(form);
        
        const updateData = {
            name: document.getElementById('editName').value,
            phone: document.getElementById('editPhone').value
        };

        if (this.user.role === 'student') {
            updateData.department = document.getElementById('editDepartment').value;
            updateData.year = document.getElementById('editYear').value;
            updateData.section = document.getElementById('editSection').value;
        } else if (this.user.role === 'admin') {
            updateData.institution = document.getElementById('editInstitution').value;
            updateData.position = document.getElementById('editPosition').value;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const data = await response.json();
                this.user = { ...this.user, ...data.user };
                localStorage.setItem('user', JSON.stringify(this.user));
                
                // Update profile display
                this.updateProfileDisplay();
                
                alert('Profile updated successfully!');
            } else {
                const error = await response.json();
                alert('Failed to update profile: ' + error.message);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('Failed to update profile. Please try again.');
        }
    }

    updateProfileDisplay() {
        const profileName = document.getElementById('profileName');
        if (profileName && this.user) {
            profileName.textContent = this.user.name;
        }
    }

    showAttendanceHistory() {
        if (!this.user) {
            alert('Please login to view attendance history');
            return;
        }

        // Redirect to appropriate page based on user role
        if (this.user.role === 'student') {
            window.location.href = 'student.html';
        } else if (this.user.role === 'admin') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'employee.html';
        }
    }

    showSettings() {
        alert('Settings feature coming soon!');
    }

    async logout() {
        if (confirm('Are you sure you want to logout?')) {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        }
    }

    // Method to update user data (called from other components)
    updateUserData(userData) {
        this.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        this.updateProfileDisplay();
    }
}

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuickMarkProfile();
});
