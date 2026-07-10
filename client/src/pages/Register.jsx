import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      const { confirmPassword, ...data } = formData;
      await authAPI.register(data);
      navigate('/portal');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <Link to="/" className="auth-logo" aria-label="CityCare Hospital Home">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 8V24M8 16H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>CityCare Hospital</span>
          </Link>

          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join CityCare Hospital for personalized healthcare access</p>

          {error && (
            <div className="alert alert-error" role="alert">
              <AlertCircle className="icon" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" aria-hidden="true" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`input ${errors.name ? 'input-error' : ''}`}
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    disabled={submitting}
                  />
                </div>
                {errors.name && <span id="name-error" className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" aria-hidden="true" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={submitting}
                  />
                </div>
                {errors.email && <span id="email-error" className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="label">Phone Number (Optional)</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" aria-hidden="true" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    disabled={submitting}
                  />
                </div>
                {errors.phone && <span id="phone-error" className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`input ${errors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="icon" aria-hidden="true" /> : <Eye className="icon" aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && <span id="password-error" className="error-text">{errors.password}</span>}
                {!errors.password && <span id="password-hint" className="hint-text">At least 8 characters</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="toggle-password"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="icon" aria-hidden="true" /> : <Eye className="icon" aria-hidden="true" />}
                  </button>
                </div>
                {errors.confirmPassword && <span id="confirm-error" className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  required
                  disabled={submitting}
                  aria-required="true"
                />
                <span className="checkmark" aria-hidden="true"></span>
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="icon spin" aria-hidden="true" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>already have an account?</span>
          </div>

          <p className="auth-footer">
            <Link to="/login" className="btn btn-ghost">Sign In Instead</Link>
          </p>
        </div>

        <div className="auth-benefits" aria-hidden="true">
          <h2>Your Health Portal Awaits</h2>
          <p>With a CityCare account, you get secure 24/7 access to your health information and care team.</p>
          <ul className="benefits-list">
            <li><CheckCircle className="icon" /> View test results & medical records</li>
            <li><CheckCircle className="icon" /> Schedule & manage appointments</li>
            <li><CheckCircle className="icon" /> Secure messaging with your doctors</li>
            <li><CheckCircle className="icon" /> Request prescription refills</li>
            <li><CheckCircle className="icon" /> Online bill pay & insurance info</li>
            <li><CheckCircle className="icon" /> Personalized health reminders</li>
          </ul>
        </div>
      </div>
    </div>
  );
}