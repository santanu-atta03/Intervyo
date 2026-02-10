import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Users,
  Sparkles,
  Shield,
  Zap,
  Mail,
  Linkedin,
  Github,
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  BarChart,
  Globe,
  Lightbulb,
  Star,
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import Lenis from "@studio-freight/lenis";

export default function AboutUs() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef(null);
  const [contributors, setContributors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  const itemVariants = {
    hidden: { y: 0, opacity: 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  };
  const teamMembers = [
    {
      name: "Santanu Atta",
      role: "Founder & Lead Developer",
      image: "https://avatars.githubusercontent.com/santanu-atta03",
      linkedin: "https://www.linkedin.com/in/santanu-atta-139820363",
      github: "https://github.com/santanu-atta03",
    },
  ];
  const AnimatedSection = ({ children, className = "" }) => {
    return (
      <motion.div
        className={className}
        initial="visible"
        animate="visible"
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  };


  React.useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/santanu-atta03/Intervyo/contributors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching contributors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const coreValues = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Innovation",
      description:
        "Continuously improving our AI to provide cutting-edge interview preparation experiences.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Accessibility",
      description:
        "Making quality interview preparation available to everyone, regardless of background.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust & Privacy",
      description:
        "Protecting your data and maintaining transparency in everything we do.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "User-Centric",
      description:
        "Building features that truly matter and help our users succeed in their careers.",
    },
  ];
  const team = {
    creator: {
      name: "Santanu Atta",
      role: "Full-Stack Developer & Creator",
      description: "Passionate developer dedicated to transforming public transportation through innovative technology solutions.",
      github: "https://github.com/santanu-atta03",
      email: "intervyo@team.gmail.com",
      avatar: "https://github.com/santanu-atta03.png",
      skills: ["React", "Node.js", "MongoDB", "Express.js"],
    },
    values: [
      {
        name: "Innovation",
        role: "Core Principle",
        description: "Continuously pushing boundaries with cutting-edge technology solutions",
        icon: Lightbulb,
      },
      {
        name: "Reliability",
        role: "Foundation",
        description: "Building robust systems that users can depend on every day",
        icon: Shield,
      },
      {
        name: "User-Centric",
        role: "Design Philosophy",
        description: "Every feature designed with user experience and accessibility in mind",
        icon: Heart,
      },
    ],
  };

  return (
    <div className="bg-skin-primary text-skin-primary transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-skin-primary/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-skin-primary">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-skin-primary">Interv</span>
            <span className="text-emerald-500">yo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="/#features"
              className="text-gray-600 hover:text-skin-primary font-medium transition-colors cursor-pointer"
            >
              Features
            </a>
            <Link
              to="/about"
              className="text-emerald-500 font-medium transition-colors"
            >
              About
            </Link>
            <a
              href="/#how-it-works"
              className="text-gray-600 hover:text-skin-primary font-medium transition-colors cursor-pointer"
            >
              How it Works
            </a>
            <a
              href="/#pricing"
              className="text-gray-600 hover:text-skin-primary font-medium transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="/#faq"
              className="text-gray-600 hover:text-skin-primary font-medium transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-skin-primary font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            {token ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
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
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-skin-primary hover:bg-gray-100 rounded-lg transition-colors"
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
                href="/#features"
                className="block text-gray-600 hover:text-skin-primary font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                className="block text-gray-600 hover:text-skin-primary font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                How it Works
              </a>
              <a
                href="/#pricing"
                className="block text-gray-600 hover:text-skin-primary font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Pricing
              </a>
              <a
                href="/#faq"
                className="block text-gray-600 hover:text-skin-primary font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                FAQ
              </a>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block text-gray-600 hover:text-skin-primary font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="block text-emerald-500 font-medium py-3 px-4 rounded-lg bg-emerald-50"
              >
                About
              </Link>

              <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-600 font-medium">Theme</span>
                <ThemeToggle />
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      closeMobileMenu();
                    }}
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
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-skin-secondary transition-colors duration-300">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated sweep glow */}
        <div
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl"
          style={{ animation: "sweepGlow 8s ease-in-out infinite" }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full mb-6 font-semibold text-sm tracking-wide border border-emerald-500/20">
            About Us
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-skin-primary">
            Empowering Careers with
            <br />
            <span className="text-emerald-500">AI-Powered</span> Interview Prep
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            We're on a mission to democratize interview preparation and help job
            seekers worldwide unlock their full potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold text-lg flex items-center gap-2 transition-all"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-white/10 border-2 border-gray-700 rounded-xl hover:bg-white/20 font-semibold text-lg text-white backdrop-blur-sm transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}

<section className="py-20 px-6 bg-skin-secondary transition-colors duration-300 relative overflow-hidden">
  {/* Background glow */}
  <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
  <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

  <div className="max-w-6xl mx-auto relative z-10">
    <motion.div
      className="grid md:grid-cols-2 gap-12 items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
    >
      {/* LEFT CONTENT */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-600 px-4 py-2 rounded-full mb-6 font-semibold text-sm border border-emerald-400/30"
        >
          Who We Are
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-skin-primary leading-tight">
          <motion.span
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 30px rgba(16,185,129,0.6)"
            }}
            className="inline-block bg-gradient-to-r from-violet-500 via-emerald-500 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
          >
            Building the Future
          </motion.span>
          <br />
          <span className="text-emerald-500">Interview Preparation</span>
        </h2>

        <motion.p
          className="text-lg text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-emerald-500 font-semibold">Intervyo</span>{" "}
          is an AI-powered interview preparation platform designed to help tech
          professionals and job seekers excel in real interviews.
        </motion.p>

        <motion.p
          className="text-lg text-gray-600 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          viewport={{ once: true }}
        >
          We blend cutting-edge AI with proven interview techniques to deliver
          realistic, personalized mock interview experiences.
        </motion.p>
      </motion.div>

      {/* RIGHT STATS GRID */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {[
          { value: "5K+", label: "Active Users", glow: "emerald" },
          { value: "50+", label: "Tech Roles", glow: "cyan" },
          { value: "87%", label: "Success Rate", glow: "violet" },
          { value: "24/7", label: "AI Support", glow: "emerald" }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{
              y: -10,
              scale: 1.05,
              boxShadow:
                item.glow === "emerald"
                  ? "0 20px 40px rgba(16,185,129,0.35)"
                  : item.glow === "cyan"
                  ? "0 20px 40px rgba(34,211,238,0.35)"
                  : "0 20px 40px rgba(139,92,246,0.35)"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 cursor-pointer relative overflow-hidden group"
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/40 to-transparent" />

            <div className="relative z-10">
              <div className="text-4xl font-bold text-emerald-500 mb-2">
                {item.value}
              </div>
              <p className="text-gray-600 font-medium">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </div>
</section>


      {/* Mission & Vision Section */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Our <span className="text-emerald-500">Mission</span> &{" "}
              <span className="text-emerald-500">Vision</span>
            </h2>
            <p className="text-xl text-gray-400">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-all">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-400 leading-relaxed">
                To revolutionize interview preparation by providing accessible,
                AI-driven coaching that empowers individuals to confidently
                showcase their skills and land their dream jobs. We strive to
                bridge the gap between potential and opportunity.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-all">
                <Eye className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To become the world's most trusted AI interview coach, helping
                millions of professionals unlock career opportunities and
                achieve their full potential. We envision a future where
                everyone has equal access to premium interview preparation.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-skin-primary">
              What We <span className="text-emerald-500">Stand For</span>
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-200 hover:text-white transition-all group hover:scale-110 duration-500"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all group-hover:scale-110">
                  <span className="text-emerald-500 group-hover:text-white transition-all">
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-skin-primary mb-2 group-hover:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
<section className="py-20 px-6 bg-white relative overflow-hidden">
  {/* subtle background glow */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

  <div className="max-w-6xl mx-auto relative z-10">
    {/* Heading */}
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="inline-block bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-600 px-4 py-2 rounded-full mb-4 font-semibold text-sm border border-emerald-400/30"
      >
        Features
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
        What We Offer
      </h2>
      <p className="text-xl text-gray-600">
        Everything you need to ace your interviews
      </p>
    </motion.div>

    {/* Cards */}
    <motion.div
      className="grid md:grid-cols-3 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.15 }
        }
      }}
    >
      {/* Card 1 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{
          y: -12,
          scale: 1.05,
          boxShadow: "0 25px 50px rgba(16,185,129,0.35)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 text-white border-4 border-gray-900 cursor-pointer"
      >
        <motion.div
          whileHover={{ rotate: -10, scale: 1.1 }}
          className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold mb-3">AI Mock Interviews</h3>
        <p className="text-emerald-100 leading-relaxed">
          Practice with realistic, role-specific interview simulations powered
          by advanced AI.
        </p>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{
          y: -12,
          scale: 1.05,
          boxShadow: "0 25px 50px rgba(251,191,36,0.45)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-amber-300 to-yellow-300 rounded-3xl p-8 border-4 border-gray-900 cursor-pointer"
      >
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4"
        >
          <Zap className="w-6 h-6 text-gray-900" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Instant Feedback
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Receive detailed performance analysis and actionable improvement
          suggestions.
        </p>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{
          y: -12,
          scale: 1.05,
          boxShadow: "0 25px 50px rgba(139,92,246,0.4)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-violet-200 to-purple-200 rounded-3xl p-8 border-4 border-gray-900 cursor-pointer"
      >
        <motion.div
          whileHover={{ rotate: -12, scale: 1.1 }}
          className="w-12 h-12 bg-purple-300 rounded-xl flex items-center justify-center mb-4"
        >
          <BarChart className="w-6 h-6 text-gray-900" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Progress Analytics
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Track your improvement over time with comprehensive dashboards and
          insights.
        </p>
      </motion.div>
    </motion.div>
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
              Meet the <span className="text-emerald-500">People</span> Behind
              Intervyo
            </h2>
            <p className="text-xl text-gray-400">
              Passionate developers building the future of interview prep
            </p>
          </div>

          {/* <div className="flex justify-center">
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
                <h3 className="text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
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
          </div> */}
          {/* Creator Section */}
          <AnimatedSection
            className={`rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border backdrop-blur-sm parallax-element bg-gray-900 border-gray-700/50
              `}
          >
            <div className="text-center mb-8">
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`relative p-2 rounded-2xl bg-blue-500/20`}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 40px rgba(59, 130, 246, 0.6)",
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img
                    src={team.creator.avatar}
                    alt={team.creator.name}
                    className="w-32 h-32 rounded-xl object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${team.creator.name}&background=3b82f6&color=ffffff&size=128`;
                    }}
                  />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.h2
                className={`text-4xl font-bold mb-4 text-white`}
                variants={itemVariants}
              >
                Meet the <span className="text-emerald-500">Creator</span>
              </motion.h2>

              <motion.div
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                <h3 className="text-2xl font-bold mb-2 text-emerald-500">{team.creator.name}</h3>
                <p className="text-lg font-semibold text-emerald-500">{team.creator.role}</p>
              </motion.div>

              <motion.p
                className={`text-lg leading-relaxed mt-4 max-w-2xl mx-auto text-gray-300`}
                variants={itemVariants}
              >
                {team.creator.description}
              </motion.p>

              <motion.div
                className="flex justify-center gap-4 mt-6"
                variants={itemVariants}
              >
                <motion.a
                  href={team.creator.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all duration-300 bg-gray-700 hover:bg-gray-600 text-white"
                    `}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href={`mailto:${team.creator.email}`}
                  className={`p-3 rounded-xl transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white"
                    `}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-6 h-6" />
                </motion.a>
              </motion.div>

              <motion.div
                className="mt-6"
                variants={itemVariants}
              >
                <p className={`text-sm text-gray-400 mb-3`}>
                  Tech Stack Expertise:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {team.creator.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        `}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
          {/* Contributors Section */}
          <div
            className={`rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border backdrop-blur-sm bg-gray-950 border-gray-700/50`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 rounded-2xl bg-purple-500/20`}
              >
                <Github
                  className={`w-8 h-8 text-purple-400`}
                />
              </div>
              <h2
                className={`text-3xl font-bold text-white`}
              >
                Project Contributors
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className={`text-lg text-gray-400`}>
                  Loading contributors...
                </div>
              </div>
            ) : error ? (
              <div className={`text-center p-6 rounded-xl bg-red-900/30`}>
                <p className={`ext-red-400`}>
                  Error loading contributors: {error}
                </p>
                <p className={`text-gray-400`}>
                  Visit our <a href="https://github.com/santanu-atta03/Intervyo" target="_blank" rel="noopener noreferrer" className="underline">GitHub repository</a> to see contributors.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.id}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-700/50 border border-gray-700/50`}
                    title={`${contributor.login} (${contributor.contributions} contributions)`}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-transparent group-hover:border-purple-500 transition-colors duration-300"
                      />
                      <h3 className={`font-semibold text-center truncate w-full text-white`}>
                        {contributor.login}
                      </h3>
                      <p className={`text-sm mt-1 text-gray-400`}>
                        {contributor.contributions} contributions
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <p className="text-gray-500 text-center mt-12 max-w-2xl mx-auto">
            We're a growing team of passionate developers, designers, and AI
            enthusiasts committed to building the best interview preparation
            platform.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
  {/* Animated gradient background */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500"
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    style={{ backgroundSize: "200% 200%" }}
  />

  {/* Soft glow */}
  <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
  <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

  <motion.div
    className="relative z-10 max-w-4xl mx-auto text-center"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <motion.h2
      className="text-3xl md:text-4xl font-bold mb-6 text-white"
      whileHover={{ scale: 1.03 }}
    >
      Ready to Ace Your Next Interview?
    </motion.h2>

    <motion.p
      className="text-xl text-emerald-100 mb-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
    >
      Join thousands of job seekers who are already preparing smarter with
      <span className="font-semibold text-white"> Intervyo</span>.
    </motion.p>

    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.15 }
        }
      }}
    >
      {/* Primary CTA */}
      <motion.button
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 25px 50px rgba(255,255,255,0.35)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/register")}
        className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-lg"
      >
        Get Started Free
        <motion.span
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </motion.button>

      {/* Secondary CTA */}
      <motion.a
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        whileHover={{
          scale: 1.05,
          backgroundColor: "rgba(6,78,59,1)",
          boxShadow: "0 20px 40px rgba(16,185,129,0.35)"
        }}
        whileTap={{ scale: 0.95 }}
        href="mailto:intervyo.team@example.com"
        className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold text-lg flex items-center gap-2"
      >
        <Mail className="w-5 h-5" />
        Contact Us
      </motion.a>
    </motion.div>
  </motion.div>
</section>


      {/* Add CSS for sweep animation */}
      <style jsx>{`
        @keyframes sweepGlow {
          0%,
          100% {
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
