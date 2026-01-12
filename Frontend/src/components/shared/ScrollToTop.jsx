import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Button styles - Positioned on the LEFT side to avoid chatbot overlap
  const buttonStyles = {
    position: 'fixed',
    bottom: '30px',
    left: '30px', // Changed from right to left
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: isHovered ? '#0056b3' : '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isHovered ? '0 6px 12px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
    transition: 'all 0.3s ease',
    opacity: isHovered ? 1 : 0.9,
    transform: isHovered ? 'translateY(-3px)' : 'none',
    outline: 'none'
  };

  // Icon styles
  const iconStyles = {
    fontSize: '20px',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'translateY(-2px)' : 'none'
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={buttonStyles}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Scroll to top"
        >
          <FaArrowUp style={iconStyles} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
