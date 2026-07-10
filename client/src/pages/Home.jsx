import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Clock, Users, Award, Stethoscope, Building2, CheckCircle } from 'lucide-react';

export default function Home() {
  const stats = [
    { value: '500+', label: 'Expert Doctors', icon: Users },
    { value: '50+', label: 'Specialties', icon: Stethoscope },
    { value: '2M+', label: 'Patients Treated', icon: Heart },
    { value: '24/7', label: 'Emergency Care', icon: Clock },
  ];

  const features = [
    { icon: Shield, title: 'World-Class Care', description: 'Accredited by Joint Commission with top-tier patient safety ratings' },
    { icon: Heart, title: 'Patient-Centered', description: 'Personalized treatment plans tailored to your unique health needs' },
    { icon: Award, title: 'Award Winning', description: 'Recognized for excellence in cardiology, neurology, and oncology' },
    { icon: Building2, title: 'Modern Facilities', description: 'State-of-the-art technology and comfortable healing environments' },
    { icon: Clock, title: '24/7 Emergency', description: 'Level 1 Trauma Center with rapid response emergency care' },
    { icon: Users, title: 'Expert Team', description: 'Board-certified physicians from world-renowned medical institutions' },
  ];

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-background" aria-hidden="true">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" aria-hidden="true"></span>
              <span>Top 1% Hospital Nationwide • Joint Commission Accredited</span>
            </div>
            <h1 id="hero-title" className="hero-title">
              Your Health,<br />
              <span className="hero-highlight">Our Priority</span>
            </h1>
            <p className="hero-subtitle">
              CityCare Hospital delivers world-class healthcare with compassion. 
              From routine checkups to complex surgeries, our expert team is here for you.
            </p>
            <div className="hero-actions">
              <Link to="/appointments" className="btn btn-primary btn-lg">
                Book Appointment
                <ArrowRight className="icon" aria-hidden="true" />
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg">
                Our Services
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle className="icon" aria-hidden="true" />
                <span>Same-day appointments available</span>
              </div>
              <div className="trust-item">
                <CheckCircle className="icon" aria-hidden="true" />
                <span>Most insurance plans accepted</span>
              </div>
              <div className="trust-item">
                <CheckCircle className="icon" aria-hidden="true" />
                <span>Virtual visits available</span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop" 
                alt="CityCare Hospital modern facility" 
                className="hero-image"
              />
              <div className="hero-floating-card card-1">
                <Heart className="icon" />
                <div>
                  <strong>98%</strong>
                  <span>Patient Satisfaction</span>
                </div>
              </div>
              <div className="hero-floating-card card-2">
                <Clock className="icon" />
                <div>
                  <strong>{'<15min'}</strong>
                  <span>Avg ER Wait Time</span>
                </div>
              </div>
              <div className="hero-floating-card card-3">
                <Award className="icon" />
                <div>
                  <strong>#1</strong>
                  <span>Regional Ranking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section" aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="sr-only">Hospital Statistics</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon" aria-hidden="true">
                  <stat.icon className="icon" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section features-section" aria-labelledby="features-title">
        <div className="container">
          <header className="section-header">
            <h2 id="features-title" className="section-title">Why Choose CityCare</h2>
            <p className="section-subtitle">Excellence in healthcare delivered with compassion and innovation</p>
          </header>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <article key={index} className="feature-card card">
                <div className="feature-icon" aria-hidden="true">
                  <feature.icon className="icon" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 id="cta-title" className="cta-title">Ready to Experience Exceptional Care?</h2>
              <p className="cta-subtitle">Schedule your appointment today and take the first step toward better health.</p>
            </div>
            <div className="cta-actions">
              <Link to="/appointments" className="btn btn-primary btn-lg">
                Book Appointment
                <ArrowRight className="icon" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn-ghost btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}