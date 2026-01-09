import { Twitter, Linkedin, Github, Youtube } from "lucide-react";

export default function Footer() {
  return (
   <footer className="bg-gray-950 text-gray-400 py-12 md:py-16 px-4 md:px-6 relative overflow-hidden border-t border-gray-800">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <div className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-white">Interv</span>
                <span className="text-emerald-500">yo</span>
              </div>
              <p className="text-sm md:text-base mb-6">AI-powered interview prep for tech professionals.</p>
              <div className="flex gap-4">
                <Twitter className="w-5 h-5 md:w-6 md:h-6 hover:text-emerald-400 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 md:w-6 md:h-6 hover:text-emerald-400 cursor-pointer transition-colors" />
                <Github className="w-5 h-5 md:w-6 md:h-6 hover:text-emerald-400 cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 md:w-6 md:h-6 hover:text-emerald-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Platform</h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Mock Interviews</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Feedback</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Role Prep</a></li>
              </ul>
            </div>
            <p className="text-gray-400 text-sm md:text-base">Master your tech interviews with AI </p>
          </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Company</h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Resources</h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-base md:text-lg">Legal</h4>
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs md:text-sm text-center mb-8 text-gray-500">© 2026 Intervyo. All rights reserved.</p>
            
            {/* Dotted text at bottom */}
            <div className="flex justify-center overflow-hidden">
              <div 
                className="text-5xl md:text-[80px] lg:text-[120px] xl:text-[160px] font-bold whitespace-nowrap select-none"
                style={{
                  color: 'transparent',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 2px, transparent 2px)',
                  backgroundSize: '6px 6px',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  letterSpacing: '0.05em'
                }}
              >
                     INTERVYO 
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}
