import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../services/api';

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        await API.get('/auth/verify');
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, []);

  if (isChecking) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
