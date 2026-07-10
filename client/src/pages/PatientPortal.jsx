import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, XCircle, Clock, User, HeartPulse, FileText, MessageSquare, CreditCard, Bell, Settings, LogOut, ChevronRight, Loader2, Plus } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { appointmentsAPI } from '../services/api';

const tabConfig = [
  { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: 0 },
  { id: 'past', label: 'Past Visits', icon: CheckCircle, count: 0 },
  { id: 'records', label: 'Medical Records', icon: FileText, count: 0 },
  { id: 'messages', label: 'Messages', icon: MessageSquare, count: 2 },
  { id: 'billing', label: 'Billing', icon: CreditCard, count: 1 },
];

export default function PatientPortal() {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [tabs, setTabs] = useState(() => tabConfig);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentsAPI.getMyAppointments();
      setAppointments(res.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      await appointmentsAPI.cancel(appointmentId);
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'cancelled' } : a));
      setShowCancelConfirm(null);
    } catch (error) {
      console.error('Failed to cancel:', error);
    }
  };

  const upcomingAppointments = appointments.filter(a => 
    a.status === 'confirmed' && !isBefore(new Date(a.date), startOfDay(new Date()))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastAppointments = appointments.filter(a => 
    a.status === 'completed' || (a.status === 'confirmed' && isBefore(new Date(a.date), startOfDay(new Date())))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  if (authLoading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Loading your portal...</p></div>;
  }

  if (!user) {
    return (
      <div className="portal-redirect">
        <div className="card" style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center', padding: '3rem' }}>
          <User className="icon" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)' }} />
          <h2>Please Sign In</h2>
          <p className="text-muted mt-2 mb-4">Access your patient portal to manage appointments, view records, and message your care team.</p>
          <a href="/login" className="btn btn-primary btn-lg">Sign In to Portal</a>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <div className="tab-content">
            {loading ? (
              <div className="loading-state"><Loader2 className="icon spin" /><p>Loading appointments...</p></div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <Calendar className="icon large" />
                <h3>No Upcoming Appointments</h3>
                <p>You're all caught up! Schedule your next visit.</p>
                <a href="/appointments" className="btn btn-primary mt-4"><Plus className="icon" /> Book Appointment</a>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.map(apt => (
                  <article key={apt.id} className="appointment-card card">
                    <div className="appointment-header">
                      <img src={apt.doctor.image} alt="" className="doctor-avatar" loading="lazy" />
                      <div className="doctor-info">
                        <h4>{apt.doctor.name}</h4>
                        <p>{apt.doctor.specialization}</p>
                      </div>
                      <span className="badge badge-success">Confirmed</span>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <Calendar className="icon" />
                        <span>{format(new Date(apt.date), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="detail-item">
                        <Clock className="icon" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <div className="detail-item">
                        <HeartPulse className="icon" />
                        <span>{apt.type.charAt(0).toUpperCase() + apt.type.slice(1)} Visit</span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowCancelConfirm(apt.id)}>
                        <XCircle className="icon" /> Cancel
                      </button>
                      <a href={`/appointments?doctor=${apt.doctorId}`} className="btn btn-outline btn-sm">
                        <ChevronRight className="icon" /> Reschedule
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        );

      case 'past':
        return (
          <div className="tab-content">
            {pastAppointments.length === 0 ? (
              <div className="empty-state">
                <CheckCircle className="icon large" />
                <h3>No Past Visits</h3>
                <p>Your visit history will appear here after your appointments.</p>
              </div>
            ) : (
              <div className="appointments-list">
                {pastAppointments.map(apt => (
                  <article key={apt.id} className="appointment-card card past">
                    <div className="appointment-header">
                      <img src={apt.doctor.image} alt="" className="doctor-avatar" loading="lazy" />
                      <div className="doctor-info">
                        <h4>{apt.doctor.name}</h4>
                        <p>{apt.doctor.specialization}</p>
                      </div>
                      <span className="badge badge-primary">Completed</span>
                    </div>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <Calendar className="icon" />
                        <span>{format(new Date(apt.date), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="detail-item">
                        <Clock className="icon" />
                        <span>{apt.timeSlot}</span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn btn-outline btn-sm">View Summary</button>
                      <button className="btn btn-ghost btn-sm">View Notes</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        );

      case 'records':
        return (
          <div className="tab-content">
            <div className="records-section">
              <div className="section-header">
                <h3>Medical Records</h3>
                <button className="btn btn-primary btn-sm"><Plus className="icon" /> Request Records</button>
              </div>
              <div className="records-grid">
                {[
                  { type: 'Lab Results', count: 12, icon: FileText, color: 'var(--color-primary)', lastUpdated: '2 days ago' },
                  { type: 'Imaging Reports', count: 5, icon: HeartPulse, color: 'var(--color-secondary)', lastUpdated: '1 week ago' },
                  { type: 'Visit Summaries', count: 8, icon: Calendar, color: 'var(--color-accent)', lastUpdated: '3 days ago' },
                  { type: 'Immunizations', count: 6, icon: HeartPulse, color: '#8b5cf6', lastUpdated: '6 months ago' },
                  { type: 'Prescriptions', count: 14, icon: FileText, color: '#ec4899', lastUpdated: '1 week ago' },
                  { type: 'Allergies', count: 3, icon: HeartPulse, color: '#06b6d4', lastUpdated: 'Updated today' },
                ].map((record, i) => (
                  <article key={i} className="record-card card">
                    <div className="record-icon" style={{ backgroundColor: record.color + '20' }}>
                      <record.icon className="icon" style={{ color: record.color }} />
                    </div>
                    <div className="record-info">
                      <h4>{record.type}</h4>
                      <p>{record.count} documents</p>
                    </div>
                    <span className="record-updated">{record.lastUpdated}</span>
                    <button className="btn btn-ghost btn-sm">View</button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="tab-content">
            <div className="messages-section">
              <div className="section-header">
                <h3>Secure Messages</h3>
                <button className="btn btn-primary btn-sm"><Plus className="icon" /> New Message</button>
              </div>
              <div className="messages-list">
                {[
                  { from: 'Dr. Sarah Johnson', subject: 'Follow-up on your recent visit', preview: 'Your lab results look good...', time: '2 hours ago', unread: true },
                  { from: 'Nursing Team', subject: 'Appointment reminder', preview: 'Your appointment with Dr. Chen is tomorrow at 10:00 AM...', time: '1 day ago', unread: false },
                ].map((msg, i) => (
                  <article key={i} className={`message-card card ${msg.unread ? 'unread' : ''}`}>
                    <div className="message-sender">
                      <User className="icon" />
                      <span>{msg.from}</span>
                    </div>
                    <h4>{msg.subject}</h4>
                    <p>{msg.preview}</p>
                    <span className="message-time">{msg.time}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="tab-content">
            <div className="billing-section">
              <div className="bill-summary card">
                <h3>Current Balance</h3>
                <div className="balance-amount">$247.50</div>
                <p className="text-muted">Due by March 15, 2024</p>
                <button className="btn btn-primary mt-4">Pay Now</button>
              </div>
              <div className="bills-list">
                <h3>Recent Statements</h3>
                {[
                  { date: 'Feb 15, 2024', amount: '$125.00', status: 'Paid', items: 'Cardiology Consultation' },
                  { date: 'Jan 20, 2024', amount: '$89.00', status: 'Paid', items: 'Lab Work - Blood Panel' },
                  { date: 'Mar 1, 2024', amount: '$247.50', status: 'Pending', items: 'Neurology Follow-up + MRI' },
                ].map((bill, i) => (
                  <article key={i} className="bill-card card">
                    <div className="bill-date">{bill.date}</div>
                    <div className="bill-details">
                      <p>{bill.items}</p>
                    </div>
                    <div className="bill-amount">{bill.amount}</div>
                    <span className={`badge ${bill.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{bill.status}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="patient-portal">
      <div className="portal-header">
        <div className="container">
          <div className="portal-header-content">
            <div className="welcome">
              <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
              <p>Manage your health, appointments, and records all in one place.</p>
            </div>
            <div className="portal-actions">
              <a href="/appointments" className="btn btn-primary"><Plus className="icon" /> Book Appointment</a>
              <button className="btn btn-ghost" onClick={logout}><LogOut className="icon" /> Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="portal-body">
        <div className="container">
          <div className="portal-layout">
            <aside className="portal-sidebar">
              <nav className="portal-nav" aria-label="Patient portal navigation">
                <ul>
                  {tabs.map(tab => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                      >
                        <tab.icon className="icon" aria-hidden="true" />
                        <span>{tab.label}</span>
                        {tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="quick-actions">
                <h4>Quick Actions</h4>
                <div className="action-buttons">
                  <a href="/appointments" className="action-btn"><Calendar className="icon" /> Schedule Visit</a>
                  <button className="action-btn"><FileText className="icon" /> Request Records</button>
                  <button className="action-btn"><MessageSquare className="icon" /> Message Doctor</button>
                  <button className="action-btn"><CreditCard className="icon" /> Pay Bill</button>
                </div>
              </div>

              <div className="profile-card card">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="" className="profile-avatar" />
                <div className="profile-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
            </aside>

            <main className="portal-main" role="main">
              {renderTabContent()}

              {showCancelConfirm && (
                <div className="modal-overlay" onClick={() => setShowCancelConfirm(null)} role="dialog" aria-modal="true" aria-labelledby="cancel-title">
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <h3 id="cancel-title">Cancel Appointment?</h3>
                    <p>Are you sure you want to cancel this appointment? This action cannot be undone.</p>
                    <div className="modal-actions">
                      <button className="btn btn-outline" onClick={() => setShowCancelConfirm(null)}>Keep Appointment</button>
                      <button className="btn btn-danger" onClick={() => handleCancel(showCancelConfirm)}>Yes, Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}