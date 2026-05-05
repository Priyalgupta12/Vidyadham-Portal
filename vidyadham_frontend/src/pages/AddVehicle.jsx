import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import API from '../services/api';
import '../styles/FormStyles.css';

const VEHICLE_TYPES = [
  { value: '', label: 'Select vehicle type' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Mini Bus', label: 'Mini Bus' },
  { value: 'Van', label: 'Van' },
  { value: 'Auto-rickshaw', label: 'Auto-rickshaw' },
  { value: 'Car', label: 'Car (Staff)' },
];

function AddVehicle() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    capacity: '',
    type: '',
    fuelType: '',
    insuranceExpiry: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.vehicleNumber || !formData.capacity || !formData.type) {
      setMessage({ type: 'error', text: 'Vehicle number, capacity, and type are required.' });
      return;
    }

    if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      setMessage({ type: 'error', text: 'Capacity must be a positive number.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      await API.post('/vehicles', payload);
      setMessage({ type: 'success', text: 'Vehicle added successfully!' });

      // Reset
      setFormData({ vehicleNumber: '', capacity: '', type: '', fuelType: '', insuranceExpiry: '' });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add vehicle. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Add Vehicle</h1>
          <p>Register a new vehicle to the transport fleet</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`form-message ${message.type}`} id="vehicle-form-message">
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

      <div className="form-card" id="add-vehicle-form">
        <h2>Vehicle Details</h2>
        <p className="form-subtitle">Fill in the details below. Fields marked * are required.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Vehicle Number */}
            <div className="form-field">
              <label htmlFor="vehicle-number">Vehicle Number *</label>
              <input
                type="text"
                id="vehicle-number"
                name="vehicleNumber"
                placeholder="e.g. MH12 AB 1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
            </div>

            {/* Vehicle Type */}
            <div className="form-field">
              <label htmlFor="vehicle-type">Vehicle Type *</label>
              <select
                id="vehicle-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {VEHICLE_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>{vt.label}</option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div className="form-field">
              <label htmlFor="vehicle-capacity">Seating Capacity *</label>
              <input
                type="number"
                id="vehicle-capacity"
                name="capacity"
                placeholder="e.g. 40"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>

            {/* Fuel Type */}
            <div className="form-field">
              <label htmlFor="vehicle-fuel">Fuel Type</label>
              <select
                id="vehicle-fuel"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option value="">Select fuel type</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Insurance Expiry */}
            <div className="form-field">
              <label htmlFor="vehicle-insurance">Insurance Expiry</label>
              <input
                type="date"
                id="vehicle-insurance"
                name="insuranceExpiry"
                value={formData.insuranceExpiry}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting} id="submit-vehicle-btn">
              {isSubmitting ? (
                <><span className="btn-spinner"></span> Adding...</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Vehicle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default AddVehicle;
