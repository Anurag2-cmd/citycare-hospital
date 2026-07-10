import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle, Loader2, ChevronRight, ChevronLeft, CalendarDays, ArrowLeft, Star } from 'lucide-react';
import { appointmentsAPI, doctorsAPI } from '../services/api';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isBefore, isAfter, startOfDay } from 'date-fns';

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedDoctorId = searchParams.get('doctor');

  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [formData, setFormData] = useState({ reason: '', type: 'consultation' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (preSelectedDoctorId) {
      const doctor = doctors.find(d => d.id === preSelectedDoctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        setStep(2);
      }
    }
  }, [preSelectedDoctorId, doctors]);

  const fetchDoctors = async () => {
    try {
      const res = await doctorsAPI.getAll();
      setDoctors(res.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchAvailability = async (doctorId, date) => {
    setLoading(true);
    try {
      const res = await doctorsAPI.getAvailability(doctorId, format(date, 'yyyy-MM-dd'));
      setAvailability(res.data);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailability(selectedDoctor.id, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  });

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    setError(null);

    try {
      await appointmentsAPI.create({
        doctorId: selectedDoctor.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTime,
        reason: formData.reason,
        type: formData.type
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/portal');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ reason: '', type: 'consultation' });
    setError(null);
  };

  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));
  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
      <section className="page-hero" aria-labelledby="appointments-title">
        <div className="container">
          <h1 id="appointments-title" className="page-title">Book Appointment</h1>
          <p className="page-subtitle">Schedule your visit in just a few steps</p>
        </div>
      </section>

      <section className="section appointments-section">
        <div className="container">
          <div className="booking-layout">
            <aside className="booking-sidebar">
              <div className="steps-indicator" role="navigation" aria-label="Booking steps">
                {[
                  { num: 1, label: 'Choose Doctor', icon: User },
                  { num: 2, label: 'Select Date', icon: CalendarDays },
                  { num: 3, label: 'Choose Time', icon: Clock },
                  { num: 4, label: 'Confirm', icon: CheckCircle }
                ].map((s, i) => (
                  <div key={s.num} className={`step ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}>
                    <div className="step-circle" aria-current={i + 1 === step ? 'step' : undefined}>
                      {i + 1 < step ? <CheckCircle className="icon" aria-hidden="true" /> : <s.icon className="icon" aria-hidden="true" />}
                    </div>
                    <span className="step-label">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="booking-summary">
                {selectedDoctor && (
                  <div className="summary-item">
                    <Stethoscope className="icon" aria-hidden="true" />
                    <div>
                      <span className="summary-label">Doctor</span>
                      <span className="summary-value">{selectedDoctor.name}</span>
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <div className="summary-item">
                    <Calendar className="icon" aria-hidden="true" />
                    <div>
                      <span className="summary-label">Date</span>
                      <span className="summary-value">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                  </div>
                )}
                {selectedTime && (
                  <div className="summary-item">
                    <Clock className="icon" aria-hidden="true" />
                    <div>
                      <span className="summary-label">Time</span>
                      <span className="summary-value">{selectedTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="btn btn-ghost btn-back">
                  <ArrowLeft className="icon" aria-hidden="true" />
                  Back
                </button>
              )}
            </aside>

            <main className="booking-main" role="main">
              {success ? (
                <div className="success-screen" role="status" aria-live="polite">
                  <div className="success-icon">
                    <CheckCircle className="icon large" aria-hidden="true" />
                  </div>
                  <h2>Appointment Confirmed!</h2>
                  <p>Your appointment with <strong>{selectedDoctor?.name}</strong> has been booked for <strong>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}</strong> at <strong>{selectedTime}</strong>.</p>
                  <p className="confirmation-details">A confirmation email has been sent to your email address.</p>
                  <button onClick={() => navigate('/portal')} className="btn btn-primary mt-4">View My Appointments</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="booking-form" noValidate>
                  {error && (
                    <div className="alert alert-error" role="alert">
                      <AlertCircle className="icon" aria-hidden="true" />
                      <span>{error}</span>
                    </div>
                  )}

                  {step === 1 && (
                    <fieldset className="form-step">
                      <legend>Select Your Doctor</legend>
                      <p className="step-hint">Choose from our specialists or search by specialty</p>
                      <div className="doctors-selection" role="listbox" aria-label="Available doctors">
                        {doctors.map(doctor => (
                          <button
                            key={doctor.id}
                            type="button"
                            onClick={() => handleDoctorSelect(doctor)}
                            className={`doctor-option ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                            role="option"
                            aria-selected={selectedDoctor?.id === doctor.id}
                          >
                            <img src={doctor.image} alt="" className="doctor-option-image" loading="lazy" />
                            <div className="doctor-option-info">
                              <h4>{doctor.name}</h4>
                              <p>{doctor.specialization} • {doctor.experience}</p>
                              <div className="doctor-option-meta">
                                <span className="rating">
                                  <Star className="icon filled" aria-hidden="true" />
                                  {doctor.rating} ({doctor.reviews})
                                </span>
                                <span className="fee">${doctor.consultationFee}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {step === 2 && (
                    <fieldset className="form-step">
                      <legend>Select Date</legend>
                      <p className="step-hint">Available days for {selectedDoctor?.name} are highlighted</p>
                      
                      <div className="calendar-nav">
                        <button type="button" onClick={prevWeek} className="btn btn-ghost btn-sm" aria-label="Previous week">
                          <ChevronLeft className="icon" aria-hidden="true" />
                        </button>
                        <span className="calendar-title">{format(currentWeekStart, 'MMMM yyyy')}</span>
                        <button type="button" onClick={nextWeek} className="btn btn-ghost btn-sm" aria-label="Next week">
                          <ChevronRight className="icon" aria-hidden="true" />
                        </button>
                      </div>
                      
                      {currentWeekStart > startOfWeek(new Date(), { weekStartsOn: 1 }) && (
                        <button type="button" onClick={goToToday} className="btn btn-ghost btn-sm today-btn">
                          This Week
                        </button>
                      )}

                      <div className="calendar-week" role="grid" aria-label="Week calendar">
                        {dayNames.map((day, i) => (
                          <div key={day} className="calendar-day-header" role="columnheader">{day}</div>
                        ))}
                        {weekDays.map(date => {
                          const isToday = isSameDay(date, new Date());
                          const isPast = isBefore(date, startOfDay(new Date()));
                          const isSelected = selectedDate && isSameDay(date, selectedDate);
                          const doctorAvailable = selectedDoctor?.availableDays?.includes(format(date, 'EEEE'));
                          const hasAvailability = availability.length > 0 || !selectedDate;

                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              onClick={() => handleDateSelect(date)}
                              disabled={isPast || !doctorAvailable}
                              className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''} ${!doctorAvailable ? 'unavailable' : ''}`}
                              role="gridcell"
                              aria-selected={isSelected}
                              aria-disabled={isPast || !doctorAvailable}
                              aria-label={`${format(date, 'EEEE, MMMM d')} ${isToday ? '(Today)' : ''} ${!doctorAvailable ? 'Not available' : hasAvailability ? 'Available' : 'Loading...'}`}
                            >
                              <span className="day-number">{format(date, 'd')}</span>
                              {!doctorAvailable && !isPast && <span className="unavailable-badge" aria-hidden="true">×</span>}
                            </button>
                          );
                        })}
                      </div>
                      
                      <p className="calendar-legend">
                        <span className="legend-item"><span className="legend-color today" aria-hidden="true"></span> Today</span>
                        <span className="legend-item"><span className="legend-color selected" aria-hidden="true"></span> Selected</span>
                        <span className="legend-item"><span className="legend-color unavailable" aria-hidden="true"></span> Not Available</span>
                      </p>
                    </fieldset>
                  )}

                  {step === 3 && (
                    <fieldset className="form-step">
                      <legend>Choose Time</legend>
                      <p className="step-hint">Available slots for {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'selected date'}</p>
                      
                      {loading ? (
                        <div className="loading-slots">
                          <Loader2 className="icon spin" aria-hidden="true" />
                          <span>Loading available times...</span>
                        </div>
                      ) : availability.length === 0 ? (
                        <div className="no-slots">
                          <Clock className="icon large" aria-hidden="true" />
                          <p>No available slots for this date. Please select another day.</p>
                        </div>
                      ) : (
                        <div className="time-slots" role="listbox" aria-label="Available time slots">
                          {availability.map((slot, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleTimeSelect(slot)}
                              className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                              role="option"
                              aria-selected={selectedTime === slot}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </fieldset>
                  )}

                  {step === 4 && (
                    <fieldset className="form-step">
                      <legend>Confirm Details</legend>
                      <div className="confirmation-details">
                        <div className="detail-row">
                          <span className="detail-label">Doctor</span>
                          <span className="detail-value">{selectedDoctor?.name} ({selectedDoctor?.specialization})</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Date</span>
                          <span className="detail-value">{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Time</span>
                          <span className="detail-value">{selectedTime}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Fee</span>
                          <span className="detail-value">${selectedDoctor?.consultationFee}</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="appointment-type" className="label">Appointment Type</label>
                        <select
                          id="appointment-type"
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="input"
                        >
                          <option value="consultation">Consultation</option>
                          <option value="follow-up">Follow-up</option>
                          <option value="second-opinion">Second Opinion</option>
                          <option value="pre-op">Pre-operative</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="reason" className="label">Reason for Visit (Optional)</label>
                        <textarea
                          id="reason"
                          value={formData.reason}
                          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                          className="input"
                          rows={3}
                          placeholder="Briefly describe your symptoms or reason for visit..."
                        />
                      </div>

                      <div className="form-actions">
                        <button type="button" onClick={() => setStep(3)} className="btn btn-outline">
                          <ArrowLeft className="icon" aria-hidden="true" />
                          Change Time
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="icon spin" aria-hidden="true" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              Confirm Appointment
                              <CheckCircle className="icon" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </div>
                    </fieldset>
                  )}
                </form>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}