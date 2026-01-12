// src/pages/NotFound.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const [animate, setAnimate] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    gradientBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '400px',
      background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.8), transparent)',
      zIndex: 0
    },
    content: {
      textAlign: 'center',
      background: 'rgba(30, 41, 59, 0.8)',
      padding: '3rem 2rem',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      maxWidth: '500px',
      width: '100%',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      zIndex: 1,
      position: 'relative',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease'
    },
    errorCode: {
      fontSize: '6rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      margin: '0',
      lineHeight: '1',
      marginBottom: '1rem'
    },
    errorTitle: {
      fontSize: '2rem',
      color: '#f8fafc',
      margin: '0.5rem 0',
      fontWeight: '600'
    },
    errorMessage: {
      color: '#cbd5e1',
      marginBottom: '2rem',
      lineHeight: '1.6',
      fontSize: '1.1rem',
      opacity: 0.9
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    homeButton: {
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: 'white',
      display: 'inline-block',
      minWidth: '160px'
    },
    dashboardButton: {
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: 'pointer',
      fontSize: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      display: 'inline-block',
      minWidth: '160px'
    },
    backButton: {
      padding: '12px 28px',
      borderRadius: '12px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      fontSize: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#cbd5e1',
      display: 'inline-block',
      minWidth: '160px'
    }
  };

  const handleButtonHover = (e, isPrimary = true) => {
    e.target.style.transform = 'translateY(-2px)';
    if (isPrimary) {
      e.target.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)';
    } else {
      e.target.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.1)';
    }
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.container}>
      {/* Subtle gradient background */}
      <div style={styles.gradientBg}></div>
      
      {/* Glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }}></div>

      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <h2 style={styles.errorTitle}>Page Not Found</h2>
        <p style={styles.errorMessage}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div style={styles.actions}>
          <Link 
            to="/" 
            style={styles.homeButton}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={handleButtonLeave}
          >
            Go to Home
          </Link>
          
          {token ? (
            <Link 
              to="/dashboard"
              style={styles.dashboardButton}
              onMouseEnter={(e) => handleButtonHover(e, false)}
              onMouseLeave={handleButtonLeave}
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/register"
              style={styles.dashboardButton}
              onMouseEnter={(e) => handleButtonHover(e, false)}
              onMouseLeave={handleButtonLeave}
            >
              Get Started
            </Link>
          )}
          
          <button 
            style={styles.backButton}
            onClick={() => window.history.back()}
            onMouseEnter={(e) => handleButtonHover(e, false)}
            onMouseLeave={handleButtonLeave}
          >
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: animate ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Try these pages instead:
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/interview-setup" 
              style={{ 
                color: '#cbd5e1', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#6366f1'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Practice Interview
            </Link>
            <Link 
              to="/leaderboard" 
              style={{ 
                color: '#cbd5e1', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#6366f1'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Leaderboard
            </Link>
            <Link 
              to="/blog" 
              style={{ 
                color: '#cbd5e1', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#6366f1'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.8rem',
        opacity: 0.7
      }}>
        © {new Date().getFullYear()} Intervyo. All rights reserved.
      </div>
    </div>
  );
};

export default NotFound;