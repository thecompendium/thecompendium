import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const opacity = Math.max(1 - scrollY / 700, 0);
        const transform = `translateY(${scrollY * 0.4}px)`;
        
        heroRef.current.style.opacity = opacity.toString();
        heroRef.current.style.transform = transform;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background aesthetic elements with animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-secondary/5 blur-2xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-secondary/5 blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero content */}
      <div 
        ref={heroRef}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 min-h-screen flex flex-col justify-center"
      >
        <div className="animate-reveal">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-medium bg-secondary rounded-full text-secondary-foreground">
            The Digital Publication Society
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight md:leading-tight mb-6 max-w-5xl">
            Where Student Voices and Achievements Find Their Expression
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed md:leading-relaxed animate-fade-in-delayed">
            The Compendium is a platform for students to showcase their writing talents, research papers, and creative works while developing professional publication skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Link
              to="/publications"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-300 hover:translate-x-1 font-medium text-base group"
            >
              Explore Publications
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors duration-300 font-medium text-base"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
