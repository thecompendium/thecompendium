import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, Publication, Achievement, Event } from '../types';
import { api } from '../services/supabase';

interface HomeProps {
  onNavigate: (page: Page) => void;
  publications: Publication[];
  achievements: Achievement[];
  events: Event[];
  isAdmin: boolean;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
}

const Home: React.FC<HomeProps> = ({ onNavigate, publications, achievements, events, isAdmin }) => {
  const [heroTitle, setHeroTitle] = useState("Where Student Voices and Achievements Find Their Expression");
  const [heroSub, setHeroSub] = useState("The Compendium is the official news and publication society, providing a curated platform for students to showcase intellectual and creative milestones.");
  
  // Recruitment Section State
  const [joinLink, setJoinLink] = useState("");
  const [joinEnabled, setJoinEnabled] = useState(false);
  const [joinNotice, setJoinNotice] = useState("Applications are currently closed. Next application period opens in April.");
  
  // Stats State
  const [membersCount, setMembersCount] = useState("50+");

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Derived Date Logic
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter for ONLY Upcoming Events for the Home section
  const upcomingEvents = useMemo(() => {
    return events
      .filter(ev => ev.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [events, today]);

  // Calculated Stats
  const stats = useMemo(() => {
    return {
      total: publications.length,
      articles: publications.filter(p => p.category === 'Article').length,
      editions: publications.filter(p => p.category === 'College News' || p.category === 'Annual Magazine').length
    };
  }, [publications]);

  const fetchHomeConfig = useCallback(async () => {
    try {
      const [title, sub, link, enabled, notice, members] = await Promise.all([
        api.config.get('home_hero_title'),
        api.config.get('home_hero_sub'),
        api.config.get('join_team_link'),
        api.config.get('join_team_enabled'),
        api.config.get('join_team_notice'),
        api.config.get('stats_members')
      ]);
      if (title) setHeroTitle(title);
      if (sub) setHeroSub(sub);
      if (link) setJoinLink(link);
      if (enabled) setJoinEnabled(enabled === 'true');
      if (notice) setJoinNotice(notice);
      if (members) setMembersCount(members);
    } catch (e) {
      console.warn("Using default config text");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHomeConfig(); }, [fetchHomeConfig]);

  const handleSync = async () => {
    if (isSyncing || !hasUnsavedChanges) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        api.config.set('home_hero_title', heroTitle),
        api.config.set('home_hero_sub', heroSub),
        api.config.set('join_team_link', joinLink),
        api.config.set('join_team_enabled', joinEnabled.toString()),
        api.config.set('join_team_notice', joinNotice),
        api.config.set('stats_members', membersCount)
      ]);
      setHasUnsavedChanges(false);
      alert("✅ HOME PAGE SYNCED SUCCESSFULLY!");
    } catch (err: any) {
      alert("❌ SYNC FAILED: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  if (isLoading) return null;

  return (
    <div className="pt-24 bg-[var(--primary-bg)] transition-colors text-left">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[var(--primary-bg)] to-[var(--secondary-bg)]">
        <div className="relative z-10 max-w-6xl mx-auto text-center py-20">
          <span className="inline-block px-5 py-1.5 rounded-full bg-yellow-400/10 text-yellow-500 text-[13px] font-black tracking-widest uppercase mb-10 animate-fadeInUp border border-yellow-400/20">
            The Digital Publication Society of IARE
          </span>
          
          <div className="relative group">
            {isAdmin ? (
              <textarea 
                className="w-full bg-transparent text-h1 mb-10 text-center focus:outline-none border-b border-[var(--border-color)] resize-none min-h-[220px] text-[var(--text-main)]"
                value={heroTitle}
                onChange={(e) => { setHeroTitle(e.target.value); setHasUnsavedChanges(true); }}
              />
            ) : (
              <h1 className="text-h1 mb-10 leading-tight animate-fadeInUp whitespace-pre-wrap text-[var(--text-main)]">
                {heroTitle}
              </h1>
            )}
          </div>
          
          <div className="relative group mb-14">
            {isAdmin ? (
              <textarea 
                className="w-full bg-transparent text-xl text-[var(--text-muted)] max-w-3xl mx-auto text-center focus:outline-none border-b border-[var(--border-color)] resize-none"
                value={heroSub}
                onChange={(e) => { setHeroSub(e.target.value); setHasUnsavedChanges(true); }}
              />
            ) : (
              <p className="text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed animate-fadeInUp font-light">
                {heroSub}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp">
            <button 
              onClick={() => onNavigate(Page.News)}
              className="px-10 py-5 bg-[#001529] hover:bg-[#001f3f] text-white border border-white/10 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-2xl"
            >
              Explore Archives <span className="text-yellow-400">→</span>
            </button>
            <button 
              onClick={() => onNavigate(Page.About)}
              className="px-10 py-5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-black transition-all transform hover:scale-105 shadow-2xl uppercase tracking-widest text-[13px]"
            >
              The Society
            </button>
          </div>
        </div>
      </section>

      {/* DOODLE BACKGROUND WRAPPER */}
      <div className="relative overflow-hidden bg-[#ffc90c]">
        {/* DOODLE PATTERN LAYER */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-multiply grayscale"
          style={{ 
            backgroundImage: `url('https://ekrrilidqrjbddapdfkc.supabase.co/storage/v1/object/public/the_compendium_files/site_assets/Untitled%20design.png')`,
            backgroundSize: '1000px',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        <div className="relative z-10">
          {/* Upcoming Events - Newest 4 cards */}
          <section className="py-28 px-6 border-b border-black/10">
            <div className="max-w-7xl mx-auto text-left">
              <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="text-left">
                  <span className="inline-block px-4 py-1 bg-black text-white text-[11px] font-black uppercase rounded-full mb-6">
                    Mark Your Calendar
                  </span>
                  <h2 className="text-h2 serif-font mb-4 text-black">Upcoming Events</h2>
                  <p className="text-lg text-black/70 font-medium max-w-2xl leading-relaxed">
                    The latest workshops, conferences, and competitions organized by the society.
                  </p>
                </div>
                <button onClick={() => onNavigate(Page.Events)} className="text-black hover:bg-black/10 px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all border border-black/10 whitespace-nowrap">
                  View All Events <span>→</span>
                </button>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/30 rounded-3xl border border-dashed border-black/20">
                   <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-6">
                     <svg className="w-8 h-8 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                   </div>
                   <p className="text-black/60 font-bold uppercase tracking-widest text-xs">No Events Scheduled Currently</p>
                   <p className="text-black/40 text-sm mt-2">Check back later for new updates!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn">
                  {upcomingEvents.map((event) => (
                      <div key={event.id} className="group relative bg-[#050a18] rounded-xl overflow-hidden flex flex-col h-full shadow-2xl transition-all text-left">
                        <div className="h-48 overflow-hidden relative">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl ${event.date === today ? 'bg-green-500 text-white animate-pulse' : 'bg-[#facc15] text-black'}`}>
                              {event.date === today ? 'Happening Today' : 'Upcoming'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold serif-font mb-4 leading-tight text-white group-hover:text-yellow-400 transition-colors h-[3rem] line-clamp-2">{event.title}</h3>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-400 text-[12px]">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-[12px]">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-[12px]">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </div>

                          <button onClick={() => onNavigate(Page.Events)} className="text-[13px] font-bold text-white hover:text-yellow-400 transition-all flex items-center gap-2 group/link w-fit">
                            Details & Registration <span className="text-base group-hover/link:translate-x-1 transition-transform">→</span>
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Latest Publications - Newest 4 cards */}
          <section className="py-28 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
                <div className="text-left">
                  <span className="text-black/80 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Editorial Picks</span>
                  <h2 className="text-h2 text-black font-bold">Latest Publications</h2>
                </div>
                <button onClick={() => onNavigate(Page.News)} className="text-black hover:bg-black/10 px-4 py-2 rounded-lg flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all border border-black/10">
                  Full Archives <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {publications.length === 0 ? (
                  <div className="col-span-full py-24 text-center text-black/60 border border-dashed border-black/30 rounded-[2rem] bg-white/30 backdrop-blur-sm">
                    <p className="text-[14px] font-bold uppercase tracking-widest">Awaiting new submissions...</p>
                  </div>
                ) : (
                  publications.slice(0, 4).map((pub) => (
                    <div key={pub.id} className="group bg-[#0d121f] rounded-xl overflow-hidden flex flex-col h-full text-left shadow-2xl transition-all hover:-translate-y-1">
                      <div className="h-44 overflow-hidden relative">
                        <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[#001bb8] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl">
                            {pub.category === 'Article' ? 'Articles' : pub.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold mb-4 leading-tight text-white group-hover:text-yellow-400 transition-colors line-clamp-2 h-[3rem]">{pub.title}</h3>
                        <p className="text-sm text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed opacity-80">"{pub.summary}"</p>
                        <button onClick={() => onNavigate(Page.News)} className="text-[13px] font-bold text-white hover:text-yellow-400 uppercase tracking-widest transition-colors w-fit flex items-center gap-2">READ {pub.category === 'Article' ? 'ARTICLE' : 'EDITION'} <span className="text-base">→</span></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Student Achievements - Newest 4 cards */}
          <section className="py-28 px-6 border-t border-black/10">
            <div className="max-w-7xl mx-auto text-left">
              <div className="mb-16">
                <span className="inline-block px-4 py-1 bg-black text-white text-[11px] font-black uppercase rounded-full mb-6">Celebrating Excellence</span>
                <h2 className="text-h2 text-black font-bold">Student Talent & Achievements</h2>
                <p className="text-lg text-black/70 font-medium max-w-2xl leading-relaxed">Showcasing the creativity and accomplishments of our students.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {achievements.length === 0 ? (
                  <div className="col-span-full py-20 text-center border border-dashed border-black/20 rounded-3xl bg-white/30 font-bold uppercase text-xs tracking-widest">Awaiting milestones...</div>
                ) : (
                  achievements.slice(0, 4).map((ach) => (
                    <div key={ach.id} className="group bg-[#211f1e] rounded-xl overflow-hidden flex flex-col h-full text-left shadow-2xl transition-all hover:-translate-y-1">
                      <div className="h-48 overflow-hidden relative">
                        <img src={ach.image_url} alt={ach.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <span className="absolute bottom-4 left-4 px-2 py-1 bg-yellow-400 text-black text-[9px] font-black rounded uppercase tracking-widest shadow-xl">
                          {ach.category}
                        </span>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors line-clamp-1">{ach.name}</h3>
                        <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-4 opacity-80">{ach.department}</p>
                        <p className="text-sm text-gray-300 leading-relaxed mb-6 line-clamp-3 flex-grow italic">"{ach.description}"</p>
                        <button onClick={() => onNavigate(Page.Achievements)} className="text-[11px] font-black text-white hover:text-yellow-400 uppercase tracking-widest transition-all w-fit flex items-center gap-2 border-b border-white/10 pb-1">VIEW STORY <span className="text-base">→</span></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Key Facts Section */}
          <section className="py-28 px-6 border-t border-black/10">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-5xl font-bold serif-font mb-6 text-black">Key Facts</h2>
              <p className="text-lg text-black/70 mb-20 font-medium max-w-2xl mx-auto leading-relaxed">A snapshot of our organization and impact.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all hover:bg-black group shadow-2xl">
                  <span className="text-4xl font-bold text-white mb-2">{stats.total}</span>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Publications</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all hover:bg-black group shadow-2xl">
                  <span className="text-4xl font-bold text-white mb-2">{stats.articles}</span>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Articles</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all hover:bg-black group shadow-2xl">
                  <span className="text-4xl font-bold text-white mb-2">{stats.editions}</span>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Editions</p>
                </div>
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all hover:bg-black group shadow-2xl">
                  {isAdmin ? (
                    <input className="bg-transparent text-4xl font-bold text-white text-center w-full focus:outline-none border-b border-white/10 mb-2" value={membersCount} onChange={e => { setMembersCount(e.target.value); setHasUnsavedChanges(true); }} />
                  ) : (
                    <span className="text-4xl font-bold text-white mb-2">{membersCount}</span>
                  )}
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Active members</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recruitment Section */}
          <section className="py-28 px-6 border-t border-black/10">
            <div className="max-w-6xl mx-auto">
              <div className="bg-[#111111] rounded-[2.5rem] p-12 md:p-20 border border-white/5 shadow-3xl text-left backdrop-blur-md">
                <h2 className="text-5xl font-bold serif-font text-white mb-10">Join Our Team</h2>
                <p className="text-xl text-gray-300 font-light mb-14 max-w-4xl leading-relaxed">Become part of our publication team and gain professional skills in content strategy, design, and management.</p>
                <div className="space-y-6">
                  {isAdmin ? (
                    <div className="p-8 bg-black/40 rounded-3xl border border-white/10 space-y-6 max-w-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Recruitment Controls</p>
                      <button onClick={() => { setJoinEnabled(!joinEnabled); setHasUnsavedChanges(true); }} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${joinEnabled ? 'bg-green-600' : 'bg-red-600'}`}>{joinEnabled ? 'BUTTON ACTIVE' : 'BUTTON DISABLED'}</button>
                      <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none text-sm" placeholder="Google Form Link" value={joinLink} onChange={(e) => { setJoinLink(e.target.value); setHasUnsavedChanges(true); }} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <button disabled={!joinEnabled} onClick={() => joinEnabled && window.open(joinLink, '_blank')} className={`px-14 py-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${joinEnabled ? 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-2xl scale-105' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>Apply to Join</button>
                      <p className="text-base font-medium text-gray-400 italic">{joinNotice}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Admin Sync Bar */}
      {isAdmin && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] w-full max-xl px-8 pointer-events-none">
          <div className="bg-black border border-white/10 p-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center justify-between gap-8 pointer-events-auto backdrop-blur-3xl">
             <div className="flex items-center gap-4 pl-4">
                <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">Sync Pending</p>
             </div>
             <button disabled={!hasUnsavedChanges || isSyncing} onClick={handleSync} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!hasUnsavedChanges ? 'bg-white/10 text-gray-400' : 'bg-yellow-400 text-black shadow-xl hover:scale-105'}`}>{isSyncing ? 'Syncing...' : 'Sync to Cloud'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;