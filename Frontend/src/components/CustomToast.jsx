import { useState } from 'react';

const CustomToast = ({ message, type = 'success', onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const icons = {
    success: (
      <div className="relative">
        <svg className="w-6 h-6 text-white animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
      </div>
    ),
    error: (
      <svg className="w-6 h-6 text-white animate-shake" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6 text-white animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    loading: (
      <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )
  };

  const styles = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-rose-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-cyan-500',
    loading: 'from-purple-500 to-pink-500'
  };

  return (
    <div 
      className={`flex items-center gap-3 bg-white rounded-xl shadow-2xl p-4 min-w-[320px] max-w-md border border-gray-100 ${
        isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${styles[type]} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
        {icons[type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 font-semibold text-sm leading-tight">{message}</p>
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${styles[type]} animate-progress rounded-bl-xl`}></div>
    </div>
  );
};

export default CustomToast;