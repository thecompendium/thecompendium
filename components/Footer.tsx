
import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, isAdmin }) => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-6 serif-font">The Compendium</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            A news and publication society empowering students to showcase their talent in writing, designing, photography, marketing, and social media management while gaining professional experience.
          </p>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/the-compendium-iare-987b35212/" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/thecompendium.iare" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><button onClick={() => onNavigate(Page.Home)} className="hover:text-white transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate(Page.About)} className="hover:text-white transition-colors">About Us</button></li>
            <li><button onClick={() => onNavigate(Page.News)} className="hover:text-white transition-colors">Publications</button></li>
            <li><button onClick={() => onNavigate(Page.Events)} className="hover:text-white transition-colors">Events</button></li>
            <li><button onClick={() => onNavigate(Page.Contact)} className="hover:text-white transition-colors">Contact</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Publications</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><button onClick={() => onNavigate(Page.News)} className="hover:text-white transition-colors">Annual Magazine</button></li>
            <li><button onClick={() => onNavigate(Page.News)} className="hover:text-white transition-colors">College News</button></li>
            <li><button onClick={() => onNavigate(Page.News)} className="hover:text-white transition-colors">Articles</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Contact Us</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="break-all">Email: <br/><span className="text-white">thecompendiumiare@gmail.com</span></li>
            <li>LinkedIn: <span className="text-white">@the-compendium-iare</span></li>
            <li>Instagram: <span className="text-white">@thecompendium.iare</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 border-t border-white/5 pt-10">
        <p>© 2025 The Compendium. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => onNavigate(Page.AdminLogin)}
            className="hover:text-white"
          >
            Admin Login
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
