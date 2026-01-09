import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Globe, MessageSquare, Zap, Target, BarChart, Users, Play, ChevronDown, Menu, X } from "lucide-react";
import Lenis from '@studio-freight/lenis';

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
      orientation: 'vertical',
      gestureOrientation: 'vertical',
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
    <div className="bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-gray-200">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-gray-900">Interv</span>
            <span className="text-emerald-500">yo</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">How it Works</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Pricing</a>
            <a href="#faq" onClick={(e) => scrollToSection(e, '#faq')} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">FAQ</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all">
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                onClick={(e) => scrollToSection(e, '#features')}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => scrollToSection(e, '#how-it-works')}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                How it Works
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => scrollToSection(e, '#pricing')}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection(e, '#faq')}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                FAQ
              </a>
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  <button 
                    onClick={() => { navigate('/dashboard'); closeMobileMenu(); }} 
                    className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
                  >
                    Dashboard
                  </button>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gray-950">
        {/* Grid Background Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Animated sweep glow - Multiple layers for intensity */}
        <div 
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl"
          style={{
            animation: 'sweepGlow 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent blur-2xl"
          style={{
            animation: 'sweepGlow 8s ease-in-out infinite 0.5s'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 mb-6 border border-emerald-500/20">
           
            <span className="font-medium"></span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
            Ace Your Next Tech<br />
            Interview with <span className="text-emerald-500">AI</span><br />
            <span className="text-emerald-500">Coaching</span> <span className="text-4xl"></span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Practice real-world interview scenarios, get role-specific questions,<br />
            and receive instant, actionable feedback to boost your confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold text-lg flex items-center gap-2">
              Start Practicing Free <span>→</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-white/10 border-2 border-gray-700 rounded-xl hover:bg-white/20 font-semibold text-lg flex items-center gap-2 text-white backdrop-blur-sm">
              <Play className="w-5 h-5" /> Try Now
            </button>
          </div>

          {/* Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-t-2xl p-3">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">Frontend Developer</span>
                      <span className="text-gray-500 text-sm">Question 3 of 10</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-6">Explain the difference between useState and useReducer in React.</h3>
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
                        <span className="text-sm text-gray-600">Technical Depth</span>
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
                    <p className="text-sm text-gray-600">Great structure! Consider adding a practical example...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-16">
            <p className="text-gray-900 mb-8 text-center">
              <span className="bg-yellow-400 px-2 py-1">Trusted by <strong>5,000+</strong> job seekers preparing for their dream roles</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 border border-gray-700 max-w-7xl mx-auto">
              <div className="flex flex-col items-center justify-center p-8 border-r border-b border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">TechCorp</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 border-r border-b border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">Innovate Inc</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 border-r border-b border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">DevStudio</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 border-b border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">CodeAcademy</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 border-r border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">StartupHub</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 border-r border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">CareerBoost</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 border-r border-gray-700 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">HireRight</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-8 hover:bg-white/5 hover:-translate-y-2 transition-all duration-300 min-h-[120px] group cursor-pointer">
                <span className="text-2xl font-bold text-white mb-2">SkillBoost</span>
                <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Learn More →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full mb-4 font-medium">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to<br />
              <span className="text-emerald-500">nail your interview</span>
            </h2>
            <p className="text-xl text-gray-600">
              From practice questions to AI feedback, Intervyo gives you the tools to prepare smarter<br />
              and interview with confidence.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AI-Powered Questions - Emerald Green Card */}
            <div className="bg-emerald-600 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all min-h-[280px] flex flex-col justify-center">
              <div className="text-yellow-200 text-6xl font-bold mb-3">50K+</div>
              <h3 className="text-yellow-100 text-xl font-medium">Questions Asked</h3>
              <p className="text-emerald-100 mt-2">last month</p>
            </div>

            {/* Realistic Scenarios - Gray Card */}
            <div className="bg-gray-500 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all text-white min-h-[280px] flex flex-col justify-center">
              <h3 className="text-yellow-200 text-2xl font-semibold mb-4">Active Users</h3>
              <div className="text-yellow-100 text-7xl font-bold mb-6">12K</div>
             
            </div>

            {/* Instant Feedback - Yellow Lime Card */}
            <div className="bg-yellow-300 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all min-h-[280px] flex flex-col justify-center">
              <div className="bg-yellow-400 rounded-2xl p-4 inline-block mb-6">
                <Zap className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Feedback</h3>
              <p className="text-gray-800 leading-relaxed">
                Real-time AI analysis of your responses
              </p>
            </div>

            {/* Large Purple Card with Chart */}
            <div className="md:col-span-2 bg-purple-200 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all">
              <div className="bg-purple-300 rounded-2xl px-6 py-2 inline-block mb-4">
                <h3 className="text-xl font-bold text-gray-900">Interview Success Rate</h3>
              </div>
              <div className="text-6xl font-bold mb-2">87%</div>
              <div className="flex items-center gap-2 text-purple-700 mb-6">
                
              </div>
              <div className="h-32 bg-purple-300/50 rounded-xl"></div>
            </div>

            {/* Skill Assessment - Pink Card */}
            <div className="bg-pink-200 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-300 mb-6">
                <div className="text-4xl">🎯</div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Assessment</h3>
            </div>

            {/* Progress Tracking - Yellow Card */}
            <div className="bg-yellow-300 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Practice Sessions</h3>
              <div className="text-5xl font-bold mb-2 text-gray-900">2.4K</div>
              <p className="text-gray-800 mb-4">Completed this week</p>
              
            </div>

            {/* Industry Insights - Emerald Card - Wide */}
            <div className="md:col-span-2 bg-emerald-600 rounded-3xl p-10 shadow-lg border-4 border-gray-900 hover:shadow-2xl transition-all text-white flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3 text-yellow-200">We Build Future of</h3>
                <h3 className="text-3xl font-bold mb-4 text-yellow-100">Interview Prep</h3>
                <p className="text-emerald-100">Crafting Meaningful AI-Driven Experience</p>
              </div>
              <div className="w-32 h-32 rounded-full border-4 border-yellow-200 flex items-center justify-center">
                <div className="text-6xl">⊕</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white px-4">
              Here's why you'd choose <span className="text-emerald-500">us</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 px-4">
              The experience of a <span className="font-semibold text-emerald-500">professional platform</span>, Flexibility of a <span className="font-semibold text-emerald-500">custom solution</span>,<br className="hidden md:block" />
              and the comfort of an <span className="font-semibold text-emerald-500">all-in-one tool</span>.
            </p>
          </div>

          {/* Mobile View - Stacked Cards */}
          <div className="block md:hidden space-y-4">
            {/* AI-Powered */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">AI-Powered</h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Quick</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Custom</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Affordable</span>
                </div>
              </div>
            </div>

            {/* Voice Practice */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">Voice Practice</h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">—</span>
                  <span className="text-gray-300 text-xs font-semibold">Quick</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Custom</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">—</span>
                  <span className="text-gray-300 text-xs font-semibold">Affordable</span>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">Analytics</h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Quick</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">—</span>
                  <span className="text-gray-300 text-xs font-semibold">Custom</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Affordable</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                <h4 className="text-xl font-bold text-white relative z-10">Pricing</h4>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-gray-500 text-2xl font-bold mb-2">—</span>
                  <span className="text-gray-300 text-xs font-semibold">Quick</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Custom</span>
                </div>
                <div className="bg-gray-700 p-4 rounded flex flex-col items-center justify-center">
                  <span className="text-emerald-500 text-3xl font-bold mb-2">✓</span>
                  <span className="text-gray-300 text-xs font-semibold">Affordable</span>
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
              <h3 className="text-xl lg:text-2xl font-bold text-gray-300">Quick</h3>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-300">Custom</h3>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-300">Affordable</h3>
            </div>

            {/* Row 1 - AI-Powered */}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">AI-Powered</h4>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>

            {/* Row 2 - Voice Practice */}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">Voice Practice</h4>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">—</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">—</span>
            </div>

            {/* Row 3 - Analytics */}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">Analytics</h4>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">—</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>

            {/* Row 4 - Pricing */}
            <div className="bg-gradient-to-br from-gray-950 via-emerald-600 to-emerald-500 p-6 lg:p-8 flex items-center relative overflow-hidden min-h-[100px] lg:min-h-[120px]">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
              <h4 className="text-lg lg:text-xl font-bold text-white relative z-10">Pricing</h4>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-gray-500 text-3xl lg:text-4xl font-bold">—</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>
            <div className="bg-gray-700 p-6 lg:p-8 flex items-center justify-center min-h-[100px] lg:min-h-[120px]">
              <span className="text-emerald-500 text-4xl lg:text-5xl font-bold">✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-100 text-emerald-600 px-6 py-2 rounded-full mb-6 font-semibold text-sm tracking-wide">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Four steps to<br />
              <span className="text-emerald-500">interview success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes interview prep efficient and effective.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                01
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">Choose Your Role</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Select from 50+ tech roles including Frontend, Backend, Data Science, DevOps, and more. We'll tailor questions to match.
                </p>
              </div>
              <div className="text-gray-300 group-hover:text-emerald-500 text-4xl hidden md:block transition-colors">→</div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                02
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">Practice Interviews</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Answer realistic interview questions through voice or text. Our AI simulates a real interviewer experience.
                </p>
              </div>
              <div className="text-gray-300 group-hover:text-emerald-500 text-4xl hidden md:block transition-colors">→</div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                03
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">Get AI Feedback</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Receive instant, detailed feedback on clarity, technical accuracy, structure, and areas for improvement.
                </p>
              </div>
              <div className="text-gray-300 group-hover:text-emerald-500 text-4xl hidden md:block transition-colors">→</div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                04
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">Track Progress</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Monitor your improvement with analytics dashboards and prepare strategically for your actual interview.
                </p>
              </div>
              <div className="text-gray-300 group-hover:text-emerald-500 text-4xl hidden md:block transition-colors">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              We don't gossip but some<br />
              people have been saying<br />
              some things...
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "Just landed my dream job at Google! The AI feedback was incredibly accurate and helped me improve my answers."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  PS
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Priya Sharma</p>
                  <p className="text-gray-500 text-xs">Software Engineer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "The mock interviews felt so realistic! I was actually nervous practicing, which helped me perform better in the real thing."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  RK
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Rahul Kumar</p>
                  <p className="text-gray-500 text-xs">Full Stack Developer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "I went from failing interviews to getting 3 offers in 2 weeks. The AI coaching is next level!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AP
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Aisha Patel</p>
                  <p className="text-gray-500 text-xs">Data Scientist</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "The role-specific questions were spot on. Got asked almost the exact same questions in my Amazon interview!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AS
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Arjun Singh</p>
                  <p className="text-gray-500 text-xs">Backend Engineer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 5 - Highlighted */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-white mb-4">
                "Best $0 I ever spent! The free tier alone got me interview-ready. Now I'm at Microsoft!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">
                  AD
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Ananya Desai</p>
                  <p className="text-emerald-100 text-xs">Frontend Developer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "The instant feedback saved me so much time. No more wondering if my answers were good enough!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  VR
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Vikram Reddy</p>
                  <p className="text-gray-500 text-xs">DevOps Engineer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 7 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "Practiced 50+ questions and got detailed feedback on each. My confidence went through the roof!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  SG
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Sneha Gupta</p>
                  <p className="text-gray-500 text-xs">Product Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 8 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "The analytics dashboard showed me exactly where I was weak. Improved my technical depth score from 3 to 5 stars!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  RM
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Rohan Mehta</p>
                  <p className="text-gray-500 text-xs">Cloud Architect</p>
                </div>
              </div>
            </div>

            {/* Testimonial 9 */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-800">
              <p className="text-gray-300 mb-4">
                "Voice practice feature is a game changer. Finally got comfortable speaking my answers out loud!"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  NV
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Neha Verma</p>
                  <p className="text-gray-500 text-xs">ML Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Down to business.<br />
              Pick your plan <span className="inline-block">↓</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg p-10 shadow-2xl border-8 border-gray-900 flex flex-col">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Free
              </h3>
              
              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Get started with basic interview prep
              </p>

              <div className="text-6xl font-bold text-gray-900 mb-8">
                ₹0<span className="text-xl text-gray-500 font-normal">/month</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">2 interviews/month</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Basic analytics</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Community support</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/register')}
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-bold text-lg uppercase tracking-wide transition-colors mt-auto"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-white rounded-lg p-10 shadow-2xl border-8 border-gray-900 relative flex flex-col">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                
              </div>

              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Pro
              </h3>
              
              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Unlimited practice - AI feedback - Land your dream job
              </p>

              <div className="text-6xl font-bold text-gray-900 mb-8">
                ₹999<span className="text-xl text-gray-500 font-normal">/month</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Unlimited interviews</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Advanced analytics & reports</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Priority support</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Voice & video recording</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Custom questions</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/register')}
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-bold text-lg uppercase tracking-wide transition-colors mt-auto"
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg p-10 shadow-2xl border-8 border-gray-900 flex flex-col">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Enterprise
              </h3>
              
              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Custom solutions for teams and organizations
              </p>

              <div className="text-6xl font-bold text-gray-900 mb-8">
                Custom
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Everything in Pro</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Custom branding</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Dedicated support</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">Team management</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">SSO integration</p>
                </div>
              </div>

              <button 
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-bold text-lg uppercase tracking-wide transition-colors mt-auto"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-gradient-to-br from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            I've got questions.
          </h2>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="border-b-4 border-white pb-6">
              <button 
                onClick={() => toggleFaq(0)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">
                  How does AI feedback work?
                </h3>
                <ChevronDown 
                  className={`w-12 h-12 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 0 ? 'rotate-180' : ''}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 0 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Our AI analyzes your responses in real-time, evaluating clarity, technical accuracy, structure, and completeness. You'll receive instant, actionable feedback on how to improve your answers, just like a real interviewer would provide.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border-b-4 border-white pb-6">
              <button 
                onClick={() => toggleFaq(1)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">
                  Can I practice for specific tech roles?
                </h3>
                <ChevronDown 
                  className={`w-12 h-12 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 1 ? 'rotate-180' : ''}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 1 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Yes! We have role-specific question banks for 50+ tech positions including Frontend, Backend, Full Stack, DevOps, Data Science, ML Engineer, Product Manager, and more. Each role has curated questions that match real interview scenarios.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border-b-4 border-white pb-6">
              <button 
                onClick={() => toggleFaq(2)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">
                  How fast will I see improvement?
                </h3>
                <ChevronDown 
                  className={`w-12 h-12 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 2 ? 'rotate-180' : ''}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 2 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Most users see significant improvement within 1-2 weeks of consistent practice. Our analytics dashboard tracks your progress over time, showing improvements in clarity, technical depth, and structure scores. Practice 3-5 interviews per week for best results.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border-b-4 border-white pb-6">
              <button 
                onClick={() => toggleFaq(3)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">
                  Is voice practice really necessary?
                </h3>
                <ChevronDown 
                  className={`w-12 h-12 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 3 ? 'rotate-180' : ''}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 3 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Absolutely! Speaking your answers out loud helps you practice articulation, pacing, and confidence. Many candidates freeze during verbal interviews even when they know the answer. Our voice practice feature simulates real interview conditions so you're prepared.
                </p>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border-b-4 border-white pb-6">
              <button 
                onClick={() => toggleFaq(4)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">
                  Can I use this to prepare my team for interviews?
                </h3>
                <ChevronDown 
                  className={`w-12 h-12 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 4 ? 'rotate-180' : ''}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 4 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Yes! Our Enterprise plan includes team management features, custom branding, and dedicated support. Perfect for bootcamps, training programs, and companies preparing candidates for technical interviews. Contact our sales team for custom solutions.
                </p>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="border-b-4 border-white pb-6">
              <button 
                onClick={() => toggleFaq(5)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white pr-8">
                  What companies do your questions prepare me for?
                </h3>
                <ChevronDown 
                  className={`w-12 h-12 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 5 ? 'rotate-180' : ''}`}
                  strokeWidth={3}
                />
              </button>
              {openFaq === 5 && (
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Our question banks are designed to prepare you for interviews at top tech companies including FAANG (Facebook/Meta, Amazon, Apple, Netflix, Google), Microsoft, startups, and mid-size tech companies. The questions cover common patterns and topics asked across the industry.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-emerald-500 px-3 py-1 rounded">Intervyo</span> is the only<br />
                prep tool you'll ever need
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of candidates who've landed their dream<br />
                tech jobs.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 font-semibold text-lg flex items-center gap-2">
                Get Started <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
