// Enhanced Footer Component for Quick Mark System
class QuickMarkFooter {
    constructor() {
        this.init();
    }

    init() {
        this.createFooter();
        this.addEventListeners();
    }

    createFooter() {
        const footer = document.createElement('footer');
        footer.className = 'quick-mark-footer';
        footer.innerHTML = `
            <div class="footer-container">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <div class="footer-logo-icon">QM</div>
                        <span>Quick Mark</span>
                    </div>
                    <p class="footer-description">
                        Revolutionizing education and corporate attendance management with AI-powered solutions. 
                        Built by Singh HR Private Limited for modern institutions and companies.
                    </p>
                    <div class="social-links">
                        <a href="#" class="social-link" title="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-link" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-link" title="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" class="social-link" title="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="social-link" title="YouTube">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Product</h4>
                    <div class="footer-links">
                        <a href="landing.html">Features</a>
                        <a href="about.html">About</a>
                        <a href="login.html">Login</a>
                        <a href="register.html">Register</a>
                        <a href="student.html">Student Portal</a>
                        <a href="employee.html">Employee Portal</a>
                        <a href="payroll.html">Payroll System</a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Company</h4>
                    <div class="footer-links">
                        <a href="about.html">About Us</a>
                        <a href="clients.html">Our Clients</a>
                        <a href="careers.html">Careers</a>
                        <a href="#" onclick="showPrivacyPolicy()">Privacy Policy</a>
                        <a href="#" onclick="showTermsOfService()">Terms of Service</a>
                        <a href="#" onclick="showCookiePolicy()">Cookie Policy</a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Support</h4>
                    <div class="footer-links">
                        <a href="#" onclick="showHelpCenter()">Help Center</a>
                        <a href="#" onclick="showDocumentation()">Documentation</a>
                        <a href="#" onclick="showContactUs()">Contact Us</a>
                        <a href="#" onclick="showStatus()">System Status</a>
                        <a href="#" onclick="showAPI()">API Documentation</a>
                        <a href="#" onclick="showTraining()">Training</a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Head Office</strong>
                                <p>123 Business District<br>New Delhi, India 110001</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Phone</strong>
                                <p>+91 11 2345 6789<br>+91 98765 43210</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email</strong>
                                <p>info@smartattendance.com<br>support@smartattendance.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Business Hours</strong>
                                <p>Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <div class="footer-bottom-left">
                        <p>&copy; 2025 Quick Mark System. All rights reserved.</p>
                        <p>Built with ❤️ by <strong>Singh HR Private Limited</strong></p>
                    </div>
                    <div class="footer-bottom-right">
                        <div class="footer-badges">
                            <span class="badge">ISO 27001</span>
                            <span class="badge">GDPR Compliant</span>
                            <span class="badge">SOC 2</span>
                        </div>
                        <div class="footer-links-inline">
                            <a href="#" onclick="showPrivacyPolicy()">Privacy</a>
                            <a href="#" onclick="showTermsOfService()">Terms</a>
                            <a href="#" onclick="showCookiePolicy()">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert footer at the end of body
        document.body.appendChild(footer);
    }

    addEventListeners() {
        // Add smooth scrolling for anchor links
        this.addSmoothScrolling();
        
        // Add newsletter subscription
        this.addNewsletterSubscription();
        
        // Add back to top button
        this.addBackToTopButton();
    }

    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    addNewsletterSubscription() {
        // Add newsletter subscription functionality
        const newsletterForm = document.createElement('div');
        newsletterForm.className = 'newsletter-subscription';
        newsletterForm.innerHTML = `
            <div class="newsletter-content">
                <h4>Stay Updated</h4>
                <p>Get the latest updates on new features and improvements.</p>
                <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `;
        
        // Insert newsletter before footer bottom
        const footer = document.querySelector('.quick-mark-footer');
        const footerBottom = footer.querySelector('.footer-bottom');
        footer.insertBefore(newsletterForm, footerBottom);
    }

    addBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('title', 'Back to top');
        
        document.body.appendChild(backToTop);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Global functions for footer interactions
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Simulate API call
    showNotification('Thank you for subscribing! You will receive updates soon.', 'success');
    event.target.reset();
}

function showPrivacyPolicy() {
    showModal('Privacy Policy', `
        <div class="privacy-content">
            <h3>Data Protection & Privacy</h3>
            <p>We are committed to protecting your privacy and personal data. Our system complies with GDPR, CCPA, and other international privacy regulations.</p>
            
            <h4>Data We Collect</h4>
            <ul>
                <li>Attendance records and timestamps</li>
                <li>Facial recognition data (encrypted and secure)</li>
                <li>Location data for geofencing</li>
                <li>User profile information</li>
            </ul>
            
            <h4>How We Use Your Data</h4>
            <ul>
                <li>Attendance tracking and reporting</li>
                <li>System security and fraud prevention</li>
                <li>Analytics and insights</li>
                <li>Communication and notifications</li>
            </ul>
            
            <h4>Your Rights</h4>
            <ul>
                <li>Right to access your data</li>
                <li>Right to rectification</li>
                <li>Right to erasure</li>
                <li>Right to data portability</li>
            </ul>
        </div>
    `);
}

function showTermsOfService() {
    showModal('Terms of Service', `
        <div class="terms-content">
            <h3>Terms of Service</h3>
            <p>By using Smart Attendance System, you agree to these terms and conditions.</p>
            
            <h4>Acceptable Use</h4>
            <ul>
                <li>Use the system for legitimate attendance tracking only</li>
                <li>Do not attempt to circumvent security measures</li>
                <li>Respect other users' privacy and data</li>
                <li>Follow institutional policies and guidelines</li>
            </ul>
            
            <h4>Prohibited Activities</h4>
            <ul>
                <li>Unauthorized access to other accounts</li>
                <li>Attempting to reverse engineer the system</li>
                <li>Sharing login credentials</li>
                <li>Using the system for illegal activities</li>
            </ul>
            
            <h4>Service Availability</h4>
            <p>We strive for 99.9% uptime but cannot guarantee uninterrupted service. Maintenance windows will be announced in advance.</p>
        </div>
    `);
}

function showCookiePolicy() {
    showModal('Cookie Policy', `
        <div class="cookie-content">
            <h3>Cookie Usage</h3>
            <p>We use cookies to enhance your experience and provide personalized services.</p>
            
            <h4>Types of Cookies</h4>
            <ul>
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference Cookies:</strong> Remember your settings</li>
                <li><strong>Security Cookies:</strong> Protect against fraud</li>
            </ul>
            
            <h4>Managing Cookies</h4>
            <p>You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect system functionality.</p>
        </div>
    `);
}

function showHelpCenter() {
    showModal('Help Center', `
        <div class="help-content">
            <h3>Help & Support</h3>
            <div class="help-sections">
                <div class="help-section">
                    <h4><i class="fas fa-question-circle"></i> Frequently Asked Questions</h4>
                    <p>Find answers to common questions about using the system.</p>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-book"></i> User Guides</h4>
                    <p>Step-by-step guides for all system features.</p>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-video"></i> Video Tutorials</h4>
                    <p>Watch video demonstrations of key features.</p>
                </div>
                <div class="help-section">
                    <h4><i class="fas fa-headset"></i> Contact Support</h4>
                    <p>Get help from our support team via email or chat.</p>
                </div>
            </div>
        </div>
    `);
}

function showDocumentation() {
    showModal('API Documentation', `
        <div class="api-content">
            <h3>API Documentation</h3>
            <p>Integrate Smart Attendance with your existing systems using our RESTful API.</p>
            
            <h4>Authentication</h4>
            <pre><code>POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}</code></pre>
            
