import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Github } from "lucide-react";
import BrandLogo from "./BrandLogo";

// Clean minimal X (Twitter) icon
const XIcon = ({ className = "size-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Clean minimal Instagram icon
const InstagramIcon = ({ className = "size-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative bg-[#F8F9FA] dark:bg-[#08090D] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      {/* Giant Watermark in background */}
      <div className="absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden z-0">
        <span className="brand-wordmark-font font-extrabold text-[120px] sm:text-[190px] md:text-[240px] lg:text-[290px] tracking-tight leading-none text-neutral-900/[0.04] dark:text-white/[0.03] whitespace-nowrap block">
          Intervyo
        </span>
      </div>

      {/* Floating Card Container */}
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="bg-white dark:bg-[#121622] rounded-[28px] sm:rounded-[36px] border border-black/[0.08] dark:border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12 lg:p-14">
          
          {/* Top Row: Brand & Info (Left) + 3 Columns (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
            
            {/* Left Column: Logo, Description & Social Icons */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <Link to="/" className="inline-flex items-center">
                  <BrandLogo className="text-2xl" />
                </Link>

                <p className="mt-5 text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed font-sans">
                  Intervyo empowers engineers and professionals to master high-stakes technical interviews — turning raw preparation into clear, offer-winning confidence and real career breakthroughs.
                </p>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="https://x.com/attasantanu747"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <XIcon className="size-4" />
                </a>
                <Link
                  href="https://instagram.com/santanu.stoic"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <InstagramIcon className="size-4" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/santanu-atta-139820363"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Linkedin className="size-4" />
                </Link>
                <Link
                  href="https://github.com/santanu-atta03"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  <Github className="size-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Product, Resources, Company */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-10">
              
              {/* Product */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-4 tracking-tight">
                  Product
                </h4>
                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>
                    <Link to="/interview-setup" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/practice-lab" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Changelog
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-4 tracking-tight">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>
                    <Link to="/docs" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="/learning-hub" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-4 tracking-tight">
                  Company
                </h4>
                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>
                    <Link to="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/career" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/santanu-atta03/Intervyo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      Partners
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Thin Divider Line & Bottom Legal Links */}
          <div className="pt-7 border-t border-neutral-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-neutral-500 dark:text-neutral-400 font-normal">
              © {new Date().getFullYear()} Intervyo. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-neutral-600 dark:text-neutral-400">
              <Link
                to="/privacy"
                className="underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:text-neutral-900 dark:hover:text-white hover:decoration-neutral-900 dark:hover:decoration-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:text-neutral-900 dark:hover:text-white hover:decoration-neutral-900 dark:hover:decoration-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookie-policy"
                className="underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:text-neutral-900 dark:hover:text-white hover:decoration-neutral-900 dark:hover:decoration-white transition-colors"
              >
                Cookies Settings
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
