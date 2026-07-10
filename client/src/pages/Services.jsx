import { Link } from 'react-router-dom';
import { HeartPulse, Brain, Bone, Baby, Stethoscope, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: HeartPulse,
    name: 'Cardiology & Vascular Care',
    shortDesc: 'Comprehensive heart and vascular treatment',
    description: 'Our nationally ranked cardiology program offers the full spectrum of heart care, from preventive cardiology to complex interventions and heart transplantation.',
    features: [
      'Interventional Cardiology & Cath Lab',
      'Electrophysiology & Arrhythmia Management',
      'Heart Failure & Transplant Program',
      'Structural Heart Disease Program',
      'Preventive Cardiology & Lipid Clinic',
      'Vascular Surgery & Endovascular Therapy'
    ],
    treatments: ['Angioplasty & Stenting', 'TAVR', 'Ablation Procedures', 'Pacemaker/ICD Implantation', 'Heart Transplant Evaluation'],
    cta: 'Schedule Cardiology Consultation'
  },
  {
    icon: Brain,
    name: 'Neurology & Neurosurgery',
    shortDesc: 'Advanced brain and nervous system care',
    description: 'Our Comprehensive Neuroscience Center provides expert diagnosis and treatment for the full range of neurological conditions using the latest technology.',
    features: [
      'Comprehensive Stroke Center',
      'Epilepsy Monitoring Unit',
      'Movement Disorders Clinic',
      'Brain & Spine Tumor Program',
      'Neuromuscular Disease Center',
      'Headache & Pain Management'
    ],
    treatments: ['Thrombectomy', 'DBS for Parkinson\'s', 'Gamma Knife Radiosurgery', 'Minimally Invasive Spine Surgery', 'Epilepsy Surgery'],
    cta: 'Request Neurology Appointment'
  },
  {
    icon: Bone,
    name: 'Orthopedics & Sports Medicine',
    shortDesc: 'Expert bone, joint, and muscle care',
    description: 'From elite athletes to weekend warriors, our orthopedic specialists provide personalized treatment plans to restore mobility and eliminate pain.',
    features: [
      'Joint Replacement Center',
      'Sports Medicine & Arthroscopy',
      'Spine Surgery & Deformity Correction',
      'Hand & Upper Extremity Surgery',
      'Foot & Ankle Reconstruction',
      'Orthopedic Trauma & Fracture Care'
    ],
    treatments: ['Robotic Joint Replacement', 'ACL Reconstruction', 'Spinal Fusion', 'Rotator Cuff Repair', 'Cartilage Restoration'],
    cta: 'Book Orthopedic Evaluation'
  },
  {
    icon: Baby,
    name: 'Pediatrics & Neonatology',
    shortDesc: 'Specialized care for children and newborns',
    description: 'Our Children\'s Hospital provides family-centered care from birth through adolescence, with a Level IV NICU and pediatric subspecialists.',
    features: [
      'Level IV Neonatal ICU (NICU)',
      'Pediatric Emergency Department',
      'Pediatric Surgery & Specialties',
      'Adolescent Medicine',
      'Child Development Center',
      'Pediatric Oncology & Hematology'
    ],
    treatments: ['Well-Child Visits', 'Immunizations', 'Complex Neonatal Surgery', 'Pediatric Cancer Treatment', 'Developmental Screening'],
    cta: 'Find a Pediatrician'
  },
  {
    icon: Stethoscope,
    name: 'Emergency & Trauma Care',
    shortDesc: '24/7 Level 1 Trauma Center',
    description: 'Our emergency department is staffed by board-certified emergency physicians and trauma surgeons, ready for any medical crisis.',
    features: [
      'Level 1 Trauma Center (Adult & Pediatric)',
      'Chest Pain & Stroke Protocols',
      'Emergency Ultrasound & Imaging',
      'Toxicology & Environmental Exposure',
      'Psychiatric Emergency Services',
      'Air Medical Transport (LifeFlight)'
    ],
    treatments: ['Trauma Resuscitation', 'Emergency Surgery', 'Stroke Alert Protocol', 'STEMI Heart Attack Protocol', 'Sepsis Protocol'],
    cta: 'In Emergency, Call 911'
  },
  {
    icon: Shield,
    name: 'Oncology & Cancer Care',
    shortDesc: 'Comprehensive cancer treatment and support',
    description: 'Our Cancer Center offers multidisciplinary care with the latest treatments, clinical trials, and comprehensive support services.',
    features: [
      'Medical, Radiation & Surgical Oncology',
      'Clinical Trials Program',
      'Genetic Counseling & Testing',
      'Survivorship & Wellness Program',
      'Palliative Care & Pain Management',
      'Integrative Medicine Services'
    ],
    treatments: ['Immunotherapy & Targeted Therapy', 'Proton Therapy', 'Minimally Invasive Cancer Surgery', 'Bone Marrow Transplant', 'CAR T-Cell Therapy'],
    cta: 'Schedule Oncology Consultation'
  }
];

export default function Services() {
  return (
    <>
      <section className="page-hero" aria-labelledby="page-title">
        <div className="container">
          <h1 id="page-title" className="page-title">Our Medical Services</h1>
          <p className="page-subtitle">World-class care across 50+ specialties, delivered with compassion</p>
        </div>
      </section>

      <section className="section services-overview" aria-labelledby="overview-title">
        <div className="container">
          <header className="section-header">
            <h2 id="overview-title" className="section-title">Centers of Excellence</h2>
            <p className="section-subtitle">Specialized programs recognized nationally for clinical excellence</p>
          </header>
          <div className="grid grid-3">
            {services.map((service, index) => (
              <article key={index} className="service-card card">
                <div className="service-icon" aria-hidden="true">
                  <service.icon className="icon" />
                </div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-short-desc">{service.shortDesc}</p>
                <Link to={`/services/${service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="service-link">
                  Learn More <ArrowRight className="icon" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section service-details" aria-labelledby="details-title">
        <div className="container">
          <h2 id="details-title" className="sr-only">Detailed Service Information</h2>
          {services.map((service, index) => (
            <article key={index} className="service-detail card">
              <div className="service-detail-header">
                <div className="service-detail-icon" aria-hidden="true">
                  <service.icon className="icon" />
                </div>
                <div className="service-detail-info">
                  <h3 className="service-detail-name">{service.name}</h3>
                  <p className="service-detail-desc">{service.description}</p>
                </div>
              </div>
              <div className="service-detail-content">
                <div className="service-features">
                  <h4>Key Programs & Services</h4>
                  <ul className="features-list">
                    {service.features.map((feature, i) => (
                      <li key={i}>
                        <CheckCircle className="icon" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="service-treatments">
                  <h4>Featured Treatments</h4>
                  <ul className="treatments-list">
                    {service.treatments.map((treatment, i) => (
                      <li key={i}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="service-detail-footer">
                <Link to="/appointments" className="btn btn-primary">
                  {service.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-section" aria-labelledby="services-cta-title">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 id="services-cta-title" className="cta-title">Don't See What You're Looking For?</h2>
              <p className="cta-subtitle">We offer 50+ medical specialties. Contact us to find the right specialist for your needs.</p>
            </div>
            <Link to="/doctors" className="btn btn-primary btn-lg">View All Specialists</Link>
          </div>
        </div>
      </section>
    </>
  );
}