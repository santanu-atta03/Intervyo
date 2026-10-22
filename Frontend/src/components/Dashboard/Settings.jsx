import { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../services/operations/authAPI";
import toast from "react-hot-toast";
import {
  uploadProfilePicture,
  updatePersonalInfo,
  updateProfessionalInfo,
  updateEducation,
  updateCertificates,
  updateAchievements,
  getUserProfile,
} from "../../services/operations/profileAPI";
import { setLoading } from "../../slices/authSlice";
import logo from "../../assets/intervyologo.png";
import ThemeToggle from "../../components/ThemeToggle";
import { ThemeContext } from "../../components/shared/ThemeContext";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Shield, 
  Trash2, 
  Plus, 
  Github, 
  Linkedin, 
  Globe, 
  Camera, 
  ChevronRight, 
  ChevronDown,
  LogOut, 
  Settings as SettingsIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Crown,
  Bell,
  Menu,
  X
} from "lucide-react";
import SEO from "../../components/shared/SEO";

/* ------------------------------------------------------------------ */
/*  Nike design system – tokens, components and motion                 */
/*  Light is the documented palette. When the app theme is "dark" the  */
/*  neutral tokens invert (ink <-> canvas); the pill grammar is kept.  */
/* ------------------------------------------------------------------ */
export const NIKE_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500&display=swap");

.nk-root {
  --nk-ink: #111111;
  --nk-on-ink: #ffffff;
  --nk-canvas: #ffffff;
  --nk-cloud: #f5f5f5;
  --nk-hairline: #cacacb;
  --nk-hairline-soft: #e5e5e5;
  --nk-charcoal: #39393b;
  --nk-mute: #707072;
  --nk-stone: #9e9ea0;
  --nk-success: #007d48;
  --nk-sale: #d30005;
  --nk-bg: #4f1a1bff;
  --nk-ease: cubic-bezier(0.22, 1, 0.36, 1);
  font-family: "Helvetica Now Text", "Helvetica Neue", "Inter", Helvetica, Arial, sans-serif;
  font-size: 16px; font-weight: 400; line-height: 1.5; letter-spacing: 0;
  background: var(--nk-canvas); color: var(--nk-ink);
  -webkit-font-smoothing: antialiased; min-height: 100vh; overflow-x: hidden;
}
.nk-root[data-nk-theme="dark"] {
  --nk-ink: #ffffff; --nk-on-ink: #111111; --nk-canvas: #111111; --nk-cloud: #1f1f21;
  --nk-hairline: #39393b; --nk-hairline-soft: #2a2a2c; --nk-charcoal: #cacacb;
  --nk-mute: #9e9ea0; --nk-success: #1eaa52;
}
.nk-root *, .nk-root *::before, .nk-root *::after { box-sizing: border-box; }
.nk-root button { font: inherit; color: inherit; cursor: pointer; }
.nk-root a { color: inherit; text-decoration: none; }

/* Typography (weights 400 / 500 only) */
.nk-display { font-family: "Nike Futura ND", "Bebas Neue", Anton, Impact, "Helvetica Neue", sans-serif; font-size: 96px; font-weight: 500; line-height: 0.9; text-transform: uppercase; letter-spacing: -0.005em; }
.nk-h-xl { font-family: "Helvetica Now Display", "Helvetica Neue", "Inter", sans-serif; font-size: 32px; font-weight: 500; line-height: 1.2; text-transform: uppercase; }
.nk-h-lg { font-size: 24px; font-weight: 500; line-height: 1.2; }
.nk-h-md { font-size: 16px; font-weight: 500; line-height: 1.75; }
.nk-body-strong { font-size: 16px; font-weight: 500; line-height: 1.5; }
.nk-caption { font-size: 14px; font-weight: 500; line-height: 1.5; }
.nk-caption-sm { font-size: 12px; font-weight: 500; line-height: 1.5; }
.nk-mute { color: var(--nk-mute); }

/* Layout */
.nk-container { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 48px; }
.nk-section { padding-top: 48px;}
.nk-section-last { padding-bottom: 80px; }
.nk-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 24px; }

