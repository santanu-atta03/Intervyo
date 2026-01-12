import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createInterview } from "../services/operations/interviewAPI";
import { resetInterview, setInterviewConfig } from "../slices/interviewSlice";

export default function InterviewSetup() {
  const { token } = useSelector((state) => state.auth);
  const { interviewConfig, loading } = useSelector((state) => state.interview);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [customQuestion, setCustomQuestion] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [customCompany, setCustomCompany] = useState("");
  const [config, setConfig] = useState({
    domain: "",
    subDomain: "",
    interviewType: "",
    difficulty: "",
    duration: 30,
    targetCompany: "",
    questions: [],
    resume: null,
    ...interviewConfig, // Merge with Redux config if exists
  });
  const [isPreparingInterview, setIsPreparingInterview] = useState(false);
  const [preparationProgress, setPreparationProgress] = useState(0);

  useEffect(() => {
    // Reset interview state when component mounts
    dispatch(resetInterview());
  }, [dispatch]);

  // Update config when interviewConfig changes
  useEffect(() => {
    if (interviewConfig) {
      setConfig((prev) => ({
        ...prev,
        ...interviewConfig,
      }));
    }
  }, [interviewConfig]);

  const domains = [
    {
      value: "frontend",
      label: "Frontend Development",
      icon: "💻",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      subDomains: [
        "React",
        "Vue",
        "Angular",
        "JavaScript",
        "TypeScript",
        "Next.js",
        "CSS/HTML",
        "Redux",
      ],
    },
    {
      value: "backend",
      label: "Backend Development",
      icon: "⚙️",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      subDomains: [
        "Node.js",
        "Python",
        "Java",
        "Go",
        "C#",
        "Ruby",
        "PHP",
        "Spring Boot",
      ],
    },
    {
      value: "fullstack",
      label: "Full Stack",
      icon: "🔧",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      subDomains: [
        "MERN",
        "MEAN",
        "Django",
        "Spring Boot",
        ".NET",
        "Ruby on Rails",
      ],
    },
    {
      value: "mobile",
      label: "Mobile Development",
      icon: "📱",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      subDomains: [
        "React Native",
        "Flutter",
        "iOS (Swift)",
        "Android (Kotlin)",
        "Xamarin",
      ],
    },
    {
      value: "devops",
      label: "DevOps & Cloud",
      icon: "🚀",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      subDomains: [
        "AWS",
        "Azure",
        "GCP",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Terraform",
      ],
    },
    {
      value: "data",
      label: "Data Science & AI",
      icon: "🤖",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      subDomains: [
        "Machine Learning",
        "Data Analysis",
        "Deep Learning",
        "NLP",
        "Computer Vision",
      ],
    },
  ];

  const interviewTypes = [
    {
      value: "technical",
      label: "Technical",
      icon: "💡",
      gradient: "from-blue-500 to-purple-600",
      description: "Coding, algorithms & data structures",
      features: ["Live coding", "Problem solving", "Code review"],
    },
    {
      value: "behavioral",
      label: "Behavioral",
      icon: "💬",
      gradient: "from-green-500 to-teal-600",
      description: "Communication & soft skills",
      features: ["STAR method", "Team scenarios", "Leadership"],
    },
    {
      value: "system-design",
      label: "System Design",
      icon: "🏗️",
      gradient: "from-orange-500 to-red-600",
      description: "Architecture & scalability",
      features: ["Microservices", "Database design", "Load balancing"],
    },
    {
      value: "mixed",
      label: "Mixed Interview",
      icon: "🎯",
      gradient: "from-pink-500 to-purple-600",
      description: "Comprehensive assessment",
      features: ["All-in-one", "Realistic", "Complete evaluation"],
    },
  ];

  const difficulties = [
    {
      value: "easy",
      label: "Easy",
      icon: "🟢",
      description: "Perfect for beginners",
      gradient: "from-green-400 to-emerald-500",
      exp: "0-2 years",
      badge: "Beginner Friendly",
    },
    {
      value: "medium",
      label: "Medium",
      icon: "🟡",
      description: "Intermediate challenges",
      gradient: "from-yellow-400 to-orange-500",
      exp: "2-4 years",
      badge: "Most Popular",
    },
    {
      value: "hard",
      label: "Hard",
      icon: "🔴",
      description: "Advanced concepts",
      gradient: "from-red-400 to-pink-500",
      exp: "4-7 years",
      badge: "Advanced",
    },
    {
      value: "expert",
      label: "Expert",
      icon: "⚫",
      description: "Senior level mastery",
      gradient: "from-purple-600 to-indigo-700",
      exp: "7+ years",
      badge: "Elite Level",
    },
  ];

  const durations = [
    { value: 15, label: "15 min", icon: "⚡", desc: "Quick practice" },
    {
      value: 30,
      label: "30 min",
      icon: "🎯",
      desc: "Standard session",
      recommended: true,
    },
    { value: 45, label: "45 min", icon: "⏱️", desc: "Extended practice" },
    { value: 60, label: "1 hour", icon: "🕐", desc: "Deep dive" },
    { value: 90, label: "1.5 hours", icon: "⏰", desc: "Full interview" },
  ];

  const topCompanies = [
    {
      name: "Google",
      logo: "🔍",
      gradient: "from-blue-500 to-red-500",
      color: "blue",
    },
    {
      name: "Meta",
      logo: "👁️",
      gradient: "from-blue-600 to-indigo-600",
      color: "indigo",
    },
    {
      name: "Amazon",
      logo: "📦",
      gradient: "from-orange-400 to-yellow-500",
      color: "orange",
    },
    {
      name: "Microsoft",
      logo: "🪟",
      gradient: "from-blue-500 to-cyan-500",
      color: "cyan",
    },
    {
      name: "Apple",
      logo: "🍎",
      gradient: "from-gray-700 to-gray-900",
      color: "gray",
    },
    {
      name: "Netflix",
      logo: "🎬",
      gradient: "from-red-600 to-red-700",
      color: "red",
    },
    {
      name: "Tesla",
      logo: "⚡",
      gradient: "from-red-500 to-gray-700",
      color: "red",
    },
    {
      name: "Adobe",
      logo: "🎨",
      gradient: "from-red-500 to-pink-500",
      color: "pink",
    },
    {
      name: "Salesforce",
      logo: "☁️",
      gradient: "from-blue-400 to-cyan-500",
      color: "cyan",
    },
    {
      name: "Oracle",
      logo: "🔴",
      gradient: "from-red-600 to-orange-600",
      color: "orange",
    },
    {
      name: "Startup",
      logo: "🚀",
      gradient: "from-purple-500 to-pink-500",
      color: "purple",
    },
    {
      name: "Custom",
      logo: "✏️",
      gradient: "from-gray-500 to-gray-700",
      color: "gray",
    },
  ];

  const updateConfig = (updates) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    dispatch(setInterviewConfig(updates));
  };

  // Handle domain selection with subdomain reset
  const handleDomainSelect = (domainValue) => {
    updateConfig({
      domain: domainValue,
      subDomain: "", // Reset subdomain when domain changes
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            updateConfig({ resume: file });
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      const newQuestions = [...(config.questions || []), customQuestion.trim()];
      updateConfig({ questions: newQuestions });
      setCustomQuestion("");
      toast.success("Custom question added!");
    }
  };

  const removeQuestion = (index) => {
    const newQuestions = (config.questions || []).filter((_, i) => i !== index);
    updateConfig({ questions: newQuestions });
    toast.success("Question removed");
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return config.domain && config.subDomain;
      case 2:
        return config.interviewType && config.difficulty;
      case 3:
        return config.duration && config.targetCompany;
      case 4:
        return true; // Step 4 is optional
      default:
        return false;
    }
  };

  const handleStartInterview = async () => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    // Validate required fields
    if (
      !config.domain ||
      !config.subDomain ||
      !config.interviewType ||
      !config.difficulty ||
      !config.duration ||
      !config.targetCompany
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    // Show preparation screen
    setIsPreparingInterview(true);

    // Simulate AI preparation with progress updates
    const progressSteps = [
      { progress: 20, message: "Analyzing your resume..." },
      { progress: 40, message: "Generating personalized questions..." },
      { progress: 60, message: "Setting up interview environment..." },
      { progress: 80, message: "Configuring AI interviewer..." },
      { progress: 100, message: "Ready to start!" },
    ];

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPreparationProgress(step.progress);
      toast.loading(step.message, { id: "prep" });
    }

    toast.dismiss("prep");

    // Prepare interview data
    let interviewData = { ...config };

    // Handle file upload separately
    if (config.resume) {
      const formData = new FormData();
      formData.append("resume", config.resume);
      formData.append("domain", config.domain);
      formData.append("subDomain", config.subDomain);
      formData.append("interviewType", config.interviewType);
      formData.append("difficulty", config.difficulty);
      formData.append("duration", config.duration);
      formData.append("targetCompany", config.targetCompany);

      // Only append questions if they exist
      if (config.questions && config.questions.length > 0) {
        formData.append("customQuestions", JSON.stringify(config.questions));
      }

      interviewData = formData;
    }

    // Call API to create interview
    dispatch(createInterview(interviewData, navigate, token));
  };

  if (isPreparingInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full border border-white/20">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Preparing Your Interview
            </h2>

            <div className="mb-6">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                  style={{ width: `${preparationProgress}%` }}
                ></div>
              </div>
              <p className="text-white/60 mt-3 text-sm">
                {preparationProgress}% Complete
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div
                className={`flex items-center gap-3 p-3 rounded-xl ${preparationProgress >= 20 ? "bg-green-500/20" : "bg-white/5"}`}
              >
                <span className="text-xl">
                  {preparationProgress >= 20 ? "✅" : "⏳"}
                </span>
                <span className="text-white/80">Resume Analysis</span>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-xl ${preparationProgress >= 40 ? "bg-green-500/20" : "bg-white/5"}`}
              >
                <span className="text-xl">
                  {preparationProgress >= 40 ? "✅" : "⏳"}
                </span>
                <span className="text-white/80">Question Generation</span>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-xl ${preparationProgress >= 60 ? "bg-green-500/20" : "bg-white/5"}`}
              >
                <span className="text-xl">
                  {preparationProgress >= 60 ? "✅" : "⏳"}
                </span>
                <span className="text-white/80">Environment Setup</span>
              </div>
              <div
                className={`flex items-center gap-3 p-3 rounded-xl ${preparationProgress >= 80 ? "bg-green-500/20" : "bg-white/5"}`}
              >
                <span className="text-xl">
                  {preparationProgress >= 80 ? "✅" : "⏳"}
                </span>
                <span className="text-white/80">AI Configuration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <nav className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 text-white/80 hover:text-white transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                <span className="text-xl">←</span>
              </div>
              <span className="font-semibold hidden sm:block">
                Back to Dashboard
              </span>
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform hover:scale-110 transition-all">
                <span className="text-white font-bold text-2xl">AI</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">
                  Interview Setup
                </h1>
                <p className="text-xs text-white/60">
                  Powered by AI • Real-time Analysis
                </p>
              </div>
            </div>

            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl shadow-blue-500/50 ring-2 ring-white/20">
              <span className="text-xl">👤</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-8 left-0 right-0 h-1 bg-white/10 rounded-full -z-10">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full transition-all duration-700 shadow-lg shadow-purple-500/50"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {[
              { num: 1, label: "Domain", icon: "🎯", desc: "Choose field" },
              { num: 2, label: "Type", icon: "💡", desc: "Select format" },
              { num: 3, label: "Details", icon: "⚙️", desc: "Configure" },
              { num: 4, label: "Extras", icon: "✨", desc: "Customize" },
            ].map((s) => (
              <div
                key={s.num}
                className="flex flex-col items-center z-10 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold transition-all duration-500 transform relative ${
                    step >= s.num
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-110"
                      : "bg-white/10 backdrop-blur-xl text-white/40 border-2 border-white/20"
                  }`}
                >
                  {step > s.num ? (
                    <span className="text-3xl">✓</span>
                  ) : (
                    <>
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-xs mt-1">{s.num}</span>
                    </>
                  )}
                  {step === s.num && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse opacity-50"></div>
                  )}
                </div>
                <span
                  className={`mt-3 text-sm font-bold transition-all ${
                    step >= s.num ? "text-white" : "text-white/40"
                  }`}
                >
                  {s.label}
                </span>
                <span className="text-xs text-white/40 mt-1 hidden sm:block">
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-6 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>

          <div className="relative z-10">
            {/* STEP 1: Domain Selection */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                    <span className="text-purple-300 text-sm font-semibold">
                      Step 1 of 4
                    </span>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Choose Your{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Domain
                    </span>
                  </h2>
                  <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    Select the technical area where you want to showcase your
                    expertise
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {domains.map((domain, idx) => (
                    <button
                      key={domain.value}
                      onClick={() => handleDomainSelect(domain.value)}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:-translate-y-2 text-left overflow-hidden animate-fadeIn ${
                        config.domain === domain.value
                          ? "border-purple-500 bg-white/20 shadow-2xl shadow-purple-500/50 scale-105"
                          : "border-white/20 hover:border-purple-400 bg-white/5 hover:bg-white/10 shadow-xl"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>

                      <div className="relative">
                        <div className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                          {domain.icon}
                        </div>
                        <h3 className="font-bold text-2xl text-white mb-3">
                          {domain.label}
                        </h3>
                        <div className="flex items-center gap-2 text-white/60">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm">
                            {domain.subDomains.length} specializations
                          </span>
                        </div>

                        {config.domain === domain.value && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-bounce">
                            <span className="text-white text-lg">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {config.domain && (
                  <div className="mt-12 animate-slideUp">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 border-2 border-purple-500/30 backdrop-blur-xl">
                      <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-4xl">🎯</span>
                        Select Your Specialization
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {domains
                          .find((d) => d.value === config.domain)
                          ?.subDomains.map((sub, idx) => (
                            <button
                              key={sub}
                              onClick={() => updateConfig({ subDomain: sub })}
                              style={{ animationDelay: `${idx * 50}ms` }}
                              className={`group px-6 py-4 rounded-xl border-2 font-bold transition-all duration-300 transform hover:scale-105 animate-fadeIn ${
                                config.subDomain === sub
                                  ? "border-purple-500 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50"
                                  : "border-white/30 bg-white/10 text-white hover:border-purple-400 hover:bg-white/20"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{sub}</span>
                                {config.subDomain === sub && (
                                  <span className="text-xl">✓</span>
                                )}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Interview Type & Difficulty */}
            {step === 2 && (
              <div className="space-y-10">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                    <span className="text-purple-300 text-sm font-semibold">
                      Step 2 of 4
                    </span>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Choose Interview{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Format
                    </span>
                  </h2>
                  <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    Select the type and difficulty level that matches your
                    preparation goals
                  </p>
                </div>

                {/* Interview Type */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    Interview Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interviewTypes.map((type, idx) => (
                      <button
                        key={type.value}
                        onClick={() =>
                          updateConfig({ interviewType: type.value })
                        }
                        style={{ animationDelay: `${idx * 100}ms` }}
                        className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:-translate-y-2 text-left overflow-hidden animate-fadeIn ${
                          config.interviewType === type.value
                            ? "border-purple-500 bg-white/20 shadow-2xl shadow-purple-500/50 scale-105"
                            : "border-white/20 hover:border-purple-400 bg-white/5 hover:bg-white/10 shadow-xl"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                        ></div>

                        <div className="relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-5xl transform group-hover:scale-110 transition-transform">
                              {type.icon}
                            </div>
                            {config.interviewType === type.value && (
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                <span className="text-white">✓</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-2xl text-white mb-2">
                            {type.label}
                          </h3>
                          <p className="text-white/60 mb-4">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {type.features.map((feature, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🎚️</span>
                    Difficulty Level
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {difficulties.map((diff, idx) => (
                      <button
                        key={diff.value}
                        onClick={() => updateConfig({ difficulty: diff.value })}
                        style={{ animationDelay: `${idx * 100}ms` }}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fadeIn ${
                          config.difficulty === diff.value
                            ? "border-purple-500 bg-white/20 shadow-2xl shadow-purple-500/50 scale-105"
                            : "border-white/20 hover:border-purple-400 bg-white/5 hover:bg-white/10 shadow-xl"
                        }`}
                      >
                        {diff.badge === "Most Popular" && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 rounded-full text-xs font-bold text-black">
                            ⭐ Popular
                          </div>
                        )}

                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${diff.gradient} opacity-0 hover:opacity-10 transition-opacity`}
                        ></div>

                        <div className="relative text-center">
                          <div className="text-5xl mb-4 transform hover:scale-125 transition-transform">
                            {diff.icon}
                          </div>
                          <h3 className="font-bold text-xl text-white mb-2">
                            {diff.label}
                          </h3>
                          <p className="text-white/60 text-sm mb-3">
                            {diff.description}
                          </p>
                          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20">
                            {diff.exp}
                          </div>

                          {config.difficulty === diff.value && (
                            <div className="mt-4 w-8 h-8 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-bounce">
                              <span className="text-white">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Duration & Company */}
            {step === 3 && (
              <div className="space-y-10">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                    <span className="text-purple-300 text-sm font-semibold">
                      Step 3 of 4
                    </span>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Configure{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Details
                    </span>
                  </h2>
                  <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    Set your interview duration and target company
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">⏱️</span>
                    Interview Duration
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {durations.map((dur, idx) => (
                      <button
                        key={dur.value}
                        onClick={() => updateConfig({ duration: dur.value })}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 animate-fadeIn ${
                          config.duration === dur.value
                            ? "border-purple-500 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50"
                            : "border-white/20 bg-white/5 text-white hover:border-purple-400 hover:bg-white/10"
                        }`}
                      >
                        {dur.recommended && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">
                            ⭐
                          </div>
                        )}
                        <div className="text-center">
                          <div className="text-4xl mb-3">{dur.icon}</div>
                          <div className="text-2xl font-bold mb-1">
                            {dur.label}
                          </div>
                          <div className="text-xs opacity-70">{dur.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Company */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🏢</span>
                    Target Company
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {topCompanies.map((company, idx) => (
                      <button
                        key={company.name}
                        onClick={() => {
                          updateConfig({ targetCompany: company.name });
                          if (company.name === "Custom") {
                            setShowCustomCompany(true);
                          } else {
                            setShowCustomCompany(false);
                          }
                        }}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 animate-fadeIn ${
                          config.targetCompany === company.name
                            ? "border-purple-500 bg-white/20 shadow-2xl shadow-purple-500/50"
                            : "border-white/20 bg-white/5 hover:border-purple-400 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                        ></div>
                        <div className="relative text-center">
                          <div className="text-4xl mb-3 transform group-hover:scale-125 transition-transform">
                            {company.logo}
                          </div>
                          <div className="text-white font-bold">
                            {company.name}
                          </div>
                          {config.targetCompany === company.name && (
                            <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showCustomCompany && (
                    <div className="mt-6 animate-slideUp">
                      <input
                        type="text"
                        value={customCompany}
                        onChange={(e) => {
                          setCustomCompany(e.target.value);
                          updateConfig({ targetCompany: e.target.value });
                        }}
                        placeholder="Enter company name..."
                        className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 focus:outline-none backdrop-blur-xl transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Optional Enhancements */}
            {step === 4 && (
              <div className="space-y-10">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4">
                    <span className="text-purple-300 text-sm font-semibold">
                      Step 4 of 4 - Optional
                    </span>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Enhance Your{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Experience
                    </span>
                  </h2>
                  <p className="text-white/60 text-lg max-w-2xl mx-auto">
                    Add custom questions and upload your resume for personalized
                    questions
                  </p>
                </div>

                {/* Resume Upload */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 border-2 border-dashed border-white/20 rounded-3xl p-10 hover:border-purple-400 transition-all duration-500 backdrop-blur-xl">
                  <div className="text-center">
                    <div className="inline-block p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-6">
                      <span className="text-7xl">📄</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Upload Your Resume
                    </h3>
                    <p className="text-white/60 mb-6 text-lg">
                      AI will analyze and create personalized questions based on
                      your experience
                    </p>

                    {!config.resume ? (
                      <>
                        <label className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
                          <span className="text-xl">📤</span>
                          Choose PDF File
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-white/40 text-sm mt-4">
                          Maximum file size: 5MB • PDF only
                        </p>
                      </>
                    ) : (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="inline-flex items-center gap-4 px-6 py-4 bg-green-500/20 border-2 border-green-500/50 rounded-xl">
                          <span className="text-3xl">✓</span>
                          <div className="text-left">
                            <div className="font-bold text-white text-lg">
                              {config.resume.name}
                            </div>
                            <div className="text-green-400 text-sm">
                              Successfully uploaded
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            updateConfig({ resume: null });
                            setUploadProgress(0);
                          }}
                          className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                        >
                          Remove File
                        </button>
                      </div>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-6 animate-fadeIn">
                        <div className="bg-white/10 h-3 rounded-full overflow-hidden backdrop-blur-xl">
                          <div
                            className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 h-full transition-all duration-300 relative"
                            style={{ width: `${uploadProgress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-white/60 text-sm mt-2 font-semibold">
                          Uploading... {uploadProgress}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Questions */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 border-2 border-white/20 rounded-3xl p-8 backdrop-blur-xl">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-4xl">📝</span>
                    Add Custom Questions
                    <span className="text-sm font-normal text-white/60 ml-2">
                      (Optional)
                    </span>
                  </h3>

                  <div className="flex gap-3 mb-6">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addCustomQuestion()
                      }
                      placeholder="Enter your custom question here..."
                      className="flex-1 px-6 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-500 focus:outline-none backdrop-blur-xl transition-all"
                    />
                    <button
                      onClick={addCustomQuestion}
                      disabled={!customQuestion.trim()}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Add +
                    </button>
                  </div>

                  {(config.questions || []).length > 0 && (
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-white/80 mb-4">
                        <span className="text-xl">📋</span>
                        <span className="font-semibold">
                          {(config.questions || []).length} custom question(s)
                          added
                        </span>
                      </div>
                      {(config.questions || []).map((q, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-4 p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all animate-slideUp"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-500/30 rounded-lg font-bold text-white flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="flex-1 text-white/90 leading-relaxed">
                            {q}
                          </p>
                          <button
                            onClick={() => removeQuestion(index)}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500 rounded-lg text-red-400 hover:text-white font-bold transition-all transform hover:scale-110"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(config.questions || []).length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      <span className="text-5xl mb-3 block">📝</span>
                      <p>No custom questions added yet</p>
                      <p className="text-sm mt-2">
                        Add questions to personalize your interview
                      </p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="text-sm text-blue-200">
                        <strong className="block mb-1">Pro Tip:</strong>
                        Custom questions will be seamlessly integrated with
                        AI-generated questions for a comprehensive interview
                        experience.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interview Summary */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 border-2 border-purple-500/30 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">📊</span>
                    <h3 className="text-3xl font-bold text-white">
                      Interview Summary
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-xl border border-white/20">
                      <div className="text-white/60 text-sm mb-2 font-semibold">
                        Domain
                      </div>
                      <div className="text-white font-bold text-lg">
                        {config.domain || "—"}
                      </div>
                      <div className="text-purple-300 text-sm mt-1">
                        {config.subDomain || "—"}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-xl border border-white/20">
                      <div className="text-white/60 text-sm mb-2 font-semibold">
                        Interview Type
                      </div>
                      <div className="text-white font-bold text-lg capitalize">
                        {config.interviewType || "—"}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-xl border border-white/20">
                      <div className="text-white/60 text-sm mb-2 font-semibold">
                        Difficulty
                      </div>
                      <div className="text-white font-bold text-lg capitalize">
                        {config.difficulty || "—"}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-xl border border-white/20">
                      <div className="text-white/60 text-sm mb-2 font-semibold">
                        Duration
                      </div>
                      <div className="text-white font-bold text-lg">
                        {config.duration || "—"} minutes
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-xl border border-white/20">
                      <div className="text-white/60 text-sm mb-2 font-semibold">
                        Target Company
                      </div>
                      <div className="text-white font-bold text-lg">
                        {config.targetCompany || "—"}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-5 backdrop-blur-xl border border-white/20">
                      <div className="text-white/60 text-sm mb-2 font-semibold">
                        Custom Questions
                      </div>
                      <div className="text-white font-bold text-lg">
                        {(config.questions || []).length} added
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-500/20 border-2 border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-3 text-green-200">
                      <span className="text-2xl">✓</span>
                      <div>
                        <div className="font-bold">Ready to Start!</div>
                        <div className="text-sm opacity-80">
                          Click "Launch Interview" when you're prepared
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`group flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all transform ${
              step === 1
                ? "bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10"
                : "bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-x-2"
            }`}
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Previous
          </button>

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepComplete()}
                className={`group flex items-center gap-3 px-12 py-4 rounded-xl font-bold text-lg transition-all transform ${
                  isStepComplete()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 hover:translate-x-2"
                    : "bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10"
                }`}
              >
                Next Step
                <span className="text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            ) : (
              <button
                onClick={handleStartInterview}
                disabled={!token}
                className="group relative px-12 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold text-xl rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-110 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  Launch Interview Now
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  step >= s ? "bg-purple-500 w-8" : "bg-white/30"
                }`}
              ></div>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-3">
            Step {step} of 4 • {Math.round((step / 4) * 100)}% Complete
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
