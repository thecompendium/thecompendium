
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TeamMember, Publication, JourneyYear, JourneyLeader, Page } from '../types';
import { api, storageService } from '../services/supabase';

interface AboutProps {
  team: TeamMember[];
  publications: Publication[];
  isAdmin: boolean;
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const DEFAULT_LEADER = (): JourneyLeader => ({
  id: `l-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: 'NEW LEADER NAME',
  role: 'POSITION',
  image_url: '',
  tagline: 'Short tagline here...',
  reflection: 'Full detailed reflection for the archive goes here.'
});

const DEFAULT_DOMAIN = (): JourneyLeader => ({
  id: `dh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: 'DOMAIN HEAD NAME',
  role: 'DOMAIN NAME',
  image_url: ''
});

const DEFAULT_NEW_YEAR = (year: number): JourneyYear => ({
  year,
  title: "New Milestone Title",
  main_image: "",
  description: "Enter a brief description of the year's impact and achievements here.",
  events: ["Launch Event"],
  new_editions: ["New Magazine"],
  leaders: [DEFAULT_LEADER()],
  domain_heads: [DEFAULT_DOMAIN()],
  gallery: []
});

const INITIAL_JOURNEY_DATA: JourneyYear[] = [
  {
    year: 2024,
    title: "Milestones & Impact",
    main_image: "https://ekrrilidqrjbddapdfkc.supabase.co/storage/v1/object/public/the_compendium_files/journey/1741162153112_WhatsApp_Image_2025-03-05_at_13.34.12_6549a1d4.jpg",
    description: "Commemorating its fifth anniversary, the club celebrated its journey with a vibrant lineup of intellectually and creatively stimulating events.",
    events: ["DESIGN FOR EVERYONE", "QUIZ - BATTLE OF BRAINS"],
    new_editions: ["ARTICLES", "WEBSITE"],
    leaders: [
      { id: 'l1', name: 'K YAGNESH REDDY', role: 'PRESIDENT', image_url: '', tagline: 'Leading the club vision.', reflection: "Leadership is about empathy and passion." }
    ],
    domain_heads: [
      { id: 'dh1', name: 'ABHINAV VIKAS', role: 'PHOTOGRAPHY HEAD', image_url: '' }
    ],
    gallery: []
  }
];

const About: React.FC<AboutProps> = ({ isAdmin, publications }) => {
  const [journeyData, setJourneyData] = useState<JourneyYear[]>([]);
  const [activeYear, setActiveYear] = useState<number>(2024);
  const [showMore, setShowMore] = useState(false);
  const [aboutUsImage, setAboutUsImage] = useState('');
  const [viewMode, setViewMode] = useState<'snapshot' | 'full'>('snapshot');
  
  // Stats Section State (Manual override for members)
  const [manualStats, setManualStats] = useState({
    members: '50+'
  });

  // Dynamic calculations
  const dynamicStats = useMemo(() => {
    return {
      pubs: publications.length.toString(),
      articles: publications.filter(p => p.category === 'Article').length.toString(),
      editions: publications.filter(p => p.category === 'College News' || p.category === 'Annual Magazine').length.toString()
    };
  }, [publications]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAddLeaderModal, setShowAddLeaderModal] = useState(false);
  const [newLeaderForm, setNewLeaderForm] = useState<Partial<JourneyLeader>>({ name: '', role: '', reflection: '', tagline: '' });
  const [newLeaderFile, setNewLeaderFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [fileMap, setFileMap] = useState<Record<string, File>>({});

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const [savedHero, savedJourney, sMembs] = await Promise.all([
        api.config.get('about_us_image_main'),
        api.config.get('journey_data_v2'),
        api.config.get('stats_members')
      ]);
      if (savedHero) setAboutUsImage(savedHero);
      if (savedJourney && savedJourney !== '[]') {
        const sorted = JSON.parse(savedJourney).sort((a: any, b: any) => b.year - a.year);
        setJourneyData(sorted);
        if (sorted.length > 0) setActiveYear(sorted[0].year);
      } else setJourneyData(INITIAL_JOURNEY_DATA);
      
      setManualStats({
        members: sMembs || '50+'
      });
    } catch (e: any) {
      setJourneyData(INITIAL_JOURNEY_DATA);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const currentYearData = useMemo(() => {
    return journeyData.find(y => y.year === activeYear) || journeyData[0] || INITIAL_JOURNEY_DATA[0];
  }, [journeyData, activeYear]);

  // Data Updates
  const handleUpdateYearText = (field: keyof JourneyYear, value: any) => {
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, [field]: value } : y));
    setHasUnsavedChanges(true);
  };

  const handleUpdateLeader = (id: string, field: keyof JourneyLeader, value: string) => {
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, leaders: y.leaders.map(l => l.id === id ? { ...l, [field]: value } : l) } : y));
    setHasUnsavedChanges(true);
  };

  const handleUpdateDomain = (id: string, field: keyof JourneyLeader, value: string) => {
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, domain_heads: (y.domain_heads || []).map(dh => dh.id === id ? { ...dh, [field]: value } : dh) } : y));
    setHasUnsavedChanges(true);
  };

  const handleRemoveLeader = (id: string) => {
    if (!confirm("Remove record?")) return;
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, leaders: y.leaders.filter(l => l.id !== id) } : y));
    setHasUnsavedChanges(true);
  };

  const handleAddNewYear = () => {
    const nextYear = Math.max(...journeyData.map(y => y.year), 2024) + 1;
    setJourneyData(prev => [DEFAULT_NEW_YEAR(nextYear), ...prev]);
    setActiveYear(nextYear);
    setHasUnsavedChanges(true);
  };

  const handleStageImage = (file: File, type: 'about' | 'milestone' | 'leader' | 'domain' | 'gallery_add', id?: string) => {
    const blobUrl = URL.createObjectURL(file);
    setFileMap(prev => ({ ...prev, [blobUrl]: file }));
    setHasUnsavedChanges(true);
    if (type === 'about') setAboutUsImage(blobUrl);
    else if (type === 'milestone') handleUpdateYearText('main_image', blobUrl);
    else if (type === 'leader' && id) handleUpdateLeader(id, 'image_url', blobUrl);
    else if (type === 'domain' && id) handleUpdateDomain(id, 'image_url', blobUrl);
    else if (type === 'gallery_add') setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, gallery: [...y.gallery, blobUrl] } : y));
  };

  const processDeepUploads = async (data: any, pathHint: string = 'journey'): Promise<any> => {
    if (!data) return data;
    if (typeof data === 'string') {
      if (data.startsWith('blob:')) {
        const stagedFile = (fileMap as Record<string, any>)[data];
        if (stagedFile instanceof File) {
          try { return await storageService.uploadFile(stagedFile, pathHint); }
          catch (err) { console.error(err); return data; }
        }
      }
      return data;
    }
    if (Array.isArray(data)) return await Promise.all(data.map(item => processDeepUploads(item, pathHint)));
    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        const childPath = (key === 'main_image' || key === 'gallery') ? 'journey' : pathHint;
        result[key] = await processDeepUploads(value, childPath);
      }
      return result;
    }
    return data;
  };

  const handlePublishAll = async () => {
    if (isSyncing || !hasUnsavedChanges) return;
    setIsSyncing(true);
    try {
      const finalAboutImage = await processDeepUploads(aboutUsImage, 'banners');
      const finalJourney = await processDeepUploads(journeyData, 'journey');
      await Promise.all([
        api.config.set('about_us_image_main', finalAboutImage),
        api.config.set('journey_data_v2', JSON.stringify(finalJourney)),
        api.config.set('stats_members', manualStats.members)
      ]);
      setAboutUsImage(finalAboutImage); setJourneyData(finalJourney); setFileMap({}); setHasUnsavedChanges(false);
      alert("✅ CLOUD SYNC SUCCESSFUL.");
    } catch (err: any) { alert("❌ SYNC ERROR: " + err.message); } finally { setIsSyncing(false); }
  };

  const handleAddTag = (field: 'events' | 'new_editions') => {
    const val = prompt(`Enter new ${field.replace('_', ' ')} item:`);
    if (val) {
      const currentArr = (currentYearData as any)[field] || [];
      handleUpdateYearText(field as any, [...currentArr, val]);
    }
  };

  const handleRemoveTag = (field: 'events' | 'new_editions', index: number) => {
    const currentArr = (currentYearData as any)[field] || [];
    handleUpdateYearText(field as any, currentArr.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="bg-[#000b1a] text-white pt-20 transition-all font-inter">
      {/* MODAL: ADD LEADER */}
      {showAddLeaderModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="max-w-2xl w-full bg-[#211f1e] p-12 rounded-[3rem] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] relative">
            <button onClick={() => setShowAddLeaderModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 className="text-4xl font-bold serif-font mb-10 text-yellow-400">Add Core Leader</h2>
            <form onSubmit={async (e) => {
               e.preventDefault();
               let imgUrl = '';
               if (newLeaderFile) {
                 const blobUrl = URL.createObjectURL(newLeaderFile);
                 setFileMap(p => ({ ...p, [blobUrl]: newLeaderFile }));
                 imgUrl = blobUrl;
               }
               const newL: JourneyLeader = { id: `l-${Date.now()}`, name: newLeaderForm.name || 'UNNAMED', role: newLeaderForm.role || 'POSITION', reflection: newLeaderForm.reflection || '', tagline: newLeaderForm.tagline || '', image_url: imgUrl };
               setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, leaders: [...y.leaders, newL] } : y));
               setHasUnsavedChanges(true); setShowAddLeaderModal(false); setNewLeaderForm({ name: '', role: '', reflection: '', tagline: '' }); setNewLeaderFile(null);
            }} className="space-y-6">
              <input required placeholder="Name" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none" value={newLeaderForm.name} onChange={e => setNewLeaderForm({...newLeaderForm, name: e.target.value})} />
              <input required placeholder="Role" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none" value={newLeaderForm.role} onChange={e => setNewLeaderForm({...newLeaderForm, role: e.target.value})} />
              <textarea required placeholder="Reflection Message..." rows={6} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none resize-none" value={newLeaderForm.reflection} onChange={e => setNewLeaderForm({...newLeaderForm, reflection: e.target.value})} />
              <div className="p-6 border border-dashed border-white/10 rounded-2xl bg-black/40">
                <input type="file" required accept="image/*" className="text-xs text-gray-400" onChange={e => setNewLeaderFile(e.target.files?.[0] || null)} />
              </div>
              <button type="submit" className="w-full py-5 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-widest text-xs">Add to Record</button>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1200] bg-black/98 flex items-center justify-center p-4 backdrop-blur-3xl" onClick={() => setLightboxIndex(null)}>
          <img src={currentYearData.gallery[lightboxIndex]} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" alt="Full View" />
        </div>
      )}

      {viewMode === 'snapshot' ? (
        <>
          <section className="py-24 px-4 text-center">
            <h1 className="text-6xl font-bold serif-font mb-6">Society Archives</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">Documenting the intellectual and creative milestones of IARE.</p>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 border-b border-white/5 pb-32">
            <div className="space-y-8 text-left">
              <h2 className="text-4xl font-bold serif-font text-white">About Us</h2>
              <div className="space-y-6 text-gray-300 font-light text-lg">
                <p>Welcome to Compendium IARE, the official news and publication society of IARE.</p>
                <p>A student-led movement dedicated to finding expression for voices that shape campus culture.</p>
              </div>
              <p className="text-yellow-400 font-bold text-lg italic underline underline-offset-8">Curating Excellence. Since 2020.</p>
            </div>
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-white/5 aspect-[1.4/1] bg-[#211f1e]">
               <img src={aboutUsImage || "https://picsum.photos/seed/about/800/600"} className="w-full h-full object-cover" alt="Banner" />
               {isAdmin && (
                 <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'about')} /><span className="bg-yellow-400 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Upload Banner</span></label>
               )}
            </div>
          </section>

          {/* Key Facts / Stats Section */}
          <section className="py-20 bg-[var(--primary-bg)]">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold serif-font mb-4">Key Facts</h2>
              <p className="text-gray-400 mb-12 font-light">A snapshot of our organization and impact</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Dynamic Stat 1: Total Pubs */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center aspect-[1.4/1] transition-all hover:border-yellow-400/30 group">
                  <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <span className="text-4xl font-bold text-white mb-2">{dynamicStats.pubs}</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">Publishing student work</p>
                </div>

                {/* Dynamic Stat 2: Articles */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center aspect-[1.4/1] transition-all hover:border-yellow-400/30 group">
                  <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-4xl font-bold text-white mb-2">{dynamicStats.articles}</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">Articles published</p>
                </div>

                {/* Dynamic Stat 3: News Editions */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center aspect-[1.4/1] transition-all hover:border-yellow-400/30 group">
                  <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-4xl font-bold text-white mb-2">{dynamicStats.editions}</span>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">News Editions</p>
                </div>

                {/* Manual Stat 4: Members */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center aspect-[1.4/1] transition-all hover:border-yellow-400/30 group">
                  <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  {isAdmin ? (
                    <input className="bg-transparent text-4xl font-bold text-white text-center w-full focus:outline-none border-b border-white/10 mb-2" value={manualStats.members} onChange={e => { setManualStats({...manualStats, members: e.target.value}); setHasUnsavedChanges(true); }} />
                  ) : (
                    <span className="text-4xl font-bold text-white mb-2">{manualStats.members}</span>
                  )}
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center">Active members</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-24">
                 <div className="w-24"></div><h2 className="text-5xl font-bold serif-font text-center flex-grow">Our Evolution</h2>
                 <div className="w-24 flex justify-end">{isAdmin && <button onClick={handleAddNewYear} className="px-4 py-2 bg-yellow-400 text-black text-[9px] font-black rounded-lg uppercase tracking-widest">+ Add Year</button>}</div>
              </div>
              <div className="flex flex-col lg:flex-row gap-20 items-start">
                <div className="w-full lg:w-1/2 text-left">
                  <div className="relative group overflow-hidden rounded-3xl aspect-[1.8/1] mb-12 bg-[#211f1e]">
                    <img src={currentYearData.main_image || "https://picsum.photos/seed/milestone/800/450"} className="w-full h-full object-cover" alt="Milestone" />
                    {isAdmin && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'milestone')} /><span className="bg-yellow-400 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Year Hero</span></label>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4"><h3 className="text-3xl font-bold serif-font text-white">{activeYear}</h3><span className="w-px h-8 bg-white/20"></span>
                    {isAdmin ? <input className="bg-transparent text-yellow-400 text-3xl font-bold serif-font w-full focus:outline-none border-b border-white/10" value={currentYearData.title} onChange={e => handleUpdateYearText('title', e.target.value)} /> : <h3 className="text-3xl font-bold serif-font text-yellow-400">{currentYearData.title}</h3>}</div>
                    {isAdmin ? <textarea className="w-full bg-[#211f1e] border border-white/10 text-gray-400 p-3 rounded text-lg min-h-[100px] outline-none" value={currentYearData.description} onChange={e => handleUpdateYearText('description', e.target.value)} /> : <p className="text-gray-400 text-lg font-light leading-relaxed">{currentYearData.description}</p>}
                    
                    {/* Event & Edition Tags Management */}
                    <div className="flex flex-col gap-6 mt-6">
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">Major Events</p>
                          <div className="flex flex-wrap gap-3">
                             {currentYearData.events?.map((ev, i) => (
                               <span key={i} className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-xs flex items-center gap-2">
                                  {ev} {isAdmin && <button onClick={() => handleRemoveTag('events', i)} className="text-red-500 font-bold ml-1">×</button>}
                               </span>
                             ))}
                             {isAdmin && <button onClick={() => handleAddTag('events')} className="px-4 py-1 border border-dashed border-yellow-400/40 text-yellow-400 rounded-full text-xs">+ Add</button>}
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">New Editions</p>
                          <div className="flex flex-wrap gap-3">
                             {currentYearData.new_editions?.map((ed, i) => (
                               <span key={i} className="px-4 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 rounded-full text-xs flex items-center gap-2">
                                  {ed} {isAdmin && <button onClick={() => handleRemoveTag('new_editions', i)} className="text-red-500 font-bold ml-1">×</button>}
                               </span>
                             ))}
                             {isAdmin && <button onClick={() => handleAddTag('new_editions')} className="px-4 py-1 border border-dashed border-yellow-400/40 text-yellow-400 rounded-full text-xs">+ Add</button>}
                          </div>
                       </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/5"><button onClick={() => setShowMore(!showMore)} className="text-xs font-black uppercase text-white/40 hover:text-white underline underline-offset-8">{showMore ? 'SHOW LESS' : 'SHOW MORE'}</button><button onClick={() => { setViewMode('full'); window.scrollTo(0,0); }} className="text-xs font-black uppercase text-white/40 hover:text-yellow-400">VIEW REFLECTIONS →</button></div>
                  </div>
                  <div className="mt-20 relative pt-10"><div className="absolute top-14 left-0 right-0 h-px bg-white/10"></div>
                    <div className="flex justify-between items-center relative px-2">{journeyData.slice().sort((a,b)=>a.year-b.year).map((y) => (
                         <div key={y.year} className="flex flex-col items-center gap-6 cursor-pointer group" onClick={() => { setActiveYear(y.year); }}>
                            <span className={`text-xs font-black tracking-widest transition-all ${activeYear === y.year ? 'text-yellow-400 scale-125' : 'text-gray-600 group-hover:text-white'}`}>{y.year}</span>
                            <div className={`w-3.5 h-3.5 rotate-45 border-2 transition-all ${activeYear === y.year ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(255,193,7,0.5)]' : 'bg-transparent border-white/20'}`}></div>
                            {isAdmin && activeYear === y.year && <button onClick={(e) => { e.stopPropagation(); if(confirm(`Delete entire ${y.year} archive?`)) setJourneyData(p => p.filter(it => it.year !== y.year)); setHasUnsavedChanges(true); }} className="text-[8px] text-red-500 font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity mt-4 absolute -bottom-6">Delete</button>}
                         </div>
                    ))}</div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-16 lg:pl-10 text-left">
                   {(currentYearData.leaders || []).map((leader) => (
                     <div key={leader.id} className="flex gap-8 items-start group relative">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 bg-[#211f1e]">
                           <img src={leader.image_url || `https://picsum.photos/seed/${leader.id}/300/300`} className="w-full h-full object-cover" alt={leader.name} />
                           {isAdmin && <><label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'leader', leader.id)} /><span className="text-[8px] font-black uppercase text-white">Upload</span></label>
                           <button onClick={() => handleRemoveLeader(leader.id)} className="absolute -top-1 -right-1 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 z-[80]"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button></>}
                        </div>
                        <div className="space-y-3 flex-grow">
                           {isAdmin ? (<div className="space-y-2"><input className="bg-transparent border-b border-white/10 text-2xl font-bold serif-font text-white w-full focus:outline-none" value={leader.name} onChange={e => handleUpdateLeader(leader.id, 'name', e.target.value)} />
                               <input className="bg-transparent border-b border-white/10 text-[10px] text-yellow-400 font-black uppercase tracking-[0.3em] w-full focus:outline-none" value={leader.role} onChange={e => handleUpdateLeader(leader.id, 'role', e.target.value)} />
                               <input className="bg-transparent border-b border-white/10 text-gray-400 text-sm italic w-full focus:outline-none" value={leader.tagline} onChange={e => handleUpdateLeader(leader.id, 'tagline', e.target.value)} /></div>
                           ) : (<><h4 className="text-2xl font-bold serif-font text-white">{leader.name}</h4><p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">{leader.role}</p><p className="text-gray-400 text-sm italic">{leader.tagline}</p></>)}
                        </div>
                     </div>
                   ))}
                   {isAdmin && <button onClick={() => setShowAddLeaderModal(true)} className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black text-gray-500 hover:text-yellow-400 hover:border-yellow-400/40 uppercase tracking-[0.2em] transition-all bg-[#211f1e] z-[70] relative">+ ADD CORE LEADER</button>}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="min-h-screen pb-40 px-6 animate-fadeIn">
          <button onClick={() => setViewMode('snapshot')} className="fixed top-28 left-8 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all z-[100] flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">← Back to Archives</button>
          <div className="max-w-6xl mx-auto pt-24 text-center">
             <h2 className="text-6xl font-bold serif-font mb-12">{activeYear} Team Reflections</h2>
             <div className="space-y-40 mb-56">
                {(currentYearData.leaders || []).map((leader, i) => (
                  <div key={leader.id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center lg:items-start relative group`}>
                     <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-yellow-400/20 flex-shrink-0 shadow-2xl">
                        <img src={leader.image_url || `https://picsum.photos/seed/${leader.id}/400/400`} className="w-full h-full object-cover" alt={leader.name} />
                        {isAdmin && (<label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'leader', leader.id)} /><span className="text-[10px] font-black uppercase text-yellow-400">Update Portrait</span></label>)}
                     </div>
                     <div className="flex-grow bg-[#211f1e] p-14 rounded-3xl border-t-4 border-l-4 border-yellow-400/40 shadow-3xl text-left relative">
                        <div className="flex items-center gap-4 mb-8">
                           <h3 className="text-4xl font-bold serif-font text-yellow-400">{leader.name}</h3>
                           <span className="px-4 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] font-black uppercase rounded-lg border border-yellow-400/20">{leader.role}</span>
                        </div>
                        {isAdmin ? <textarea className="w-full bg-black/20 border border-white/10 rounded-xl p-6 text-white min-h-[300px] font-light outline-none" value={leader.reflection} onChange={e => handleUpdateLeader(leader.id, 'reflection', e.target.value)} /> : <div className="space-y-6 text-gray-300 font-light text-lg italic leading-relaxed">{leader.reflection?.split('\n\n').map((p,idx)=>(<p key={idx}>{p}</p>))}</div>}
                     </div>
                     {isAdmin && <button onClick={() => handleRemoveLeader(leader.id)} className="absolute top-0 right-0 p-4 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-[80] shadow-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                  </div>
                ))}
             </div>

             <section className="mb-24 px-4 text-center">
                <h2 className="text-5xl font-bold serif-font text-yellow-400 mb-20">Archive Gallery {activeYear}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                   {(currentYearData.gallery || []).map((img, idx) => (
                     <div key={idx} className="relative group aspect-[4/3] rounded-[2.5rem] overflow-hidden border-[4px] border-yellow-400/80 p-1 shadow-2xl bg-[#211f1e] cursor-zoom-in transition-transform hover:scale-[1.02]" onClick={() => setLightboxIndex(idx)}>
                        <img src={img} className="w-full h-full object-cover rounded-[2rem]" alt="Memory" />
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); setJourneyData(prev => prev.map(y => y.year === activeYear ? {...y, gallery: y.gallery.filter(u => u !== img)} : y)); setHasUnsavedChanges(true); }} className="absolute top-6 right-6 p-4 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all z-[80]"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} stroke="currentColor" /></svg></button>}
                     </div>
                   ))}
                </div>
                {isAdmin && (<label className="mt-20 inline-block px-12 py-5 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-2xl cursor-pointer shadow-2xl hover:bg-yellow-500 transition-all z-[70] relative"><input type="file" multiple className="hidden" onChange={(e) => { if(e.target.files) Array.from(e.target.files).forEach(f => handleStageImage(f, 'gallery_add')); }} />+ UPLOAD MEMORIES</label>)}
             </section>
          </div>
        </div>
      )}

      {/* SYNC STATUS BAR */}
      {isAdmin && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-lg px-4 pointer-events-none">
          <div className="bg-[#0a0f2b]/95 border border-white/10 p-5 rounded-[2.5rem] shadow-3xl flex items-center justify-between gap-6 pointer-events-auto backdrop-blur-2xl">
             <div className="flex items-center gap-4 pl-4"><div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{hasUnsavedChanges ? 'Sync Pending' : 'Archives Synced'}</p></div>
             <button disabled={!hasUnsavedChanges || isSyncing} onClick={handlePublishAll} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!hasUnsavedChanges ? 'bg-white/5 text-gray-500' : 'bg-yellow-400 text-black shadow-2xl hover:bg-yellow-500 hover:scale-105 cursor-pointer'}`}>{isSyncing ? 'Syncing...' : 'Sync to Cloud'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
