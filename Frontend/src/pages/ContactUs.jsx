import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { submitContactForm } from "../services/operations/contactAPI";
import Lenis from "@studio-freight/lenis";
export default function ContactUs() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const result = await submitContactForm(formData, setLoading);
    if (result) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Navbar - Copied from Landing.jsx but slightly modified for links */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-gray-200">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-gray-900">Interv</span>
            <span className="text-emerald-500">yo</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {/* Use Link to Home with hash if possible, or just redirect to home sections */}
            <Link
              to="/#features"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/#how-it-works"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              How it Works
            </Link>
            <Link
              to="/#pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              Pricing
            </Link>
            <Link
              to="/#faq"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 mx-2 overflow-hidden">
            <div className="p-6 space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                About
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-center"
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
      <section className="pt-40 pb-20 px-6 relative overflow-hidden bg-gray-950 text-white">
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
        <div
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl"
          style={{ animation: "sweepGlow 8s ease-in-out infinite" }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
            Have questions or need support? We're here to help you succeed in
            your interview journey.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          {/* Contact Info */}
          <div className="md:w-1/3 space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form or reach us directly.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Email Us</h4>
                <p className="text-gray-600">support@intervyo.com</p>
              </div>
            </div>
            {/* 
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Visit Us</h4>
                        <p className="text-gray-600">123 Interview Lane, Tech City</p>
                    </div>
                </div>
                */}
          </div>

          {/* Form */}
          <div className="md:w-2/3 bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
            <form onSubmit={handleOnSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleOnChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={handleOnChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  value={message}
                  onChange={handleOnChange}
                  rows="5"
                  placeholder="Tell us what you need..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-black text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