/* Utility bar + primary nav */
.nk-utility { background: var(--nk-cloud); height: 36px; font-size: 12px; font-weight: 500; }
.nk-utility .nk-container { height: 100%; display: flex; align-items: center; justify-content: flex-end; gap: 16px; }
.nk-utility a, .nk-utility button { background: none; border: 0; padding: 0; font-size: 12px; font-weight: 500; }
.nk-utility a:hover, .nk-utility button:hover { color: var(--nk-mute); }
.nk-nav { position: sticky; top: 0; z-index: 60; height: 60px; background: var(--nk-canvas); transition: box-shadow .3s ease; }
.nk-nav[data-scrolled="true"] { box-shadow: inset 0 -1px 0 var(--nk-hairline-soft); }
.nk-nav .nk-container { height: 100%; display: flex; align-items: center; justify-content: space-between; }
.nk-nav-links { display: flex; align-items: center; gap: 28px; height: 100%; }
.nk-nav-link { position: relative; height: 100%; display: inline-flex; align-items: center; font-size: 16px; font-weight: 500; }
.nk-nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: 8px; height: 2px; background: var(--nk-ink); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--nk-ease); }
.nk-nav-link:hover::after, .nk-nav-link[aria-current="page"]::after { transform: scaleX(1); }
.nk-nav-right { display: flex; align-items: center; gap: 8px; }

/* Buttons: pill only */
.nk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 32px; border-radius: 30px; border: 0; font-size: 16px; font-weight: 500; line-height: 1.5; white-space: nowrap; transition: transform .18s var(--nk-ease), opacity .18s ease, background-color .25s ease; }
.nk-btn-primary { background: var(--nk-ink); color: var(--nk-on-ink) !important; }
.nk-btn-secondary { background: var(--nk-cloud); color: var(--nk-ink); }
.nk-btn-onimage { background: #ffffff; color: #111111 !important; height: 44px; padding: 0 24px; }
.nk-btn-sm { height: 40px; padding: 0 20px; font-size: 14px; }
.nk-btn:active { transform: scale(0.95); opacity: 0.8; }
.nk-btn-primary:hover { background: var(--nk-charcoal); }
.nk-btn-secondary:hover { background: var(--nk-hairline-soft); }
.nk-icon-btn { position: relative; width: 40px; height: 40px; border-radius: 9999px; border: 0; background: transparent; display: inline-flex; align-items: center; justify-content: center; transition: background-color .25s ease, transform .18s var(--nk-ease); }
.nk-icon-btn:hover { background: var(--nk-cloud); }
.nk-icon-btn:active { transform: scale(0.85); }
.nk-root :is(a, button, [role="button"]):focus-visible { outline: 2px solid var(--nk-ink); outline-offset: 2px; }
.nk-link { background: none; border: 0; padding: 0; font-size: 16px; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; display: inline-flex; align-items: center; gap: 4px; }
.nk-chip { display: inline-flex; align-items: center; gap: 6px; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); border-radius: 30px; padding: 4px 12px; font-size: 12px; font-weight: 500; line-height: 1.5; color: var(--nk-ink); }
.nk-badge-dot { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; border-radius: 9999px; background: var(--nk-sale); }
.nk-badge-dot::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: var(--nk-sale); animation: nk-ping 1.8s ease-out infinite; }
.nk-avatar { width: 32px; height: 32px; border-radius: 9999px; background: var(--nk-ink); color: var(--nk-on-ink); display: inline-flex; align-items: center; justify-content: center; overflow: hidden; font-size: 14px; font-weight: 500; }

