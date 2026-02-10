import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Globe,
  MessageSquare,
  Zap,
  Target,
  BarChart,
  Users,
  Play,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Lenis from "@studio-freight/lenis";
import ThemeToggle from "../components/ThemeToggle";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Hover card component with magnetic effect
const HoverCard = ({ children, className, glowColor = "emerald" }) => {
  const glowColors = {
    emerald: "hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]",
    purple: "hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]",
    pink: "hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]",
    yellow: "hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]",
    cyan: "hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]",
    orange: "hover:shadow-[0_0_40px_rgba(251,146,60,0.4)]",
  };
  
  return (
    <motion.div
      className={`${className} ${glowColors[glowColor]} transition-all duration-500`}
      whileHover={{ 
        scale: 1.03, 
        y: -12,
        boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// Animated button component
const AnimatedButton = ({ children, onClick, className, variant = "primary" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 hover:from-emerald-400 hover:via-green-500 hover:to-lime-400 text-white shadow-lg shadow-sky-500/30 hover:shadow-green-400/50",
    secondary: "bg-white/5 border-2 border-sky-400/60 hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-500/20 hover:to-blue-500/20 text-white backdrop-blur-md",
    dark: "bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 hover:from-sky-900 hover:via-blue-900 hover:to-indigo-900 text-white shadow-lg hover:shadow-sky-500/30",
    accent: "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-blue-400 hover:via-sky-400 hover:to-cyan-400 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-400/50"
  };
  
  return (
    <motion.button
      onClick={onClick}
      className={`${variants[variant]} ${className} relative overflow-hidden group transition-all duration-300`}
      whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        initial={{ x: "-100%", opacity: 0 }}
        whileHover={{ x: "100%", opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      {children}
    </motion.button>
  );
};

// Floating animation for decorative elements
const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.querySelector(sectionId);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, {
        offset: -100,
        duration: 1.5,
      });
    }
    closeMobileMenu();
  };

  return (
    <div className="bg-white text-sky-600">
      <div className="bg-skin-primary text-skin-primary transition-colors duration-300">
      {/* Navbar */}
      <nav className="
fixed top-6 left-1/2 -translate-x-1/2
w-[95%] max-w-7xl
bg-white/10
backdrop-blur-xl
rounded-full
border border-white/20
z-50
text-skin-primary
">


        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-white-800">Interv</span>
            <span className="text-emerald-500">yo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "#features")}
              className="text-gray-400 hover:text-cyan-400 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] cursor-pointer"
            >
              Features
            </a>
            <a
              href="/about"
              className="text-gray-400 hover:text-fuchsia-400 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]"


            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "#how-it-works")}
              className="text-gray-400 hover:text-amber-400 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"


            >
              How it Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "#pricing")}
              className="text-gray-400 hover:text-emerald-400 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "#faq")}
              className="text-gray-400 hover:text-violet-400 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] cursor-pointer"
            >
              FAQ
            </a>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-rose-400 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {token ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-cyan-500/40 transition-all duration-300"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-slate-800 to-gray-900 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 text-sm hover:shadow-purple-500/30"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-cyan-500/40 transition-all duration-300 text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-sky-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 mx-2 overflow-hidden">
            <div className="p-6 space-y-4">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "#features")}
                className="block text-gray-500 hover:text-cyan-500 font-medium py-3 px-4 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "#how-it-works")}
                className="block text-gray-500 hover:text-amber-500 font-medium py-3 px-4 rounded-lg hover:bg-amber-500/10 transition-all duration-300 cursor-pointer"
              >
                How it Works
              </a>
              <a
                href="/pricing"
                onClick={(e) => scrollToSection(e, "#pricing")}
                className="block text-gray-500 hover:text-emerald-500 font-medium py-3 px-4 rounded-lg hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "#faq")}
                className="block text-gray-500 hover:text-violet-500 font-medium py-3 px-4 rounded-lg hover:bg-violet-500/10 transition-all duration-300 cursor-pointer"
              >
                FAQ
              </a>
              <a
                href="/about"
                className="block text-gray-500 hover:text-fuchsia-500 font-medium py-3 px-4 rounded-lg hover:bg-fuchsia-500/10 transition-all duration-300"
              >
                About
              </a>
              <Link
                to="/contact"
                className="block text-gray-500 hover:text-rose-500 font-medium py-3 px-4 rounded-lg hover:bg-rose-500/10 transition-all duration-300"
              >
                Contact
              </Link>

              <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-600 font-medium">Theme</span>
                <ThemeToggle />
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      closeMobileMenu();
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-cyan-500/40 transition-all duration-300"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-slate-800 to-gray-900 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 text-center hover:shadow-purple-500/30"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-cyan-500/40 transition-all duration-300 text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated sweep glow - Multiple layers for intensity */}
        <motion.div
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent blur-3xl"
          animate={{ x: ["-50%", "150%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent blur-2xl"
          animate={{ x: ["150%", "-50%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-violet-500/20 mb-6 border border-emerald-500/30 px-4 py-2 rounded-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span 
              className="w-2 h-2 bg-emerald-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-medium text-emerald-300 text-sm">AI-Powered Interview Platform</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
          Ace Your Next Tech
          <br />
          Interview with{" "}
          <motion.span 
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: "200% auto" }}
          >
            AI
          </motion.span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Coaching</span>
        </motion.h1>
        <motion.p>
          <br />
          and receive instant, actionable feedback to boost your confidence.
        </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnimatedButton
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4  rounded-xl font-semibold text-lg flex items-center gap-2"
              variant="primary"
            >
              Start Practicing Free <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>{'->'}</motion.span>
            </AnimatedButton>
            <AnimatedButton
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2"
              variant="secondary"
            >
              <Play className="w-5 h-5" /> Try Now
            </AnimatedButton>
          </motion.div>

          {/* Mockup */}
          <motion.div 
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="bg-gray-900 rounded-t-2xl p-3 relative">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
                        Frontend Developer
                      </span>
                      <span className="text-gray-500 text-sm">
                        Question 3 of 10
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-6">
                      Explain the difference between useState and useReducer in
                      React.
                    </h3>
                    <div className="space-y-3 mb-6">
                      <div className="h-3 bg-gray-100 rounded"></div>
                      <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-100 rounded w-3/5"></div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-sm">Recording your answer...</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-emerald-500">✓</div>
                      <h4 className="font-semibold">AI Feedback</h4>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Clarity</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Technical Depth
                        </span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Structure</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Great structure! Consider adding a practical example...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <div className="mt-16 px-4"> 
            <p className="text-sky-600 mb-8 text-center">
              <span className="bg-yellow-400 px-2 py-1 inline-block leading-relaxed max-w-full">
                Trusted by <strong>5,000+</strong> job seekers preparing for
                their dream roles
              </span>
            </p>
            <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
              <div className="grid grid-cols-2 md:grid-cols-4 border border-gray-700 max-w-7xl mx-auto min-w-[600px] md:min-w-0 bg-gray-900">
                {/* Company grid items here, only once */}
                <div className="flex flex-col items-center justify-center p-8 border-r border-b border-gray-700 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-emerald-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-cyan-400 transition-colors">TechCorp</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-cyan-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border-r border-b border-gray-700 hover:bg-gradient-to-br hover:from-violet-500/10 hover:to-purple-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-violet-400 transition-colors">Innovate Inc</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-violet-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border-r border-b border-gray-700 hover:bg-gradient-to-br hover:from-fuchsia-500/10 hover:to-pink-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-fuchsia-400 transition-colors">DevStudio</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-fuchsia-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border-b border-gray-700 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-orange-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-amber-400 transition-colors">CodeAcademy</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-amber-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border-r border-gray-700 hover:bg-gradient-to-br hover:from-rose-500/10 hover:to-red-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-rose-400 transition-colors">StartupHub</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-rose-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border-r border-gray-700 hover:bg-gradient-to-br hover:from-teal-500/10 hover:to-cyan-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-teal-400 transition-colors">CareerBoost</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-teal-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border-r border-gray-700 hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-blue-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-indigo-400 transition-colors">HireRight</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-indigo-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-green-500/10 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                  <span className="text-2xl font-bold text-white mb-2 text-center group-hover:text-emerald-400 transition-colors">SkillBoost</span>
                  <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-emerald-300 transition-all flex items-center gap-1">Learn More →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ...existing code... */}

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-100 via-white to-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <motion.div 
              className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-2 rounded-full mb-4 font-semibold border border-emerald-200"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">nail your interview</span>
            </h2>
            <p className="text-xl text-gray-600">
              From practice questions to AI feedback, Intervyo gives you the
              tools to prepare smarter
              <br />
              and interview with confidence.
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* AI-Powered Questions - Emerald Green Card */}
            <HoverCard className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-10 shadow-lg border-4 border-gray-900 min-h-[280px] flex flex-col justify-center cursor-pointer" glowColor="emerald">
              <motion.div variants={staggerItem}>
                <motion.div 
                  className="text-yellow-200 text-6xl font-bold mb-3"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  50K+
                </motion.div>
                <h3 className="text-yellow-100 text-xl font-medium">
                  Questions Asked
                </h3>
                <p className="text-emerald-100 mt-2">last month</p>
              </motion.div>
            </HoverCard>

            {/* Realistic Scenarios - Gray Card */}
            <HoverCard className="bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-700 rounded-3xl p-10 shadow-lg border-4 border-gray-900 text-white min-h-[280px] flex flex-col justify-center cursor-pointer">
              <motion.div variants={staggerItem}>
                <h3 className="text-amber-300 text-2xl font-semibold mb-4">
                  Active Users
                </h3>
                <motion.div 
                  className="text-amber-200 text-7xl font-bold mb-6"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  12K
                </motion.div>
              </motion.div>
            </HoverCard>

            {/* Instant Feedback - Yellow Lime Card */}
            <HoverCard className="bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-300 rounded-3xl p-10 shadow-lg border-4 border-gray-900 min-h-[280px] flex flex-col justify-center cursor-pointer" glowColor="yellow">
              <motion.div variants={staggerItem}>
                <motion.div 
                  className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-4 inline-block mb-6 shadow-lg"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap className="w-8 h-8 text-sky-600" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-sky-600">
                  Instant Feedback
                </h3>
                <p className="text-gray-800 leading-relaxed">
                  Real-time AI analysis of your responses
                </p>
              </motion.div>
            </HoverCard>

            {/* Large Purple Card with Chart */}
            <HoverCard className="md:col-span-2 bg-gradient-to-br from-purple-200 via-violet-200 to-fuchsia-200 rounded-3xl p-10 shadow-lg border-4 border-gray-900 cursor-pointer" glowColor="purple">
              <motion.div variants={staggerItem}>
                <motion.div 
                  className="bg-gradient-to-r from-purple-300 to-violet-300 rounded-2xl px-6 py-2 inline-block mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-xl font-bold text-sky-600">
                    Interview Success Rate
                  </h3>
                </motion.div>
                <motion.div 
                  className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  87%
                </motion.div>
                <div className="flex items-center gap-2 text-purple-700 mb-6"></div>
                <motion.div 
                  className="h-32 bg-gradient-to-r from-purple-300/50 to-violet-300/50 rounded-xl overflow-hidden relative"
                >
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-500 to-transparent"
                    initial={{ height: 0 }}
                    whileInView={{ height: "87%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </motion.div>
              </motion.div>
            </HoverCard>

            {/* Skill Assessment - Pink Card */}
            <HoverCard className="bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 rounded-3xl p-10 shadow-lg border-4 border-gray-900 cursor-pointer" glowColor="pink">
              <motion.div variants={staggerItem}>
                <motion.div 
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 mb-6 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-4xl">🎯</div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-sky-600">
                  Assessment
                </h3>
              </motion.div>
            </HoverCard>

            {/* Progress Tracking - Yellow Card */}
            <HoverCard className="bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-300 rounded-3xl p-10 shadow-lg border-4 border-gray-900 cursor-pointer" glowColor="yellow">
              <motion.div variants={staggerItem}>
                <h3 className="text-2xl font-bold mb-3 text-sky-600">
                  Practice Sessions
                </h3>
                <motion.div 
                  className="text-5xl font-bold mb-2 text-sky-600"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                >
                  2.4K
                </motion.div>
                <p className="text-gray-800 mb-4">Completed this week</p>
              </motion.div>
            </HoverCard>

            {/* Industry Insights - Emerald Card - Wide */}
            <HoverCard className="md:col-span-2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-10 shadow-lg border-4 border-gray-900 text-white flex items-center justify-between cursor-pointer" glowColor="emerald">
              <motion.div className="flex-1" variants={staggerItem}>
                <h3 className="text-3xl font-bold mb-3 text-amber-200">
                  We Build Future of
                </h3>
                <h3 className="text-3xl font-bold mb-4 text-amber-100">
                  Interview Prep
                </h3>
                <p className="text-emerald-100">
                  Crafting Meaningful AI-Driven Experience
                </p>
              </motion.div>
              <motion.div 
                className="w-32 h-32 rounded-full border-4 border-amber-200 flex items-center justify-center bg-gradient-to-br from-emerald-400/20 to-teal-400/20"
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl text-amber-200">⊕</div>
              </motion.div>
            </HoverCard>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white px-4">
              Here's why you'd choose{" "}
              <span className="text-emerald-500">us</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 px-4">
              The experience of a{" "}
              <span className="font-semibold text-emerald-500">
                professional platform
              </span>
              , Flexibility of a{" "}
              <span className="font-semibold text-emerald-500">
                custom solution
              </span>
              ,<br className="hidden md:block" />
              and the comfort of an{" "}
              <span className="font-semibold text-emerald-500">
                all-in-one tool
              </span>
              .
            </p>
          </div>

          {/* Mobile View - Stacked Cards */}
          <div className="block md:hidden space-y-4">
            {/* AI-Powered */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">
                  AI-Powered
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Quick
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Custom
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                  ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Affordable
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Practice */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">
                  Voice Practice
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">
                    —
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Quick
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Custom
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">
                    —
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Affordable
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">
                  Analytics
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Quick
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">
                  —
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Custom
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Affordable
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">
                  Pricing
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">
                    —
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Quick
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Custom
                  </span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">
                    ✓
                  </span>
                  <span className="text-gray-300 text-xs font-semibold">
                    Affordable
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop View - Table Grid */}
          <div className="hidden md:grid grid-cols-4 gap-1 bg-gray-800 p-1 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header Row */}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-300">
                Quick
              </h3>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-300">
                Custom
              </h3>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-300">
                Affordable
              </h3>
            </div>

            {/* Row 1 - AI-Powered */}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">
                AI-Powered
              </h4>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>

            {/* Row 2 - Voice Practice */}}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">
                Voice Practice
              </h4>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">
                —
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">
                —
              </span>
            </div>

            {/* Row 3 - Analytics */}}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">
                Analytics
              </h4>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">
                —
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>

            {/* Row 4 - Pricing */}}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">
                Pricing
              </h4>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">
                —
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>
            <div className="bg-gray-700 hover:bg-gray-600 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px] transition-colors duration-300">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 text-4xl lg:text-5xl font-bold">
                ✓
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <motion.div 
              className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-2 rounded-full mb-6 font-semibold text-sm tracking-wide border border-emerald-200"
              whileHover={{ scale: 1.05 }}
            >
              How It Works
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-sky-600">
              Four steps to
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">interview success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes interview prep efficient and
              effective.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {["Choose Your Role", "Practice Interviews", "Get AI Feedback", "Track Progress"].map((title, index) => {
              const descriptions = [
                "Select from 50+ tech roles including Frontend, Backend, Data Science, DevOps, and more. We'll tailor questions to match.",
                "Answer realistic interview questions through voice or text. Our AI simulates a real interviewer experience.",
                "Receive instant, detailed feedback on clarity, technical accuracy, structure, and areas for improvement.",
                "Monitor your improvement with analytics dashboards and prepare strategically for your actual interview."
              ];
              const gradients = [
                "from-emerald-500 to-teal-500",
                "from-violet-500 to-purple-500",
                "from-amber-500 to-orange-500",
                "from-pink-500 to-rose-500"
              ];
              
              return (
                <motion.div 
                  key={index}
                  className="flex flex-col md:flex-row gap-6 items-start bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100 group cursor-pointer"
                  variants={staggerItem}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 10,
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
                    borderColor: "rgb(16, 185, 129)" 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    0{index + 1}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-sky-600 group-hover:text-emerald-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {descriptions[index]}
                    </p>
                  </div>
                  <motion.div 
                    className="text-gray-300 group-hover:text-emerald-500 text-4xl hidden md:block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        {/* Background effects */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              We don't gossip but some
              <br />
              people have been saying
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">some things...</span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Testimonial 1 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(16, 185, 129)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "Just landed my dream job at Google! The AI feedback was
                incredibly accurate and helped me improve my answers."
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  PS
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Priya Sharma</p>
                  <p className="text-gray-500 text-xs">Software Engineer</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(139, 92, 246)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "The mock interviews felt so realistic! I was actually nervous
                practicing, which helped me perform better in the real thing."
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  RK
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Rahul Kumar</p>
                  <p className="text-gray-500 text-xs">Full Stack Developer</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(251, 191, 36)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "I went from failing interviews to getting 3 offers in 2 weeks.
                The AI coaching is next level!"
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  AP
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Aisha Patel</p>
                  <p className="text-gray-500 text-xs">Data Scientist</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 4 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(236, 72, 153)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "The role-specific questions were spot on. Got asked almost the
                exact same questions in my Amazon interview!"
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  AS
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Arjun Singh</p>
                  <p className="text-gray-500 text-xs">Backend Engineer</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 5 - Highlighted */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 shadow-lg cursor-pointer relative overflow-hidden"
              variants={staggerItem}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-white/10"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-white mb-4 relative z-10">
                "Best $0 I ever spent! The free tier alone got me
                interview-ready. Now I'm at Microsoft!"
              </p>
              <div className="flex items-center gap-2 relative z-10">
                <motion.div 
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  AD
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Ananya Desai</p>
                  <p className="text-emerald-100 text-xs">Frontend Developer</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 6 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(34, 211, 238)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "The instant feedback saved me so much time. No more wondering
                if my answers were good enough!"
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  VR
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Vikram Reddy</p>
                  <p className="text-gray-500 text-xs">DevOps Engineer</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 7 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(16, 185, 129)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "Practiced 50+ questions and got detailed feedback on each. My
                confidence went through the roof!"
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  SG
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Sneha Gupta</p>
                  <p className="text-gray-500 text-xs">Product Manager</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 8 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(168, 85, 247)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "The analytics dashboard showed me exactly where I was weak.
                Improved my technical depth score from 3 to 5 stars!"
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  RM
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Rohan Mehta</p>
                  <p className="text-gray-500 text-xs">Cloud Architect</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 9 */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50 group cursor-pointer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -5, borderColor: "rgb(244, 114, 182)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-300 mb-4">
                "Voice practice feature is a game changer. Finally got
                comfortable speaking my answers out loud!"
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  NV
                </motion.div>
                <div>
                  <p className="text-white text-sm font-medium">Neha Verma</p>
                  <p className="text-gray-500 text-xs">ML Engineer</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        {/* Background decorations */}
        <motion.div 
          className="absolute top-40 -left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Down to business.
              <br />
              Pick your plan <motion.span 
                className="inline-block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >↓</motion.span>
            </h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Free Plan */}
            <motion.div 
              className="bg-white rounded-lg p-10 shadow-2xl border-8 border-gray-900 hover:border-sky-400 flex flex-col relative overflow-hidden group cursor-pointer transition-colors duration-300"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -10, boxShadow: "0 0 50px rgba(56, 189, 248, 0.3)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <h3 className="text-4xl font-bold text-sky-600 mb-6">Free</h3>

              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Get started with basic interview prep
              </p>

              <div className="text-6xl font-bold text-gray-900 mb-8">
                ₹0
                <span className="text-xl text-gray-500 font-normal">
                  /month
                </span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    2 interviews/month
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Basic analytics
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Community support
                  </p>
                </div>
              </div>

              <AnimatedButton
                onClick={() => navigate("/register")}
                className="w-full py-5 font-bold text-lg uppercase tracking-wide mt-auto rounded-lg"
                variant="primary"
              >
                Get Started
              </AnimatedButton>
            </motion.div>

            {/* Pro Plan - Most Popular */}
            <motion.div 
              className="bg-white rounded-lg p-10 shadow-2xl border-8 border-sky-400 hover:border-sky-300 relative flex flex-col overflow-hidden group cursor-pointer transition-colors duration-300"
              variants={staggerItem}
              whileHover={{ scale: 1.05, y: -15, boxShadow: "0 0 60px rgba(56, 189, 248, 0.4)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute -top-1 -right-1 bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg"
                initial={{ x: 100 }}
                whileInView={{ x: 0 }}
                transition={{ delay: 0.5 }}
              >
                POPULAR
              </motion.div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-sky-400/15 via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2"></div>

              <h3 className="text-4xl font-bold text-sky-600 mb-6">Pro</h3>

              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Unlimited practice - AI feedback - Land your dream job
              </p>

              <div className="text-6xl font-bold text-gray-900 mb-8">
                ₹999
                <span className="text-xl text-gray-500 font-normal">
                  /month
                </span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Unlimited interviews
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Advanced analytics & reports
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Priority support
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Voice & video recording
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Custom questions
                  </p>
                </div>
              </div>

              <AnimatedButton
                onClick={() => navigate("/register")}
                className="w-full py-5 font-bold text-lg uppercase tracking-wide mt-auto rounded-lg"
                variant="accent"
              >
                Start Free Trial
              </AnimatedButton>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              className="bg-white rounded-lg p-10 shadow-2xl border-8 border-gray-900 hover:border-sky-400 flex flex-col relative overflow-hidden group cursor-pointer transition-colors duration-300"
              variants={staggerItem}
              whileHover={{ scale: 1.03, y: -10, boxShadow: "0 0 50px rgba(56, 189, 248, 0.3)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <h3 className="text-4xl font-bold text-sky-600 mb-6">
                Enterprise
              </h3>

              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Custom solutions for teams and organizations
              </p>

              <div className="text-6xl font-bold text-sky-600 mb-8">
                Custom
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Everything in Pro
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Custom branding
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Dedicated support
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    Team management
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sky-600 text-lg font-medium">
                    SSO integration
                  </p>
                </div>
              </div>

              <AnimatedButton
                className="w-full py-5 font-bold text-lg uppercase tracking-wide mt-auto rounded-lg"
                variant="dark"
              >
                Contact Sales
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-24 px-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            I've got questions.
          </h2>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="border-b-4 border-white/30 hover:border-amber-300 pb-6 transition-colors duration-300">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8 group-hover:text-amber-200 transition-colors">
                  How does AI feedback work?
                </h3>
                <ChevronDown
                  className={`w-12 h-12 text-white group-hover:text-amber-300 flex-shrink-0 transition-all duration-300 ${openFaq === 0 ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 0 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Our AI analyzes your responses in real-time, evaluating
                  clarity, technical accuracy, structure, and completeness.
                  You'll receive instant, actionable feedback on how to improve
                  your answers, just like a real interviewer would provide.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border-b-4 border-white/30 hover:border-fuchsia-300 pb-6 transition-colors duration-300">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8 group-hover:text-fuchsia-200 transition-colors">
                  Can I practice for specific tech roles?
                </h3>
                <ChevronDown
                  className={`w-12 h-12 text-white group-hover:text-fuchsia-300 flex-shrink-0 transition-all duration-300 ${openFaq === 1 ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 1 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Yes! We have role-specific question banks for 50+ tech
                  positions including Frontend, Backend, Full Stack, DevOps,
                  Data Science, ML Engineer, Product Manager, and more. Each
                  role has curated questions that match real interview
                  scenarios.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border-b-4 border-white/30 hover:border-violet-300 pb-6 transition-colors duration-300">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8 group-hover:text-violet-200 transition-colors">
                  How fast will I see improvement?
                </h3>
                <ChevronDown
                  className={`w-12 h-12 text-white group-hover:text-violet-300 flex-shrink-0 transition-all duration-300 ${openFaq === 2 ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 2 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Most users see significant improvement within 1-2 weeks of
                  consistent practice. Our analytics dashboard tracks your
                  progress over time, showing improvements in clarity, technical
                  depth, and structure scores. Practice 3-5 interviews per week
                  for best results.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border-b-4 border-white/30 hover:border-rose-300 pb-6 transition-colors duration-300">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8 group-hover:text-rose-200 transition-colors">
                  Is voice practice really necessary?
                </h3>
                <ChevronDown
                  className={`w-12 h-12 text-white group-hover:text-rose-300 flex-shrink-0 transition-all duration-300 ${openFaq === 3 ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 3 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Absolutely! Speaking your answers out loud helps you practice
                  articulation, pacing, and confidence. Many candidates freeze
                  during verbal interviews even when they know the answer. Our
                  voice practice feature simulates real interview conditions so
                  you're prepared.
                </p>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border-b-4 border-white/30 hover:border-cyan-300 pb-6 transition-colors duration-300">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8 group-hover:text-cyan-200 transition-colors">
                  Can I use this to prepare my team for interviews?
                </h3>
                <ChevronDown
                  className={`w-12 h-12 text-white group-hover:text-cyan-300 flex-shrink-0 transition-all duration-300 ${openFaq === 4 ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 4 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Yes! Our Enterprise plan includes team management features,
                  custom branding, and dedicated support. Perfect for bootcamps,
                  training programs, and companies preparing candidates for
                  technical interviews. Contact our sales team for custom
                  solutions.
                </p>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="border-b-4 border-white/30 hover:border-lime-300 pb-6 transition-colors duration-300">
              <button
                onClick={() => toggleFaq(5)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8 group-hover:text-lime-200 transition-colors">
                  What companies do your questions prepare me for?
                </h3>
                <ChevronDown
                  className={`w-12 h-12 text-white group-hover:text-lime-300 flex-shrink-0 transition-all duration-300 ${openFaq === 5 ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 5 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Our question banks are designed to prepare you for interviews
                  at top tech companies including FAANG (Facebook/Meta, Amazon,
                  Apple, Netflix, Google), Microsoft, startups, and mid-size
                  tech companies. The questions cover common patterns and topics
                  asked across the industry.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
          }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <motion.span 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  Intervyo
                </motion.span>{" "}
                is the only
                <br />
                prep tool you'll ever need
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of candidates who've landed their dream
                <br />
                tech jobs.
              </p>
            </div>
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <AnimatedButton
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-white text-sky-100 rounded-xl font-semibold text-lg flex items-center gap-2"
              >
                Get Started <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}></motion.span>
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Close bg-skin-primary wrapper */}
    </div>
    {/* Close main wrapper */}
  </div>
  );
}
