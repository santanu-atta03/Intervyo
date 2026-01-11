import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Sparkles, 
  Shield, 
  Zap, 
  Globe,
  Mail,
  Linkedin,
  Github,
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  BarChart
} from "lucide-react";
import { useState } from "react";

export default function AboutUs() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const teamMembers = [
    {
      name: "Santanu Atta",
      role: "Founder & Lead Developer",
      image: "https://avatars.githubusercontent.com/santanu-atta03",
      linkedin: "https://www.linkedin.com/in/santanu-atta-139820363",
      github: "https://github.com/santanu-atta03"
    }
  ];

  const coreValues = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Innovation",
      description: "Continuously improving our AI to provide cutting-edge interview preparation experiences."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Accessibility",
      description: "Making quality interview preparation available to everyone, regardless of background."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust & Privacy",
      description: "Protecting your data and maintaining transparency in everything we do."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "User-Centric",
      description: "Building features that truly matter and help our users succeed in their careers."
    }
  ];

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
            <a href="/#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Features</a>
            <Link to="/about" className="text-emerald-500 font-medium transition-colors">About</Link>
            <a href="/#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">How it Works</a>
            <a href="/#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Pricing</a>
            <a href="/#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">FAQ</a>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</Link>
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
                <Link to="/register" className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-sm">
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
              <a href="/#features" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>
                Features
              </a>
              <a href="/#how-it-works" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>
                How it Works
              </a>
              <a href="/#pricing" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>
                Pricing
              </a>
              <a href="/#faq" className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeMobileMenu}>
                FAQ
              </a>
              <Link to="/contact" onClick={closeMobileMenu} className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Contact
              </Link>
              <Link to="/about" onClick={closeMobileMenu} className="block text-emerald-500 font-medium py-3 px-4 rounded-lg bg-emerald-50">
                About
              </Link>
              
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
        
        {/* Animated sweep glow */}
        <div 
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl"
          style={{ animation: 'sweepGlow 8s ease-in-out infinite' }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full mb-6 font-semibold text-sm tracking-wide border border-emerald-500/20">
            About Us
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Empowering Careers with<br />
            <span className="text-emerald-500">AI-Powered</span> Interview Prep
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            We're on a mission to democratize interview preparation and help
            job seekers worldwide unlock their full potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold text-lg flex items-center gap-2 transition-all">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/')} className="px-8 py-4 bg-white/10 border-2 border-gray-700 rounded-xl hover:bg-white/20 font-semibold text-lg text-white backdrop-blur-sm transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full mb-6 font-semibold text-sm">
                Who We Are
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Building the Future of<br />
                <span className="text-emerald-500">Interview Preparation</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                <span className="text-emerald-500 font-semibold">Intervyo</span> is an innovative AI-powered interview preparation platform designed to help tech professionals and job seekers excel in their interviews.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We combine cutting-edge artificial intelligence with proven interview techniques to deliver personalized, realistic mock interview experiences that prepare you for success.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-emerald-500 mb-2">5K+</div>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-emerald-500 mb-2">50+</div>
                <p className="text-gray-600">Tech Roles</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-emerald-500 mb-2">87%</div>
                <p className="text-gray-600">Success Rate</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-emerald-500 mb-2">24/7</div>
                <p className="text-gray-600">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Our <span className="text-emerald-500">Mission</span> & <span className="text-emerald-500">Vision</span>
            </h2>
            <p className="text-xl text-gray-400">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-all">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To revolutionize interview preparation by providing accessible, AI-driven coaching that empowers individuals to confidently showcase their skills and land their dream jobs. We strive to bridge the gap between potential and opportunity.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-all">
                <Eye className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To become the world's most trusted AI interview coach, helping millions of professionals unlock career opportunities and achieve their full potential. We envision a future where everyone has equal access to premium interview preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full mb-4 font-semibold text-sm">
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What We <span className="text-emerald-500">Stand For</span>
            </h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-200 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-all">
                  <span className="text-emerald-500 group-hover:text-white transition-all">{value.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full mb-4 font-semibold text-sm">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What We <span className="text-emerald-500">Offer</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to ace your interviews</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-600 rounded-3xl p-8 text-white hover:shadow-xl transition-all border-4 border-gray-900">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Mock Interviews</h3>
              <p className="text-emerald-100 leading-relaxed">Practice with realistic, role-specific interview simulations powered by advanced AI.</p>
            </div>

            <div className="bg-yellow-300 rounded-3xl p-8 hover:shadow-xl transition-all border-4 border-gray-900">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Feedback</h3>
              <p className="text-gray-700 leading-relaxed">Receive detailed performance analysis and actionable improvement suggestions.</p>
            </div>

            <div className="bg-purple-200 rounded-3xl p-8 hover:shadow-xl transition-all border-4 border-gray-900">
              <div className="w-12 h-12 bg-purple-300 rounded-xl flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Analytics</h3>
              <p className="text-gray-700 leading-relaxed">Track your improvement over time with comprehensive dashboards and insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-4 font-semibold text-sm border border-emerald-500/20">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Meet the <span className="text-emerald-500">People</span> Behind Intervyo
            </h2>
            <p className="text-xl text-gray-400">Passionate developers building the future of interview prep</p>
          </div>

          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-gray-800 rounded-3xl p-8 border border-gray-700 text-center max-w-sm hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 p-1">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover bg-gray-700"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=10b981&color=fff&size=112`;
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-emerald-400 mb-6">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-center mt-12 max-w-2xl mx-auto">
            We're a growing team of passionate developers, designers, and AI enthusiasts committed to building the best interview preparation platform.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join thousands of job seekers who are already preparing smarter with Intervyo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-100 font-semibold text-lg flex items-center gap-2 transition-all shadow-lg">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="mailto:intervyo.team@example.com"
              className="px-8 py-4 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold text-lg flex items-center gap-2 transition-all"
            >
              <Mail className="w-5 h-5" /> Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Add CSS for sweep animation */}
      <style jsx>{`
        @keyframes sweepGlow {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
