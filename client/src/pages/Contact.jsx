import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2, MapPin as LocationPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: 'Call Us', details: ['+1 (234) 567-890', 'Mon-Fri: 8am-8pm', 'Sat: 9am-5pm'], href: 'tel:+1234567890', color: 'var(--color-primary)' },
    { icon: Mail, title: 'Email Us', details: ['info@citycarehospital.com', 'appointments@citycarehospital.com', 'records@citycarehospital.com'], href: 'mailto:info@citycarehospital.com', color: 'var(--color-secondary)' },
    { icon: MapPin, title: 'Visit Us', details: ['123 Healthcare Avenue', 'Medical District, NY 10001', 'Main Campus - Building A'], href: 'https://maps.google.com', color: 'var(--color-accent)' },
    { icon: Clock, title: 'Hours', details: ['Emergency: 24/7', 'Outpatient: Mon-Fri 8am-6pm', 'Urgent Care: Daily 8am-8pm'], href: null, color: '#8b5cf6' },
  ];

  const departments = [
    { name: 'General Inquiries', email: 'info@citycarehospital.com', phone: '+1 (234) 567-8900' },
    { name: 'Appointments', email: 'appointments@citycarehospital.com', phone: '+1 (234) 567-8901' },
    { name: 'Medical Records', email: 'records@citycarehospital.com', phone: '+1 (234) 567-8902' },
    { name: 'Billing & Insurance', email: 'billing@citycarehospital.com', phone: '+1 (234) 567-8903' },
    { name: 'Emergency Department', email: 'ed@citycarehospital.com', phone: '+1 (234) 567-8911' },
    { name: 'Patient Relations', email: 'patientrelations@citycarehospital.com', phone: '+1 (234) 567-8904' },
  ];

  return (
    <>
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <h1 id="page-title" className="page-title">Contact Us</h1>
          <p className="page-subtitle">We're here to help. Reach out to us any time.</p>
        </div>
      </section>

      <section className="section contact-section" aria-labelledby="contact-title">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 id="contact-title" className="contact-title">Get in Touch</h2>
              <p className="contact-description">
                Whether you have a question about our services, need help with an appointment, 
                or want to provide feedback, our team is ready to assist you.
              </p>

              <div className="contact-methods" role="list">
                {contactInfo.map((method, index) => (
                  <article key={index} className="contact-method card" role="listitem">
                    <div className="method-icon" style={{ backgroundColor: method.color + '20' }}>
                      <method.icon className="icon" style={{ color: method.color }} aria-hidden="true" />
                    </div>
                    <div className="method-content">
                      <h3>{method.title}</h3>
                      {method.details.map((detail, i) => (
                        <p key={i}>{method.href ? (
                          <a href={method.href}>{detail}</a>
                        ) : (
                          detail
                        )}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="emergency-notice card" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
                <div className="emergency-icon">
                  <LocationPin className="icon" style={{ color: 'var(--color-secondary)' }} aria-hidden="true" />
                </div>
                <div>
                  <h3>Medical Emergency?</h3>
                  <p>If you're experiencing a medical emergency, please call <strong>911</strong> immediately or visit our Emergency Department, open 24/7.</p>
                  <p className="emergency-phone">Emergency Dept: <a href="tel:+12345678911">+1 (234) 567-8911</a></p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <div className="contact-form-card card">
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>

                {submitStatus === 'success' && (
                  <div className="alert alert-success" role="alert">
                    <CheckCircle className="icon" aria-hidden="true" />
                    <span>Thank you! Your message has been sent successfully. We'll respond within 24 hours.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error" role="alert">
                    <AlertCircle className="icon" aria-hidden="true" />
                    <span>Something went wrong. Please try again or call us directly.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="label">Full Name <span className="required" aria-hidden="true">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`input ${errors.name ? 'input-error' : ''}`}
                        placeholder="John Doe"
                        required
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        disabled={submitting}
                      />
                      {errors.name && <span id="name-error" className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="label">Email Address <span className="required" aria-hidden="true">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        placeholder="you@example.com"
                        required
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        disabled={submitting}
                      />
                      {errors.email && <span id="email-error" className="error-text">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone" className="label">Phone Number <span className="required" aria-hidden="true">*</span></label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className={`input ${errors.phone ? 'input-error' : ''}`}
                        placeholder="(555) 123-4567"
                        required
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        disabled={submitting}
                      />
                      {errors.phone && <span id="phone-error" className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject" className="label">Subject <span className="required" aria-hidden="true">*</span></label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className={`input ${errors.subject ? 'input-error' : ''}`}
                        required
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                        disabled={submitting}
                      >
                        <option value="">Select a topic</option>
                        <option value="appointment">Appointment Scheduling</option>
                        <option value="medical-records">Medical Records Request</option>
                        <option value="billing">Billing & Insurance</option>
                        <option value="feedback">Feedback & Complaints</option>
                        <option value="general">General Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <span id="subject-error" className="error-text">{errors.subject}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="label">Message <span className="required" aria-hidden="true">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className={`input ${errors.message ? 'input-error' : ''}`}
                      placeholder="Please describe your inquiry or concern..."
                      rows={5}
                      required
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                      disabled={submitting}
                    />
                    {errors.message && <span id="message-error" className="error-text">{errors.message}</span>}
                    <span id="message-hint" className="hint-text">Minimum 10 characters</span>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg btn-block form-submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="icon spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="icon" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section departments-section bg-background" aria-labelledby="departments-title">
        <div className="container">
          <header className="section-header">
            <h2 id="departments-title" className="section-title">Department Contacts</h2>
            <p className="section-subtitle">Direct lines to specific departments for faster service</p>
          </header>
          <div className="departments-grid">
            {departments.map((dept, index) => (
              <article key={index} className="dept-card card">
                <h3>{dept.name}</h3>
                <div className="dept-contact">
                  <a href={`mailto:${dept.email}`}>
                    <Mail className="icon" aria-hidden="true" />
                    {dept.email}
                  </a>
                  <a href={`tel:${dept.phone.replace(/\D/g, '')}`}>
                    <Phone className="icon" aria-hidden="true" />
                    {dept.phone}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section map-section" aria-labelledby="map-title">
        <div className="container">
          <header className="section-header">
            <h2 id="map-title" className="section-title">Find Us</h2>
            <p className="section-subtitle">Our main campus is conveniently located in the Medical District</p>
          </header>
          <div className="map-wrapper card">
            <iframe
              title="CityCare Hospital Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.123456789!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
              style={{ border: 0, width: '100%', height: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="location-details grid grid-3">
            <div className="location-item card">
              <MapPin className="icon" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
              <h4>Main Campus</h4>
              <address>123 Healthcare Avenue<br />Medical District, NY 10001</address>
            </div>
            <div className="location-item card">
              <MapPin className="icon" style={{ color: 'var(--color-secondary)' }} aria-hidden="true" />
              <h4>Parking</h4>
              <address>Underground garage (500 spaces)<br />Valet available at main entrance</address>
            </div>
            <div className="location-item card">
              <MapPin className="icon" style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
              <h4>Public Transit</h4>
              <address>Subway: Medical Center Station<br />Bus: Routes 12, 24, 37</address>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}