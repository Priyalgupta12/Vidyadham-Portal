import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import API from '../services/api';
import '../styles/FormStyles.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function AddTeacher() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [timeFrom, setTimeFrom] = useState('08:00');
  const [timeTo, setTimeTo] = useState('14:00');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Subject tag handling ---
  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
    }
    setSubjectInput('');
  };

  const handleSubjectKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSubject();
    }
    if (e.key === 'Backspace' && subjectInput === '' && subjects.length > 0) {
      setSubjects(subjects.slice(0, -1));
    }
  };

  const removeSubject = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  // --- Day toggle ---
  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // --- Password generator ---
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    setFormData({ ...formData, password: pass });
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Name, email, and password are required.' });
      return;
    }

    if (subjects.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one subject.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        subjects,
        availability: {
          days: availableDays,
          timeSlot: { from: timeFrom, to: timeTo },
        },
      };

      await API.post('/teachers', payload);
      setMessage({ type: 'success', text: 'Teacher added successfully!' });

      // Reset form
      setFormData({ name: '', email: '', password: '', phone: '' });
      setSubjects([]);
      setAvailableDays([]);
      setTimeFrom('08:00');
      setTimeTo('14:00');

      // Navigate to dashboard after short delay
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add teacher. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Add Teacher</h1>
          <p>Create a new teacher profile with subjects and availability</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`form-message ${message.type}`} id="teacher-form-message">
          {message.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <span>{message.text}</span>
          <button className="msg-close" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div className="form-card" id="add-teacher-form">
        <h2>Teacher Information</h2>
        <p className="form-subtitle">Fill in the details below. Fields marked * are required.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Name */}
            <div className="form-field">
              <label htmlFor="teacher-name">Full Name *</label>
              <input
                type="text"
                id="teacher-name"
                name="name"
                placeholder="Enter teacher's full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="form-field">
              <label htmlFor="teacher-email">Email Address *</label>
              <input
                type="email"
                id="teacher-email"
                name="email"
                placeholder="teacher@vidyadham.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="teacher-password">Password *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  id="teacher-password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn-cancel" onClick={generatePassword} title="Auto-generate" style={{ padding: '8px 12px', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="form-field">
              <label htmlFor="teacher-phone">Phone Number</label>
              <input
                type="tel"
                id="teacher-phone"
                name="phone"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Subjects (tag input) */}
            <div className="form-field full-width">
              <label>Subjects *</label>
              <div className="tag-input-container" onClick={() => document.getElementById('subject-input').focus()}>
                {subjects.map((s, i) => (
                  <span className="tag-item" key={i}>
                    {s}
                    <button type="button" className="tag-remove" onClick={() => removeSubject(i)}>×</button>
                  </span>
                ))}
                <input
                  type="text"
                  id="subject-input"
                  className="tag-input"
                  placeholder={subjects.length === 0 ? 'Type a subject and press Enter' : 'Add more...'}
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={handleSubjectKeyDown}
                  onBlur={addSubject}
                />
              </div>
              <p className="tag-hint">Press Enter or comma to add multiple subjects</p>
            </div>

            {/* Availability - Days */}
            <div className="form-field full-width">
              <label>Available Days</label>
              <div className="checkbox-group">
                {DAYS.map((day) => (
                  <div className="checkbox-chip" key={day}>
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={availableDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <label htmlFor={`day-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability - Time Slot */}
            <div className="form-field full-width">
              <label>Time Slot</label>
              <div className="time-slot-row">
                <input
                  type="time"
                  id="time-from"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                />
                <span>to</span>
                <input
                  type="time"
                  id="time-to"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting} id="submit-teacher-btn">
              {isSubmitting ? (
                <><span className="btn-spinner"></span> Creating...</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Teacher
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default AddTeacher;
