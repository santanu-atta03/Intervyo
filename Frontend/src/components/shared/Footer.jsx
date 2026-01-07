import React from 'react';
const Footer = () => {
  return (
<footer className="border-t border-white/10 py-8 md:py-12 px-4 bg-gradient-to-b from-slate-900 to-purple-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
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
      </footer>)};


export default Footer;