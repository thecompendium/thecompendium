import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    document.documentElement.classList.add('transition-colors');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    setTimeout(() => {
      document.documentElement.classList.remove('transition-colors');
    }, 300);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'News & Articles', path: '/publications' },
    { label: 'Events', path: '/events' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12',
        isScrolled
          ? isHomePage 
            ? 'bg-white dark:bg-theme-blue shadow-sm border-b border-gray-200 dark:border-gray-800'
            : 'bg-theme-blue dark:bg-theme-blue shadow-sm border-b border-gray-200 dark:border-gray-800'
          : isHomePage
            ? 'bg-white dark:bg-theme-blue'
            : 'bg-theme-blue dark:bg-theme-blue'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
          onClick={() => {
            setIsMenuOpen(false);
            document.body.style.overflow = 'auto';
          }}
        >
          <BookOpen className={cn(
            "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
            isHomePage ? "text-theme-blue dark:text-white" : "text-white dark:text-white"
          )} />
          <span className={cn(
            "font-serif text-2xl font-bold tracking-tighter transition-all duration-300",
            isHomePage ? "text-theme-blue dark:text-white" : "text-white dark:text-white"
          )}>
            The Compendium
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "nav-link text-sm font-medium transition-all duration-300 hover:text-primary relative py-2",
                isHomePage ? "text-theme-blue dark:text-white" : "text-white dark:text-white",
                // Only apply special style to non-Home active links in light mode
                location.pathname === link.path && !isDarkMode && link.path !== '/' && "text-theme-yellow font-extrabold text-lg scale-110",
                location.pathname === link.path && isDarkMode && "text-primary nav-link-active"
              )}
            >
              {link.label}
              {/* Smooth underline animation for active link in light mode */}
              <span
                className={cn(
                  "absolute left-0 -bottom-1 h-0.5 w-full bg-theme-yellow rounded transition-all duration-300 origin-left",
                  location.pathname === link.path && !isDarkMode ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                )}
                aria-hidden="true"
              />
            </Link>
          ))}
          
          <button
            onClick={toggleDarkMode}
            className={cn(
              "p-2 rounded-full transition-all duration-300 hover:scale-110",
              isHomePage 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-theme-blue-dark dark:hover:bg-gray-800"
            )}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-white animate-fade-in" />
            ) : (
              <Moon className={cn(
                "h-5 w-5 animate-fade-in",
                isHomePage ? "text-theme-blue" : "text-white"
              )} />
            )}
          </button>
        </nav>

        <div className="flex items-center md:hidden">
          <button
            onClick={toggleDarkMode}
            className={cn(
              "p-2 mr-2 rounded-full transition-colors",
              isHomePage 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-theme-blue-dark dark:hover:bg-gray-800"
            )}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-white animate-fade-in" />
            ) : (
              <Moon className={cn(
                "h-5 w-5 animate-fade-in",
                isHomePage ? "text-theme-blue" : "text-white"
              )} />
            )}
          </button>
          
          <button
            onClick={toggleMenu}
            className={cn(
              "p-2 rounded-full transition-colors",
              isHomePage 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-theme-blue-dark dark:hover:bg-gray-800"
            )}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={cn(
                "h-6 w-6 animate-fade-in",
                isHomePage ? "text-theme-blue dark:text-white" : "text-white dark:text-white"
              )} />
            ) : (
              <Menu className={cn(
                "h-6 w-6 animate-fade-in",
                isHomePage ? "text-theme-blue dark:text-white" : "text-white dark:text-white"
              )} />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 pt-20 px-6 transform transition-all duration-300 ease-in-out',
          isHomePage ? 'bg-white dark:bg-theme-blue' : 'bg-theme-blue dark:bg-theme-blue',
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <nav className="flex flex-col space-y-6 py-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              style={{ 
                transitionDelay: `${index * 50}ms` 
              }}
              className={cn(
                "text-lg font-medium py-2 border-b transition-all duration-300",
                isHomePage 
                  ? "border-gray-100 dark:border-gray-800 text-theme-blue dark:text-white" 
                  : "border-white/20 dark:border-gray-800 text-white dark:text-white",
                location.pathname === link.path ? "text-primary" : "hover:text-primary",
                isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              )}
              onClick={toggleMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Custom style for nav-link underline animation (for extra safety) */}
      <style>{`
        @media (prefers-color-scheme: light) {
          .nav-link-active span {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
