
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-float">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
          <Link 
            to="/contact" 
            className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundContent;
