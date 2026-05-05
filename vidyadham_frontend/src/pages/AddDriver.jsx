import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import API from '../services/api';
import '../styles/FormStyles.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LICENSE_TYPES = [
  { value: '', label: 'Select license type' },
  { value: 'LMV', label: 'LMV – Light Motor Vehicle' },
  { value: 'HMV', label: 'HMV – Heavy Motor Vehicle' },
  { value: 'HPMV', label: 'HPMV – Heavy Passenger Motor Vehicle' },
  { value: 'HGMV', label: 'HGMV – Heavy Goods Motor Vehicle' },
  { value: 'Transport', label: 'Transport License' },
];

function AddDriver() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    licenseType: '',
  });

  const [availableDays, setAvailableDays] = useState([]);
  const [timeFrom, setTimeFrom] = useState('07:00');
  const [timeTo, setTimeTo] = useState('17:00');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.name || !formData.licenseType) {
      setMessage({ type: 'error', text: 'Name and license type are required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        availability: {
          days: availableDays,
          timeSlot: { from: timeFrom, to: timeTo },
        },
      };

      await API.post('/drivers', payload);
      setMessage({ type: 'success', text: 'Driver added successfully!' });

      // Reset
      setFormData({ name: '', phone: '', licenseNumber: '', licenseType: '' });
      setAvailableDays([]);
      setTimeFrom('07:00');
      setTimeTo('17:00');

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add driver. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Add Driver</h1>
          <p>Register a new driver with license details and availability</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`form-message ${message.type}`} id="driver-form-message">
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

      <div className="form-card" id="add-driver-form">
        <h2>Driver Information</h2>
        <p className="form-subtitle">Fill in the details below. Fields marked * are required.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Name */}
            <div className="form-field">
              <label htmlFor="driver-name">Full Name *</label>
              <input
                type="text"
                id="driver-name"
                name="name"
                placeholder="Enter driver's full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="form-field">
              <label htmlFor="driver-phone">Phone Number</label>
              <input
                type="tel"
                id="driver-phone"
                name="phone"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* License Type */}
            <div className="form-field">
              <label htmlFor="driver-license-type">License Type *</label>
              <select
                id="driver-license-type"
                name="licenseType"
                value={formData.licenseType}
                onChange={handleChange}
              >
                {LICENSE_TYPES.map((lt) => (
                  <option key={lt.value} value={lt.value}>{lt.label}</option>
                ))}
              </select>
            </div>

            {/* License Number */}
            <div className="form-field">
              <label htmlFor="driver-license-number">License Number</label>
              <input
                type="text"
                id="driver-license-number"
                name="licenseNumber"
                placeholder="e.g. MH12-2023-0045678"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </div>

            {/* Availability - Days */}
            <div className="form-field full-width">
              <label>Available Days</label>
              <div className="checkbox-group">
                {DAYS.map((day) => (
                  <div className="checkbox-chip" key={day}>
                    <input
                      type="checkbox"
                      id={`dday-${day}`}
                      checked={availableDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <label htmlFor={`dday-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability - Time Slot */}
            <div className="form-field full-width">
              <label>Shift Timing</label>
              <div className="time-slot-row">
                <input
                  type="time"
                  id="driver-time-from"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                />
                <span>to</span>
                <input
                  type="time"
                  id="driver-time-to"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting} id="submit-driver-btn">
              {isSubmitting ? (
                <><span className="btn-spinner"></span> Adding...</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Driver
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default AddDriver;
