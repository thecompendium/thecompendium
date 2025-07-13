import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Gamepad2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* The Compendium Section */}
        <div className="col-span-1 flex flex-col items-start">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold mr-2">The Compendium</h2>
            <Link to="/games" className="ml-2 text-black hover:text-yellow-300 transition-colors" title="Games">
              <Gamepad2 className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            A news and publication society empowering students to showcase their talent in writing, designing, photography, marketing, and social media management while gaining professional experience.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://www.linkedin.com/in/the-compendium-iare-987b35212/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="https://www.instagram.com/thecompendium.iare/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/publications" className="text-gray-400 hover:text-white transition-colors">Publications</Link></li>
            <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Publications Section */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Publications</h3>
          <ul className="space-y-2">
            <li><Link to="/publications/annual-magazine" className="text-gray-400 hover:text-white transition-colors">Annual Magazine</Link></li>
            <li><Link to="/publications/college-news" className="text-gray-400 hover:text-white transition-colors">College News</Link></li>
            <li><Link to="/publications/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400 mb-4">Email: thecompendiumiare@gmail.com</p>
          <p className="text-gray-400 mb-4">LinkedIn: @the-compendium-iare</p>
          <p className="text-gray-400">Instagram: @thecompendium.iare</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 The Compendium. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
      {/* Admin Link */}
      <div className="w-full flex justify-center mt-4">
        <Link to="/admin-login" className="text-xs text-gray-400 hover:text-white underline">Admin</Link>
      </div>
    </footer>
  );
};

export default Footer;