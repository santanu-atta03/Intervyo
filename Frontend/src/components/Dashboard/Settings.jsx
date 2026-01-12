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

export default function Settings() {
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.profile);
  console.log("User profile : ", user);
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          dispatch(setLoading(true));
          const result = await dispatch(getUserProfile(token));
          console.log("Fetched user result:", result);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          dispatch(setLoading(false));
        }
      }
    };
    fetchUserDetails();
  }, [dispatch, token]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        dispatch(setLoading(true));
        await dispatch(getUserProfile(token));
        dispatch(setLoading(false));
      }
    };
    fetchUserDetails();
  }, [dispatch, token]);

  // Update the profile data loading useEffect
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

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    bio: "",
    location: "",
    profilePicture: "",
  });

  // Professional Data
  const [professionalData, setProfessionalData] = useState({
    domain: "",
    experience: "",
    skills: [],
    linkedIn: "",
    github: "",
    portfolio: "",
  });

  // Education
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    field: "",
    startYear: "",
    endYear: "",
    grade: "",
  });

  // Certificates
  const [certificates, setCertificates] = useState([]);
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    url: "",
  });

  // Achievements
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "professional", name: "Professional", icon: "💼" },
    { id: "education", name: "Education", icon: "🎓" },
    { id: "certificates", name: "Certificates", icon: "📜" },
    { id: "achievements", name: "Achievements", icon: "🏆" },
    { id: "security", name: "Security", icon: "🔒" },
  ];

  // Load user data when component mounts or user changes
  // useEffect(() => {
  //   if (user) {
  //     setProfileData({
  //       name: user?.name || "",
  //       email: user?.email || "",
  //       phone: user?.profile?.phone || "",
  //       gender: user?.profile?.gender || "",
  //       age: user?.profile?.age || "",
  //       bio: user?.profile?.bio || "",
  //       location: user?.profile?.location || "",
  //       profilePicture: user?.profilePicture || "",
  //     });

  //     setProfessionalData({
  //       domain: user?.profile?.domain || "",
  //       experience: user?.profile?.experience || "",
  //       skills: user?.profile?.skills || [],
  //       linkedIn: user?.profile?.linkedIn || "",
  //       github: user?.profile?.github || "",
  //       portfolio: user?.profile?.portfolio || "",
  //     });

  //     setEducation(user?.profile?.education || []);
  //     setCertificates(user?.profile?.certificates || []);
  //     setAchievements(user?.profile?.achievements || []);
  //   }
  // }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      //  toast.error("File size should be less than 5MB");
      //  toast.error("File size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const result = await dispatch(uploadProfilePicture(token, file));

      if (result.success) {
        setProfileData((prev) => ({
          ...prev,
          profilePicture: result.profilePicture,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (
      skillInput.trim() &&
      !professionalData.skills.includes(skillInput.trim())
    ) {
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
      setEducation([
        ...education,
        { ...newEducation, _id: Date.now().toString() },
      ]);
      setNewEducation({
        degree: "",
        institution: "",
        field: "",
        startYear: "",
        endYear: "",
        grade: "",
      });
    }
  };

  const handleRemoveEducation = (id) => {
    setEducation(education.filter((edu) => edu._id !== id));
  };

  const handleAddCertificate = () => {
    if (newCertificate.name && newCertificate.issuer) {
      setCertificates([
        ...certificates,
        { ...newCertificate, _id: Date.now().toString() },
      ]);
      setNewCertificate({
        name: "",
        issuer: "",
        issueDate: "",
        credentialId: "",
        url: "",
      });
    }
  };

  const handleRemoveCertificate = (id) => {
    setCertificates(certificates.filter((cert) => cert._id !== id));
  };

  const handleAddAchievement = () => {
    if (newAchievement.title) {
      setAchievements([
        ...achievements,
        { ...newAchievement, _id: Date.now().toString() },
      ]);
      setNewAchievement({
        title: "",
        description: "",
        date: "",
      });
    }
  };

  const handleRemoveAchievement = (id) => {
    setAchievements(achievements.filter((ach) => ach._id !== id));
  };

  // Save function based on active tab
  // const handleSaveProfile = async () => {
  //   if (!token) {
  //     toast.error("Please login to update profile");
  //     navigate("/login");
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     let result;

  //     switch (activeTab) {
  //       case "profile":
  //         // Save only personal information
  //         result = await dispatch(updatePersonalInfo(token, {
  //           name: profileData.name,
  //           phone: profileData.phone,
  //           gender: profileData.gender,
  //           age: parseInt(profileData.age) || null,
  //           bio: profileData.bio,
  //           location: profileData.location,
  //         }));
  //         break;

  //       case "professional":
  //         // Save only professional information
  //         result = await dispatch(updateProfessionalInfo(token, {
  //           domain: professionalData.domain,
  //           experience: parseInt(professionalData.experience) || null,
  //           skills: professionalData.skills,
  //           linkedIn: professionalData.linkedIn,
  //           github: professionalData.github,
  //           portfolio: professionalData.portfolio,
  //         }));
  //         break;

  //       case "education":
  //         // Save only education
  //         const cleanedEducation = education.map(edu => ({
  //           ...(edu._id?.toString().length <= 15 ? { _id: edu._id } : {}),
  //           degree: edu.degree,
  //           institution: edu.institution,
  //           field: edu.field,
  //           startYear: edu.startYear,
  //           endYear: edu.endYear,
  //           grade: edu.grade,
  //         }));
  //         result = await dispatch(updateEducation(token, cleanedEducation));
  //         break;

  //       case "certificates":
  //         // Save only certificates
  //         const cleanedCertificates = certificates.map(cert => ({
  //           ...(cert._id?.toString().length <= 15 ? { _id: cert._id } : {}),
  //           name: cert.name,
  //           issuer: cert.issuer,
  //           issueDate: cert.issueDate,
  //           credentialId: cert.credentialId,
  //           url: cert.url,
  //         }));
  //         result = await dispatch(updateCertificates(token, cleanedCertificates));
  //         break;

  //       case "achievements":
  //         // Save only achievements
  //         const cleanedAchievements = achievements.map(ach => ({
  //           ...(ach._id?.toString().length <= 15 ? { _id: ach._id } : {}),
  //           title: ach.title,
  //           description: ach.description,
  //           date: ach.date,
  //         }));
  //         result = await dispatch(updateAchievements(token, cleanedAchievements));
  //         break;

  //       default:
  //         toast.error("Invalid tab");
  //         return;
  //     }

  //     if (!result.success) {
  //       toast.error(result.message || "Failed to save changes");
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     toast.error("Failed to save profile");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

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
          result = await dispatch(
            updatePersonalInfo(token, {
              name: profileData.name,
              phone: profileData.phone,
              gender: profileData.gender,
              age: parseInt(profileData.age) || null,
              bio: profileData.bio,
              location: profileData.location,
            }),
          );
          break;

        case "professional":
          result = await dispatch(
            updateProfessionalInfo(token, {
              domain: professionalData.domain,
              experience: parseInt(professionalData.experience) || null,
              skills: professionalData.skills,
              linkedIn: professionalData.linkedIn,
              github: professionalData.github,
              portfolio: professionalData.portfolio,
            }),
          );
          break;

        case "education":
          const cleanedEducation = education.map((edu) => {
            const eduObj = {
              degree: edu.degree,
              institution: edu.institution,
              field: edu.field || "",
              startYear: edu.startYear || "",
              endYear: edu.endYear || "",
              grade: edu.grade || "",
            };
            // Only include _id if it's a valid MongoDB ObjectId
            if (edu._id && edu._id.match(/^[0-9a-fA-F]{24}$/)) {
              eduObj._id = edu._id;
            }
            return eduObj;
          });
          result = await dispatch(updateEducation(token, cleanedEducation));
          break;

        case "certificates":
          const cleanedCertificates = certificates.map((cert) => {
            const certObj = {
              name: cert.name,
              issuer: cert.issuer,
              issueDate: cert.issueDate || "",
              credentialId: cert.credentialId || "",
              url: cert.url || "",
            };
            if (cert._id && cert._id.match(/^[0-9a-fA-F]{24}$/)) {
              certObj._id = cert._id;
            }
            return certObj;
          });
          result = await dispatch(
            updateCertificates(token, cleanedCertificates),
          );
          break;

        case "achievements":
          const cleanedAchievements = achievements.map((ach) => {
            const achObj = {
              title: ach.title,
              description: ach.description || "",
              date: ach.date || "",
            };
            if (ach._id && ach._id.match(/^[0-9a-fA-F]{24}$/)) {
              achObj._id = ach._id;
            }
            return achObj;
          });
          result = await dispatch(
            updateAchievements(token, cleanedAchievements),
          );
          break;

        default:
          toast.error("Invalid tab");
          setSaving(false);
          return;
      }

      // Check if result is successful
      if (result && !result.success) {
        toast.error(result.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center cursor-pointer">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Intervyo</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Dashboard
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <a
                      href="#"
                      onClick={handleBackToDashboard}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </a>
                    <hr className="my-2" />
                    <a
                      onClick={handleLogout}
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-semibold">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Profile Information
                    </h2>

                    {/* Profile Picture */}
                    <div className="flex items-center gap-6 mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {profileData.profilePicture ? (
                            <img
                              src={profileData.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                              {user?.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Update your profile picture (Max 5MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                        >
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={profileData.gender}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              gender: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={profileData.age}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              age: e.target.value,
                            })
                          }
                          placeholder="25"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          placeholder="City, Country"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        rows="4"
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Tab */}
              {activeTab === "professional" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Professional Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Domain
                      </label>
                      <select
                        value={professionalData.domain}
                        onChange={(e) =>
                          setProfessionalData({
                            ...professionalData,
                            domain: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        <option value="">Select Domain</option>
                        <option value="frontend">Frontend Development</option>
                        <option value="backend">Backend Development</option>
                        <option value="fullstack">
                          Full Stack Development
                        </option>
                        <option value="data-science">Data Science</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="ml">Machine Learning</option>
                        <option value="blockchain">Blockchain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={professionalData.experience}
                        onChange={(e) =>
                          setProfessionalData({
                            ...professionalData,
                            experience: e.target.value,
                          })
                        }
                        placeholder="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={professionalData.linkedIn}
                        onChange={(e) =>
                          setProfessionalData({
                            ...professionalData,
                            linkedIn: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={professionalData.github}
                        onChange={(e) =>
                          setProfessionalData({
                            ...professionalData,
                            github: e.target.value,
                          })
                        }
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={professionalData.portfolio}
                        onChange={(e) =>
                          setProfessionalData({
                            ...professionalData,
                            portfolio: e.target.value,
                          })
                        }
                        placeholder="https://yourportfolio.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddSkill()
                        }
                        placeholder="Add a skill (e.g., React, Node.js)"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {professionalData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-purple-200"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-600 transition"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Education
                  </h2>

                  {/* Add Education Form */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Add Education
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Degree (e.g., B.Tech, M.Sc.)"
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            degree: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Institution Name"
                        value={newEducation.institution}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            institution: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={newEducation.field}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            field: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Grade/CGPA"
                        value={newEducation.grade}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            grade: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="number"
                        placeholder="Start Year"
                        value={newEducation.startYear}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            startYear: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="number"
                        placeholder="End Year"
                        value={newEducation.endYear}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            endYear: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleAddEducation}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Add Education
                    </button>
                  </div>

                  {/* Education List */}
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div
                        key={edu._id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800">
                              {edu.degree}
                            </h3>
                            <p className="text-purple-600 font-semibold mb-2">
                              {edu.institution}
                            </p>
                            <p className="text-gray-600">{edu.field}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                              <span>
                                {edu.startYear} - {edu.endYear}
                              </span>
                              {edu.grade && <span>{edu.grade}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveEducation(edu._id)}
                            className="text-red-500 hover:text-red-700 text-xl"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === "certificates" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Certificates
                  </h2>

                  {/* Add Certificate Form */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Add Certificate
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Certificate Name"
                        value={newCertificate.name}
                        onChange={(e) =>
                          setNewCertificate({
                            ...newCertificate,
                            name: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        value={newCertificate.issuer}
                        onChange={(e) =>
                          setNewCertificate({
                            ...newCertificate,
                            issuer: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="date"
                        placeholder="Issue Date"
                        value={newCertificate.issueDate}
                        onChange={(e) =>
                          setNewCertificate({
                            ...newCertificate,
                            issueDate: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Credential ID"
                        value={newCertificate.credentialId}
                        onChange={(e) =>
                          setNewCertificate({
                            ...newCertificate,
                            credentialId: e.target.value,
                          })
                        }
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      />
                      <input
                        type="url"
                        placeholder="Certificate URL"
                        value={newCertificate.url}
                        onChange={(e) =>
                          setNewCertificate({
                            ...newCertificate,
                            url: e.target.value,
                          })
                        }
                        className="md:col-span-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleAddCertificate}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Add Certificate
                    </button>
                  </div>

                  {/* Certificates List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert._id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-3xl">📜</div>
                          <button
                            onClick={() => handleRemoveCertificate(cert._id)}
                            className="text-red-500 hover:text-red-700 text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-green-600 font-semibold mb-2">
                          {cert.issuer}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                        {cert.credentialId && (
                          <p className="text-sm text-gray-600 mb-2">
                            ID: {cert.credentialId}
                          </p>
                        )}
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            View Certificate →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Achievements
                  </h2>

                  {/* Add Achievement Form */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Add Achievement
                    </h3>
                    <div className="space-y-4 mb-4">
                      <input
                        type="text"
                        placeholder="Achievement Title"
                        value={newAchievement.title}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                      />
                      <textarea
                        placeholder="Description"
                        value={newAchievement.description}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition resize-none"
                      />
                      <input
                        type="date"
                        value={newAchievement.date}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            date: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <button
                      onClick={handleAddAchievement}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Add Achievement
                    </button>
                  </div>

                  {/* Achievements List */}
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement._id}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                      >
                        <div className="flex gap-4">
                          <div className="text-4xl">🏆</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                  {achievement.title}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                  {achievement.description}
                                </p>
                                {achievement.date && (
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      achievement.date,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveAchievement(achievement._id)
                                }
                                className="text-red-500 hover:text-red-700 text-xl"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Security Settings
                  </h2>

                  {/* Change Password */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🔒</span> Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span>🛡️</span> Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📱</span> Active Sessions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">💻</div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Current Device
                            </p>
                            <p className="text-sm text-gray-600">
                              Chrome on Windows • Last active: Now
                            </p>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                      <span>⚠️</span> Danger Zone
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full bg-white border-2 border-red-300 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
                        Deactivate Account
                      </button>
                      <button className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                        Delete Account Permanently
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {activeTab !== "security" && (
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    onClick={handleBackToDashboard}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : `Save ${tabs.find((t) => t.id === activeTab)?.name}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
