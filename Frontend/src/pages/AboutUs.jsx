import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowRight,
  MessageSquare,
  BarChart,
  Globe,
  Lightbulb,
  Star,
} from "lucide-react";
import Lenis from "@studio-freight/lenis";

export default function AboutUs() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
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
  
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden bg-skin-secondary text-skin-primary transition-colors duration-300">
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

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block bg-emerald-500/10 text-emerald-500 px-6 py-2 rounded-full mb-6 font-semibold text-sm tracking-wide border border-emerald-500/20">
            About Us
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-skin-primary">
            Empowering Careers with
            <br />
            <span className="text-emerald-500">AI-Powered</span> Interview Prep
          </h1>

          <p className="text-xl text-skin-secondary mb-10 max-w-3xl mx-auto">
            We're on a mission to democratize interview preparation and help job
            seekers worldwide unlock their full potential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold text-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-skin-primary border-2 border-skin-primary rounded-xl hover:bg-skin-secondary font-semibold text-lg text-skin-primary backdrop-blur-sm transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-6 bg-skin-secondary transition-colors duration-500 relative overflow-hidden">
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
                className="inline-block bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full mb-6 font-semibold text-sm border border-emerald-500/20"
              >
                Who We Are
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-skin-primary leading-tight">
                <motion.span
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="inline-block bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer"
                >
                  Building the Future
                </motion.span>
                <br />
                <span className="text-emerald-500">Interview Preparation</span>
              </h2>

              <motion.p
                className="text-lg text-skin-secondary mb-6 leading-relaxed"
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
                className="text-lg text-skin-secondary leading-relaxed"
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
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-skin-primary rounded-2xl p-6 shadow-sm border border-skin-primary cursor-pointer relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-emerald-500 mb-2">
                      {item.value}
                    </div>
                    <p className="text-skin-secondary font-medium">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6 bg-skin-primary transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-skin-primary">
              Our <span className="text-emerald-500">Mission</span> &{" "}
              <span className="text-emerald-500">Vision</span>
            </h2>
            <p className="text-xl text-skin-secondary">What drives us every day</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-skin-secondary rounded-3xl p-8 border border-skin-primary hover:border-emerald-500/50 transition-all group shadow-sm">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                <Target className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-skin-primary mb-4">
                Our Mission
              </h3>
              <p className="text-skin-secondary leading-relaxed">
                To revolutionize interview preparation by providing accessible,
                AI-driven coaching that empowers individuals to confidently
                showcase their skills and land their dream jobs. We strive to
                bridge the gap between potential and opportunity.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-skin-secondary rounded-3xl p-8 border border-skin-primary hover:border-emerald-500/50 transition-all group shadow-sm">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                <Eye className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-skin-primary mb-4">Our Vision</h3>
              <p className="text-skin-secondary leading-relaxed">
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
      <section className="py-20 px-6 bg-skin-secondary transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full mb-4 font-semibold text-sm border border-emerald-500/20">
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-skin-primary">
              What We <span className="text-emerald-500">Stand For</span>
            </h2>
            <p className="text-xl text-skin-secondary">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-skin-primary rounded-2xl p-6 shadow-sm border border-skin-primary hover:shadow-lg hover:border-emerald-500 transition-all group hover:scale-105 duration-300"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <span className="text-emerald-500 group-hover:text-white transition-all">
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-skin-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-skin-secondary text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-6 bg-skin-primary relative overflow-hidden transition-colors duration-500">
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
              className="inline-block bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full mb-4 font-semibold text-sm border border-emerald-500/20"
            >
              Features
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-skin-primary">
              What We Offer
            </h2>
            <p className="text-xl text-skin-secondary">
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
                boxShadow: "0 25px 50px rgba(16,185,129,0.2)"
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-8 text-white border-4 border-skin-primary cursor-pointer shadow-lg"
            >
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">AI Mock Interviews</h3>
              <p className="text-white/90 leading-relaxed">
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
                boxShadow: "0 25px 50px rgba(251,191,36,0.2)"
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl p-8 text-white border-4 border-skin-primary cursor-pointer shadow-lg"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">
                Instant Feedback
              </h3>
              <p className="text-white/90 leading-relaxed">
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
                boxShadow: "0 25px 50px rgba(139,92,246,0.2)"
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white border-4 border-skin-primary cursor-pointer shadow-lg"
            >
              <motion.div
                whileHover={{ rotate: -12, scale: 1.1 }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4"
              >
                <BarChart className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">
                Progress Analytics
              </h3>
              <p className="text-white/90 leading-relaxed">
                Track your improvement over time with comprehensive dashboards and
                insights.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-skin-secondary transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full mb-4 font-semibold text-sm border border-emerald-500/20">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-skin-primary">
              Meet the <span className="text-emerald-500">People</span> Behind
              Intervyo
            </h2>
            <p className="text-xl text-skin-secondary">
              Passionate developers building the future of interview prep
            </p>
          </div>

          {/* Creator Section */}
          <AnimatedSection
            className={`rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border backdrop-blur-sm bg-skin-primary border-skin-primary`}
          >
            <div className="text-center mb-8">
              <motion.div
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`relative p-2 rounded-2xl bg-emerald-500/10`}
                >
                  <img
                    src={team.creator.avatar}
                    alt={team.creator.name}
                    className="w-32 h-32 rounded-xl object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${team.creator.name}&background=10b981&color=ffffff&size=128`;
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
                className={`text-4xl font-bold mb-4 text-skin-primary`}
                variants={itemVariants}
              >
                Meet the <span className="text-emerald-500">Creator</span>
              </motion.h2>

              <motion.div
                variants={itemVariants}
              >
                <h3 className="text-2xl font-bold mb-2 text-emerald-500">{team.creator.name}</h3>
                <p className="text-lg font-semibold text-skin-secondary">{team.creator.role}</p>
              </motion.div>

              <motion.p
                className={`text-lg leading-relaxed mt-4 max-w-2xl mx-auto text-skin-secondary`}
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
                  className={`p-3 rounded-xl transition-all duration-300 bg-skin-secondary text-skin-primary border border-skin-primary`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href={`mailto:${team.creator.email}`}
                  className={`p-3 rounded-xl transition-all duration-300 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20`}
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
                <p className={`text-sm text-skin-secondary mb-3`}>
                  Tech Stack Expertise:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {team.creator.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`}
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
            className={`rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border backdrop-blur-sm bg-skin-primary border-skin-primary`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 rounded-2xl bg-emerald-500/10`}
              >
                <Github
                  className={`w-8 h-8 text-emerald-500`}
                />
              </div>
              <h2
                className={`text-3xl font-bold text-skin-primary`}
              >
                Project Contributors
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className={`text-lg text-skin-secondary`}>
                  Loading contributors...
                </div>
              </div>
            ) : error ? (
              <div className={`text-center p-6 rounded-xl bg-skin-secondary border border-skin-primary`}>
                <p className={`text-emerald-500`}>
                  Error loading contributors: {error}
                </p>
                <p className={`text-skin-secondary`}>
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
                    className={`block group p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-skin-secondary hover:bg-emerald-500/5 border border-skin-primary`}
                    title={`${contributor.login} (${contributor.contributions} contributions)`}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-transparent group-hover:border-emerald-500 transition-colors duration-300"
                      />
                      <h3 className={`font-semibold text-center truncate w-full text-skin-primary`}>
                        {contributor.login}
                      </h3>
                      <p className={`text-sm mt-1 text-skin-secondary`}>
                        {contributor.contributions} contributions
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <p className="text-skin-secondary text-center mt-12 max-w-2xl mx-auto">
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
            className="text-xl text-emerald-50 mb-10"
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
                boxShadow: "0 25px 50px rgba(255,255,255,0.2)"
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
              }}
              whileTap={{ scale: 0.95 }}
              href="mailto:intervyo.team@gmail.com"
              className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold text-lg flex items-center gap-2 border border-white/20"
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
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }
`}</style>
    </div>
  );
}