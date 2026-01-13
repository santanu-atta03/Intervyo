import { HugeiconsIcon } from "@hugeicons/react";
import { TelegramIcon } from "@hugeicons/core-free-icons";
import { Twitter, Linkedin, Github, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-black text-gray-400 border-t border-white/5 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 opacity-50" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold mb-4">
              <span className="text-white">Interv</span>
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">yo</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Empowering tech professionals with AI-driven interview preparation. 
              Master your skills, boost your confidence, land your dream job.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              <a 
                href="mailto:intervyo.team@example.com" 
                aria-label="Email"
                className="group relative p-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </a>

              <a
                href="https://www.linkedin.com/in/santanu-atta-139820363"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group relative p-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>

              <a
                href="https://github.com/santanu-atta03"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group relative p-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://t.me/attasantanu747"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="group relative p-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
              >
                <HugeiconsIcon
                  icon={TelegramIcon}
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors"
                />
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Mock Interviews
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  AI Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Role Preparation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Study Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <a href="mailto:intervyo.team@example.com" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/santanu-atta03/Intervyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Intervyo. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with <span className="text-red-500">♥</span> for aspiring developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
