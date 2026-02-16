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
    description: "Commemorating its fifth anniversary, the club celebrated its journey with a vibrant lineup of intellectually and creatively stimulating events. It reaffirmed its role as a hub for innovation, expression, and impactful student experiences.",
    events: ["DESIGN FOR EVERYONE - WORKSHOP", "QUIZ - THE BATTLE OF BRAINS", "VIBE CODING", "COURTROOM CONUNDRUM", "STATE VS A NOBODY"],
    new_editions: ["ARTICLES", "WEBSITE", "CULTURAL FEST MAGAZINE (2024-2025)", "ANNUAL MAGAZINE (2024-2025)"],
    leaders: [
      { id: 'l1', name: 'K YAGNESH REDDY', role: 'PRESIDENT', image_url: 'https://picsum.photos/seed/kynr/300/300', tagline: 'Leading the club\'s vision and strategic initiatives, coordinating with different teams to drive innovation and growth.', reflection: "Leadership is about empathy and passion." },
      { id: 'l2', name: 'MULE BHARATH', role: 'CREATIVE DIRECTOR', image_url: 'https://picsum.photos/seed/mbht/300/300', tagline: 'Overseeing the club\'s creative direction, managing design projects, and ensuring visual consistency across all publications.', reflection: "Design is thinking made visual." },
      { id: 'l3', name: 'ROHIT JOY', role: 'MANAGING DIRECTOR', image_url: 'https://picsum.photos/seed/rjoy/300/300', tagline: 'Managing day-to-day operations, coordinating events, and ensuring smooth execution of club activities and projects.', reflection: "Operations are the heartbeat of our society." }
    ],
    domain_heads: [
      { id: 'dh1', name: 'KRANTHI KUMAR VEGGALAM', role: 'DESIGN HEAD', image_url: 'https://picsum.photos/seed/kkv/400/400' },
      { id: 'dh2', name: 'KEERTHI NORI', role: 'WRITER HEAD', image_url: 'https://picsum.photos/seed/knori/400/400' },
      { id: 'dh3', name: 'ABHINAV VIKAS', role: 'PHOTOGRAPHY HEAD', image_url: 'https://picsum.photos/seed/avikas/400/400' }
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
  const [manualStats, setManualStats] = useState({ members: '50+' });
  const [domainCarouselIndex, setDomainCarouselIndex] = useState(0);

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
      setManualStats({ members: sMembs || '50+' });
    } catch (e: any) {
      setJourneyData(INITIAL_JOURNEY_DATA);
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const currentYearData = useMemo(() => {
    return journeyData.find(y => y.year === activeYear) || journeyData[0] || INITIAL_JOURNEY_DATA[0];
  }, [journeyData, activeYear]);

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
    if (!confirm("Remove leader?")) return;
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, leaders: y.leaders.filter(l => l.id !== id) } : y));
    setHasUnsavedChanges(true);
  };

  const handleRemoveDomain = (id: string) => {
    if (!confirm("Remove domain head?")) return;
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, domain_heads: (y.domain_heads || []).filter(dh => dh.id !== id) } : y));
    setHasUnsavedChanges(true);
    setDomainCarouselIndex(0);
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
        const childPath = (key === 'main_image' || key === 'gallery' || key === 'image_url') ? 'journey' : pathHint;
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
      alert("✅ Archives Updated Successfully.");
    } catch (err: any) { alert("❌ Error: " + err.message); } finally { setIsSyncing(false); }
  };

  const handleAddTag = (field: 'events' | 'new_editions') => {
    const val = prompt(`Enter new item:`);
    if (val) {
      const currentArr = (currentYearData as any)[field] || [];
      handleUpdateYearText(field as any, [...currentArr, val]);
    }
  };

  const handleRemoveTag = (field: 'events' | 'new_editions', index: number) => {
    const currentArr = (currentYearData as any)[field] || [];
    handleUpdateYearText(field as any, currentArr.filter((_: any, i: number) => i !== index));
  };

  const handleAddDomainHead = () => {
    const newDH = DEFAULT_DOMAIN();
    setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, domain_heads: [...(y.domain_heads || []), newDH] } : y));
    setHasUnsavedChanges(true);
    setDomainCarouselIndex((currentYearData.domain_heads?.length || 0));
  };

  const nextDomain = () => {
    const heads = currentYearData.domain_heads || [];
    if (heads.length === 0) return;
    setDomainCarouselIndex(prev => (prev + 1) % heads.length);
  };

  const prevDomain = () => {
    const heads = currentYearData.domain_heads || [];
    if (heads.length === 0) return;
    setDomainCarouselIndex(prev => (prev - 1 + heads.length) % heads.length);
  };

  const nextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % currentYearData.gallery.length);
  };

  const prevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + currentYearData.gallery.length) % currentYearData.gallery.length);
  };

  return (
    <div className="bg-[#000b1a] text-white pt-24 transition-all font-inter">
      {/* MODAL: ADD LEADER */}
      {showAddLeaderModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="max-w-xl w-full bg-[#211f1e] p-10 rounded-[2rem] border border-white/10 shadow-2xl relative">
            <button onClick={() => setShowAddLeaderModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 className="text-2xl font-bold serif-font mb-8 text-yellow-400">Add Core Leader</h2>
            <form onSubmit={async (e) => {
               e.preventDefault();
               let imgUrl = '';
               if (newLeaderFile) {
                 const blobUrl = URL.createObjectURL(newLeaderFile);
                 setFileMap(p => ({ ...p, [blobUrl]: newLeaderFile }));
                 imgUrl = blobUrl;
               }
               const newL: JourneyLeader = { id: `l-${Date.now()}`, name: newLeaderForm.name || 'NAME', role: newLeaderForm.role || 'ROLE', reflection: newLeaderForm.reflection || '', tagline: newLeaderForm.tagline || '', image_url: imgUrl };
               setJourneyData(prev => prev.map(y => y.year === activeYear ? { ...y, leaders: [...y.leaders, newL] } : y));
               setHasUnsavedChanges(true); setShowAddLeaderModal(false); setNewLeaderForm({ name: '', role: '', reflection: '', tagline: '' }); setNewLeaderFile(null);
            }} className="space-y-4">
              <input required placeholder="Name" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" value={newLeaderForm.name} onChange={e => setNewLeaderForm({...newLeaderForm, name: e.target.value})} />
              <input required placeholder="Role" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" value={newLeaderForm.role} onChange={e => setNewLeaderForm({...newLeaderForm, role: e.target.value})} />
              <textarea required placeholder="Tagline..." rows={2} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none resize-none" value={newLeaderForm.tagline} onChange={e => setNewLeaderForm({...newLeaderForm, tagline: e.target.value})} />
              <textarea required placeholder="Reflection..." rows={4} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none resize-none" value={newLeaderForm.reflection} onChange={e => setNewLeaderForm({...newLeaderForm, reflection: e.target.value})} />
              <div className="p-4 border border-dashed border-white/10 rounded-xl bg-black/40">
                <input type="file" required accept="image/*" className="text-xs text-gray-400" onChange={e => setNewLeaderFile(e.target.files?.[0] || null)} />
              </div>
              <button type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[10px]">Add Leader</button>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1200] bg-black/98 flex items-center justify-center p-4 backdrop-blur-3xl" onClick={() => setLightboxIndex(null)}>
          <button onClick={prevLightbox} className="absolute left-6 z-[1300] w-12 h-12 bg-white/10 hover:bg-yellow-400 hover:text-black rounded-full flex items-center justify-center transition-all shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="relative max-w-6xl max-h-[80vh] animate-fadeIn">
             <img src={currentYearData.gallery[lightboxIndex]} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" alt="View" />
          </div>
          <button onClick={nextLightbox} className="absolute right-6 z-[1300] w-12 h-12 bg-white/10 hover:bg-yellow-400 hover:text-black rounded-full flex items-center justify-center transition-all shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      {viewMode === 'snapshot' ? (
        <>
          <section className="py-20 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold serif-font mb-4">Society Archives</h1>
            <p className="text-gray-400 max-w-xl mx-auto text-base font-light">Documenting the intellectual and creative milestones of IARE.</p>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-white/5 pb-24">
            <div className="space-y-6 text-left self-center">
              <h2 className="text-3xl font-bold serif-font text-white">About Us</h2>
              <div className="space-y-4 text-gray-300 font-light text-base leading-relaxed">
                <p>Welcome to Compendium IARE, the official news and publication society of IARE.</p>
                <p>A student-led movement dedicated to finding expression for voices that shape campus culture.</p>
              </div>
              <p className="text-yellow-400 font-bold text-base italic underline underline-offset-4">Curating Excellence. Since 2020.</p>
            </div>
            <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-white/5 aspect-[1.5/1] bg-[#211f1e]">
               <img src={aboutUsImage || "https://picsum.photos/seed/about/800/600"} className="w-full h-full object-cover" alt="Banner" />
               {isAdmin && (
                 <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'about')} /><span className="bg-yellow-400 text-black px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-2xl">Upload Banner</span></label>
               )}
            </div>
          </section>

          {/* Facts Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold serif-font mb-3">Key Facts</h2>
              <p className="text-gray-400 mb-12 font-light text-sm">A snapshot of our organization and impact</p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', val: dynamicStats.pubs, label: 'Publications' },
                  { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', val: dynamicStats.articles, label: 'Articles' },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', val: dynamicStats.editions, label: 'Editions' },
                  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', val: manualStats.members, label: 'Members', isManual: true }
                ].map((stat, i) => (
                  <div key={i} className="glow-card border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center aspect-[1.4/1] group">
                    <div className="text-yellow-400 mb-3 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
                    </div>
                    {stat.isManual && isAdmin ? (
                      <input className="bg-transparent text-2xl font-bold text-white text-center w-full focus:outline-none border-b border-white/10 mb-1" value={manualStats.members} onChange={e => { setManualStats({...manualStats, members: e.target.value}); setHasUnsavedChanges(true); }} />
                    ) : (
                      <span className="text-2xl font-bold text-white mb-1">{stat.val}</span>
                    )}
                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Journey Section */}
          <section className="py-24 px-6 bg-[#030b5e]">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-16">
                 <div className="w-20"></div><h2 className="text-4xl md:text-5xl font-bold serif-font text-center flex-grow text-white">Our Journey</h2>
                 <div className="w-20 flex justify-end">{isAdmin && <button onClick={handleAddNewYear} className="px-3 py-1.5 bg-yellow-400 text-black text-[8px] font-black rounded uppercase tracking-widest">+ Year</button>}</div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="w-full lg:w-1/2 text-left">
                  <div className="relative group overflow-hidden rounded-2xl aspect-[1.8/1] mb-10 bg-[#211f1e] shadow-2xl">
                    <img src={currentYearData.main_image || "https://picsum.photos/seed/milestone/800/450"} className="w-full h-full object-cover" alt="Milestone" />
                    {isAdmin && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70] transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'milestone')} /><span className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase">Update Hero</span></label>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-bold serif-font text-white">{activeYear}</h3>
                      <span className="w-px h-6 bg-white/20"></span>
                      {isAdmin ? (
                        <input className="bg-transparent text-yellow-400 text-2xl font-bold serif-font w-full focus:outline-none border-b border-white/10" value={currentYearData.title} onChange={e => handleUpdateYearText('title', e.target.value)} />
                      ) : (
                        <h3 className="text-2xl font-bold serif-font text-yellow-400">{currentYearData.title}</h3>
                      )}
                    </div>
                    
                    {isAdmin ? (
                      <textarea className="w-full bg-[#211f1e] border border-white/10 text-gray-400 p-3 rounded text-base min-h-[80px] outline-none" value={currentYearData.description} onChange={e => handleUpdateYearText('description', e.target.value)} />
                    ) : (
                      <p className="text-gray-300 text-base font-light leading-relaxed">
                        {currentYearData.description}
                      </p>
                    )}

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showMore ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                       <div className="space-y-6">
                          <div>
                             <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest mb-3">EVENTS:</p>
                             <ul className="space-y-1 text-gray-300 text-xs font-medium">
                                {currentYearData.events?.map((ev, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                                    {ev}
                                    {isAdmin && <button onClick={() => handleRemoveTag('events', i)} className="text-red-500 text-[8px] font-black ml-2 hover:underline">X</button>}
                                  </li>
                                ))}
                                {isAdmin && <button onClick={() => handleAddTag('events')} className="mt-1 text-[8px] font-black text-yellow-500 uppercase">+ ADD</button>}
                             </ul>
                          </div>
                          <div>
                             <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest mb-3">EDITIONS:</p>
                             <ul className="space-y-1 text-gray-300 text-xs font-medium">
                                {currentYearData.new_editions?.map((ed, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                                    {ed}
                                    {isAdmin && <button onClick={() => handleRemoveTag('new_editions', i)} className="text-red-500 text-[8px] font-black ml-2 hover:underline">X</button>}
                                  </li>
                                ))}
                                {isAdmin && <button onClick={() => handleAddTag('new_editions')} className="mt-1 text-[8px] font-black text-yellow-500 uppercase">+ ADD</button>}
                             </ul>
                          </div>
                       </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <button onClick={() => setShowMore(!showMore)} className="text-[9px] font-black uppercase text-yellow-400 hover:text-white underline underline-offset-4">
                        {showMore ? 'Less' : 'More Details'}
                      </button>
                      <button onClick={() => { setViewMode('full'); window.scrollTo(0,0); }} className="text-[9px] font-black uppercase text-yellow-400 hover:text-white underline underline-offset-4">
                        View Reflections
                      </button>
                    </div>
                  </div>

                  {/* TIMELINE */}
                  <div className="mt-16 relative pt-8">
                    <div className="absolute top-11 left-0 right-0 h-px bg-white/20"></div>
                    <div className="flex justify-start items-center relative gap-6 px-2">
                      {journeyData.slice().sort((a,b)=>a.year-b.year).map((y) => (
                         <div key={y.year} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => { setActiveYear(y.year); setShowMore(false); }}>
                            <span className={`text-[9px] font-black tracking-widest transition-all ${activeYear === y.year ? 'text-yellow-400 scale-110' : 'text-gray-400 group-hover:text-white'}`}>{y.year}</span>
                            <div className={`w-3 h-3 rotate-45 border-2 transition-all ${activeYear === y.year ? 'bg-yellow-400 border-yellow-400' : 'bg-transparent border-white/30'}`}></div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LEADERS LIST */}
                <div className="w-full lg:w-1/2 space-y-10 lg:pl-8 text-left">
                   {(currentYearData.leaders || []).map((leader) => (
                     <div key={leader.id} className="flex gap-6 items-start group relative glow-card p-6 rounded-2xl">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0 bg-[#211f1e] shadow-xl">
                           <img src={leader.image_url || `https://picsum.photos/seed/${leader.id}/300/300`} className="w-full h-full object-cover" alt={leader.name} />
                           {isAdmin && <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70] transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'leader', leader.id)} /><span className="text-[7px] font-black uppercase text-white">Upload</span></label>}
                        </div>
                        <div className="flex-grow space-y-3 pt-1">
                           <div>
                             {isAdmin ? (
                                <input className="bg-transparent border-b border-white/10 text-xl font-bold serif-font text-white w-full focus:outline-none mb-1" value={leader.name} onChange={e => handleUpdateLeader(leader.id, 'name', e.target.value)} />
                             ) : (
                                <h4 className="text-xl font-bold serif-font text-white uppercase tracking-tight">{leader.name}</h4>
                             )}
                             {isAdmin ? (
                                <input className="bg-transparent border-b border-white/10 text-[9px] text-gray-400 font-bold uppercase tracking-widest w-full focus:outline-none" value={leader.role} onChange={e => handleUpdateLeader(leader.id, 'role', e.target.value)} />
                             ) : (
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{leader.role}</p>
                             )}
                           </div>
                           {isAdmin ? (
                              <textarea className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-gray-300 text-xs leading-relaxed focus:outline-none" rows={2} value={leader.tagline} onChange={e => handleUpdateLeader(leader.id, 'tagline', e.target.value)} />
                           ) : (
                              <p className="text-gray-300 text-xs font-light leading-relaxed max-w-sm">
                                {leader.tagline}
                              </p>
                           )}
                           {isAdmin && (
                             <button onClick={() => handleRemoveLeader(leader.id)} className="text-[7px] font-black text-red-500 hover:text-white uppercase">Remove</button>
                           )}
                        </div>
                     </div>
                   ))}
                   {isAdmin && <button onClick={() => setShowAddLeaderModal(true)} className="w-full py-5 border-2 border-dashed border-white/10 rounded-xl text-[9px] font-black text-gray-500 hover:text-yellow-400 uppercase tracking-widest transition-all bg-[#211f1e] relative">+ CORE LEADER</button>}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="min-h-screen pb-40 px-6 animate-fadeIn">
          <button onClick={() => setViewMode('snapshot')} className="fixed top-28 left-6 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all z-[100] flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">← Back</button>
          <div className="max-w-5xl mx-auto pt-20 text-center">
             <h2 className="text-4xl md:text-5xl font-bold serif-font mb-12">{activeYear} Team Reflections</h2>
             <div className="space-y-32 mb-40">
                {(currentYearData.leaders || []).map((leader, i) => (
                  <div key={leader.id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center lg:items-start relative group`}>
                     <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-yellow-400/20 flex-shrink-0 shadow-xl">
                        <img src={leader.image_url || `https://picsum.photos/seed/${leader.id}/400/400`} className="w-full h-full object-cover" alt={leader.name} />
                        {isAdmin && (<label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'leader', leader.id)} /><span className="text-[9px] font-black uppercase text-yellow-400">Update</span></label>)}
                     </div>
                     <div className="flex-grow glow-card p-10 rounded-2xl text-left">
                        <div className="flex items-center gap-3 mb-6">
                           <h3 className="text-2xl font-bold serif-font text-yellow-400">{leader.name}</h3>
                           <span className="px-3 py-0.5 bg-yellow-400/10 text-yellow-400 text-[9px] font-black uppercase rounded-lg border border-yellow-400/20">{leader.role}</span>
                        </div>
                        {isAdmin ? <textarea className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white min-h-[200px] text-sm font-light outline-none" value={leader.reflection} onChange={e => handleUpdateLeader(leader.id, 'reflection', e.target.value)} /> : <div className="space-y-4 text-gray-300 font-light text-base italic leading-relaxed">{leader.reflection?.split('\n\n').map((p,idx)=>(<p key={idx}>{p}</p>))}</div>}
                     </div>
                  </div>
                ))}
             </div>

             {/* Domain Heads Slider */}
             <section className="mb-40">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold serif-font text-yellow-400 mb-3">Domain Heads</h2>
                  <p className="text-gray-400 text-xs font-light">Meet our {activeYear} domain leaders</p>
                </div>

                <div className="relative max-w-4xl mx-auto flex items-center justify-center py-16 overflow-hidden">
                  <button onClick={prevDomain} className="absolute left-2 z-[100] w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                  </button>

                  <div className="flex items-center justify-center gap-8 w-full px-8 h-[400px]">
                    {(currentYearData.domain_heads || []).map((head, idx) => {
                      const isFocused = idx === domainCarouselIndex;
                      const isPrev = idx === (domainCarouselIndex - 1 + (currentYearData.domain_heads?.length || 1)) % (currentYearData.domain_heads?.length || 1);
                      const isNext = idx === (domainCarouselIndex + 1) % (currentYearData.domain_heads?.length || 1);
                      if (!isFocused && !isPrev && !isNext && (currentYearData.domain_heads?.length || 0) > 3) return null;
                      return (
                        <div key={head.id} className={`flex flex-col items-center transition-all duration-700 ease-out absolute ${isFocused ? 'scale-110 z-50 opacity-100' : 'scale-75 z-10 opacity-30 grayscale blur-[1px]'}`} style={{ transform: isFocused ? 'translateX(0)' : isPrev ? 'translateX(-150px)' : isNext ? 'translateX(150px)' : 'none' }}>
                           <div className="relative group">
                              <div className={`w-36 h-36 md:w-48 md:h-48 rounded-full border-4 border-yellow-400 overflow-hidden shadow-2xl`}>
                                <img src={head.image_url || `https://picsum.photos/seed/${head.id}/400/400`} className="w-full h-full object-cover" alt={head.name} />
                                {isAdmin && isFocused && (
                                   <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-[70]">
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'domain', head.id)} />
                                      <span className="text-[8px] font-black uppercase text-white">Update</span>
                                   </label>
                                )}
                              </div>
                              {isAdmin && isFocused && (
                                <button onClick={() => handleRemoveDomain(head.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                              )}
                           </div>
                           {isFocused && (
                              <div className="mt-10 text-center animate-fadeInUp">
                                {isAdmin ? (
                                   <div className="space-y-1">
                                      <input className="bg-transparent border-b border-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase tracking-widest text-center focus:outline-none w-full" value={head.role} onChange={e => handleUpdateDomain(head.id, 'role', e.target.value)} />
                                      <input className="bg-transparent border-b border-white/10 text-3xl font-bold serif-font text-white text-center focus:outline-none w-full" value={head.name} onChange={e => handleUpdateDomain(head.id, 'name', e.target.value)} />
                                   </div>
                                ) : (
                                   <>
                                      <p className="text-yellow-400 text-[11px] font-black uppercase tracking-[0.3em] mb-2">{head.role}</p>
                                      <h3 className="text-3xl md:text-4xl font-bold serif-font text-white uppercase leading-tight">{head.name}</h3>
                                   </>
                                )}
                              </div>
                           )}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={nextDomain} className="absolute right-2 z-[100] w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
                {isAdmin && <button onClick={handleAddDomainHead} className="mt-8 mx-auto px-6 py-2 border-2 border-dashed border-yellow-400/30 text-yellow-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-yellow-400/10">+ ADD DOMAIN HEAD</button>}
             </section>

             <section className="mb-24 px-4 text-center">
                <h2 className="text-3xl font-bold serif-font text-yellow-400 mb-12">Archive Gallery {activeYear}</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                   {(currentYearData.gallery || []).map((img, idx) => (
                     <div key={idx} className="relative group aspect-square rounded-[1.5rem] overflow-hidden glow-card cursor-zoom-in" onClick={() => setLightboxIndex(idx)}>
                        <img src={img} className="w-full h-full object-cover" alt="Memory" />
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); setJourneyData(prev => prev.map(y => y.year === activeYear ? {...y, gallery: y.gallery.filter(u => u !== img)} : y)); setHasUnsavedChanges(true); }} className="absolute top-3 right-3 p-2 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-[80] shadow-xl"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} stroke="currentColor" /></svg></button>}
                     </div>
                   ))}
                </div>
                {isAdmin && (<label className="mt-16 inline-block px-10 py-4 bg-yellow-400 text-black text-[9px] font-black uppercase rounded-xl cursor-pointer shadow-xl hover:bg-yellow-500 transition-all relative z-[70]"><input type="file" multiple className="hidden" onChange={(e) => { if(e.target.files) Array.from(e.target.files).forEach(f => handleStageImage(f, 'gallery_add')); }} />+ UPLOAD PHOTOS</label>)}
             </section>
          </div>
        </div>
      )}

      {/* SYNC STATUS BAR */}
      {isAdmin && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-lg px-4 pointer-events-none">
          <div className="bg-[#0a0f2b]/95 border border-white/10 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6 pointer-events-auto backdrop-blur-2xl">
             <div className="flex items-center gap-4 pl-4"><div className={`w-2.5 h-2.5 rounded-full ${hasUnsavedChanges ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{hasUnsavedChanges ? 'Sync Pending' : 'Archives Synced'}</p></div>
             <button disabled={!hasUnsavedChanges || isSyncing} onClick={handlePublishAll} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!hasUnsavedChanges ? 'bg-white/5 text-gray-500' : 'bg-yellow-400 text-black shadow-2xl hover:bg-yellow-500 hover:scale-105 cursor-pointer'}`}>{isSyncing ? 'Syncing...' : 'SAVE CHANGES'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;