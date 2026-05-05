import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import API from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('teachers');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [teacherRes, driverRes, vehicleRes] = await Promise.allSettled([
        API.get('/teachers'),
        API.get('/drivers'),
        API.get('/vehicles'),
      ]);

      if (teacherRes.status === 'fulfilled') setTeachers(teacherRes.value.data);
      if (driverRes.status === 'fulfilled') setDrivers(driverRes.value.data);
      if (vehicleRes.status === 'fulfilled') setVehicles(vehicleRes.value.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Delete ${type} "${name}"?`)) return;
    try {
      await API.delete(`/${type}s/${id}`);
      setMessage({ type: 'success', text: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully` });
      fetchAllData();
    } catch {
      setMessage({ type: 'error', text: `Failed to delete ${type}` });
    }
  };

  const handleGenerateSchedule = () => {
    setMessage({ type: 'success', text: 'Schedule generation will be available in Phase 4 (AI Integration).' });
  };

  // Summary cards data
  const summaryCards = [
    {
      id: 'teachers-count',
      label: 'Teachers',
      count: teachers.length,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      id: 'drivers-count',
      label: 'Drivers',
      count: drivers.length,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" />
        </svg>
      ),
    },
    {
      id: 'vehicles-count',
      label: 'Vehicles',
      count: vehicles.length,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h10l4 5v5a2 2 0 01-2 2M5 17a2 2 0 002 2h10a2 2 0 002-2" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
      ),
    },
  ];

  const tabs = [
    { id: 'teachers', label: 'Teachers' },
    { id: 'drivers', label: 'Drivers' },
    { id: 'vehicles', label: 'Vehicles' },
  ];

  // --- Delete button SVG ---
  const DeleteIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );

  return (
    <PageLayout>
      {/* Header */}
      <header className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of all teachers, drivers, and vehicles</p>
        </div>
        <button className="generate-schedule-btn" onClick={handleGenerateSchedule} id="generate-schedule-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.657.896 3.105 2.232 3.888L9 12l-1.5 2 1 1.5L7 18l1 2h8l1-2-1.5-2.5 1-1.5L15 12l-.732-1.612A4.5 4.5 0 0016.5 6.5 4.5 4.5 0 0012 2z" />
          </svg>
          Generate Schedule
        </button>
      </header>

      {/* Message */}
      {message.text && (
        <div className={`dash-message ${message.type}`} id="dashboard-message">
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
          <button className="msg-close-btn" onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        {summaryCards.map((card) => (
          <div className="summary-card" key={card.id} id={card.id}>
            <div className="summary-icon" style={{ background: card.gradient }}>
              {card.icon}
            </div>
            <div className="summary-info">
              <span className="summary-count">{card.count}</span>
              <span className="summary-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Content */}
      <div className="dash-content-card">
        <div className="dash-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}

          {/* Quick-add button per tab */}
          <button
            className="tab-add-btn"
            onClick={() =>
              navigate(activeTab === 'teachers' ? '/add-teacher' : activeTab === 'drivers' ? '/add-driver' : '/add-vehicle')
            }
            id="tab-add-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add {activeTab === 'teachers' ? 'Teacher' : activeTab === 'drivers' ? 'Driver' : 'Vehicle'}
          </button>
        </div>

        {isLoading ? (
          <div className="dash-loading">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* ========== TEACHERS TABLE ========== */}
            {activeTab === 'teachers' && (
              <div className="table-wrapper">
                {teachers.length === 0 ? (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="11" x2="19" y2="17" />
                    </svg>
                    <h3>No teachers yet</h3>
                    <p>Click "Add Teacher" to create the first teacher profile.</p>
                  </div>
                ) : (
                  <table className="dash-table" id="teachers-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subjects</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t) => (
                        <tr key={t._id}>
                          <td>
                            <div className="name-cell">
                              <div className="avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                {t.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <span className="cell-name">{t.name}</span>
                                {t.phone && <span className="cell-sub">{t.phone}</span>}
                              </div>
                            </div>
                          </td>
                          <td>{t.email}</td>
                          <td>
                            <div className="cell-tags">
                              {(t.subjects || [t.subject].filter(Boolean)).map((s, i) => (
                                <span className="cell-tag purple" key={i}>{s}</span>
                              ))}
                              {(!t.subjects || t.subjects.length === 0) && !t.subject && <span className="text-muted">—</span>}
                            </div>
                          </td>
                          <td>
                            {t.availability?.days?.length > 0 ? (
                              <div className="cell-tags">
                                {t.availability.days.map((d, i) => (
                                  <span className="cell-tag blue" key={i}>{d.slice(0, 3)}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">Not set</span>
                            )}
                          </td>
                          <td>
                            <button className="del-btn" onClick={() => handleDelete('teacher', t._id, t.name)} title="Delete teacher">
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ========== DRIVERS TABLE ========== */}
            {activeTab === 'drivers' && (
              <div className="table-wrapper">
                {drivers.length === 0 ? (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" />
                    </svg>
                    <h3>No drivers yet</h3>
                    <p>Click "Add Driver" to register the first driver.</p>
                  </div>
                ) : (
                  <table className="dash-table" id="drivers-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>License Type</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((d) => (
                        <tr key={d._id}>
                          <td>
                            <div className="name-cell">
                              <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                                {d.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="cell-name">{d.name}</span>
                            </div>
                          </td>
                          <td>{d.phone || '—'}</td>
                          <td>
                            <span className="cell-tag green">{d.licenseType || '—'}</span>
                          </td>
                          <td>
                            {d.availability?.days?.length > 0 ? (
                              <div className="cell-tags">
                                {d.availability.days.map((day, i) => (
                                  <span className="cell-tag blue" key={i}>{day.slice(0, 3)}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">Not set</span>
                            )}
                          </td>
                          <td>
                            <button className="del-btn" onClick={() => handleDelete('driver', d._id, d.name)} title="Delete driver">
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ========== VEHICLES TABLE ========== */}
            {activeTab === 'vehicles' && (
              <div className="table-wrapper">
                {vehicles.length === 0 ? (
                  <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h10l4 5v5a2 2 0 01-2 2M5 17a2 2 0 002 2h10a2 2 0 002-2" />
                      <circle cx="7.5" cy="17.5" r="2.5" />
                      <circle cx="16.5" cy="17.5" r="2.5" />
                    </svg>
                    <h3>No vehicles yet</h3>
                    <p>Click "Add Vehicle" to register a fleet vehicle.</p>
                  </div>
                ) : (
                  <table className="dash-table" id="vehicles-table">
                    <thead>
                      <tr>
                        <th>Vehicle No.</th>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Fuel</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((v) => (
                        <tr key={v._id}>
                          <td>
                            <div className="name-cell">
                              <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                  <path d="M5 17h14" />
                                  <circle cx="7.5" cy="17.5" r="2" />
                                  <circle cx="16.5" cy="17.5" r="2" />
                                </svg>
                              </div>
                              <span className="cell-name">{v.vehicleNumber}</span>
                            </div>
                          </td>
                          <td>
                            <span className="cell-tag amber">{v.type}</span>
                          </td>
                          <td>{v.capacity} seats</td>
                          <td>{v.fuelType || '—'}</td>
                          <td>
                            <button className="del-btn" onClick={() => handleDelete('vehicle', v._id, v.vehicleNumber)} title="Delete vehicle">
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default Dashboard;
