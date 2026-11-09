import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { IntervyoLoader } from './Loader/Loader';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setAuthenticated(!!user);
    setLoading(false);
  }, []);

  if (loading) return <IntervyoLoader label="Checking your account" />;
  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
}
