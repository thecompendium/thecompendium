
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedPublications from '@/components/home/FeaturedPublications';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import Achievements from '@/components/home/Achievements';
import About from '@/components/home/About';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Light yellow background from FeaturedPublications to Footer in light mode */}
        <div className="bg-yellow-50 dark:bg-transparent w-full">
        <FeaturedPublications />
        <UpcomingEvents />
        <Achievements />
        <About />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
