import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const faqs = [
  {
    question: "How does AI feedback work?",
    answer:
      "Our AI analyzes your responses in real-time, evaluating clarity, technical accuracy, structure, and completeness. You'll receive instant, actionable feedback on how to improve your answers, just like a real interviewer would provide."
  },
  {
    question: "Can I practice for specific tech roles?",
    answer:
      "Yes! We have role-specific question banks for 50+ tech positions including Frontend, Backend, Full Stack, DevOps, Data Science, ML Engineer, Product Manager, and more. Each role has curated questions that match real interview scenarios.",
  },
  {
    question: "How fast will I see improvement?",
    answer:
      "Most users see significant improvement within 1-2 weeks of consistent practice. Our analytics dashboard tracks your progress over time, showing improvements in clarity, technical depth, and structure scores. Practice 3-5 interviews per week for best results.",
  },
  {
    question: "Is voice practice really necessary?",
    answer:
      "Absolutely! Speaking your answers out loud helps you practice articulation, pacing, and confidence. Many candidates freeze during verbal interviews even when they know the answer. Our voice practice feature simulates real interview conditions so you're prepared.",
  },
  {
    question: "Can I use this to prepare my team for interviews?",
    answer:
      "Yes! Our Enterprise plan includes team management features, custom branding, and dedicated support. Perfect for bootcamps, training programs, and companies preparing candidates for technical interviews. Contact our sales team for custom solutions.",
  },
  {
    question: "What companies do your questions prepare me for?",
    answer:
      "Our question banks are designed to prepare you for interviews at top tech companies including FAANG (Facebook/Meta, Amazon, Apple, Netflix, Google), Microsoft, startups, and mid-size tech companies. The questions cover common patterns and topics asked across the industry."
  }
];

export default function FAQ() {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#13132a] to-[#0f0f1a] text-white px-6 pb-12">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-slate-900/95 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="font-bold">AI</span>
            </div>
            <span className="text-xl font-bold">Intervyo</span>
          </Link>

          <Link
            to="/"
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* FAQ Section */}
      <div className="pt-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h1>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl px-6 py-5 shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-[#0f172a] font-semibold text-lg">
                  {faq.question}
                </span>
                <span className="text-2xl font-bold text-cyan-500">
                  {activeIndex === index ? "×" : "+"}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-40 mt-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
