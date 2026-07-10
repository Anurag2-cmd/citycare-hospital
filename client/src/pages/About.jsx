import { Link } from 'react-router-dom';
import { Users, Award, Heart, Building2, Target, Leaf, Clock, Shield } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassion', description: 'We treat every patient with empathy, dignity, and respect.' },
    { icon: Award, title: 'Excellence', description: 'We pursue the highest standards in clinical quality and patient safety.' },
    { icon: Target, title: 'Innovation', description: 'We embrace cutting-edge technology and evidence-based practices.' },
    { icon: Users, title: 'Collaboration', description: 'We work together across disciplines for the best patient outcomes.' },
    { icon: Shield, title: 'Integrity', description: 'We act with honesty, transparency, and accountability in all we do.' },
    { icon: Leaf, title: 'Stewardship', description: 'We responsibly manage resources for sustainable healthcare delivery.' },
  ];

  const milestones = [
    { year: '1985', title: 'Founded', description: 'CityCare Hospital opens its doors with 50 beds and a mission to serve.' },
    { year: '1995', title: 'Expansion', description: 'New wing adds 200 beds; Level 1 Trauma Center designated.' },
    { year: '2005', title: 'Innovation', description: 'First robotic surgery program in the region launched.' },
    { year: '2015', title: 'Recognition', description: 'Named Top 100 Hospital nationally; Magnet nursing status achieved.' },
    { year: '2024', title: 'Today', description: '500+ physicians, 50+ specialties, 2M+ patients served annually.' },
  ];

  const leadership = [
    { name: 'Dr. Elizabeth Morrison', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop' },
    { name: 'Dr. James Patterson', role: 'Chief Medical Officer', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop' },
    { name: 'Sarah Chen, RN', role: 'Chief Nursing Officer', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop' },
    { name: 'Michael Rodriguez', role: 'Chief Financial Officer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
  ];

  return (
    <>
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <h1 id="page-title" className="page-title">About CityCare Hospital</h1>
          <p className="page-subtitle">Nearly four decades of healing, innovation, and community care</p>
        </div>
      </section>

      <section className="section about-story" aria-labelledby="story-title">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 id="story-title" className="about-title">Our Story</h2>
              <p className="lead">
                Founded in 1985 by a group of visionary physicians, CityCare Hospital began with a simple 
                but powerful mission: to provide exceptional healthcare to every member of our community, 
                regardless of their ability to pay.
              </p>
              <p>
                What started as a modest 50-bed community hospital has grown into a world-class medical 
                center serving over 2 million patients annually. Yet through every expansion and innovation, 
                our founding mission remains unchanged.
              </p>
              <p>
                Today, CityCare is a 650-bed academic medical center affiliated with leading medical schools, 
                offering more than 50 medical and surgical specialties. We're proud to be the region's only 
                Level 1 Trauma Center and a designated Comprehensive Stroke Center.
              </p>
              <Link to="/services" className="btn btn-primary mt-4">
                Explore Our Services
              </Link>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop" 
                alt="CityCare Hospital modern building exterior" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section bg-background" aria-labelledby="values-title">
        <div className="container">
          <header className="section-header">
            <h2 id="values-title" className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </header>
          <div className="grid grid-3">
            {values.map((value, index) => (
              <article key={index} className="value-card card">
                <div className="value-icon" aria-hidden="true">
                  <value.icon className="icon" />
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section milestones-section" aria-labelledby="milestones-title">
        <div className="container">
          <header className="section-header">
            <h2 id="milestones-title" className="section-title">Our Journey</h2>
            <p className="section-subtitle">Key milestones in our commitment to excellence</p>
          </header>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <article key={index} className="timeline-item">
                <div className="timeline-marker" aria-hidden="true">
                  <span className="timeline-dot"></span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section leadership-section" aria-labelledby="leadership-title">
        <div className="container">
          <header className="section-header">
            <h2 id="leadership-title" className="section-title">Leadership Team</h2>
            <p className="section-subtitle">Experienced leaders guiding our mission</p>
          </header>
          <div className="grid grid-4">
            {leadership.map((leader, index) => (
              <article key={index} className="leader-card card">
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="leader-image"
                  loading="lazy"
                />
                <div className="leader-info">
                  <h3 className="leader-name">{leader.name}</h3>
                  <p className="leader-role">{leader.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section" aria-labelledby="about-cta-title">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 id="about-cta-title" className="cta-title">Join Our Mission</h2>
              <p className="cta-subtitle">Whether you're seeking care, building a career, or supporting our community, there's a place for you at CityCare.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
              <Link to="/careers" className="btn btn-outline btn-lg">Careers</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}