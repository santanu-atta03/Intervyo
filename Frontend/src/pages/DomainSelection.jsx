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
    { id: 'frontend', name: 'Frontend', icon: '🎨', color: 'from-pink-500 to-rose-500' },
    { id: 'backend', name: 'Backend', icon: '⚙️', color: 'from-blue-500 to-cyan-500' },
    { id: 'fullstack', name: 'Full Stack', icon: '🚀', color: 'from-purple-500 to-pink-500' },
    { id: 'data-science', name: 'Data Science', icon: '📊', color: 'from-green-500 to-emerald-500' },
    { id: 'devops', name: 'DevOps', icon: '🔧', color: 'from-orange-500 to-amber-500' },
    { id: 'mobile', name: 'Mobile', icon: '📱', color: 'from-indigo-500 to-blue-500' }
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

    // Get stored OTP from signupData
    const { name, email, password, otp, profilePicture } = signupData;
    
    const profile = {
      domain: formData.domain,
      experience: parseInt(formData.experience) || 0
    };

    // Call signup with all required data
    dispatch(signup(name, email, password, otp,profilePicture, profile, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-in-up {
          animation: slideInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Step 3 of 3
            </span>
            <span className="text-sm text-gray-500">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        <div className="slide-in-up">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Choose Your Domain
            </h1>
            <p className="text-gray-600">What do you want to master?</p>
          </div>

          {errors.domain && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {errors.domain}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => {
                  setFormData({ ...formData, domain: domain.id });
                  setErrors({ ...errors, domain: '' });
                }}
                className={`p-4 rounded-xl border-2 transition transform hover:scale-105 ${
                  formData.domain === domain.id
                    ? `bg-gradient-to-br ${domain.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">{domain.icon}</div>
                <div className="font-semibold text-sm">{domain.name}</div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Years of Experience (Optional)
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select experience</option>
              <option value="0">Fresher</option>
              <option value="1">1-2 years</option>
              <option value="3">3-5 years</option>
              <option value="6">5+ years</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Complete Registration 🎉'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}