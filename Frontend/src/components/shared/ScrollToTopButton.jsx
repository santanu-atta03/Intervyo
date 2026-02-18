import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

// ScrollToTopButton component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress = Math.min((scrollTop / docHeight) * 100, 100);
    setScrollProgress(progress);

    setIsVisible(scrollTop > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isComplete = scrollProgress >= 99.5;

  // Progress ring
  const wrapperStyles = {
    position: "fixed",
    bottom: "30px",
    left: "30px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: `conic-gradient(
      #10b981 ${scrollProgress}%,
      rgba(255,255,255,0.15) ${scrollProgress}%
    )`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    animation: isComplete ? "glowPulse 1.6s ease-in-out infinite" : "none",
  };

  // Inner button
  const buttonStyles = {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    backgroundColor: isHovered ? "#059669" : "#10b981",
    color: "white",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: isHovered
      ? "0 6px 12px rgba(0,0,0,0.3)"
      : "0 4px 8px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    outline: "none",
  };

  const iconStyles = {
    fontSize: "20px",
    transform: isHovered ? "translateY(-2px)" : "none",
    transition: "transform 0.3s ease",
  };

  return (
    <>
      {/* Inject keyframes once */}
      <style>
        {`
          @keyframes glowPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(16,185,129,0.7);
            }
            70% {
              box-shadow: 0 0 0 14px rgba(16,185,129,0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(16,185,129,0);
            }
          }
        `}
      </style>

      {isVisible && (
        <div style={wrapperStyles}>
          <button
            onClick={scrollToTop}
            style={buttonStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Scroll to top"
          >
            <FaArrowUp style={iconStyles} />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