            <h4>Attendance Endpoints</h4>
            <pre><code>GET /api/attendance/summary
POST /api/attendance/mark
GET /api/attendance/history</code></pre>
            
            <h4>Rate Limits</h4>
            <p>100 requests per 15 minutes per IP address.</p>
        </div>
    `);
}

function showContactUs() {
    showModal('Contact Us', `
        <div class="contact-content">
            <h3>Get in Touch</h3>
            <div class="contact-methods">
                <div class="contact-method">
                    <i class="fas fa-envelope"></i>
                    <h4>Email Support</h4>
                    <p>support@smartattendance.com</p>
                    <p>Response time: Within 24 hours</p>
                </div>
                <div class="contact-method">
                    <i class="fas fa-phone"></i>
                    <h4>Phone Support</h4>
                    <p>+91 11 2345 6789</p>
                    <p>Mon-Fri: 9 AM - 6 PM IST</p>
                </div>
                <div class="contact-method">
                    <i class="fas fa-comments"></i>
                    <h4>Live Chat</h4>
                    <p>Available 24/7</p>
                    <p>Click the chat icon in the bottom right</p>
                </div>
            </div>
        </div>
    `);
}

function showStatus() {
    showModal('System Status', `
        <div class="status-content">
            <h3>System Status</h3>
            <div class="status-items">
                <div class="status-item">
                    <div class="status-indicator online"></div>
                    <div class="status-info">
                        <h4>API Services</h4>
                        <p>All systems operational</p>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-indicator online"></div>
                    <div class="status-info">
                        <h4>Database</h4>
                        <p>99.9% uptime</p>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-indicator online"></div>
                    <div class="status-info">
                        <h4>Face Recognition</h4>
                        <p>Processing normally</p>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-indicator online"></div>
                    <div class="status-info">
                        <h4>GPS Services</h4>
                        <p>Location tracking active</p>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function showAPI() {
    showDocumentation();
}

function showTraining() {
    showModal('Training & Onboarding', `
        <div class="training-content">
            <h3>Training Programs</h3>
            <div class="training-options">
                <div class="training-option">
                    <h4><i class="fas fa-graduation-cap"></i> Basic Training</h4>
                    <p>2-hour session covering system basics</p>
                    <p>Perfect for new users</p>
                </div>
                <div class="training-option">
                    <h4><i class="fas fa-cogs"></i> Advanced Training</h4>
                    <p>4-hour session for administrators</p>
                    <p>Includes API integration and customization</p>
                </div>
                <div class="training-option">
                    <h4><i class="fas fa-users"></i> Group Training</h4>
                    <p>Customized sessions for teams</p>
                    <p>On-site or virtual options available</p>
                </div>
            </div>
        </div>
    `);
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuickMarkFooter();
});
