import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/operations/authAPI';
import { toast } from 'react-hot-toast';

export default function DomainSelection() {
  const [formData, setFormData] = useState({
    domain: '',
    experience: ''
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, signupData } = useSelector((state) => state.auth);

  const domains = [
    { id: 'frontend', name: 'Frontend', icon: '🎨', color: 'from-emerald-500 to-teal-500' },
    { id: 'backend', name: 'Backend', icon: '⚙️', color: 'from-blue-500 to-indigo-500' },
    { id: 'fullstack', name: 'Full Stack', icon: '🚀', color: 'from-emerald-400 to-cyan-500' },
    { id: 'data-science', name: 'Data Science', icon: '📊', color: 'from-purple-500 to-pink-500' },
    { id: 'devops', name: 'DevOps', icon: '🔧', color: 'from-orange-500 to-red-500' },
    { id: 'mobile', name: 'Mobile', icon: '📱', color: 'from-blue-400 to-blue-600' }
  ];

  const handleSubmit = () => {
    if (!formData.domain) {
      setErrors({ domain: 'Please select a domain' });
      toast.error('Please select a domain');
      return;
    }

    if (!signupData) {
      toast.error('Session expired. Please register again.');
      navigate('/register');
      return;
    }

    const { name, email, password, otp, profilePicture } = signupData;
    
    const profile = {
      domain: formData.domain,
      experience: parseInt(formData.experience) || 0
    };

    dispatch(signup(name, email, password, otp, profilePicture, profile, navigate));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 🔳 TILE GRID BACKGROUND - Matches Register UI */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))] pointer-events-auto">
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="border border-white/5 transition-colors duration-150 ease-out hover:bg-[#10b981]"
          />
        ))}
      </div>

      {/* Glow effect layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[450px] h-[450px] rounded-full bg-emerald-500 blur-[100px] opacity-20" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.15)] p-8">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-300">Step 3 of 3</span>
              <span className="text-sm text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mb-3 shadow-lg shadow-emerald-500/20">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Choose Your Domain
            </h1>
            <p className="text-gray-400 mt-2">Personalize your prep experience</p>
          </div>

          {errors.domain && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-xs text-center animate-pulse">
              {errors.domain}
            </div>
          )}

          {/* Domain Selection Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  setFormData({ ...formData, domain: domain.id });
                  setErrors({ ...errors, domain: '' });
                }}
                className={`group p-4 rounded-xl border transition-all duration-300 transform active:scale-95 ${
                  formData.domain === domain.id
                    ? `bg-gradient-to-br ${domain.color} text-white border-transparent shadow-[0_0_20px_rgba(16,185,129,0.2)]`
                    : 'bg-zinc-900 border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800'
                }`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{domain.icon}</div>
                <div className={`font-semibold text-sm ${formData.domain === domain.id ? 'text-white' : 'text-gray-300'}`}>
                  {domain.name}
                </div>
              </button>
            ))}
          </div>

          {/* Experience Select */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Years of Experience (Optional)
            </label>
            <div className="relative">
              <select
                name="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="">Select experience</option>
                <option value="0">Fresher</option>
                <option value="1">1-2 years</option>
                <option value="3">3-5 years</option>
                <option value="6">5+ years</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                ▼
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-emerald-500 py-4 font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                'Complete Registration 🎉'
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}