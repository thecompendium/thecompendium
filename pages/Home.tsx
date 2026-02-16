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

  if (isLoading) return null;

  return (
    <div className="pt-24 bg-[var(--primary-bg)] transition-colors">
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
          {/* Featured Publications */}
          <section className="py-28 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="text-left">
                  <span className="text-black/80 text-[13px] font-black uppercase tracking-[0.4em] mb-4 block">Selected Works</span>
                  <h2 className="text-h2 text-black font-bold">Featured Publications</h2>
                </div>
                <button onClick={() => onNavigate(Page.News)} className="text-black hover:bg-black/10 px-4 py-2 rounded-lg flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-all border border-black/10">
                  Browse Full Catalog <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {publications.length === 0 ? (
                  <div className="col-span-full py-24 text-center text-black/60 border border-dashed border-black/30 rounded-[2rem] bg-white/30 backdrop-blur-sm">
                    <p className="text-[16px] font-bold uppercase tracking-widest">Awaiting new publications...</p>
                  </div>
                ) : (
                  publications.slice(0, 4).map((pub) => (
                    <div key={pub.id} className="group glow-card rounded-[1.5rem] overflow-hidden flex flex-col h-full text-left shadow-2xl">
                      <div className="h-48 overflow-hidden relative">
                        <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded uppercase tracking-widest shadow-xl">
                          {pub.category}
                        </span>
                      </div>
                      <div className="p-6 flex-grow flex flex-col bg-[#1a1a1a]">
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-3">{pub.author} • {pub.date}</p>
                        <h3 className="text-lg font-bold serif-font mb-3 leading-tight text-white group-hover:text-yellow-400 transition-colors line-clamp-2 h-[3rem]">{pub.title}</h3>
                        <p className="text-sm text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed">"{pub.summary}"</p>
                        <button onClick={() => onNavigate(Page.News)} className="text-[11px] font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-widest transition-colors w-fit flex items-center gap-2">READ FULL <span className="text-base">→</span></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="py-28 px-6 border-t border-black/10">
            <div className="max-w-7xl mx-auto text-left">
              <div className="mb-16">
                <span className="inline-block px-4 py-1 bg-black text-white text-[11px] font-black uppercase rounded-full mb-6">
                  Mark Your Calendar
                </span>
                <h2 className="text-h2 serif-font mb-4 text-black">Upcoming Events</h2>
                <p className="text-lg text-black/70 font-medium max-w-2xl leading-relaxed">
                  Join us for workshops, launches, and special events to enhance your writing and publishing skills.
                </p>
              </div>

              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/30 rounded-3xl border border-black/10">
                  <div className="mb-8 p-6 bg-white/50 rounded-3xl border border-white/40">
                    <svg className="w-16 h-16 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-black">No Upcoming Events</h3>
                  <p className="text-black/60 mb-10 max-w-md text-base text-center">Check back soon for new events and workshops!</p>
                  <button onClick={() => onNavigate(Page.Events)} className="px-10 py-4 bg-black text-white font-bold rounded-xl transition-all flex items-center gap-3 uppercase tracking-widest text-xs">View All Events ↗</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {events.slice(0, 4).map((event) => (
                      <div key={event.id} className="group glow-card rounded-[1.5rem] overflow-hidden flex flex-col h-full text-left shadow-2xl">
                        <div className="h-48 overflow-hidden relative">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded uppercase tracking-widest shadow-xl">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col bg-[#1a1a1a]">
                          <h3 className="text-lg font-bold serif-font mb-3 leading-tight text-white group-hover:text-yellow-400 transition-colors line-clamp-2 h-[3rem]">{event.title}</h3>
                          <div className="flex items-center gap-2 text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-6 line-clamp-2 leading-relaxed flex-grow italic">"{event.description}"</p>
                          <button onClick={() => onNavigate(Page.Events)} className="text-[11px] font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-widest transition-colors w-fit flex items-center gap-2">DETAILS <span className="text-base">→</span></button>
                        </div>
                      </div>
                  ))}
                  <div className="col-span-full flex justify-center mt-12">
                      <button onClick={() => onNavigate(Page.Events)} className="text-sm font-black text-black/70 hover:text-black uppercase tracking-widest flex items-center gap-3 border-b-2 border-black/10 pb-1">View All Events <span>→</span></button>
                  </div>
                </div>
              )}
            </div>
          </section>
          
          {/* Achievements Showcase Section */}
          <section className="py-28 px-6 border-t border-black/10">
            <div className="max-w-7xl mx-auto text-left">
              <div className="mb-16">
                <span className="inline-block px-4 py-1 bg-black text-white text-[11px] font-black uppercase rounded-full mb-6">Celebrating Excellence</span>
                <h2 className="text-h2 text-black">Student Talent & Achievements</h2>
                <p className="text-lg text-black/70 font-medium max-w-2xl leading-relaxed">Showcasing the creativity and accomplishments of our students across academic and creative disciplines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {achievements.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-black/20 rounded-3xl text-black/60 uppercase text-sm font-black tracking-widest bg-white/30">Awaiting new milestones...</div>
                ) : (
                  achievements.slice(0, 4).map((ach) => (
                    <div key={ach.id} className="group glow-card rounded-[1.5rem] overflow-hidden flex flex-col h-full text-left shadow-2xl">
                      <div className="h-52 overflow-hidden relative">
                        <img src={ach.image_url} alt={ach.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <span className="absolute bottom-4 left-4 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded uppercase tracking-widest shadow-xl">
                          {ach.category}
                        </span>
                      </div>
                      <div className="p-6 flex-grow flex flex-col bg-[#1a1a1a]">
                        <h3 className="text-xl font-bold serif-font text-white mb-1 group-hover:text-yellow-400 transition-colors line-clamp-1">{ach.name}</h3>
                        <p className="text-[10px] text-yellow-400 font-black uppercase tracking-widest mb-4">{ach.roll_number} • {ach.department}</p>
                        <p className="text-sm text-gray-300 leading-relaxed mb-6 line-clamp-3 flex-grow italic">"{ach.description}"</p>
                        <button onClick={() => onNavigate(Page.Achievements)} className="text-[11px] font-black text-yellow-400 hover:text-yellow-300 uppercase tracking-widest transition-all w-fit flex items-center gap-2">VIEW STORY <span className="text-base">→</span></button>
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
              <p className="text-lg text-black/70 mb-20 font-medium max-w-2xl mx-auto leading-relaxed">A snapshot of our organization and impact within the university ecosystem.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* PUB COUNT CARD */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center aspect-[1.3/1] transition-all hover:bg-black group shadow-2xl">
                  <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <span className="text-4xl font-bold text-white mb-3">{stats.total}</span>
                  <p className="text-gray-400 text-[12px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Publications</p>
                </div>

                {/* ARTICLES CARD */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center aspect-[1.3/1] transition-all hover:bg-black group shadow-2xl">
                  <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-4xl font-bold text-white mb-3">{stats.articles}</span>
                  <p className="text-gray-400 text-[12px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Articles</p>
                </div>

                {/* NEWS EDITIONS CARD */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center aspect-[1.3/1] transition-all hover:bg-black group shadow-2xl">
                  <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-4xl font-bold text-white mb-3">{stats.editions}</span>
                  <p className="text-gray-400 text-[12px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Editions</p>
                </div>

                {/* MEMBERS CARD */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center aspect-[1.3/1] transition-all hover:bg-black group shadow-2xl">
                  <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  {isAdmin ? (
                    <input className="bg-transparent text-4xl font-bold text-white text-center w-full focus:outline-none border-b border-white/10 mb-2" value={membersCount} onChange={e => { setMembersCount(e.target.value); setHasUnsavedChanges(true); }} />
                  ) : (
                    <span className="text-4xl font-bold text-white mb-3">{membersCount}</span>
                  )}
                  <p className="text-gray-400 text-[12px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">Active members</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recruitment Section */}
          <section className="py-28 px-6 border-t border-black/10">
            <div className="max-w-6xl mx-auto">
              <div className="bg-[#111111] rounded-[2.5rem] p-12 md:p-20 border border-white/5 shadow-3xl text-left backdrop-blur-md">
                <h2 className="text-5xl font-bold serif-font text-white mb-10">Join Our Team</h2>
                <p className="text-xl text-gray-300 font-light mb-14 max-w-4xl leading-relaxed">Interested in writing, editing, design, or photography? Become part of our publication team and gain valuable skills while showcasing your work to the entire college.</p>
                <div className="space-y-6">
                  {isAdmin ? (
                    <div className="p-10 bg-black/40 rounded-3xl border border-white/10 space-y-8 max-w-2xl">
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Recruitment Controls (Admin Only)</p>
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-white/80">Enable Apply Button:</label>
                        <button onClick={() => { setJoinEnabled(!joinEnabled); setHasUnsavedChanges(true); }} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${joinEnabled ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{joinEnabled ? 'ENABLED' : 'DISABLED'}</button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Google Form Link</label>
                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none text-base" placeholder="https://docs.google.com/forms/..." value={joinLink} onChange={(e) => { setJoinLink(e.target.value); setHasUnsavedChanges(true); }} />
                      </div>
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
                <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-yellow-400 animate-pulse' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'}`}></div>
                <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white/90">{hasUnsavedChanges ? 'Changes Pending' : 'Home Synced'}</p>
             </div>
             <button disabled={!hasUnsavedChanges || isSyncing} onClick={handleSync} className={`px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${!hasUnsavedChanges ? 'bg-white/10 text-gray-400' : 'bg-yellow-400 text-black shadow-xl hover:scale-105 active:scale-95'}`}>{isSyncing ? 'Syncing...' : 'Sync to Cloud'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;