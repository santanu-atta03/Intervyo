import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, Check, Zap, Users, BarChart, Sparkles, Crown, Building2, ChevronDown } from "lucide-react";
import Lenis from "@studio-freight/lenis";

export default function PricingPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);
  const lenisRef = useRef(null);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-gray-200">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-gray-900">Interv</span>
            <span className="text-emerald-500">yo</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Features
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              About
            </Link>
            <Link to="/#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              How it Works
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </Link>
            <Link to="/#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all">
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 mx-2 overflow-hidden">
            <div className="p-6 space-y-4">
              <Link to="/" onClick={closeMobileMenu} className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Home
              </Link>
              <Link to="/about" onClick={closeMobileMenu} className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                About
              </Link>
              <Link to="/contact" onClick={closeMobileMenu} className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  <button onClick={() => { navigate("/dashboard"); closeMobileMenu(); }} className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all">
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
      <section className="pt-40 pb-20 px-6 relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-3xl" style={{ animation: "sweepGlow 8s ease-in-out infinite" }} />
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent blur-2xl" style={{ animation: "sweepGlow 8s ease-in-out infinite 0.5s" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 font-medium">Transparent Pricing</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
            Choose the Perfect Plan
            <br />
            for Your <span className="text-emerald-500">Interview Success</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Start free, upgrade when you're ready. All plans include AI-powered feedback
            <br />
            and role-specific questions to help you land your dream job.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')} className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors">
              <div className={`absolute top-1 left-1 w-6 h-6 bg-emerald-500 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-8' : ''}`} />
            </button>
            <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-emerald-500 text-sm">(Save 20%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-10 shadow-2xl border-4 border-gray-900 flex flex-col hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900">Free</h3>
              </div>

              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Perfect for getting started with interview prep
              </p>

              <div className="mb-8">
                <div className="text-6xl font-bold text-gray-900">₹0</div>
                <p className="text-gray-500 text-lg mt-2">Forever free</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">2 AI-powered interviews per month</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Basic performance analytics</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Access to 10+ tech roles</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Community support forum</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Email support (48hr response)</p>
                </div>
              </div>

              <button onClick={() => navigate("/register")} className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition-colors mt-auto">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-10 shadow-2xl border-4 border-emerald-400 relative flex flex-col hover:scale-105 transition-transform duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                MOST POPULAR
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-4xl font-bold text-white">Pro</h3>
              </div>

              <p className="text-emerald-50 text-lg mb-8 pb-6 border-b border-emerald-400">
                Everything you need to ace any tech interview
              </p>

              <div className="mb-8">
                <div className="text-6xl font-bold text-white">
                  ₹{billingCycle === 'monthly' ? '999' : '799'}
                </div>
                <p className="text-emerald-100 text-lg mt-2">
                  per month, billed {billingCycle}
                </p>
                {billingCycle === 'yearly' && (
                  <p className="text-yellow-300 text-sm mt-1 font-semibold">Save ₹2,400/year</p>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Unlimited AI-powered interviews</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Advanced analytics & progress tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">50+ specialized tech roles</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Voice & video practice mode</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Custom interview questions</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Detailed performance reports</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Priority email support (24hr)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-white text-base font-medium">Interview history & playback</p>
                </div>
              </div>

              <button onClick={() => navigate("/register")} className="w-full py-4 bg-white hover:bg-gray-100 text-emerald-600 font-bold text-lg rounded-xl transition-colors mt-auto shadow-lg">
                Start 7-Day Free Trial
              </button>
              <p className="text-emerald-100 text-sm text-center mt-3">No credit card required</p>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-10 shadow-2xl border-4 border-gray-900 flex flex-col hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900">Enterprise</h3>
              </div>

              <p className="text-gray-600 text-lg mb-8 pb-6 border-b border-gray-300">
                Tailored solutions for organizations and teams
              </p>

              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900">Custom</div>
                <p className="text-gray-500 text-lg mt-2">Contact us for pricing</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Everything in Pro plan</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Unlimited team members</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Custom branding & white-label</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">SSO & advanced security</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Team analytics dashboard</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Dedicated account manager</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Custom integrations & API access</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" strokeWidth={3} />
                  <p className="text-gray-700 text-base">Priority phone & chat support</p>
                </div>
              </div>

              <button className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition-colors mt-auto">
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Compare All <span className="text-emerald-500">Features</span>
            </h2>
            <p className="text-xl text-gray-600">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-6 px-4 text-lg font-bold text-gray-900">Features</th>
                  <th className="text-center py-6 px-4 text-lg font-bold text-gray-900">Free</th>
                  <th className="text-center py-6 px-4 text-lg font-bold text-emerald-600">Pro</th>
                  <th className="text-center py-6 px-4 text-lg font-bold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Interviews per month</td>
                  <td className="py-4 px-4 text-center text-gray-700">2</td>
                  <td className="py-4 px-4 text-center text-emerald-600 font-semibold">Unlimited</td>
                  <td className="py-4 px-4 text-center text-gray-700">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">AI feedback & scoring</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Tech roles available</td>
                  <td className="py-4 px-4 text-center text-gray-700">10+</td>
                  <td className="py-4 px-4 text-center text-emerald-600 font-semibold">50+</td>
                  <td className="py-4 px-4 text-center text-gray-700">50+</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Voice practice</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Video recording</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Custom questions</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Progress analytics</td>
                  <td className="py-4 px-4 text-center text-gray-700">Basic</td>
                  <td className="py-4 px-4 text-center text-emerald-600 font-semibold">Advanced</td>
                  <td className="py-4 px-4 text-center text-gray-700">Advanced + Team</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Interview history</td>
                  <td className="py-4 px-4 text-center text-gray-700">7 days</td>
                  <td className="py-4 px-4 text-center text-emerald-600 font-semibold">Unlimited</td>
                  <td className="py-4 px-4 text-center text-gray-700">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Team management</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">SSO integration</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Support</td>
                  <td className="py-4 px-4 text-center text-gray-700">Email (48hr)</td>
                  <td className="py-4 px-4 text-center text-emerald-600 font-semibold">Priority (24hr)</td>
                  <td className="py-4 px-4 text-center text-gray-700">Dedicated Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Pricing Questions?
          </h2>

          <div className="space-y-4">
            <div className="border-b-4 border-white pb-6">
              <button onClick={() => toggleFaq(0)} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-2xl font-bold text-white pr-8">Can I switch plans anytime?</h3>
                <ChevronDown className={`w-8 h-8 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 0 ? "rotate-180" : ""}`} strokeWidth={3} />
              </button>
              {openFaq === 0 && (
                <p className="mt-4 text-lg text-white/90 leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your current billing cycle.
                </p>
              )}
            </div>

            <div className="border-b-4 border-white pb-6">
              <button onClick={() => toggleFaq(1)} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-2xl font-bold text-white pr-8">Do you offer refunds?</h3>
                <ChevronDown className={`w-8 h-8 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 1 ? "rotate-180" : ""}`} strokeWidth={3} />
              </button>
              {openFaq === 1 && (
                <p className="mt-4 text-lg text-white/90 leading-relaxed">
                  We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied within the first 7 days, contact our support team for a full refund, no questions asked.
                </p>
              )}
            </div>

            <div className="border-b-4 border-white pb-6">
              <button onClick={() => toggleFaq(2)} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-2xl font-bold text-white pr-8">What payment methods do you accept?</h3>
                <ChevronDown className={`w-8 h-8 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 2 ? "rotate-180" : ""}`} strokeWidth={3} />
              </button>
              {openFaq === 2 && (
                <p className="mt-4 text-lg text-white/90 leading-relaxed">
                  We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets. All payments are processed securely through industry-standard encryption.
                </p>
              )}
            </div>

            <div className="border-b-4 border-white pb-6">
              <button onClick={() => toggleFaq(3)} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-2xl font-bold text-white pr-8">Is the free trial really free?</h3>
                <ChevronDown className={`w-8 h-8 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 3 ? "rotate-180" : ""}`} strokeWidth={3} />
              </button>
              {openFaq === 3 && (
                <p className="mt-4 text-lg text-white/90 leading-relaxed">
                  Yes! The 7-day free trial for the Pro plan requires no credit card. You'll have full access to all Pro features during the trial. After 7 days, you can choose to upgrade or continue with the free plan.
                </p>
              )}
            </div>

            <div className="border-b-4 border-white pb-6">
              <button onClick={() => toggleFaq(4)} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-2xl font-bold text-white pr-8">How does Enterprise pricing work?</h3>
                <ChevronDown className={`w-8 h-8 text-white flex-shrink-0 transition-transform duration-300 ${openFaq === 4 ? "rotate-180" : ""}`} strokeWidth={3} />
              </button>
              {openFaq === 4 && (
                <p className="mt-4 text-lg text-white/90 leading-relaxed">
                  Enterprise pricing is customized based on your team size, usage requirements, and specific needs. Contact our sales team for a tailored quote. We offer volume discounts for larger organizations.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Trusted by <span className="text-emerald-500">5,000+</span> Job Seekers
            </h2>
            <p className="text-xl text-gray-600">Join thousands preparing for their dream roles</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">87%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">50K+</div>
              <p className="text-gray-600">Interviews Completed</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">4.9/5</div>
              <p className="text-gray-600">User Rating</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">12K</div>
              <p className="text-gray-600">Active Users</p>
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
                Ready to <span className="bg-emerald-500 px-3 py-1 rounded">ace</span> your
                <br />
                next interview?
              </h2>
              <p className="text-xl text-gray-300">
                Start practicing today with our AI-powered interview coach.
                <br />
                No credit card required.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button onClick={() => navigate("/register")} className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold text-lg flex items-center gap-2 shadow-lg">
                Get Started Free <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
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