
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NotFoundContent from '@/components/NotFoundContent';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <NotFoundContent />
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
