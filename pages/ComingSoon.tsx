import React from 'react';

interface ComingSoonProps {
  onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--primary-bg)] px-6 text-center transition-colors">
      <div className="w-24 h-24 bg-[var(--accent-color)]/10 rounded-3xl flex items-center justify-center mb-8 border border-[var(--accent-color)]/20 animate-pulse">
        <svg className="w-12 h-12 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <h1 className="text-6xl md:text-8xl font-bold serif-font text-[var(--text-main)] mb-6 uppercase tracking-tighter">Coming Soon</h1>
      <p className="text-xl text-[var(--text-muted)] font-light max-w-lg mb-12 leading-relaxed">
        Our team is working hard to bring you comprehensive resources for your placement preparation journey. Stay tuned for updates!
      </p>
      <button 
        onClick={onBack}
        className="px-12 py-5 bg-[var(--accent-color)] text-black font-black rounded-2xl uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-3xl hover:scale-105 active:scale-95"
      >
        Return to Society Home
      </button>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-color)]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
    </div>
  );
};

export default ComingSoon;