/* Flat tiles */
.nk-tile { background: var(--nk-cloud); padding: 24px; display: flex; flex-direction: column; transition: background-color .3s ease; }
.nk-circle { width: 48px; height: 48px; border-radius: 9999px; background: var(--nk-canvas); color: var(--nk-ink); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* Menus */
.nk-menu { position: absolute; right: 0; top: calc(100% + 8px); width: 340px; max-height: 440px; overflow-y: auto; background: var(--nk-canvas); border: 1px solid var(--nk-hairline); z-index: 80; animation: nk-menu-in .28s var(--nk-ease) both; transform-origin: top right; }
.nk-menu-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 500; background: none; border: 0; text-align: left; transition: background-color .2s ease; }
.nk-menu-item:hover { background: var(--nk-cloud); }
.nk-drawer-scrim { position: fixed; inset: 0; background: rgba(17,17,17,0.5); z-index: 90; animation: nk-fade .3s ease both; }
.nk-drawer { position: fixed; top: 0; bottom: 0; left: 0; width: min(88vw, 360px); background: var(--nk-canvas); z-index: 95; overflow-y: auto; padding: 16px 24px 48px; animation: nk-drawer-in .4s var(--nk-ease) both; }
.nk-drawer a, .nk-drawer .nk-drawer-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 24px 0 0; background: none; border: 0; text-align: left; font-size: 24px; font-weight: 500; line-height: 1.2; }
.nk-drawer .nk-menu { position: static; width: 100%; max-height: none; margin: 16px 0 0; animation: none; }

