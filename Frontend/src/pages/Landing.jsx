import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Bot,
  BarChart3,
  Code,
  Database,
  Cpu,
  Smartphone,
  Wrench,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Star,
  Play,
  User,
  UserRound,
  Briefcase,
  GraduationCap,
  Globe,
  ArrowRight,
  Check,
  Award,
  Zap,
  Lightbulb,
  Rocket,
  Settings,
  Monitor,
  Server,
  SmartphoneIcon,
  Cloud,
  Shield,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  PieChart,
  BarChart,
  TrendingUpIcon,
  Users2,
  FileBarChart,
  StarIcon
} from 'lucide-react';


export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Bot className="w-10 h-10" />, // AI-Powered Interviews
      title: 'AI-Powered Interviews',
      description: 'Experience realistic interviews with our advanced AI interviewer',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BarChart3 className="w-10 h-10" />, // Real-Time Analytics
      title: 'Real-Time Analytics',
      description: 'Get instant feedback on your performance with detailed metrics',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Target className="w-10 h-10" />, // Domain-Specific Prep
      title: 'Domain-Specific Prep',
      description: 'Practice for Frontend, Backend, Data Science & more',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Trophy className="w-10 h-10" />, // Gamified Learning
      title: 'Gamified Learning',
      description: 'Earn XP, unlock badges, and compete on leaderboards',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      image: <UserRound className="w-10 h-10" />,
      text: 'This platform helped me land my dream job! The AI interviewer felt incredibly real.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Data Scientist at Amazon',
      image: <UserRound className="w-10 h-10" />,
      text: 'The instant feedback and analytics were game-changers for my interview prep.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Full Stack Developer at Microsoft',
      image: <UserRound className="w-10 h-10" />,
      text: 'I improved my confidence by 10x. The practice sessions were incredibly valuable.',
      rating: 5
    }
  ];

  const stats = [
    { value: '50K+', label: 'Users' },
    { value: '100K+', label: 'Interviews Completed' },
    { value: '95%', label: 'Success Rate' },
    { value: '4.9/5', label: 'Average Rating' }
  ];

  const domains = [
    { name: 'Frontend', icon: <Code className="w-8 h-8" />, color: 'bg-pink-500' },
    { name: 'Backend', icon: <Server className="w-8 h-8" />, color: 'bg-blue-500' },
    { name: 'Full Stack', icon: <Globe className="w-8 h-8" />, color: 'bg-purple-500' },
    { name: 'Data Science', icon: <Database className="w-8 h-8" />, color: 'bg-green-500' },
    { name: 'DevOps', icon: <Wrench className="w-8 h-8" />, color: 'bg-orange-500' },
    { name: 'Mobile', icon: <Smartphone className="w-8 h-8" />, color: 'bg-indigo-500' }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['2 interviews/month', 'Basic analytics', 'Community support', 'Limited domains'],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: ['Unlimited interviews', 'Advanced analytics', 'Priority support', 'All domains', 'Video recording', 'Custom questions'],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Everything in Pro', 'Custom branding', 'API access', 'Dedicated support', 'Team management', 'SSO integration'],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const parallaxOffset = scrollY * 0.5;
  const heroOpacity = Math.max(1 - scrollY / 500, 0);

  return (
    <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .gradient-animate { 
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .scale-in {
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .scale-in.visible {
          opacity: 1;
          transform: scale(1);
        }
        /* Mobile menu animations */
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .mobile-menu-enter {
          animation: slideIn 0.3s ease-out forwards;
        }
        .mobile-menu-exit {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>

      {/* Animated Cursor Effect */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'left 0.3s, top 0.3s'
        }}
      />

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold">Intervyo</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-purple-400 transition">Features</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a>
              <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
              <a href="#testimonials" className="hover:text-purple-400 transition">Testimonials</a>
              <a href="/faq" className="hover:text-purple-400 transition">FAQ</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>

            { token === null && 
              <div className="hidden md:flex items-center gap-4">
                <Link to={"/login"} className="px-4 py-2 text-sm hover:text-purple-400 transition">Sign In</Link>
                <Link to={"/register"} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105">
                  Get Started
                </Link>
              </div>
            }
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-lg shadow-lg border-t border-white/10 ${isMenuOpen ? 'mobile-menu-enter' : 'hidden'}`}>
          <div className="flex flex-col p-4 space-y-4">
            <a href="#features" className="py-2 px-4 hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="py-2 px-4 hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#pricing" className="py-2 px-4 hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#testimonials" className="py-2 px-4 hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
            
            {token === null && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                <Link to={"/login"} className="py-2 px-4 text-center hover:text-purple-400 transition" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                <Link to={"/register"} className="py-2 px-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-16">
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 md:right-20 w-56 h-56 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 md:left-1/3 w-48 h-48 md:w-80 md:h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto" style={{ opacity: heroOpacity }}>
          <div className="mb-4 md:mb-6 inline-block px-4 py-1 md:px-6 md:py-2 bg-purple-500/20 backdrop-blur-lg rounded-full border border-purple-500/30">
            <span className="text-purple-300 text-xs md:text-sm font-semibold">🚀 AI-Powered Interview Preparation</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Master Your Next
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent gradient-animate">
              Tech Interview
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Practice with our AI interviewer, get instant feedback, and land your dream job at top tech companies
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4">
            <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-2xl">
              Start Free Interview →
            </button>
            <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-lg rounded-xl font-semibold text-base md:text-lg hover:bg-white/20 transition border border-white/20">
              Watch Demo 🎥
            </button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto px-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/10 hover:bg-white/10 transition">
                <div className="text-xl md:text-3xl font-bold text-purple-400 mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-12 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div id="domains" data-animate className={`text-center mb-8 md:mb-16 fade-in-up ${isVisible.domains ? 'visible' : ''}`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Choose Your Domain</h2>
            <p className="text-gray-400 text-sm md:text-lg">Specialized interview prep for every tech role</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {domains.map((domain, index) => (
              <div
                key={index}
                id={`domain-${index}`}
                data-animate
                className={`scale-in ${isVisible[`domain-${index}`] ? 'visible' : ''} bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-white/10 hover:border-purple-500/50 transition cursor-pointer group`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 ${domain.color} rounded-xl flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 mx-auto group-hover:scale-110 transition`}>
                  {domain.icon}
                </div>
                <div className="text-center font-semibold text-sm md:text-base">{domain.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div id="features-header" data-animate className={`text-center mb-8 md:mb-16 fade-in-up ${isVisible['features-header'] ? 'visible' : ''}`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Why Choose InterviewPro?</h2>
            <p className="text-gray-400 text-sm md:text-lg">Everything you need to ace your interview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`fade-in-up ${isVisible[`feature-${index}`] ? 'visible' : ''} bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 hover:border-purple-500/50 transition group`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div id="how-it-works-header" data-animate className={`text-center mb-8 md:mb-16 fade-in-up ${isVisible['how-it-works-header'] ? 'visible' : ''}`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">How It Works</h2>
            <p className="text-gray-400 text-sm md:text-lg">Get started in 3 simple steps</p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {[
              { step: '01', title: 'Choose Your Domain', desc: 'Select from Frontend, Backend, Data Science, and more', icon: <Target className="w-10 h-10" /> },
              { step: '02', title: 'Start AI Interview', desc: 'Experience realistic interviews with our advanced AI', icon: <Bot className="w-10 h-10" /> },
              { step: '03', title: 'Get Instant Feedback', desc: 'Receive detailed analytics and improvement suggestions', icon: <BarChart3 className="w-10 h-10" /> }
            ].map((item, index) => (
              <div
                key={index}
                id={`step-${index}`}
                data-animate
                className={`fade-in-up ${isVisible[`step-${index}`] ? 'visible' : ''} flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl md:text-5xl">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-purple-400 font-bold text-xs md:text-sm mb-2">STEP {item.step}</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div id="testimonials-header" data-animate className={`text-center mb-8 md:mb-16 fade-in-up ${isVisible['testimonials-header'] ? 'visible' : ''}`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Success Stories</h2>
            <p className="text-gray-400 text-sm md:text-lg">Join thousands who landed their dream jobs</p>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-12 border border-white/10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl md:text-5xl mx-auto mb-4">
                  {testimonials[activeTestimonial].image}
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl md:text-2xl">⭐</span>
                  ))}
                </div>
                <p className="text-base md:text-xl lg:text-2xl text-gray-300 mb-6 italic">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <h4 className="text-base md:text-lg font-bold">{testimonials[activeTestimonial].name}</h4>
                <p className="text-purple-400 text-sm md:text-base">{testimonials[activeTestimonial].role}</p>
              </div>

              <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition ${
                      activeTestimonial === index ? 'bg-purple-500 md:w-8 w-6' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div id="pricing-header" data-animate className={`text-center mb-8 md:mb-16 fade-in-up ${isVisible['pricing-header'] ? 'visible' : ''}`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-sm md:text-lg">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                id={`plan-${index}`}
                data-animate
                className={`scale-in ${isVisible[`plan-${index}`] ? 'visible' : ''} relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border ${plan.popular ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-white/10'
                  } hover:border-purple-500/50 transition`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4 md:mb-6">
                  <span className="text-3xl md:text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm md:text-base">{plan.period}</span>
                </div>
                
                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-gray-300 text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div id="cta" data-animate className={`fade-in-up ${isVisible.cta ? 'visible' : ''} bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 md:p-12 lg:p-16`}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Ready to Ace Your Interview?</h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 text-purple-100">Join 50,000+ users who landed their dream jobs</p>
            <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white text-purple-600 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl">
              Start Your Free Trial Today →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg md:text-xl">AI</span>
                </div>
                <span className="text-lg md:text-xl font-bold">Intervyo</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base">Master your tech interviews with AI </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 md:mb-4">Company</h4>
              <ul className="space-y-1 md:space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition text-sm md:text-base">About</a></li>
                <li><a href="#" className="hover:text-white transition text-sm md:text-base">Blog</a></li>
                <li><a href="#" className="hover:text-white transition text-sm md:text-base">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 md:mb-4">Legal</h4>
              <ul className="space-y-1 md:space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition text-sm md:text-base">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition text-sm md:text-base">Terms</a></li>
                <li><a href="#" className="hover:text-white transition text-sm md:text-base">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} InterviewPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}