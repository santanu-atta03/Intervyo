import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Zap,
  Shield,
  Rocket,
  TrendingUp,
  Users,
} from "lucide-react";

const categoryIcons = {
  ai: Zap,
  features: Rocket,
  progress: TrendingUp,
  security: Shield,
  team: Users,
  general: MessageCircle,
};

const faqs = [
  {
    category: "ai",
    question: "How does AI feedback work?",
    answer:
      "Our AI analyzes your responses in real-time, evaluating clarity, technical accuracy, structure, and completeness. You'll receive instant, actionable feedback on how to improve your answers, just like a real interviewer would provide.",
  },
  {
    category: "features",
    question: "Can I practice for specific tech roles?",
    answer:
      "Yes! We have role-specific question banks for 50+ tech positions including Frontend, Backend, Full Stack, DevOps, Data Science, ML Engineer, Product Manager, and more. Each role has curated questions that match real interview scenarios.",
  },
  {
    category: "progress",
    question: "How fast will I see improvement?",
    answer:
      "Most users see significant improvement within 1-2 weeks of consistent practice. Our analytics dashboard tracks your progress over time, showing improvements in clarity, technical depth, and structure scores. Practice 3-5 interviews per week for best results.",
  },
  {
    category: "features",
    question: "Is voice practice really necessary?",
    answer:
      "Absolutely! Speaking your answers out loud helps you practice articulation, pacing, and confidence. Many candidates freeze during verbal interviews even when they know the answer. Our voice practice feature simulates real interview conditions so you're prepared.",
  },
  {
    category: "team",
    question: "Can I use this to prepare my team for interviews?",
    answer:
      "Yes! Our Enterprise plan includes team management features, custom branding, and dedicated support. Perfect for bootcamps, training programs, and companies preparing candidates for technical interviews. Contact our sales team for custom solutions.",
  },
  {
    category: "general",
    question: "What companies do your questions prepare me for?",
    answer:
      "Our question banks are designed to prepare you for interviews at top tech companies including FAANG, Microsoft, startups, and mid-size tech companies. The questions cover common patterns and topics asked across the industry.",
  },
  {
    category: "features",
    question: "Can I retake an interview session?",
    answer:
      "Yes, you can retake interviews as many times as you want. Repeating sessions allows you to refine your answers, improve delivery, and compare performance across attempts using the analytics dashboard.",
  },
  {
    category: "general",
    question: "Do I need a webcam and microphone to use Intervyo?",
    answer:
      "For the most realistic experience, we recommend using both a webcam and microphone. Voice input helps simulate real interview conditions. However, certain practice modes may still work without video input.",
  },
  {
    category: "ai",
    question: "How accurate is the AI scoring system?",
    answer:
      "The AI evaluates multiple parameters including structure, clarity, completeness, and technical depth. While it may not fully replace a human interviewer, it closely mirrors real-world technical interview evaluation patterns.",
  },
  {
    category: "progress",
    question: "Can I track my improvement over time?",
    answer:
      "Yes! The analytics dashboard provides detailed performance tracking, highlighting strengths, weaknesses, and trends across multiple sessions. This helps you focus on areas that need improvement.",
  },
  {
    category: "security",
    question: "Is my interview data secure?",
    answer:
      "Yes. We prioritize user privacy and secure data handling. Your interview responses and personal information are stored securely and used only to enhance your practice experience.",
  },
  {
    category: "general",
    question: "Is Intervyo free to use?",
    answer:
      "Intervyo offers both free and premium features. You can begin practicing with core functionality for free, while advanced analytics, extended question libraries, and enterprise tools may require a paid plan.",
  },
];