/* Responsive */
@media (min-width: 1920px) { .nk-container { padding: 0 80px; } }
@media (max-width: 1023px) {
  .nk-container { padding: 0 32px; }
}
@media (max-width: 960px) { .nk-nav-links { display: none; } }
@media (min-width: 961px) { .nk-hamburger { display: none; } }
@media (max-width: 599px) {
  .nk-container { padding: 0 16px; }
  .nk-menu { width: calc(100vw - 32px); right: -8px; }
}
@media (prefers-reduced-motion: reduce) {
  .nk-root *, .nk-root *::before, .nk-root *::after { animation: none !important; transition: none !important; }
}
`;

// Input Field using Nike tokens
const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder, disabled = false }) => (
  <div className="space-y-2 group">
    <label className="nk-caption nk-mute flex items-center gap-2 group-focus-within:text-[var(--nk-ink)] transition-colors">
      {Icon && <Icon size={16} />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "16px 20px",
        borderRadius: "16px",
        background: "var(--nk-cloud)",
        border: "1px solid var(--nk-hairline)",
        color: "var(--nk-ink)",
        outline: "none",
        transition: "border-color 0.2s ease",
      }}
      className={disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}
    />
  </div>
);

// Card for list items (Education, Certs, Achievements)
const ItemCard = ({ title, subtitle, meta, link, onRemove }) => (
  <div
    className="nk-tile"
    style={{
      padding: "24px",
      borderRadius: "16px",
      border: "1px solid var(--nk-hairline)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}
  >
    <div className="space-y-1">
      <h4 className="nk-body-strong" style={{ color: "var(--nk-ink)" }}>{title}</h4>
      <p className="nk-caption" style={{ color: "var(--nk-mute)" }}>{subtitle}</p>
      <p className="nk-caption-sm nk-mute">{meta}</p>
      {link && (
        <a href={link} target="_blank" rel="noreferrer" className="nk-link nk-caption-sm mt-2 inline-flex items-center gap-1">
          View Source <Globe size={12} />
        </a>
      )}
    </div>
    <button onClick={onRemove} className="nk-icon-btn" style={{ color: "var(--nk-mute)" }} aria-label="Remove">
      <Trash2 size={18} />
    </button>
  </div>
);

export default function Settings() {
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const nkTheme = theme === "dark" ? "dark" : "light";

  // Scroll handler for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch User Profile
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          dispatch(setLoading(true));
          await dispatch(getUserProfile(token));
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          dispatch(setLoading(false));
        }
      }
    };
    fetchUserDetails();
  }, [dispatch, token]);

  // Update form data when user changes
  useEffect(() => {
    if (user && user.profile) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile.phone || "",
        gender: user.profile.gender || "",
        age: user.profile.age || "",
        bio: user.profile.bio || "",
        location: user.profile.location || "",
        profilePicture: user.profilePicture || "",
      });

      setProfessionalData({
        domain: user.profile.domain || "",
        experience: user.profile.experience || "",
        skills: user.profile.skills || [],
        linkedIn: user.profile.linkedIn || "",
        github: user.profile.github || "",
        portfolio: user.profile.portfolio || "",
      });

      setEducation(user.profile.education || []);
      setCertificates(user.profile.certificates || []);
      setAchievements(user.profile.achievements || []);
    }
  }, [user]);

  // State for form data
  const [profileData, setProfileData] = useState({
    name: "", email: "", phone: "", gender: "", age: "", bio: "", location: "", profilePicture: "",
  });

  const [professionalData, setProfessionalData] = useState({
    domain: "", experience: "", skills: [], linkedIn: "", github: "", portfolio: "",
  });

  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: "", institution: "", field: "", startYear: "", endYear: "", grade: "",
  });

  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({
    name: "", issuer: "", issueDate: "", credentialId: "", url: "",
  });

  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "", description: "", date: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "professional", name: "Professional", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "certificates", name: "Certificates", icon: LinkIcon },
    { id: "achievements", name: "Achievements", icon: Award },
    { id: "security", name: "Security", icon: Shield },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const result = await dispatch(uploadProfilePicture(token, file));
      if (result.success) {
        setProfileData((prev) => ({ ...prev, profilePicture: result.profilePicture }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !professionalData.skills.includes(skillInput.trim())) {
      setProfessionalData({
        ...professionalData,
        skills: [...professionalData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfessionalData({
      ...professionalData,
      skills: professionalData.skills.filter((s) => s !== skill),
    });
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setEducation([...education, { ...newEducation, _id: `temp_${Date.now()}` }]);
      setNewEducation({ degree: "", institution: "", field: "", startYear: "", endYear: "", grade: "" });
    } else {
      toast.error("Please fill required education fields");
    }
  };

  const handleAddCertificate = () => {
    if (newCertificate.name && newCertificate.issuer) {
      setCertificates([...certificates, { ...newCertificate, _id: `temp_${Date.now()}` }]);
      setNewCertificate({ name: "", issuer: "", issueDate: "", credentialId: "", url: "" });
    } else {
      toast.error("Please fill required certificate fields");
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.title) {
      setAchievements([...achievements, { ...newAchievement, _id: `temp_${Date.now()}` }]);
      setNewAchievement({ title: "", description: "", date: "" });
    } else {
      toast.error("Please fill achievement title");
    }
  };

  const handleSaveProfile = async () => {
    if (!token) {
      toast.error("Please login to update profile");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      let result;
      switch (activeTab) {
        case "profile":
          result = await dispatch(updatePersonalInfo(token, {
            name: profileData.name,
            phone: profileData.phone,
            gender: profileData.gender,
            age: parseInt(profileData.age) || null,
            bio: profileData.bio,
            location: profileData.location,
          }));
          break;
        case "professional":
          result = await dispatch(updateProfessionalInfo(token, {
            domain: professionalData.domain,
            experience: parseInt(professionalData.experience) || null,
            skills: professionalData.skills,
            linkedIn: professionalData.linkedIn,
            github: professionalData.github,
            portfolio: professionalData.portfolio,
          }));
          break;
        case "education":
          const cleanedEducation = education.map(edu => {
            const { _id, ...rest } = edu;
            return _id?.startsWith('temp_') ? rest : edu;
          });
          result = await dispatch(updateEducation(token, cleanedEducation));
          break;
        case "certificates":
          const cleanedCertificates = certificates.map(cert => {
            const { _id, ...rest } = cert;
            return _id?.startsWith('temp_') ? rest : cert;
          });
          result = await dispatch(updateCertificates(token, cleanedCertificates));
          break;
        case "achievements":
          const cleanedAchievements = achievements.map(ach => {
            const { _id, ...rest } = ach;
            return _id?.startsWith('temp_') ? rest : ach;
          });
          result = await dispatch(updateAchievements(token, cleanedAchievements));
          break;
      }
      if (result?.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const subscriptionLabel = user?.subscription?.plan?.toUpperCase() || "FREE";

  const renderNotifications = () => (
    <div className="nk-menu" role="region" aria-label="Notifications">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--nk-hairline)" }}>
        <h3 className="nk-body-strong">Notifications</h3>
      </div>
      <div className="px-4 py-10 text-center">
        <Bell className="mx-auto mb-2 nk-mute" size={28} />
        <p className="nk-caption nk-mute">No notifications yet</p>
      </div>
    </div>
  );

  return (
    <div className="nk-root" data-nk-theme={nkTheme}>
      <style>{NIKE_CSS}</style>
      <SEO title="Settings | Intervyo" description="Manage your Intervyo profile and preferences" />

      {/* Utility bar */}
      <div className="nk-utility">
        <div className="nk-container">
          <Link to="/blog">Blog</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/subscription">Subscription</Link>
          <button onClick={() => dispatch(logout(navigate))}>Logout</button>
        </div>
      </div>

      {/* Primary nav */}
      <header className="nk-nav" data-scrolled={isScrolled}>
        <div className="nk-container">
          <div className="flex items-center gap-2">
            <button
              className="nk-icon-btn nk-hamburger"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={22} />
            </button>
            <Link to="/" aria-label="Intervyo home" className="flex items-center gap-2">
              <img src={logo} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
              <span className="nk-h-md hidden sm:inline" style={{ textTransform: "uppercase" }}>
                Intervyo
              </span>
            </Link>
          </div>

          <nav className="nk-nav-links" aria-label="Primary">
            <Link to="/dashboard" className="nk-nav-link">Dashboard</Link>
            <Link to="/interview-setup" className="nk-nav-link">Interview</Link>
            <Link to="/analytics" className="nk-nav-link">Analytics</Link>
            <Link to="/history" className="nk-nav-link">History</Link>
            <Link to="/leaderboard" className="nk-nav-link">Leaderboard</Link>
          </nav>

          <div className="nk-nav-right">
            <ThemeToggle />
            <div className="relative">
              <button
                className="nk-icon-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="nk-badge-dot" />}
              </button>
              {showNotifications && renderNotifications()}
            </div>

            <div ref={profileMenuRef} className="relative hidden sm:block">
              <button
                className="nk-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                aria-haspopup="menu"
                aria-expanded={showProfileMenu}
                aria-label="Account menu"
                style={{ width: "auto", padding: "0 8px 0 4px", gap: 6 }}
              >
                <span className="nk-avatar">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} className="h-full w-full object-cover" alt="Profile" />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )}
                </span>
                <ChevronDown
                  size={16}
                  style={{ transition: "transform .3s var(--nk-ease)", transform: showProfileMenu ? "rotate(180deg)" : "none" }}
                />
              </button>
              {showProfileMenu && (
                <div className="nk-menu" role="menu" style={{ width: 260 }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--nk-hairline)" }}>
                    <div className="nk-body-strong">{user?.name || "User"}</div>
                    <div className="nk-caption-sm nk-mute truncate">{user?.email || "Email not available"}</div>
                    <span className="nk-chip mt-2"><Crown size={12} /> {subscriptionLabel}</span>
                  </div>
                  <button
                    role="menuitem"
                    className="nk-menu-item"
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileMenu(false);
                    }}
                  >
                    <SettingsIcon size={16} /> Profile Settings
                  </button>
                  <button
                    role="menuitem"
                    className="nk-menu-item"
                    onClick={() => {
                      navigate("/subscription");
                      setShowProfileMenu(false);
                    }}
                  >
                    <Crown size={16} /> Subscription
                  </button>
                  <button
                    role="menuitem"
                    className="nk-menu-item"
                    style={{ borderTop: "1px solid var(--nk-hairline)" }}
                    onClick={() => dispatch(logout(navigate))}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="nk-drawer-scrim" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="nk-drawer" aria-label="Menu">
            <div className="flex items-center justify-between">
              <span className="nk-h-md" style={{ textTransform: "uppercase" }}>Intervyo</span>
              <button className="nk-icon-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/interview-setup" onClick={() => setIsMobileMenuOpen(false)}>Interview</Link>
            <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)}>Analytics</Link>
            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
            <Link to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>Profile Settings</Link>
            <Link to="/subscription" onClick={() => setIsMobileMenuOpen(false)}>Subscription</Link>
            <button className="nk-drawer-item" onClick={() => dispatch(logout(navigate))}>
              Logout
            </button>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="nk-container nk-section nk-section-last">
        <header className="mb-10">
          <h1 className="nk-h-xl mb-2">Settings</h1>
          <p className="nk-mute">Manage your identity, career profile, and account security</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs */}
          <aside className="lg:col-span-3 space-y-2 lg:sticky lg:top-28">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    background: isActive ? "var(--nk-cloud)" : "transparent",
                    border: isActive ? "1px solid var(--nk-hairline)" : "1px solid transparent",
                    color: isActive ? "var(--nk-ink)" : "var(--nk-mute)",
                    fontWeight: 500,
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  className="group"
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                  {isActive && <ChevronRight size={16} style={{ marginLeft: "auto" }} />}
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9 nk-tile" style={{ padding: "40px", borderRadius: "24px", border: "1px solid var(--nk-hairline)" }}>
            <div>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-10">
                  <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-2xl" style={{ background: "var(--nk-cloud)", border: "1px solid var(--nk-hairline)" }}>
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--nk-hairline)] p-1">
                        {profileData.profilePicture ? (
                          <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-[var(--nk-ink)] text-[var(--nk-on-ink)] flex items-center justify-center text-4xl font-bold">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-1 right-1 nk-btn nk-btn-sm nk-btn-primary"
                        style={{ width: "36px", height: "36px", padding: 0, borderRadius: "50%" }}
                        aria-label="Upload picture"
                      >
                        <Camera size={16} />
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <h3 className="nk-h-lg mb-1">Profile Photo</h3>
                      <p className="nk-mute text-sm mb-4">Express yourself with a profile picture. JPG, PNG or SVG. Max 5MB.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="nk-link text-sm font-medium"
                      >
                        {uploading ? "Uploading..." : "Change avatar"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" value={profileData.name} onChange={(v) => setProfileData({...profileData, name: v})} icon={User} />
                    <InputField label="Email Address" value={profileData.email} disabled icon={Mail} />
                    <InputField label="Phone Number" value={profileData.phone} onChange={(v) => setProfileData({...profileData, phone: v})} icon={Phone} placeholder="+91 XXXXX XXXXX" />
                    <div className="space-y-2">
                      <label className="nk-caption nk-mute flex items-center gap-2">Gender</label>
                      <select 
                        value={profileData.gender} 
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          borderRadius: "16px",
                          background: "var(--nk-cloud)",
                          border: "1px solid var(--nk-hairline)",
                          color: "var(--nk-ink)",
                          outline: "none",
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <InputField label="Age" type="number" value={profileData.age} onChange={(v) => setProfileData({...profileData, age: v})} icon={Calendar} placeholder="25" />
                    <InputField label="Location" value={profileData.location} onChange={(v) => setProfileData({...profileData, location: v})} icon={MapPin} placeholder="City, Country" />
                  </div>

                  <div className="space-y-2">
                    <label className="nk-caption nk-mute">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows="4"
                      placeholder="Tell us a bit about your journey..."
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        background: "var(--nk-cloud)",
                        border: "1px solid var(--nk-hairline)",
                        color: "var(--nk-ink)",
                        outline: "none",
                        resize: "none",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Professional Tab */}
              {activeTab === "professional" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="nk-caption nk-mute">Target Domain</label>
                      <select 
                        value={professionalData.domain} 
                        onChange={(e) => setProfessionalData({...professionalData, domain: e.target.value})}
                        style={{
                          width: "100%",
                          padding: "16px 20px",
                          borderRadius: "16px",
                          background: "var(--nk-cloud)",
                          border: "1px solid var(--nk-hairline)",
                          color: "var(--nk-ink)",
                          outline: "none",
                        }}
                      >
                        <option value="">Select Domain</option>
                        <option value="frontend">Frontend Development</option>
                        <option value="backend">Backend Development</option>
                        <option value="fullstack">Full Stack Development</option>
                        <option value="data-science">Data Science</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Mobile Development</option>
                      </select>
                    </div>
                    <InputField label="Years of Experience" type="number" value={professionalData.experience} onChange={(v) => setProfessionalData({...professionalData, experience: v})} icon={Briefcase} placeholder="e.g. 3" />
                    <InputField label="LinkedIn" value={professionalData.linkedIn} onChange={(v) => setProfessionalData({...professionalData, linkedIn: v})} icon={Linkedin} placeholder="linkedin.com/in/username" />
                    <InputField label="GitHub" value={professionalData.github} onChange={(v) => setProfessionalData({...professionalData, github: v})} icon={Github} placeholder="github.com/username" />
                    <div className="md:col-span-2">
                      <InputField label="Portfolio / Website" value={professionalData.portfolio} onChange={(v) => setProfessionalData({...professionalData, portfolio: v})} icon={Globe} placeholder="yourportfolio.com" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="nk-caption nk-mute">Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                        placeholder="Add skill (e.g. React, Docker)"
                        style={{
                          flex: 1,
                          padding: "16px 20px",
                          borderRadius: "16px",
                          background: "var(--nk-cloud)",
                          border: "1px solid var(--nk-hairline)",
                          color: "var(--nk-ink)",
                          outline: "none",
                        }}
                      />
                      <button onClick={handleAddSkill} className="nk-btn nk-btn-primary">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {professionalData.skills.map((skill, index) => (
                        <div key={index} className="nk-chip" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} className="nk-mute hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* List-based Tabs (Education, Certificates, Achievements) */}
              {(activeTab === "education" || activeTab === "certificates" || activeTab === "achievements") && (
                <div className="space-y-8">
                  <div className="p-8 rounded-2xl" style={{ background: "var(--nk-cloud)", border: "1px solid var(--nk-hairline)" }}>
                    <h3 className="nk-h-lg mb-6 flex items-center gap-2">
                      <Plus size={20} />
                      Add New {tabs.find(t => t.id === activeTab)?.name}
                    </h3>
                    
                    {activeTab === "education" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Degree" value={newEducation.degree} onChange={(v) => setNewEducation({...newEducation, degree: v})} placeholder="B.Tech Computer Science" />
                        <InputField label="Institution" value={newEducation.institution} onChange={(v) => setNewEducation({...newEducation, institution: v})} placeholder="University Name" />
                        <InputField label="Field" value={newEducation.field} onChange={(v) => setNewEducation({...newEducation, field: v})} placeholder="Information Technology" />
                        <InputField label="Grade" value={newEducation.grade} onChange={(v) => setNewEducation({...newEducation, grade: v})} placeholder="8.5 CGPA" />
                        <InputField label="Start Year" type="number" value={newEducation.startYear} onChange={(v) => setNewEducation({...newEducation, startYear: v})} />
                        <InputField label="End Year" type="number" value={newEducation.endYear} onChange={(v) => setNewEducation({...newEducation, endYear: v})} />
                      </div>
                    )}

                    {activeTab === "certificates" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Certificate Name" value={newCertificate.name} onChange={(v) => setNewCertificate({...newCertificate, name: v})} />
                        <InputField label="Issuer" value={newCertificate.issuer} onChange={(v) => setNewCertificate({...newCertificate, issuer: v})} />
                        <InputField label="Issue Date" type="date" value={newCertificate.issueDate} onChange={(v) => setNewCertificate({...newCertificate, issueDate: v})} />
                        <InputField label="Credential ID" value={newCertificate.credentialId} onChange={(v) => setNewCertificate({...newCertificate, credentialId: v})} />
                        <div className="md:col-span-2">
                          <InputField label="Certificate URL" value={newCertificate.url} onChange={(v) => setNewCertificate({...newCertificate, url: v})} placeholder="https://..." />
                        </div>
                      </div>
                    )}

                    {activeTab === "achievements" && (
                      <div className="space-y-4">
                        <InputField label="Title" value={newAchievement.title} onChange={(v) => setNewAchievement({...newAchievement, title: v})} />
                        <div className="space-y-2">
                          <label className="nk-caption nk-mute">Description</label>
                          <textarea 
                            value={newAchievement.description} 
                            onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "16px 20px",
                              borderRadius: "16px",
                              background: "var(--nk-canvas)",
                              border: "1px solid var(--nk-hairline)",
                              color: "var(--nk-ink)",
                              outline: "none",
                              resize: "none",
                              fontFamily: "inherit",
                            }}
                            rows="3"
                          />
                        </div>
                        <InputField label="Date" type="date" value={newAchievement.date} onChange={(v) => setNewAchievement({...newAchievement, date: v})} />
                      </div>
                    )}

                    <div className="mt-6">
                      <button 
                        onClick={activeTab === "education" ? handleAddEducation : activeTab === "certificates" ? handleAddCertificate : handleAddAchievement}
                        className="nk-btn nk-btn-primary w-full"
                      >
                        Add Entry
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {activeTab === "education" && education.map((edu, i) => (
                      <ItemCard key={i} title={edu.degree} subtitle={edu.institution} meta={`${edu.startYear} - ${edu.endYear} • ${edu.grade}`} onRemove={() => setEducation(education.filter(e => e._id !== edu._id))} />
                    ))}
                    {activeTab === "certificates" && certificates.map((cert, i) => (
                      <ItemCard key={i} title={cert.name} subtitle={cert.issuer} meta={cert.issueDate} link={cert.url} onRemove={() => setCertificates(certificates.filter(c => c._id !== cert._id))} />
                    ))}
                    {activeTab === "achievements" && achievements.map((ach, i) => (
                      <ItemCard key={i} title={ach.title} subtitle={ach.description} meta={ach.date} onRemove={() => setAchievements(achievements.filter(a => a._id !== ach._id))} />
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  <div className="p-8 rounded-2xl" style={{ background: "var(--nk-cloud)", border: "1px solid var(--nk-hairline)" }}>
                    <h3 className="nk-h-lg mb-6 flex items-center gap-2"><Shield size={22} /> Change Password</h3>
                    <div className="space-y-4">
                      <InputField label="Current Password" type="password" icon={Shield} />
                      <InputField label="New Password" type="password" icon={Shield} />
                      <InputField label="Confirm New Password" type="password" icon={Shield} />
                      <div className="pt-2">
                        <button className="nk-btn nk-btn-primary w-full">Update Password</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6" style={{ background: "var(--nk-cloud)", border: "1px solid var(--nk-hairline)" }}>
                    <div className="text-center sm:text-left">
                      <h4 className="nk-body-strong mb-1 flex items-center justify-center sm:justify-start gap-2">Two-Factor Authentication <Crown size={16} /></h4>
                      <p className="nk-mute text-sm">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="nk-btn nk-btn-secondary whitespace-nowrap">Enable 2FA</button>
                  </div>

                  <div className="p-8 rounded-2xl space-y-4" style={{ background: "var(--nk-cloud)", border: "1px solid var(--nk-hairline)" }}>
                    <h4 className="nk-caption-sm nk-mute uppercase tracking-widest font-bold">Danger Zone</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="nk-btn nk-btn-secondary flex-1" style={{ color: "var(--nk-sale)" }}>Deactivate Account</button>
                      <button className="nk-btn nk-btn-primary flex-1" style={{ background: "var(--nk-sale)", color: "var(--nk-on-ink)" }}>Delete Account</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {activeTab !== "security" && (
                <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4 border-t pt-8" style={{ borderColor: "var(--nk-hairline)" }}>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="nk-btn nk-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="nk-btn nk-btn-primary"
                  >
                    {saving ? "Saving Changes..." : `Save ${tabs.find(t => t.id === activeTab)?.name}`}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}