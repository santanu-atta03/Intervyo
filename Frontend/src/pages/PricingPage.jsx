import React, { useState, useEffect, useRef } from "react";
import SEO from "../components/shared/SEO";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown } from "lucide-react";
import Lenis from "@studio-freight/lenis";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setAuthUser } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";
import { apiConnector } from "../services/apiConnector";
import { BASE_URL } from "../services/apis";
import { useNotifications } from "../components/shared/NotificationContext";

const RAZORPAY_CHECKOUT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_URL}"]`,
    );
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Could not load the payment checkout.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      reject(new Error("Could not load the payment checkout."));
    };
    document.body.appendChild(script);
  });
}

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

export default function PricingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { refreshNotifications } = useNotifications();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [purchasing, setPurchasing] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const lenisRef = useRef(null);

  // Lenis smooth scroll
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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleProPurchase = async () => {
    if (!token) {
      toast.error("Please sign in before purchasing Pro.");
      navigate("/login");
      return;
    }
    if (purchasing) return;

    setPurchasing(true);
    try {
      const orderResponse = await apiConnector(
        "POST",
        `${BASE_URL}/payments/orders`,
        { billingCycle },
        { Authorization: `Bearer ${token}` },
      );
      const order = orderResponse.data?.data;
      if (!orderResponse.data?.success || !order?.orderId || !order?.keyId) {
        throw new Error(
          orderResponse.data?.message || "Could not start payment checkout.",
        );
      }

      await loadRazorpayCheckout();
      await new Promise((resolve, reject) => {
        let settled = false;
        const finish = (callback, value) => {
          if (settled) return;
          settled = true;
          callback(value);
        };

        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Intervyo",
          description: order.description,
          order_id: order.orderId,
          prefill: {
            name: order.name || user?.name || "",
            email: order.email || user?.email || "",
          },
          theme: { color: "#724133" },
          handler: async (paymentResponse) => {
            try {
              const verificationResponse = await apiConnector(
                "POST",
                `${BASE_URL}/payments/verify`,
                paymentResponse,
                { Authorization: `Bearer ${token}` },
              );
              const verification = verificationResponse.data;
              if (!verification.success || !verification.user) {
                throw new Error(
                  verification.message || "Payment could not be verified.",
                );
              }

              dispatch(setAuthUser(verification.user));
              dispatch(setUser(verification.user));
              finish(resolve, true);
            } catch (verificationError) {
              finish(
                reject,
                new Error(
                  verificationError.response?.data?.message ||
                    verificationError.message ||
                    "Payment completed, but access could not be confirmed. Please retry.",
                ),
              );
            }
          },
          modal: {
            ondismiss: () => finish(resolve, false),
          },
        });

        checkout.on("payment.failed", (event) => {
          finish(
            reject,
            new Error(
              event.error?.description || "Payment failed. Please try again.",
            ),
          );
        });
        checkout.open();
      }).then((purchased) => {
        if (purchased) {
          toast.success("Pro access is active.");
          refreshNotifications();
        }
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment could not be completed. Please try again.",
      );
    } finally {
      setPurchasing(false);
    }
  };

  const faqItems = [
    {
      q: "Can I switch plans anytime?",
      a: "Pro is a one-time purchase with no automatic renewal. If you purchase more Pro access while your current access is active, the new period is added after your current expiry date.",
    },
    {
      q: "Do you offer refunds?",
      a: "We offer a 7-day money-back guarantee on all paid plans. If you are not satisfied within your first week, reach out directly to our team for a full refund.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All transactions are processed securely through industry-standard encryption protocols.",
    },
    {
      q: "Does Pro renew automatically?",
      a: "No. Monthly Pro access lasts one calendar month and yearly access lasts one calendar year from activation. You can purchase again when you want to renew.",
    },
    {
      q: "How does Enterprise pricing work?",
      a: "Enterprise pricing is tailored to team size, volume usage, custom ATS/interview question integrations, and dedicated mentorship requirements. Contact our team for an exact configuration.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#191A1C] text-[#E8E3D8] nk-root">
      <SEO
        title="Pricing Plans"
        description="Choose the perfect plan for your interview success. Start free with 3 monthly interviews or upgrade to Pro for 25 monthly interviews, advanced analytics, and 50+ tech roles."
        canonical="/pricing"
      />
      <Navbar tone="dark" />

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

      {/* ── Top Hero Section (Dark Editorial) ── */}
      <section className="border-b border-[#3B3B39] bg-[#242526]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="max-w-5xl editorial-reveal">
            <SectionLabel light>Membership & Pricing</SectionLabel>

            <h1 className="mt-7 max-w-5xl nk-display text-5xl leading-[0.92] text-[#F1EEE6] sm:text-7xl lg:text-[7.5rem]">
              Invest in your interview mastery.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#B5B3AC] sm:text-lg">
              Start free, upgrade when you are ready. Precision AI feedback,
              deep role-specific rubrics, and real-time behavioral insights engineered
              to land senior offers.
            </p>

            {/* Billing Toggle Switch */}
            <div className="mt-12 inline-flex items-center gap-6 border border-[#3B3B39] bg-[#191A1C] p-2">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 nk-caption-sm uppercase tracking-[0.16em] transition ${
                  billingCycle === "monthly"
                    ? "bg-[#E8E3D8] text-[#1D1E20] font-semibold"
                    : "text-[#8D8A82] hover:text-[#E8E3D8]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2.5 nk-caption-sm uppercase tracking-[0.16em] transition ${
                  billingCycle === "yearly"
                    ? "bg-[#E8E3D8] text-[#1D1E20] font-semibold"
                    : "text-[#8D8A82] hover:text-[#E8E3D8]"
                }`}
              >
                Yearly <span className="text-emerald-400 font-bold ml-1.5">(Save 20%)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Tier Cards Section (Warm Cream Palette) ── */}
      <section className="border-b border-[#D7D1C5]/20 bg-[#E8E3D8] text-[#1D1E20]">
        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-14">
            <SectionLabel>Tiers & Commitments</SectionLabel>
            <h2 className="mt-6 max-w-2xl nk-display text-4xl leading-[0.95] text-[#1D1E20] sm:text-6xl">
              Transparent, scalable plans.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-stretch">
            {/* Free Plan Tile */}
            <div className="flex flex-col justify-between border border-[#B6B0A4] bg-[#F1EEE6] p-8 sm:p-10 transition hover:-translate-y-1 duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="nk-caption-sm uppercase tracking-[0.18em] text-[#77736B]">
                    Starter
                  </span>
                </div>
                <h3 className="mt-4 nk-display text-4xl text-[#1D1E20]">Free</h3>
                <p className="mt-3 text-sm leading-6 text-[#68655E]">
                  Essential AI-powered sessions for foundational practice and skill check.
                </p>

                <div className="my-8 border-y border-[#D7D1C5] py-6">
                  <span className="nk-display text-5xl font-bold text-[#1D1E20]">₹0</span>
                  <span className="ml-2 text-xs uppercase tracking-wider text-[#77736B]">/ Forever</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "3 AI-powered interviews per month",
                    "Basic performance analytics & scoring",
                    "Access to 10+ core tech tracks",
                    "Community discussion & support",
                    "Email support (48hr turnaround)",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#3A3834]">
                      <Check className="w-4 h-4 text-[#1D1E20] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group mt-auto flex w-full items-center justify-between border border-[#1D1E20] bg-transparent px-6 py-4 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#1D1E20] transition hover:bg-[#1D1E20] hover:text-[#E8E3D8]"
              >
                <span>Get Started Free</span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>

            {/* Pro Plan - Warm Terracotta Featured Card */}
            <div className="relative flex flex-col justify-between border border-[#B6B0A4] bg-[#724133] p-8 sm:p-10 text-[#F1EEE6] shadow-[0_20px_45px_rgba(0,0,0,0.3)] transition hover:-translate-y-1.5 duration-300">
              <div className="absolute top-0 right-0 bg-[#E8E3D8] text-[#1D1E20] px-4 py-1 nk-caption-sm font-semibold uppercase tracking-[0.18em]">
                Most Popular
              </div>

              <div>
                <span className="nk-caption-sm uppercase tracking-[0.18em] text-[#E8DFD2]">
                  Full Access
                </span>
                <h3 className="mt-4 nk-display text-4xl text-[#F1EEE6]">Pro Member</h3>
                <p className="mt-3 text-sm leading-6 text-[#E8DFD2]">
                  Up to 25 interviews each month, voice/video analysis, and deep metrics.
                </p>

                <div className="my-8 border-y border-[#A98F82] py-6">
                  <span className="nk-display text-5xl font-bold text-[#F1EEE6]">
                    ₹{billingCycle === "monthly" ? "399" : "299"}
                  </span>
                  <span className="ml-2 text-xs uppercase tracking-wider text-[#E8DFD2]">
                    / month, billed {billingCycle}
                  </span>
                  {billingCycle === "yearly" && (
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-amber-200">
                      Save ₹1,200 annually
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "25 AI-powered interviews per month",
                    "Advanced analytics & progress tracking",
                    "50+ specialized engineering & product roles",
                    "Voice & video real-time simulation",
                    "Custom tailored questions & company formats",
                    "Priority 24-hour response support",
                    "Complete replay history & audio playback",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#F3EDE3]">
                      <Check className="w-4 h-4 text-[#F1EEE6] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleProPurchase}
                  disabled={purchasing}
                  className="group flex w-full items-center justify-between bg-[#1D1E20] px-6 py-4 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#E8E3D8] transition hover:bg-[#2b2c2e] disabled:cursor-wait disabled:opacity-70"
                >
                  <span>
                    {purchasing
                      ? "Processing..."
                      : `Buy Pro · ₹${billingCycle === "monthly" ? "399" : "3,588"}`}
                  </span>
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                <p className="mt-3 text-center text-xs tracking-wider text-[#E8DFD2]/70 uppercase">
                  One-time payment · No automatic renewal
                </p>
              </div>
            </div>

            {/* Enterprise Plan Tile */}
            <div className="flex flex-col justify-between border border-[#B6B0A4] bg-[#F1EEE6] p-8 sm:p-10 transition hover:-translate-y-1 duration-300">
              <div>
                <span className="nk-caption-sm uppercase tracking-[0.18em] text-[#77736B]">
                  Organizations
                </span>
                <h3 className="mt-4 nk-display text-4xl text-[#1D1E20]">Enterprise</h3>
                <p className="mt-3 text-sm leading-6 text-[#68655E]">
                  Tailored cohorts, custom question banks, and dedicated integration.
                </p>

                <div className="my-8 border-y border-[#D7D1C5] py-6">
                  <span className="nk-display text-5xl font-bold text-[#1D1E20]">Custom</span>
                  <span className="ml-2 text-xs uppercase tracking-wider text-[#77736B]">/ Volume pricing</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Everything included in the Pro tier",
                    "Unlimited team seats & member cohorts",
                    "Custom branding & white-label assessments",
                    "SSO & enterprise-grade compliance",
                    "Team leadership performance dashboard",
                    "Dedicated account success manager",
                    "Custom ATS integrations & webhook API",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#3A3834]">
                      <Check className="w-4 h-4 text-[#1D1E20] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="mailto:support@intervyo.com?subject=Enterprise%20Plan%20Inquiry"
                className="group mt-auto flex w-full items-center justify-between border border-[#1D1E20] bg-transparent px-6 py-4 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#1D1E20] transition hover:bg-[#1D1E20] hover:text-[#E8E3D8]"
              >
                <span>Contact Enterprise Sales</span>
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Comparison Matrix (Dark Editorial Table) ── */}
      <section className="border-b border-[#3B3B39] bg-[#1E1F21] py-20 px-5 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14">
            <SectionLabel light>Detailed Matrix</SectionLabel>
            <h2 className="mt-6 nk-display text-4xl text-[#F1EEE6] sm:text-6xl">
              Compare all features.
            </h2>
          </div>

          <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[760px] table-fixed text-left border-collapse">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#403F3C]">
                  <th className="py-5 px-4 nk-caption-sm uppercase tracking-[0.16em] text-[#8D8A82]">Feature</th>
                  <th className="py-5 px-4 text-center nk-caption-sm uppercase tracking-[0.16em] text-[#8D8A82]">Free</th>
                  <th className="py-5 px-4 text-center nk-caption-sm uppercase tracking-[0.16em] text-[#E8DFD2] font-semibold bg-[#2A2B2D]">Pro</th>
                  <th className="py-5 px-4 text-center nk-caption-sm uppercase tracking-[0.16em] text-[#8D8A82]">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333436] text-sm">
                {[
                  ["Interviews per month", "3", "25", "Unlimited"],
                  ["AI feedback & scoring", true, true, true],
                  ["Tech roles available", "10+", "50+", "50+"],
                  ["Voice practice mode", "—", true, true],
                  ["Video analysis", "—", true, true],
                  ["Custom questions", "—", true, true],
                  ["Progress analytics", "Basic", "Advanced", "Advanced + Team"],
                  ["Interview history", "7 days", "Unlimited", "Unlimited"],
                  ["Team dashboard", "—", "—", true],
                  ["SSO & Security", "—", "—", true],
                  ["Support", "Email (48hr)", "Priority (24hr)", "Dedicated Manager"],
                ].map(([name, free, pro, enterprise], idx) => (
                  <tr key={idx} className="transition hover:bg-[#252628]">
                    <td className="py-4 px-4 text-[#D8D3C8] font-medium">{name}</td>
                    <td className="py-4 px-4 text-center text-[#8D8A82]">
                      {free === true ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : free}
                    </td>
                    <td className="py-4 px-4 text-center text-[#F1EEE6] bg-[#242527] font-medium">
                      {pro === true ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : pro}
                    </td>
                    <td className="py-4 px-4 text-center text-[#8D8A82]">
                      {enterprise === true ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Editorial Accordion) ── */}
      <section className="border-b border-[#3B3B39] bg-[#242526] py-20 px-5 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <SectionLabel light>Common Inquiries</SectionLabel>
          <h2 className="mt-6 mb-12 nk-display text-4xl text-[#F1EEE6] sm:text-6xl">
            Frequently asked questions.
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-[#3B3B39] pb-6 transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <h3 className="nk-h-xl text-xl sm:text-2xl text-[#F1EEE6] transition group-hover:text-[#D8D3C8]">
                    {item.q}
                  </h3>
                  <ChevronDown
                    className={`w-6 h-6 text-[#8D8A82] flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180 text-[#F1EEE6]" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="mt-4 text-base leading-7 text-[#B5B3AC] max-w-3xl">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Outcome / Metric Bar ── */}
      <section className="bg-[#191A1C]">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.7fr] lg:px-12 lg:py-28">
          <div>
            <SectionLabel light>Empowering Aspirants</SectionLabel>
            <h2 className="mt-7 max-w-3xl nk-display text-4xl leading-[0.95] text-[#F1EEE6] sm:text-6xl">
              Ready to ace your upcoming interviews?
            </h2>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#3B3B39] pt-8">
              <div>
                <span className="nk-display text-4xl text-[#F1EEE6]">87%</span>
                <p className="nk-caption-sm text-[#8D8A82] uppercase mt-1">Success Rate</p>
              </div>
              <div>
                <span className="nk-display text-4xl text-[#F1EEE6]">50K+</span>
                <p className="nk-caption-sm text-[#8D8A82] uppercase mt-1">Completed</p>
              </div>
              <div>
                <span className="nk-display text-4xl text-[#F1EEE6]">4.9/5</span>
                <p className="nk-caption-sm text-[#8D8A82] uppercase mt-1">User Rating</p>
              </div>
              <div>
                <span className="nk-display text-4xl text-[#F1EEE6]">12K</span>
                <p className="nk-caption-sm text-[#8D8A82] uppercase mt-1">Active Users</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#41423F] pt-6 flex flex-col justify-between">
            <p className="text-base leading-8 text-[#96938B]">
              Experience simulated real-world rounds before speaking with recruiters.
              Instant analysis, voice modulation feedback, and actionable rubrics.
            </p>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-8 inline-flex items-center gap-4 border-b border-[#8E8B83]/50 pb-1 nk-caption-sm font-semibold uppercase tracking-[0.16em] text-[#D8D3C8] transition hover:border-[#E8E3D8] hover:text-[#E8E3D8] cursor-pointer"
            >
              Begin Free Trial
              <Arrow />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}