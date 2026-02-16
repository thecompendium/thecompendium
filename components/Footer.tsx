import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, isAdmin }) => {
  return (
    <footer className="bg-[var(--footer-bg)] text-white pt-24 pb-12 transition-colors border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-2xl font-bold serif-font text-white">The Compendium</h3>
            <button 
              onClick={() => onNavigate(Page.Games)}
              className="text-yellow-400 hover:text-white transition-all transform hover:scale-110"
              title="Games"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </button>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            The official news and publication society of IARE, dedicated to amplifying student voices and documenting campus excellence.
          </p>
          <div className="flex gap-5">
            <a href="https://www.linkedin.com/in/the-compendium-iare-987b35212/" className="text-white/60 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/thecompendium.iare" className="text-white/60 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-8 text-[var(--accent-color)] uppercase tracking-widest text-[11px]">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/70 font-medium">
            <li><button onClick={() => onNavigate(Page.Home)} className="hover:text-white transition-colors">Home Page</button></li>
            <li><button onClick={() => onNavigate(Page.About)} className="hover:text-white transition-colors">About Society</button></li>
            <li><button onClick={() => onNavigate(Page.News)} className="hover:text-white transition-colors">Publications</button></li>
            <li><button onClick={() => onNavigate(Page.Events)} className="hover:text-white transition-colors">Society Events</button></li>
            <li><button onClick={() => onNavigate(Page.Games)} className="hover:text-white transition-colors">Games Hub</button></li>
            <li><button onClick={() => onNavigate(Page.Contact)} className="hover:text-white transition-colors">Contact Us</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-8 text-[var(--accent-color)] uppercase tracking-widest text-[11px]">Placements</h4>
          <ul className="space-y-4 text-sm text-white/70 font-medium">
            <li><button onClick={() => onNavigate(Page.ComingSoon)} className="hover:text-white transition-colors">Communication Round</button></li>
            <li><button onClick={() => onNavigate(Page.ComingSoon)} className="hover:text-white transition-colors">Aptitude Round</button></li>
            <li><button onClick={() => onNavigate(Page.ComingSoon)} className="hover:text-white transition-colors">Reasoning Round</button></li>
            <li><button onClick={() => onNavigate(Page.ComingSoon)} className="hover:text-white transition-colors">Gaming Round</button></li>
            <li><button onClick={() => onNavigate(Page.ComingSoon)} className="hover:text-white transition-colors">Coding Round</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-8 text-[var(--accent-color)] uppercase tracking-widest text-[11px]">Submissions</h4>
          <ul className="space-y-4 text-sm text-white/70 font-medium">
            <li><button onClick={() => onNavigate(Page.Achievements)} className="hover:text-white transition-colors">Achievement Portal</button></li>
            <li><button onClick={() => onNavigate(Page.News)} className="hover:text-white transition-colors">Article Submission</button></li>
            <li><button onClick={() => onNavigate(Page.Contact)} className="hover:text-white transition-colors">Guest Column</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-8 text-[var(--accent-color)] uppercase tracking-widest text-[11px]">Get Notified</h4>
          <ul className="space-y-4 text-sm text-white/70 font-medium">
            <li className="break-all">Email: <br/><span className="text-white font-bold">thecompendiumiare@gmail.com</span></li>
            <li className="italic opacity-60">Curating campus narratives since 2019.</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/40 font-black uppercase tracking-[0.2em] gap-6 border-t border-white/5 pt-12">
        <p>© 2025 The Compendium | News & Publication Society</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
        {!isAdmin && (
          <button onClick={() => onNavigate(Page.AdminLogin)} className="hover:text-yellow-400 transition-colors">Admin Portal Access</button>
        )}
      </div>
    </footer>
  );
};

export default Footer;