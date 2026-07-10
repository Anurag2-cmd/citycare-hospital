import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Menu, X, MessageSquare, User, LogOut, LayoutDashboard, Calendar, HeartPulse } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const { toggleChat: openChat } = useChat();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-content">
          <NavLink to="/" className="logo" aria-label="CityCare Hospital Home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>CityCare Hospital</span>
          </NavLink>

          <nav className="nav-desktop" aria-label="Main navigation">
            <ul className="nav-list">
              {navLinks.map(link => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              onClick={openChat}
              className="btn btn-chat"
              aria-label="Open AI Health Assistant"
            >
              <MessageSquare className="icon" aria-hidden="true" />
              <span>AI Assistant</span>
            </button>

            {user ? (
              <div className="user-menu">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="btn btn-user"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <User className="icon" aria-hidden="true" />
                  <span>{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <NavLink
                      to="/portal"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="icon" aria-hidden="true" />
                      Patient Portal
                    </NavLink>
                    <NavLink
                      to="/appointments"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Calendar className="icon" aria-hidden="true" />
                      My Appointments
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <LogOut className="icon" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
                <NavLink to="/register" className="btn btn-primary">Register</NavLink>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="icon" aria-hidden="true" /> : <Menu className="icon" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-menu" className="nav-mobile" aria-label="Mobile navigation">
            <ul className="nav-list">
              {navLinks.map(link => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="mobile-divider" />
              {!user ? (
                <>
                  <li><NavLink to="/login" className="btn btn-block btn-ghost" onClick={() => setMobileMenuOpen(false)}>Login</NavLink></li>
                  <li><NavLink to="/register" className="btn btn-block btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</NavLink></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/portal" className="btn btn-block btn-outline" onClick={() => setMobileMenuOpen(false)}><LayoutDashboard className="icon" aria-hidden="true" /> Patient Portal</NavLink></li>
                  <li><NavLink to="/appointments" className="btn btn-block btn-outline" onClick={() => setMobileMenuOpen(false)}><Calendar className="icon" aria-hidden="true" /> My Appointments</NavLink></li>
                  <li><button onClick={handleLogout} className="btn btn-block btn-outline"><LogOut className="icon" aria-hidden="true" /> Logout</button></li>
                </>
              )}
            </ul>
          </nav>
        )}
      </header>

      <main className="main" id="main-content">
        <Outlet />
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>CityCare Hospital</span>
              </div>
              <p>Providing exceptional healthcare with compassion and excellence since 1985.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook" className="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                <a href="#" aria-label="Twitter" className="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
                <a href="#" aria-label="Instagram" className="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                <a href="#" aria-label="LinkedIn" className="social-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><NavLink to="/about">About Us</NavLink></li>
                <li><NavLink to="/services">Services</NavLink></li>
                <li><NavLink to="/doctors">Our Doctors</NavLink></li>
                <li><NavLink to="/appointments">Book Appointment</NavLink></li>
                <li><NavLink to="/contact">Contact Us</NavLink></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Services</h4>
              <ul>
                <li><NavLink to="/services">Emergency Care</NavLink></li>
                <li><NavLink to="/services">Cardiology</NavLink></li>
                <li><NavLink to="/services">Neurology</NavLink></li>
                <li><NavLink to="/services">Orthopedics</NavLink></li>
                <li><NavLink to="/services">Pediatrics</NavLink></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Contact Us</h4>
              <address className="contact-info">
                <p><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 123 Healthcare Ave, Medical District, NY 10001</p>
                <p><a href="tel:+1234567890"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +1 (234) 567-890</a></p>
                <p><a href="mailto:info@citycarehospital.com"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> info@citycarehospital.com</a></p>
                <p><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Mon-Fri: 8am-8pm | Sat: 9am-5pm | Sun: Emergency Only</p>
              </address>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 CityCare Hospital. All rights reserved.</p>
            <div className="footer-legal">
              <NavLink to="/privacy">Privacy Policy</NavLink>
              <NavLink to="/terms">Terms of Service</NavLink>
              <NavLink to="/accessibility">Accessibility</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}