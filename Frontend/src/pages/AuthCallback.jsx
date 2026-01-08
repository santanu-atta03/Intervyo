// frontend/src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL_LOGIN = 'https://intervyo.onrender.com';
// const API_URL = 'http://localhost:5000';
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL_LOGIN}/api/auth/me`, {
      credentials: 'include', // REQUIRED for cookies
    })
      .then((res) => {
        console.log("res : ",res)
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        console.log("Data : ",data)
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
