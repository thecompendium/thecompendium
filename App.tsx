import React, { useState, useEffect } from 'react';
import { Page, Publication, Achievement, TeamMember, Event } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import Achievements from './pages/Achievements';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Games from './pages/Games';
import AdminLogin from './pages/AdminLogin';
import { api } from './services/supabase';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('compendium_admin') === 'true');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('compendium_theme') !== 'light');
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [publications, setPublications] = useState<Publication[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Theme Sync
  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('compendium_theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('compendium_theme', 'dark');
    }
  }, [isDarkMode]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        api.publications.getAll(),
        api.achievements.getAll(),
        api.team.getAll(),
        api.events.getAll()
      ]);

      if (results[0].status === 'fulfilled') setPublications(results[0].value as Publication[]);
      if (results[1].status === 'fulfilled') setAchievements(results[1].value as Achievement[]);
      if (results[2].status === 'fulfilled') setTeam(results[2].value as TeamMember[]);
      if (results[3].status === 'fulfilled') setEvents(results[3].value as Event[]);

    } catch (error) {
      console.error("Critical Supabase Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (Object.values(Page).includes(hash as Page)) {
        setCurrentPage(hash as Page);
      } else {
        setCurrentPage(Page.Home);
      }
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('compendium_admin', 'true');
    window.location.hash = Page.Home;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('compendium_admin');
    window.location.hash = Page.Home;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#000b1a]">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-gray-400 font-bold tracking-[0.3em] text-[10px] uppercase">Connecting to Database...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home onNavigate={(p) => window.location.hash = p} publications={publications} achievements={achievements} events={events} isAdmin={isAdmin} setPublications={setPublications} setAchievements={setAchievements} />;
      case Page.About:
        return <About team={team} publications={publications} isAdmin={isAdmin} setTeam={setTeam} />;
      case Page.News:
        return <News publications={publications} isAdmin={isAdmin} setPublications={setPublications} />;
      case Page.Events:
        return <Events events={events} isAdmin={isAdmin} setEvents={setEvents} />;
      case Page.Achievements:
        return <Achievements achievements={achievements} isAdmin={isAdmin} setAchievements={setAchievements} />;
      case Page.Contact:
        return <Contact />;
      case Page.Games:
        return <Games />;
      case Page.AdminLogin:
        return <AdminLogin onLogin={handleLogin} />;
      default:
        return <Home onNavigate={(p) => window.location.hash = p} publications={publications} achievements={achievements} events={events} isAdmin={isAdmin} setPublications={setPublications} setAchievements={setAchievements} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={(p) => window.location.hash = p} 
        isAdmin={isAdmin} 
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
      <main className="flex-grow">{renderPage()}</main>
      <Footer onNavigate={(p) => window.location.hash = p} isAdmin={isAdmin} />
    </div>
  );
};

export default App;