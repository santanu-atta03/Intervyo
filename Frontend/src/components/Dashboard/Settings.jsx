import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  LogOut, 
  LayoutDashboard,
  Settings as SettingsIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Crown
} from "lucide-react";
import SEO from "../../components/shared/SEO";

// Sub-components for cleaner structure
const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder, disabled = false }) => (
  <div className="space-y-2 group">
    <label className="text-sm font-semibold text-gray-400 flex items-center gap-2 group-focus-within:text-emerald-400 transition-colors">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition ${
        disabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:border-white/20"
      }`}
    />
  </div>
);

const ItemCard = ({ title, subtitle, meta, link, onRemove }) => (
  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h4 className="font-bold text-lg text-white">{title}</h4>
        <p className="text-emerald-400 font-medium text-sm">{subtitle}</p>
        <p className="text-gray-500 text-sm">{meta}</p>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:underline mt-2">
            View Source <Globe className="w-3 h-3" />
          </a>
        )}
      </div>
      <button onClick={onRemove} className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default function Settings() {
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
            age: parseInt(profileData.age, 10) || null,
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

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-emerald-500/30">
      <SEO title="Settings | Intervyo" description="Manage your Intervyo profile and preferences" />
      
      {/* Tile Grid Background */}
      <div className="fixed inset-0 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] grid-rows-[repeat(auto-fill,minmax(80px,1fr))] pointer-events-none opacity-[0.03]">
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-emerald-500/20" />
        ))}
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Intervyo
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2 group"
            >
              <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden hover:border-emerald-500/50 transition group"
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                ) : (
                  <span className="font-bold text-emerald-400">{user?.name?.charAt(0) || "U"}</span>
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-[#030712]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                  <button onClick={() => dispatch(logout(navigate))} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 relative z-10">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your identity, career profile, and account security</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-2 lg:sticky lg:top-28">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === tab.id
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="font-semibold">{tab.name}</span>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
            <div className="p-6 sm:p-10">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-purple-500/5 border border-white/5">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-500/30 p-1 shadow-2xl shadow-emerald-500/10">
                        {profileData.profilePicture ? (
                          <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full bg-[#111827] flex items-center justify-center text-emerald-400 text-4xl font-bold">
                            {user?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-1 right-1 p-2.5 rounded-xl bg-emerald-500 text-black hover:scale-110 active:scale-95 transition shadow-xl"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold mb-1">Profile Photo</h3>
                      <p className="text-gray-400 text-sm mb-4">Express yourself with a profile picture. JPG, PNG or SVG. Max 5MB.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mx-auto sm:mx-0"
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
                      <label className="text-sm font-semibold text-gray-400 flex items-center gap-2">Gender</label>
                      <select 
                        value={profileData.gender} 
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none transition appearance-none"
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
                    <label className="text-sm font-semibold text-gray-400">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows="4"
                      placeholder="Tell us a bit about your journey..."
                      className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-emerald-500/50 outline-none transition resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Professional Tab */}
              {activeTab === "professional" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-400">Target Domain</label>
                      <select 
                        value={professionalData.domain} 
                        onChange={(e) => setProfessionalData({...professionalData, domain: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-emerald-500/50 outline-none transition"
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
                    <label className="text-sm font-semibold text-gray-400">Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                        placeholder="Add skill (e.g. React, Docker)"
                        className="flex-1 px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-emerald-500/50 outline-none transition"
                      />
                      <button onClick={handleAddSkill} className="px-6 py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:scale-[1.02] active:scale-95 transition">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {professionalData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm group">
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* List-based Tabs (Education, Certificates, Achievements) */}
              {(activeTab === "education" || activeTab === "certificates" || activeTab === "achievements") && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/10 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-500" />
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
                          <label className="text-sm font-semibold text-gray-400">Description</label>
                          <textarea 
                            value={newAchievement.description} 
                            onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition"
                            rows="3"
                          />
                        </div>
                        <InputField label="Date" type="date" value={newAchievement.date} onChange={(v) => setNewAchievement({...newAchievement, date: v})} />
                      </div>
                    )}

                    <button 
                      onClick={activeTab === "education" ? handleAddEducation : activeTab === "certificates" ? handleAddCertificate : handleAddAchievement}
                      className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-emerald-500 transition-colors"
                    >
                      Add Entry
                    </button>
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
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-red-400"><Shield className="w-6 h-6" /> Change Password</h3>
                    <div className="space-y-4">
                      <InputField label="Current Password" type="password" icon={Shield} />
                      <InputField label="New Password" type="password" icon={Shield} />
                      <InputField label="Confirm New Password" type="password" icon={Shield} />
                      <button className="w-full py-4 rounded-2xl bg-red-500 text-black font-bold hover:bg-red-400 transition-colors mt-2">Update Password</button>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-center sm:text-left">
                      <h4 className="font-bold text-lg mb-1 flex items-center justify-center sm:justify-start gap-2">Two-Factor Authentication <Crown className="w-4 h-4 text-purple-400" /></h4>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your Intervyo account.</p>
                    </div>
                    <button className="px-8 py-4 rounded-2xl bg-purple-500 text-black font-bold hover:bg-purple-400 transition-colors whitespace-nowrap">Enable 2FA</button>
                  </div>

                  <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 space-y-4">
                    <h4 className="font-bold text-red-500 uppercase tracking-widest text-xs">Danger Zone</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 py-4 rounded-2xl border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/10 transition">Deactivate Account</button>
                      <button className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition">Delete Account</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {activeTab !== "security" && (
                <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4 border-t border-white/5 pt-8">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-8 py-4 rounded-2xl border border-white/10 text-gray-400 font-semibold hover:bg-white/5 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-10 py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
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


