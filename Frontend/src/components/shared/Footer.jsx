import React, { useState } from 'react';
import { customToast } from '../../utils/toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      customToast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call backend newsletter subscription endpoint
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        customToast.success('Thanks for subscribing! Check your inbox for exclusive updates.');
        setEmail('');
      } else if (response.status === 409) {
        customToast.info('You are already subscribed to our newsletter!');
        setEmail('');
      } else {
        customToast.error('Failed to subscribe. Please try again later.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      customToast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="border-t border-white/10 py-8 md:py-12 px-4 bg-gradient-to-b from-slate-900 to-purple-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section - Compact */}
        <div className="mb-8 md:mb-10 flex justify-center">
          <div className="w-full max-w-2xl relative rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            {/* Solid gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600"></div>

            <div className="relative px-6 md:px-8 py-5 md:py-6 backdrop-blur-sm">
              {/* Centered Content */}
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-2.5">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <h3 className="text-lg md:text-xl font-bold mb-1.5 text-white">Stay Updated!</h3>

                {/* Description */}
                <p className="text-gray-100 text-xs md:text-sm leading-snug mb-3 max-w-md">
                  Subscribe for exclusive interview tips and the latest features.
                </p>

                {/* Form */}
                <form onSubmit={handleNewsletterSubmit} className="w-full flex flex-col sm:flex-row gap-2 justify-center">
                  <div className="flex-1 max-w-xs">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-1.5 bg-white rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 disabled:opacity-50 text-xs md:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-1.5 bg-white hover:bg-gray-100 text-purple-600 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap shadow-md hover:shadow-lg text-xs md:text-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-1 justify-center">
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 justify-center">
                        Subscribe
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>

                {/* Privacy Message */}
                <p className="text-xs text-gray-200 mt-2.5">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
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
              <li><a href="/blog" className="hover:text-white transition text-sm md:text-base">Blog</a></li>
              <li><a href="#" className="hover:text-white transition text-sm md:text-base">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 md:mb-4">Legal</h4>
            <ul className="space-y-1 md:space-y-2 text-gray-400">
              <li><a href="/Privacy" className="hover:text-white transition text-sm md:text-base">Privacy</a></li>
              <li><a href="/Terms" className="hover:text-white transition text-sm md:text-base">Terms</a></li>
              <li><a href="#" className="hover:text-white transition text-sm md:text-base">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Intervyo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;