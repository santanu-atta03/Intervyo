import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { submitContactForm } from "../services/operations/contactAPI";
import Lenis from "@studio-freight/lenis";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const lenisRef = useRef(null);

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const result = await submitContactForm(formData, setLoading);
    if (result) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <div className="bg-skin-primary text-skin-primary min-h-screen flex flex-col transition-colors duration-300">

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
        <div
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl"
          style={{ animation: "sweepGlow 8s ease-in-out infinite" }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10">
            Have questions or need support? We're here to help you succeed in
            your interview journey.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 bg-skin-primary relative transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          {/* Contact Info */}
          <div className="md:w-1/3 space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form or reach us directly.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Email Us</h4>
                <p className="text-gray-600">support@intervyo.com</p>
              </div>
            </div>
            {/* 
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Visit Us</h4>
                        <p className="text-gray-600">123 Interview Lane, Tech City</p>
                    </div>
                </div>
                */}
          </div>

          {/* Form */}
          <div className="md:w-2/3 bg-skin-secondary p-8 rounded-2xl shadow-sm border border-skin-primary transition-colors duration-300">
            <form onSubmit={handleOnSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleOnChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-skin-primary border border-skin-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-skin-primary border border-skin-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={handleOnChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg bg-skin-primary border border-skin-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  value={message}
                  onChange={handleOnChange}
                  rows="5"
                  placeholder="Tell us what you need..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-black text-white rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