export default function FAQ() {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getCategoryColor = (category) => {
    const colors = {
      ai: "from-violet-500 to-purple-600",
      features: "from-blue-500 to-cyan-600",
      progress: "from-emerald-500 to-teal-600",
      security: "from-rose-500 to-pink-600",
      team: "from-orange-500 to-amber-600",
      general: "from-indigo-500 to-blue-600",
    };
    return colors[category] || colors.general;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-skin-primary px-4 sm:px-6 pb-20 transition-all duration-500 overflow-hidden">
      {/* Multiple Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-60">
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-violet-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, -80, 0],
            scale: [1, 1.4, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-to-l from-blue-500/30 via-cyan-500/30 to-teal-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Enhanced Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-2xl border-b border-purple-200/50 dark:border-purple-800/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-12 h-12"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/50 animate-pulse-glow">
                <span className="font-bold text-lg">AI</span>
              </div>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Intervyo
            </span>
          </Link>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 font-semibold"
            >
              Home
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* FAQ Section */}
      <div className="pt-32 pb-12 max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-blue-500/20 backdrop-blur-xl rounded-2xl mb-8 border border-purple-300/50 dark:border-purple-700/50 shadow-lg"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <span className="text-base font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              Got Questions? We've Got Answers ✨
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl">
              Frequently Asked
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl">
              Questions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to know about{" "}
            <span className="font-bold text-purple-600 dark:text-purple-400">
              Intervyo
            </span>{" "}
            and how it can help you{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ace your interviews
            </span>
          </motion.p>
        </motion.div>

        {/* FAQ Items with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {faqs.map((faq, index) => {
            const IconComponent = categoryIcons[faq.category];
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="group relative"
              >
                {/* Glow Effect on Hover */}
                {isHovered && (
                  <motion.div
                    layoutId="hoverGlow"
                    className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl opacity-75 blur-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl border-2 transition-all duration-500 overflow-hidden shadow-xl ${
                    isActive
                      ? "border-purple-500 shadow-2xl shadow-purple-500/30"
                      : "border-gray-200/50 dark:border-gray-700/50 hover:border-purple-400/50 dark:hover:border-purple-600/50"
                  }`}
                >
                  {/* Animated Gradient Border Effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{
                        background: [
                          "linear-gradient(0deg, #8B5CF6, #EC4899, #3B82F6)",
                          "linear-gradient(120deg, #8B5CF6, #EC4899, #3B82F6)",
                          "linear-gradient(240deg, #8B5CF6, #EC4899, #3B82F6)",
                          "linear-gradient(360deg, #8B5CF6, #EC4899, #3B82F6)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}

                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-start gap-4 text-left px-6 sm:px-8 py-6 transition-all duration-300 relative z-10"
                  >
                    {/* Icon with Gradient */}
                    <motion.div
                      animate={
                        isActive ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}
                      }
                      transition={{ duration: 0.6 }}
                      className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${getCategoryColor(faq.category)} text-white shadow-2xl shadow-purple-500/50`
                          : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-500 dark:text-gray-400 group-hover:from-purple-100 group-hover:to-blue-100 dark:group-hover:from-purple-900/30 dark:group-hover:to-blue-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" strokeWidth={2.5} />
                    </motion.div>

                    {/* Question Text */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h3
                        className={`font-bold text-lg sm:text-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent"
                            : "text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* Animated Chevron */}
                    <motion.div
                      animate={{
                        rotate: isActive ? 180 : 0,
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="flex-shrink-0 pt-1"
                    >
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-purple-100 dark:bg-purple-900/50"
                            : "bg-gray-100 dark:bg-gray-700 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30"
                        }`}
                      >
                        <ChevronDown
                          className={`w-6 h-6 transition-colors duration-300 ${
                            isActive
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                          }`}
                          strokeWidth={3}
                        />
                      </div>
                    </motion.div>
                  </button>

                  {/* Answer Section with Smooth Animation */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: { duration: 0.4, ease: "easeInOut" },
                            opacity: { duration: 0.3, delay: 0.1 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.3, ease: "easeInOut" },
                            opacity: { duration: 0.2 },
                          },
                        }}
                        className="overflow-hidden relative z-10"
                      >
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="px-6 sm:px-8 pb-8"
                        >
                          <div className="pl-0 sm:pl-16">
                            {/* Decorative Gradient Line */}
                            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mb-5 shadow-lg" />

                            {/* Answer Text */}
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
          className="mt-20"
        >
          <div className="relative group">
            {/* Animated Glow */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-75"
            />

            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 shadow-2xl overflow-hidden">
              {/* Animated Background Pattern */}
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <MessageCircle
                    className="w-16 h-16 text-white"
                    strokeWidth={1.5}
                  />
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Still have questions?
                </h3>
                <p className="text-white/95 mb-8 text-lg md:text-xl max-w-2xl mx-auto">
                  We're here to help! Reach out to our support team anytime and
                  we'll get back to you within 24 hours.
                </p>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/50 group"
                  >
                    <span>Contact Support</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Rocket className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
