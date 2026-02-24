import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_TONES = {
  landing: {
    nav: "fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-black/10 backdrop-blur-xl rounded-full border border-white/20 z-50 text-skin-primary",
    link: "text-gray-200 hover:text-emerald-400",
    mobileMenu: "bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200",
    mobileLink: "text-gray-600 hover:text-gray-900",
    menuButton: "text-gray-900 hover:bg-gray-100",
    logoPrimary: "text-white-800",
    logoSecondary: "text-emerald-500",
    activeLink: "text-emerald-400",
    activeMobile: "text-emerald-500 bg-emerald-50",
  },
  skin: {
    nav: "fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-skin-primary/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-skin-primary",
    link: "text-gray-600 hover:text-skin-primary",
    mobileMenu: "bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200",
    mobileLink: "text-gray-600 hover:text-skin-primary",
    menuButton: "text-skin-primary hover:bg-gray-100",
    logoPrimary: "text-skin-primary",
    logoSecondary: "text-emerald-500",
    activeLink: "text-emerald-500",
    activeMobile: "text-emerald-500 bg-emerald-50",
  },
  light: {
    nav: "fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-gray-200",
    link: "text-gray-600 hover:text-gray-900",
    mobileMenu: "bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200",
    mobileLink: "text-gray-600 hover:text-gray-900",
    menuButton: "text-gray-900 hover:bg-gray-100",
    logoPrimary: "text-gray-900",
    logoSecondary: "text-emerald-500",
    activeLink: "text-emerald-500",
    activeMobile: "text-emerald-500 bg-emerald-50",
  },
};

const buildLinks = (isLanding) => {
  const prefix = isLanding ? "" : "/";
  return [
    { key: "features", label: "Features", href: `${prefix}#features`, isSection: true },
    { key: "about", label: "About", to: "/about" },
    { key: "how", label: "How it Works", href: `${prefix}#how-it-works`, isSection: true },
    { key: "pricing", label: "Pricing", href: `${prefix}#pricing`, isSection: true },
    { key: "faq", label: "FAQ", href: `${prefix}#faq`, isSection: true },
    { key: "contact", label: "Contact", to: "/contact" },
  ];
};

export default function Navbar({
  tone = "light",
  variant = "pill",
  isLanding = false,
  activeKey,
  showThemeToggle = false,
  showAuthButtons = true,
  showDashboardButton = true,
  onSectionClick,
}) {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const styles = NAV_TONES[tone] || NAV_TONES.light;
  const links = useMemo(() => buildLinks(isLanding), [isLanding]);

  useEffect(() => {
    if (variant !== "simple") {
      return undefined;
    }
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSectionClick = (event, sectionId) => {
    if (onSectionClick) {
      onSectionClick(event, sectionId);
    }
    closeMobileMenu();
  };

  if (variant === "simple") {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20
          ? "bg-skin-primary/95 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ">
                  <img src={logo} alt="logo" />
                </div>

              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Intervyo
                </span>
                <div className="text-xs text-gray-500 font-medium hidden sm:block">
                  AI-Powered Practice
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.nav}>
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold">
          <span className={styles.logoPrimary}>Interv</span>
          <span className={styles.logoSecondary}>yo</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const isActive = activeKey === link.key;
            const className = `${styles.link} font-medium transition-colors${
              isActive ? ` ${styles.activeLink}` : ""
            }`;

            if (link.isSection) {
              return (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={
                    onSectionClick
                      ? (event) => handleSectionClick(event, link.href)
                      : undefined
                  }
                  className={`${className} cursor-pointer`}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link key={link.key} to={link.to} className={className}>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {showThemeToggle && <ThemeToggle />}
          {token ? (
            showDashboardButton && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
              >
                Dashboard
              </button>
            )
          ) : (
            showAuthButtons && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-sm"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${styles.menuButton}`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className={`lg:hidden absolute top-full left-0 right-0 mt-2 mx-2 overflow-hidden ${styles.mobileMenu}`}
        >
          <div className="p-6 space-y-4">
            {links.map((link) => {
              const isActive = activeKey === link.key;
              const className = `block font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors ${
                styles.mobileLink
              }${isActive ? ` ${styles.activeMobile}` : ""}`;

              if (link.isSection) {
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={
                      onSectionClick
                        ? (event) => handleSectionClick(event, link.href)
                        : closeMobileMenu
                    }
                    className={className}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.key}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            })}

            {showThemeToggle && (
              <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-600 font-medium">Theme</span>
                <ThemeToggle />
              </div>
            )}

            {(showDashboardButton || showAuthButtons) && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  showDashboardButton && (
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        closeMobileMenu();
                      }}
                      className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
                    >
                      Dashboard
                    </button>
                  )
                ) : (
                  showAuthButtons && (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-center"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="block w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-center"
                      >
                        Get Started
                      </Link>
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
