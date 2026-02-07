import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Crown,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { logout } from "../../services/operations/authAPI";
import logo from "../../assets/intervyologo.png";
import { useNotifications } from "./NotificationContext";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
} from "../../services/operations/notificationAPI";

export default function Navbar({ variant = "public" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  // --- Dashboard Logic & State ---
  const {
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount,
  } = useNotifications();

  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        // Don't close if clicking the bell toggle itself, handled by toggle
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Notification Helpers
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id, token);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      if (notification.link) {
        setShowNotifications(false);
        navigate(notification.link);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId, token);
      const deletedNotification = notifications.find(
        (n) => n._id === notificationId
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // --- Public / Shared Helpers ---
  const scrollToSection = (e, sectionId) => {
    if (location.pathname !== "/") {
      // If we are not on home, regular navigation or just let Link handle it if we used HashLink
      return;
    }
    // If we are on home, use lenis or native scroll. 
    // Since we don't have access to the parent's Lenis ref here easily without Context,
    // we'll stick to native behavior or simple id lookup for now, unless we pass a scrollTo handler prop.
    // For now, simple anchor behavior:
    const element = document.querySelector(sectionId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- Render Logic ---

  const isDashboard = variant === "dashboard";

  // Base classes
  const navClasses = isDashboard
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20
      ? "bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-black/20"
      : "bg-transparent"
    }`
    : "fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-gray-200";

  // Logo Section
  const Logo = () => (
    <div className="flex items-center gap-2 sm:gap-3">
      {isDashboard ? ( // Dashboard Logo Style
        <>
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center">
              <img src={logo} alt="logo" className="w-full h-full object-contain" />
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
        </>
      ) : ( // Public Logo Style
        <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-1">
          <span className="text-gray-900">Interv</span>
          <span className="text-emerald-500">yo</span>
        </Link>
      )}
    </div>
  );

  return (
    <nav className={navClasses}>
      <div className={`mx-auto ${isDashboard ? "px-4 sm:px-6 lg:px-8 max-w-7xl" : "px-4 md:px-8 py-2"}`}>
        <div className={`flex justify-between items-center ${isDashboard ? "h-16 sm:h-20" : ""}`}>

          <Logo />

          {/* Desktop Navigation - Public Mode */}
          {!isDashboard && (
            <div className="hidden lg:flex items-center gap-8">
              <a href="/#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Features</a>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</Link>
              <a href="/#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">How it Works</a>
              <a href="/#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Pricing</a>
              <a href="/#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">FAQ</a>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800/10 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className={isDashboard ? "text-white" : "text-gray-900"} /> : <Menu className={isDashboard ? "text-white" : "text-gray-900"} />}
          </button>

          {/* Desktop Layout - Dashboard Mode */}
          {isDashboard && (
            <div className="hidden sm:flex items-center gap-3">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 hover:bg-gray-800/50 rounded-xl transition group"
                >
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 max-h-96 overflow-y-auto z-50">
                    <div className="px-4 py-3 border-b border-gray-700/50 flex justify-between items-center">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-xs text-purple-400 hover:text-purple-300">
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 hover:bg-gray-700/50 transition cursor-pointer border-l-4 ${!notif.isRead ? "border-l-purple-500 bg-gray-800/50" : "border-l-transparent"
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-300">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                            </div>
                            <button onClick={(e) => handleDeleteNotification(e, notif._id)} className="ml-2 text-gray-500 hover:text-red-400 transition">×</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to={"/blog"} className="p-3 text-white hover:bg-gray-800/50 rounded-xl transition font-medium">
                Blog
              </Link>

              {/* Profile Dropdown */}
              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu((prev) => !prev);
                  }}
                  className="flex items-center gap-2 sm:gap-3 hover:bg-gray-800/50 px-2 sm:px-3 py-2 rounded-xl transition group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        user?.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-semibold text-white">{user?.name || "User"}</div>
                    <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      {user?.subscription?.plan?.toUpperCase() || "FREE"}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${showProfileMenu ? "rotate-90" : ""}`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="text-sm font-semibold text-white">{user?.name || "User"}</div>
                      <div className="text-xs text-gray-400 truncate">{user?.email || "email@example.com"}</div>
                    </div>
                    <button onClick={() => { navigate("/settings"); setShowProfileMenu(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 transition group w-full text-left">
                      <Settings className="w-4 h-4 group-hover:text-purple-400" /> Profile Settings
                    </button>
                    <button onClick={() => { navigate("/subscription"); setShowProfileMenu(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 transition group w-full text-left">
                      <Crown className="w-4 h-4 group-hover:text-yellow-400" /> Subscription
                    </button>
                    <hr className="my-2 border-gray-700/50" />
                    <button onClick={() => dispatch(logout(navigate))} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition group w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Buttons - Public Mode */}
          {!isDashboard && (
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
                  <Link to="/login" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Dashboard */}
      {isDashboard && isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-900/95 backdrop-blur-xl shadow-lg border-t border-gray-700/50">
          <div className="px-4 py-3 space-y-2">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition w-full text-left">
                <Bell className="w-5 h-5" /> Notifications
                {unreadCount > 0 && <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
            </div>
            <Link to="/blog" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition">
              <MessageSquare className="w-5 h-5" /> Blog
            </Link>
            <Link to="/settings" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition">
              <Settings className="w-5 h-5" /> Profile Settings
            </Link>
            <Link to="/subscription" onClick={closeMobileMenu} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-xl transition">
              <Crown className="w-5 h-5" /> Subscription
            </Link>
            <hr className="my-2 border-gray-700/50" />
            <button onClick={() => dispatch(logout(navigate))} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition w-full text-left">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu - Public */}
      {!isDashboard && isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 mx-2 overflow-hidden">
          <div className="p-6 space-y-4">
            <a href="/#features" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>Features</a>
            <a href="/#how-it-works" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>How it Works</a>
            <a href="/#pricing" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>Pricing</a>
            <a href="/#faq" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>FAQ</a>
            <Link to="/contact" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>Contact</Link>
            <Link to="/about" className="block text-emerald-500 font-medium py-3 px-4 rounded-lg bg-emerald-50" onClick={closeMobileMenu}>About</Link>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              {token ? (
                <button onClick={() => { navigate("/dashboard"); closeMobileMenu(); }} className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all">
                  Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu} className="block w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-center">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu} className="block w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
