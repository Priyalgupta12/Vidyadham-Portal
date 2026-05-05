import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/login', { replace: true });
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'add-teacher',
      label: 'Add Teacher',
      path: '/add-teacher',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="16" y1="11" x2="22" y2="11" />
        </svg>
      ),
    },
    {
      id: 'add-driver',
      label: 'Add Driver',
      path: '/add-driver',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" />
        </svg>
      ),
    },
    {
      id: 'add-vehicle',
      label: 'Add Vehicle',
      path: '/add-vehicle',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h10l4 5v5a2 2 0 01-2 2M5 17a2 2 0 002 2h10a2 2 0 002-2" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: 'teacher-assistant',
      label: 'Teacher Assistant',
      path: '/teacher-assistant',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.657.896 3.105 2.232 3.888L9 12l-1.5 2 1 1.5L7 18l1 2h8l1-2-1.5-2.5 1-1.5L15 12l-.732-1.612A4.5 4.5 0 0016.5 6.5 4.5 4.5 0 0012 2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <img src="/vidyadham-logo.jpeg" alt="Vidya Dham" className="sidebar-logo-img" />
        </div>
        <div>
          <h3>Vidya Dham</h3>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${location.pathname === item.path ? 'selected' : ''}`}
            id={`nav-${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">
            {adminData.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="admin-details">
            <span className="admin-role">Admin</span>
            <span className="admin-email">{adminData.email || 'admin'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} id="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
