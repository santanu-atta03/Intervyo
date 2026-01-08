import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL_LOGIN = 'https://intervyo.onrender.com';
// const API_URL = 'http://localhost:5000';
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login?error=missing_token');
      return;
    }

    // Store token
    localStorage.setItem('token', token);

    // Fetch user using Bearer token
    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      })
      .catch(() => {
        navigate('/login?error=auth_failed');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
