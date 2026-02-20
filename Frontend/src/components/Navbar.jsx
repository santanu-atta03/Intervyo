import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, Home } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const closeMenu = () => setMobileMenuOpen(false);

  /* ---------------- FORCE RE-ANIMATION ON HOME ---------------- */
  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Force reload to replay animations
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } else {
      navigate("/");
    }
  };

  /* ---------------- SMOOTH SCROLL ---------------- */
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMenu();
  };

  /* ---------------- SPY NAVIGATION ---------------- */
  useEffect(() => {
    const sections = ["features", "how-it-works", "pricing", "faq"];

    const handleScroll = () => {
      let current = "";
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = id;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (id) =>
    `relative cursor-pointer transition-colors duration-300 ${activeSection === id
      ? "text-emerald-500"
      : "text-gray-900 dark:text-gray-300 hover:text-emerald-500"
    }`;

  const pageActive = (path) =>
    location.pathname === path
      ? "text-emerald-500 underline underline-offset-8"
      : "text-gray-900 dark:text-gray-300 hover:text-emerald-500";

  return (
    <nav
      className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl 
      bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl 
      rounded-full shadow-lg z-50 border border-white/30 dark:border-gray-700/40 transition-all duration-300"
    >
      <div className="px-6 md:px-10 py-4 flex items-center justify-between">

        {/* Logo (No gap now) */}
        <div className="flex items-center gap-6">
          <span
            onClick={handleHomeClick}
            className="cursor-pointer text-xl md:text-2xl font-bold"
          >
            <span className="text-gray-900 dark:text-white">Interv</span>
            <span className="text-emerald-500">yo</span>
          </span>

          {/* Home Icon near features */}
          <Home
            size={20}
            className={`cursor-pointer ${location.pathname === "/"
                ? "text-emerald-500"
                : "text-gray-900 dark:text-gray-300 hover:text-emerald-500"
              }`}
            onClick={handleHomeClick}
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10 ml-6">
          <span onClick={() => scrollToSection("features")} className={linkClass("features")}>
            Features
          </span>

          <Link to="/about" className={pageActive("/about")}>
            About
          </Link>

          <span onClick={() => scrollToSection("how-it-works")} className={linkClass("how-it-works")}>
            How it Works
          </span>

          <span onClick={() => scrollToSection("pricing")} className={linkClass("pricing")}>
            Pricing
          </span>

          <span onClick={() => scrollToSection("faq")} className={linkClass("faq")}>
            FAQ
          </span>

          <Link to="/contact" className={pageActive("/contact")}>
            Contact
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          {token ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-900 dark:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden absolute top-full left-0 right-0 mt-3 
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl 
          rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mx-3"
        >
          <div className="p-6 space-y-4 text-gray-900 dark:text-gray-300">
            <span onClick={handleHomeClick} className="block cursor-pointer">Home</span>
            <span onClick={() => scrollToSection("features")} className="block cursor-pointer">Features</span>
            <Link to="/about" onClick={closeMenu} className="block">About</Link>
            <span onClick={() => scrollToSection("pricing")} className="block cursor-pointer">Pricing</span>
            <Link to="/contact" onClick={closeMenu} className="block">Contact</Link>

            <div className="flex items-center justify-between pt-4 border-t border-gray-300 dark:border-gray-700">
              <span>Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
