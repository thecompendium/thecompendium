import React, { useState } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isAdmin, onLogout, isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: Page.Home },
    { label: 'News & Articles', value: Page.News },
    { label: 'Events', value: Page.Events },
    { label: 'Achievements', value: Page.Achievements },
    { label: 'About', value: Page.About },
    { label: 'Contact', value: Page.Contact },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#001bb8]/80 backdrop-blur-md border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(Page.Home)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <img 
                  src="https://ekrrilidqrjbddapdfkc.supabase.co/storage/v1/object/public/the_compendium_files/navbar/file.png" 
                  alt="TC Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/compendium-logo/100/100';
                  }}
                />
              </div>
              <span className="text-xl font-bold serif-font text-white tracking-tight">The Compendium</span>
              {isAdmin && <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-[9px] font-black rounded uppercase">ADMIN</span>}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-[15px] font-semibold transition-colors hover:text-yellow-400 ${
                  currentPage === item.value ? 'text-yellow-400' : 'text-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-200 hover:text-yellow-400 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {isAdmin ? (
                 <button onClick={onLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white text-[11px] font-black rounded-xl transition-all">LOGOUT</button>
              ) : (
                <button onClick={() => onNavigate(Page.AdminLogin)} title="Admin Portal" className="text-gray-200 hover:text-yellow-400 transition-colors p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
             <button onClick={toggleTheme} className="text-gray-300 p-1.5">
                {isDarkMode ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
             </button>
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 p-1.5">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
             </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#001bb8] border-b border-white/5 pb-6 px-6 space-y-2">
          {navItems.map((item) => (
            <button key={item.value} onClick={() => { onNavigate(item.value); setIsOpen(false); }} className={`block w-full text-left py-3 px-4 text-base font-medium rounded-xl ${currentPage === item.value ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'}`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;