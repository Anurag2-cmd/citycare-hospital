import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Award, Heart, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { doctorsAPI } from '../services/api';

const specialties = [
  'All Specialties',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Oncology'
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await doctorsAPI.getAll();
      setDoctors(res.data);
      setFilteredDoctors(res.data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = doctors;
    
    if (searchTerm) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.about.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty !== 'All Specialties') {
      result = result.filter(d => d.specialization === selectedSpecialty);
    }
    
    setFilteredDoctors(result);
  }, [doctors, searchTerm, selectedSpecialty]);

  return (
    <>
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <h1 id="page-title" className="page-title">Our Medical Experts</h1>
          <p className="page-subtitle">Meet our team of board-certified physicians from world-renowned institutions</p>
        </div>
      </section>

      <section className="section doctors-section" aria-labelledby="doctors-title">
        <div className="container">
          <div className="doctors-toolbar">
            <div className="search-box">
              <Search className="icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search by name, specialty, condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                aria-label="Search doctors"
              />
            </div>
            
            <div className="filter-group">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-outline ${showFilters ? 'active' : ''}`}
                aria-expanded={showFilters}
              >
                <Filter className="icon" aria-hidden="true" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="icon" aria-hidden="true" /> : <ChevronDown className="icon" aria-hidden="true" />}
              </button>
              
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="input filter-select"
                aria-label="Filter by specialty"
              >
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="results-info" aria-live="polite">
            <p>{filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found</p>
          </div>

          {loading ? (
            <div className="loading-grid" aria-live="polite">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="doctor-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="no-results">
              <Search className="icon large" aria-hidden="true" />
              <h3>No doctors found</h3>
              <p>Try adjusting your search or filters</p>
              <button onClick={() => { setSearchTerm(''); setSelectedSpecialty('All Specialties'); }} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="doctors-grid" role="list">
              {filteredDoctors.map((doctor) => (
                <article key={doctor.id} className="doctor-card card" role="listitem">
                  <div className="doctor-image-wrapper">
                    <img 
                      src={doctor.image} 
                      alt="" 
                      className="doctor-image"
                      loading="lazy"
                    />
                    <div className="doctor-badges">
                      <span className="badge badge-primary">{doctor.specialization}</span>
                      <span className="badge badge-success">{doctor.experience}</span>
                    </div>
                  </div>
                  <div className="doctor-info">
                    <div className="doctor-header">
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <div className="doctor-rating">
                        <Star className="icon filled" aria-hidden="true" />
                        <span>{doctor.rating}</span>
                        <span className="review-count">({doctor.reviews})</span>
                      </div>
                    </div>
                    <p className="doctor-specialty">{doctor.specialization}</p>
                    <p className="doctor-education">{doctor.education}</p>
                    <div className="doctor-meta">
                      <span className="meta-item">
                        <MapPin className="icon" aria-hidden="true" />
                        <span>CityCare Main Campus</span>
                      </span>
                      <span className="meta-item">
                        <Clock className="icon" aria-hidden="true" />
                        <span>${doctor.consultationFee} / visit</span>
                      </span>
                    </div>
                    <div className="doctor-availability">
                      <span className="available-badge">
                        <Heart className="icon" aria-hidden="true" />
                        Available {doctor.availableDays.slice(0, 3).join(', ')}{doctor.availableDays.length > 3 ? '...' : ''}
                      </span>
                    </div>
                    <div className="doctor-actions">
                      <button className="btn btn-outline btn-sm" aria-label={`View ${doctor.name}'s profile`}>
                        View Profile
                      </button>
                      <button className="btn btn-primary btn-sm" aria-label={`Book appointment with ${doctor.name}`}>
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section cta-section" aria-labelledby="doctors-cta-title">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 id="doctors-cta-title" className="cta-title">Can't Find What You're Looking For?</h2>
              <p className="cta-subtitle">Our referral team can help match you with the right specialist for your needs.</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-primary btn-lg">Request Referral</button>
              <button className="btn btn-outline btn-lg">Call Physician Referral</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}