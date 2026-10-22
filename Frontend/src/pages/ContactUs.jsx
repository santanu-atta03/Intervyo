import React, { useEffect, useRef, useState } from "react";
import SEO from "../components/shared/SEO";
import { submitContactForm } from "../services/operations/contactAPI";
import Lenis from "@studio-freight/lenis";

function Arrow({ className = "" }) {
  return (
    <span className={`inline-block text-lg leading-none ${className}`}>
      ↗
    </span>
  );
}

function SectionLabel({ children, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-px w-8 ${light ? "bg-[#403F3C]" : "bg-[#878377]"}`}
      />
      <span
        className={`nk-caption-sm uppercase tracking-[0.22em] ${
          light ? "text-[#8D8A82]" : "text-[#69665F]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
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
    setSubmitError("");
    try {
      const result = await submitContactForm(formData, setLoading);
      if (result) {
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitError(
        err?.message ||
          "Failed to send message. Please try again or reach out directly to support@intervyo.com."
      );
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitError("");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#191A1C] text-[#E8E3D8] nk-root">
      <SEO
        title="Contact Us"
        description="Have questions or need support with Intervyo? Get in touch with our team for assistance with AI interview practice, pricing, or enterprise solutions."
        canonical="/contact"
      />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap");

        .nk-root {
          font-family: "Helvetica Now Text", "Helvetica Neue", "Inter", Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .nk-display {
          font-family: "Nike Futura ND", "Bebas Neue", Anton, Impact, "Helvetica Neue", sans-serif;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .nk-h-xl {
          font-family: "Helvetica Now Display", "Helvetica Neue", "Inter", sans-serif;
          font-weight: 500;
          letter-spacing: -0.02em;
        }

        .nk-caption-sm {
          font-family: "Inter", -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 500;
        }

        @keyframes editorialReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .editorial-reveal {
          animation: editorialReveal 900ms cubic-bezier(.2,.7,.2,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Top Banner / Hero */}
      <section className="border-b border-[#3B3B39] bg-[#242526]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="max-w-5xl editorial-reveal">
            <SectionLabel light>Contact Intervyo</SectionLabel>

            <h1 className="mt-7 max-w-5xl nk-display text-5xl leading-[0.92] text-[#F1EEE6] sm:text-7xl lg:text-[7.5rem]">
              Let&apos;s talk about your preparation.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#B5B3AC] sm:text-lg">
              Have questions about Intervyo, need assistance with your interview
              practice, or looking for custom preparation solutions? We&apos;re here
              to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="border-b border-[#D7D1C5]/20 bg-[#E8E3D8] text-[#1D1E20]">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.6fr_1fr] lg:px-12 lg:py-28">
          {/* Left Column: Direct Info */}
          <div>
            <SectionLabel>Start a conversation</SectionLabel>

            <h2 className="mt-7 max-w-md nk-display text-4xl leading-[0.95] sm:text-6xl text-[#1D1E20]">
              Bring us your goals.
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-[#68655E]">
              Fill out the form or reach us directly. Tell us what you are
              preparing for, and our team will guide you on the clearest path
              forward.
            </p>

            <div className="mt-10 space-y-6 border-t border-[#A9A49A] pt-6">
              <div>
                <p className="nk-caption-sm uppercase tracking-[0.18em] text-[#77736B]">
                  Support & Queries
                </p>
                <a
                  href="mailto:support@intervyo.com?subject=Inquiry%20-%20Intervyo"
                  className="mt-2 block text-lg font-medium tracking-tight text-[#1D1E20] transition hover:text-[#69665F]"
                >
                  support@intervyo.com
                </a>
              </div>

              <div>
                <p className="nk-caption-sm uppercase tracking-[0.18em] text-[#77736B]">
                  Response Window
                </p>
                <p className="mt-2 text-base font-medium text-[#1D1E20]">
                  Within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Warm terracotta card */}
          <div className="relative -translate-y-1 border border-[#B6B0A4] bg-[#724133] p-6 sm:p-8 shadow-[0_20px_45px_rgba(0,0,0,0.38)]">
            {submitted ? (
              <div className="flex min-h-[440px] flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="nk-caption-sm uppercase tracking-[0.2em] text-emerald-300 font-semibold">
                    Message Dispatched
                  </p>
                </div>

                <h3 className="mt-4 max-w-lg nk-display text-3xl sm:text-4xl leading-tight text-[#F1EEE6]">
                  Thank you, {formData.name || "there"}.
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-[#E8DFD2]">
                  Your inquiry regarding{" "}
                  <span className="font-semibold text-white">
                    {formData.subject || "Intervyo Practice"}
                  </span>{" "}
                  has been sent to our team. We will review your message and reply
                  to <span className="font-semibold text-white">{formData.email}</span> shortly.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-fit border-b border-[#E8DFD2] pb-1 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#E8DFD2] hover:text-white transition"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOnSubmit} className="space-y-6">
                {submitError && (
                  <div className="border border-rose-400/60 bg-rose-950/60 p-3.5 text-xs text-rose-200">
                    <p className="font-semibold text-rose-300">Notice:</p>
                    <p className="mt-1">{submitError}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="nk-caption-sm uppercase tracking-[0.18em] text-[#ffffff]"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={handleOnChange}
                    placeholder="John Doe"
                    className="mt-3 w-full border-0 border-b border-[#A9A49A] text-[#F3EDE3] bg-transparent px-0 py-3 text-base outline-none placeholder:text-[#ffffff]/60 focus:outline-none focus:border-[#E8DFD2]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="nk-caption-sm uppercase tracking-[0.18em] text-[#E8DFD2]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleOnChange}
                    placeholder="john@example.com"
                    className="mt-3 w-full border-0 border-b border-[#A98F82] bg-transparent px-0 py-3 text-base text-[#F3EDE3] outline-none placeholder:text-[#C8BFB3] focus:outline-none focus:border-[#E8DFD2]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="nk-caption-sm uppercase tracking-[0.18em] text-[#ffffff]"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={handleOnChange}
                    placeholder="How can we help?"
                    className="mt-3 w-full border-0 border-b border-[#A9A49A] bg-transparent px-0 py-3 text-base text-[#F3EDE3] outline-none placeholder:text-[#ffffff]/60 focus:outline-none focus:border-[#E8DFD2]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="nk-caption-sm uppercase tracking-[0.18em] text-[#ffffff]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={message}
                    onChange={handleOnChange}
                    placeholder="Tell us what you need..."
                    className="mt-3 w-full resize-none border border-[#A9A49A] text-[#F3EDE3] bg-transparent p-3 text-base outline-none placeholder:text-[#ffffff]/60 focus:outline-none focus:border-[#E8DFD2]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-4 bg-[#1D1E20] px-6 py-3.5 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#E8E3D8] transition hover:bg-[#303133] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-emerald-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send message</span>
                      <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Outcome Section */}
      <section className="bg-[#191A1C]">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.7fr] lg:px-12 lg:py-28">
          <div>
            <SectionLabel light>Before you reach out</SectionLabel>

            <h2 className="mt-7 max-w-3xl nk-display text-4xl leading-[0.95] text-[#F1EEE6] sm:text-6xl">
              Tell us the interview you want to master.
            </h2>
          </div>

          <div className="border-t border-[#41423F] pt-6">
            <p className="text-base leading-8 text-[#96938B]">
              Whether you are preparing for tech, product, behavioral rounds, or
              system design, let us know your target role and timeline so we can
              assist you effectively.
            </p>

            <a
              href="mailto:support@intervyo.com"
              className="mt-8 inline-flex items-center gap-4 border-b border-[#8E8B83]/50 pb-1 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#D8D3C8] transition hover:border-[#E8E3D8] hover:text-[#E8E3D8]"
            >
              Contact Support Directly
              <Arrow />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}