
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
  id: `y-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    id: 'y-2019',
    year: 2019,
    title: "Vision & Beginnings",
    main_image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    description: "The founding year of The Compendium. A group of visionary students came together to create a platform that bridges the gap between campus news and creative expression, setting the foundation for years of excellence and intellectual dialogue at IARE.",
    events: ["INAUGURAL GENERAL BODY MEETING", "FOUNDATION WORKSHOP", "FIRST RECRUITMENT DRIVE"],
    new_editions: ["NEWSLETTER VOL 1", "SOCIETY CHARTER"],
    leaders: [
      { 
        id: 'l1', 
        name: 'ANUSHA VAJHA', 
        role: 'FOUNDING PRESIDENT', 
        image_url: 'https://picsum.photos/seed/anusha/400/400', 
        tagline: 'Establishing the core values and mission of the society, ensuring a sustainable platform for student expression.', 
        reflection: "Leadership is about creating more leaders. It started with a simple belief: every student voice deserves a canvas." 
      }
    ],
    domain_heads: [
      { id: 'dh1', name: 'KRANTHI KUMAR', role: 'DESIGN HEAD', image_url: 'https://picsum.photos/seed/kk/400/400' }
    ],
    gallery: []
  }
];

const About: React.FC<AboutProps> = ({ isAdmin, publications, team, setTeam }) => {
  const [journeyData, setJourneyData] = useState<JourneyYear[]>([]);
  const [activeYear, setActiveYear] = useState<number>(2019);
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
        let parsed = JSON.parse(savedJourney);
        parsed = parsed.map((y: any) => ({ ...y, id: y.id || `y-${y.year}-${Math.random()}` }));
        const sorted = parsed.sort((a: any, b: any) => b.year - a.year);
        setJourneyData(sorted);
        if (sorted.length > 0) setActiveYear(sorted[0].year);
      } else {
        setJourneyData(INITIAL_JOURNEY_DATA);
        setActiveYear(2019);
      }
      setManualStats({ members: sMembs || '50+' });
    } catch (e: any) {
      setJourneyData(INITIAL_JOURNEY_DATA);
      setActiveYear(2019);
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

  const handleUpdateYearById = (id: string, newYearVal: number) => {
    if (isNaN(newYearVal)) return;
    setJourneyData(prev => {
      const newData = prev.map(y => y.id === id ? { ...y, year: newYearVal } : y);
      const updatedItem = newData.find(item => item.id === id);
      if (updatedItem && journeyData.find(j => j.id === id)?.year === activeYear) {
        setActiveYear(newYearVal);
      }
      return newData;
    });
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
    const nextYear = Math.max(...journeyData.map(y => y.year), 2018) + 1;
    const newYearObj = DEFAULT_NEW_YEAR(nextYear);
    setJourneyData(prev => [newYearObj, ...prev]);
    setActiveYear(nextYear);
    setHasUnsavedChanges(true);
  };

  const handleDeleteYear = () => {
    if (!confirm(`Are you sure you want to delete the ${activeYear} milestone? All data for this year will be permanently removed from the archives.`)) return;
    const newData = journeyData.filter(y => y.year !== activeYear);
    setJourneyData(newData);
    setHasUnsavedChanges(true);
    if (newData.length > 0) setActiveYear(newData[0].year);
    else setActiveYear(2019);
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
        const stagedFile = fileMap[data];
        if (stagedFile instanceof File) {
          try { 
            return await storageService.uploadFile(stagedFile, pathHint); 
          } catch (err) { 
            console.error('Upload error:', err); 
            return data; 
          }
        }
      }
      return data;
    }
    if (Array.isArray(data)) {
      return await Promise.all(data.map(item => processDeepUploads(item, pathHint)));
    }
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

  return (
    <div className="bg-[var(--primary-bg)] text-[var(--text-main)] pt-24 transition-all font-inter min-h-screen">
      {/* MODAL: ADD LEADER */}
      {showAddLeaderModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
          <div className="max-w-xl w-full bg-[#1c1c1c] p-10 rounded-[2rem] border border-white/10 shadow-2xl relative">
            <button onClick={() => setShowAddLeaderModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <h2 className="text-2xl font-bold serif-font mb-8 text-[var(--accent-color)]">Add Core Leader</h2>
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
              <input required placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-[var(--accent-color)] outline-none" value={newLeaderForm.name} onChange={e => setNewLeaderForm({...newLeaderForm, name: e.target.value})} />
              <input required placeholder="Role" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-[var(--accent-color)] outline-none" value={newLeaderForm.role} onChange={e => setNewLeaderForm({...newLeaderForm, role: e.target.value})} />
              <textarea required placeholder="Tagline..." rows={2} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-[var(--accent-color)] outline-none resize-none" value={newLeaderForm.tagline} onChange={e => setNewLeaderForm({...newLeaderForm, tagline: e.target.value})} />
              <textarea required placeholder="Reflection..." rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-[var(--accent-color)] outline-none resize-none" value={newLeaderForm.reflection} onChange={e => setNewLeaderForm({...newLeaderForm, reflection: e.target.value})} />
              <div className="p-4 border border-dashed border-white/10 rounded-xl bg-black/20">
                <input type="file" required accept="image/*" className="text-xs text-gray-400" onChange={e => setNewLeaderFile(e.target.files?.[0] || null)} />
              </div>
              <button type="submit" className="w-full py-5 bg-[var(--accent-color)] text-black font-black rounded-xl uppercase tracking-widest text-[11px] shadow-2xl">Add Leader</button>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1200] bg-black/98 flex items-center justify-center p-4 backdrop-blur-3xl" onClick={() => setLightboxIndex(null)}>
          <button onClick={(e) => { e.stopPropagation(); if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + currentYearData.gallery.length) % currentYearData.gallery.length); }} className="absolute left-6 z-[1300] w-12 h-12 bg-white/10 hover:bg-[var(--accent-color)] hover:text-black rounded-full flex items-center justify-center transition-all shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="relative max-w-6xl max-h-[80vh] animate-fadeIn">
             <img src={currentYearData.gallery[lightboxIndex]} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" alt="View" />
          </div>
          <button onClick={(e) => { e.stopPropagation(); if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % currentYearData.gallery.length); }} className="absolute right-6 z-[1300] w-12 h-12 bg-white/10 hover:bg-[var(--accent-color)] hover:text-black rounded-full flex items-center justify-center transition-all shadow-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      {viewMode === 'snapshot' ? (
        <>
          <section className="py-20 px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold serif-font mb-4 text-[var(--text-main)]">Society Archives</h1>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg font-light">Documenting the intellectual and creative milestones of IARE.</p>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 border-b border-[var(--border-color)] pb-24">
            <div className="space-y-8 text-left self-center">
              <h2 className="text-4xl font-bold serif-font text-[var(--text-main)]">About Us</h2>
              <div className="space-y-6 text-[var(--text-muted)] font-light text-lg leading-relaxed">
                <p>Welcome to Compendium IARE, the official newspaper curated by the News and Publication Society of the Institute of Aeronautical Engineering (IARE).</p>
                <p>We are a vibrant student-led community passionate about storytelling, journalism, and creative expression. Our mission is to inform, inspire, and connect the IARE community through timely news, insightful articles, and captivating stories that reflect the dynamic spirit of our campus.</p>
                <p>From covering campus events, academic highlights, and student achievements to exploring tech trends, social issues, and creative content, Compendium IARE is your go-to source for everything happening at IARE — and beyond.</p>
                <p>We aim to foster a culture of curiosity, critical thinking, and collaboration through the power of words. Whether you're a reader, a writer, or an aspiring journalist, there's a place for you here.</p>
              </div>
              <p className="text-[var(--accent-color)] font-bold text-lg italic border-b-2 border-[var(--accent-color)] w-fit pb-1">Curating Excellence. Since 2019.</p>
            </div>
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-[var(--border-color)] aspect-[1.5/1] bg-[var(--secondary-bg)]">
               <img src={aboutUsImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" />
               {isAdmin && (
                 <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70] transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'about')} /><span className="bg-yellow-400 text-black px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-2xl">Upload Banner</span></label>
               )}
            </div>
          </section>

          {/* Key Facts Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold serif-font mb-4 text-[var(--text-main)]">Key Facts</h2>
              <p className="text-[var(--text-muted)] mb-16 font-light text-lg">A snapshot of our organization and impact</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', val: dynamicStats.pubs, label: 'Publications' },
                  { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', val: dynamicStats.articles, label: 'Articles' },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', val: dynamicStats.editions, label: 'Editions' },
                  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', val: manualStats.members, label: 'Members', isManual: true }
                ].map((stat, i) => (
                  <div key={i} className="glow-card border border-[var(--border-color)] rounded-3xl p-10 flex flex-col items-center justify-center transition-all group aspect-square">
                    <div className="text-[var(--accent-color)] mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
                    </div>
                    {stat.isManual && isAdmin ? (
                      <input className="bg-transparent text-4xl font-bold text-[var(--text-main)] text-center w-full focus:outline-none border-b border-[var(--border-color)] mb-2" value={manualStats.members} onChange={e => { setManualStats({...manualStats, members: e.target.value}); setHasUnsavedChanges(true); }} />
                    ) : (
                      <span className="text-4xl font-bold text-[var(--text-main)] mb-2">{stat.val}</span>
                    )}
                    <p className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Journey Section Snapshot */}
          <section className="py-28 px-6 bg-[var(--secondary-bg)] transition-colors">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                 <h2 className="text-5xl md:text-6xl font-bold serif-font text-[var(--text-main)] text-center md:text-left">Our Journey</h2>
                 <div className="flex items-center gap-4">
                   {isAdmin && (
                     <>
                        <button onClick={handleDeleteYear} className="px-5 py-2.5 bg-red-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center gap-2 shadow-xl">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          DELETE YEAR
                        </button>
                        <button onClick={handleAddNewYear} className="px-5 py-2.5 bg-[var(--accent-color)] text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">+ YEAR</button>
                     </>
                   )}
                 </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-20 items-start">
                <div className="w-full lg:w-1/2 text-left">
                  <div className="relative group overflow-hidden rounded-[2.5rem] aspect-[16/9] mb-12 bg-black/10 shadow-3xl border border-[var(--border-color)]">
                    <img src={currentYearData.main_image || "https://picsum.photos/seed/milestone/800/450"} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Milestone" />
                    {isAdmin && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70] transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'milestone')} /><span className="bg-yellow-400 text-black px-6 py-3 rounded-xl text-[11px] font-black uppercase shadow-2xl">Update Hero Image</span></label>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      {isAdmin ? (
                        <input type="number" className="bg-transparent text-5xl font-bold serif-font text-[var(--text-main)] w-32 focus:outline-none border-b border-[var(--accent-color)]" value={activeYear} onChange={e => handleUpdateYearById(currentYearData.id, parseInt(e.target.value))} />
                      ) : (
                        <h3 className="text-5xl font-bold serif-font text-[var(--text-main)]">{activeYear}</h3>
                      )}
                      <span className="w-px h-12 bg-[var(--text-main)] opacity-20"></span>
                      {isAdmin ? (
                        <input className="bg-transparent text-[var(--accent-color)] text-3xl font-bold serif-font w-full focus:outline-none border-b border-[var(--border-color)]" value={currentYearData.title} onChange={e => handleUpdateYearText('title', e.target.value)} />
                      ) : (
                        <h3 className="text-3xl font-bold serif-font text-[var(--accent-color)]">{currentYearData.title}</h3>
                      )}
                    </div>
                    
                    {isAdmin ? (
                      <textarea className="w-full bg-black/10 border border-[var(--border-color)] text-[var(--text-muted)] p-5 rounded-2xl text-lg min-h-[120px] outline-none focus:border-[var(--accent-color)]" value={currentYearData.description} onChange={e => handleUpdateYearText('description', e.target.value)} />
                    ) : (
                      <p className="text-[var(--text-muted)] text-lg font-light leading-relaxed">{currentYearData.description}</p>
                    )}
                    
                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showMore ? 'max-h-[1000px] opacity-100 mt-10' : 'max-h-0 opacity-0'}`}>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 p-8 bg-black/5 rounded-[2rem] border border-[var(--border-color)]">
                          <div>
                             <p className="text-[var(--accent-color)] text-[10px] font-black uppercase tracking-[0.4em] mb-6">Key Events:</p>
                             <ul className="space-y-3 text-[var(--text-main)] font-medium">
                                {currentYearData.events?.map((ev, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>{ev}</span>
                                    {isAdmin && <button onClick={() => handleRemoveTag('events', i)} className="text-red-500 text-[10px] font-black ml-auto hover:underline uppercase">Rem</button>}
                                  </li>
                                ))}
                                {isAdmin && <button onClick={() => handleAddTag('events')} className="mt-4 text-[10px] font-black text-[var(--accent-color)] uppercase hover:underline">+ ADD EVENT</button>}
                             </ul>
                          </div>
                          <div>
                             <p className="text-[var(--accent-color)] text-[10px] font-black uppercase tracking-[0.4em] mb-6">Major Releases:</p>
                             <ul className="space-y-3 text-[var(--text-main)] font-medium">
                                {currentYearData.new_editions?.map((ed, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>{ed}</span>
                                    {isAdmin && <button onClick={() => handleRemoveTag('new_editions', i)} className="text-red-500 text-[10px] font-black ml-auto hover:underline uppercase">Rem</button>}
                                  </li>
                                ))}
                                {isAdmin && <button onClick={() => handleAddTag('new_editions')} className="mt-4 text-[10px] font-black text-[var(--accent-color)] uppercase hover:underline">+ ADD EDITION</button>}
                             </ul>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-8 border-t border-[var(--border-color)] mt-8">
                      <button onClick={() => setShowMore(!showMore)} className="text-[11px] font-black uppercase text-[var(--accent-color)] hover:brightness-125 transition-all border-b-2 border-[var(--accent-color)] pb-0.5">{showMore ? 'Collapse Details' : 'Milestone Highlights'}</button>
                      <button onClick={() => { setViewMode('full'); window.scrollTo(0,0); }} className="px-8 py-3 bg-[var(--text-main)] text-[var(--primary-bg)] text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl">Complete Archive Journey</button>
                    </div>
                  </div>
                  
                  <div className="mt-20 relative pt-10">
                    <div className="absolute top-[3.25rem] left-0 right-0 h-px bg-[var(--text-main)] opacity-10"></div>
                    <div className="flex justify-start items-center relative gap-8 px-4 overflow-x-auto no-scrollbar pb-6">
                      {journeyData.slice().sort((a,b)=>a.year-b.year).map((y) => (
                         <div key={y.id} className="flex flex-col items-center gap-4 cursor-pointer group flex-shrink-0" onClick={() => { setActiveYear(y.year); setShowMore(false); }}>
                            {isAdmin ? (
                               <input type="number" className={`w-16 text-center bg-transparent text-[11px] font-black tracking-widest border-b-2 focus:outline-none transition-all ${activeYear === y.year ? 'text-[var(--accent-color)] border-[var(--accent-color)]' : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]'}`} value={y.year} onChange={(e) => handleUpdateYearById(y.id, parseInt(e.target.value))} />
                            ) : (
                               <span className={`text-[11px] font-black tracking-[0.2em] transition-all ${activeYear === y.year ? 'text-[var(--accent-color)] scale-125 drop-shadow-sm' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>{y.year}</span>
                            )}
                            <div className={`w-3.5 h-3.5 rotate-45 border-2 transition-all ${activeYear === y.year ? 'bg-[var(--accent-color)] border-[var(--accent-color)] shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-transparent border-[var(--border-color)]'}`}></div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 space-y-20 lg:pl-10 text-left">
                   {(currentYearData.leaders || []).map((leader) => (
                     <div key={leader.id} className="flex flex-col sm:flex-row gap-12 items-center sm:items-start group relative transition-all">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[var(--border-color)] flex-shrink-0 bg-[var(--primary-bg)] shadow-3xl">
                           <img src={leader.image_url || `https://picsum.photos/seed/${leader.id}/400/400`} className="w-full h-full object-cover transition-all duration-700" alt={leader.name} />
                           {isAdmin && (
                             <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer z-[70] transition-opacity"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'leader', leader.id)} /><span className="text-[10px] font-black uppercase text-white tracking-widest">Update</span></label>
                           )}
                        </div>
                        <div className="flex-grow pt-4 text-center sm:text-left">
                           <div>
                             {isAdmin ? (
                                <input className="bg-transparent border-b border-[var(--border-color)] text-4xl font-bold serif-font text-[var(--text-main)] w-full focus:outline-none mb-3" value={leader.name} onChange={e => handleUpdateLeader(leader.id, 'name', e.target.value)} />
                             ) : (
                                <h4 className="text-4xl font-bold serif-font text-[var(--text-main)] uppercase tracking-tight">{leader.name}</h4>
                             )}
                             {isAdmin ? (
                                <input className="bg-transparent border-b border-[var(--border-color)] text-[var(--accent-color)] text-[11px] font-black uppercase tracking-[0.4em] w-full focus:outline-none mt-2" value={leader.role} onChange={e => handleUpdateLeader(leader.id, 'role', e.target.value)} />
                             ) : (
                                <p className="text-[11px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em] mt-3">{leader.role}</p>
                             )}
                           </div>
                           <div className="w-24 h-1 bg-[var(--accent-color)] opacity-20 my-6 mx-auto sm:mx-0"></div>
                           {isAdmin ? (
                              <textarea className="w-full bg-black/5 border border-[var(--border-color)] rounded-2xl p-5 text-[var(--text-main)] text-base leading-relaxed focus:outline-none focus:border-[var(--accent-color)]" rows={3} value={leader.tagline} onChange={e => handleUpdateLeader(leader.id, 'tagline', e.target.value)} />
                           ) : (
                              <p className="text-lg text-[var(--text-muted)] font-light leading-relaxed italic">"{leader.tagline}"</p>
                           )}
                           {isAdmin && (
                             <div className="mt-6"><button onClick={() => handleRemoveLeader(leader.id)} className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-all">Remove Leader Record</button></div>
                           )}
                        </div>
                     </div>
                   ))}
                   {isAdmin && <button onClick={() => setShowAddLeaderModal(true)} className="w-full py-12 border-2 border-dashed border-[var(--border-color)] rounded-[2.5rem] text-[11px] font-black text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] uppercase tracking-[0.4em] transition-all bg-black/5 relative">+ ARCHIVE NEW CORE LEADER</button>}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Journey Full Reflections View */
        <div className="min-h-screen pb-40 px-6 animate-fadeIn bg-[var(--primary-bg)] transition-colors">
          <button onClick={() => setViewMode('snapshot')} className="fixed top-28 left-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all z-[100] flex items-center gap-3 px-6 py-3 bg-[var(--nav-bg)] backdrop-blur-lg rounded-full border border-[var(--border-color)] shadow-2xl">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Exit Detailed View
          </button>
          
          <div className="max-w-7xl mx-auto pt-24 text-center">
             <div className="mb-24">
                <span className="text-[var(--accent-color)] text-[11px] font-black uppercase tracking-[0.5em] mb-4 block">Archives Deep Dive</span>
                <h2 className="text-6xl md:text-7xl font-bold serif-font text-[var(--text-main)]">{activeYear} Executive Reflections</h2>
             </div>
             
             <div className="space-y-40 mb-40 max-w-5xl mx-auto">
                {(currentYearData.leaders || []).map((leader, i) => (
                  <div key={leader.id} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center lg:items-start relative group`}>
                     <div className="relative w-64 h-64 rounded-full overflow-hidden border-8 border-[var(--secondary-bg)] flex-shrink-0 shadow-3xl bg-[var(--card-bg)]">
                        <img src={leader.image_url || `https://picsum.photos/seed/${leader.id}/400/400`} className="w-full h-full object-cover" alt={leader.name} />
                        {isAdmin && (<label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'leader', leader.id)} /><span className="text-[10px] font-black uppercase text-white">Update</span></label>)}
                     </div>
                     <div className="flex-grow glow-card p-12 rounded-[3rem] text-left bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--border-color)] shadow-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
                           <h3 className="text-4xl font-bold serif-font text-[var(--text-main)]">{leader.name}</h3>
                           <span className="px-4 py-1 bg-[var(--accent-color)] text-black text-[10px] font-black uppercase rounded-xl shadow-lg border border-[var(--border-color)]">{leader.role}</span>
                        </div>
                        {isAdmin ? (
                          <textarea className="w-full bg-black/10 border border-[var(--border-color)] rounded-2xl p-6 text-[var(--text-main)] min-h-[250px] text-lg font-light outline-none focus:border-[var(--accent-color)]" value={leader.reflection} onChange={e => handleUpdateLeader(leader.id, 'reflection', e.target.value)} />
                        ) : (
                          <div className="space-y-6 text-[var(--text-muted)] font-light text-xl italic leading-relaxed border-l-4 border-[var(--accent-color)] pl-8">
                            {leader.reflection?.split('\n\n').map((p,idx)=>(<p key={idx}>{p}</p>))}
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>

             {/* DOMAIN HEADS SECTION */}
             <section className="mb-48 py-24 relative rounded-[4rem] bg-black/5 border border-[var(--border-color)] overflow-hidden">
                <div className="text-center mb-20 relative z-10">
                  <span className="text-[var(--accent-color)] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Specialized Excellence</span>
                  <h2 className="text-5xl md:text-6xl font-bold serif-font text-[var(--text-main)] mb-6">Domain Leadership</h2>
                  <p className="text-[var(--text-muted)] text-lg font-light tracking-wide italic">The pillars of our operations in {activeYear}</p>
                </div>

                <div className="relative max-w-6xl mx-auto flex items-center justify-center py-24 min-h-[650px]">
                  <button onClick={prevDomain} className="absolute left-6 lg:left-0 z-[100] w-16 h-16 bg-[var(--accent-color)] text-black rounded-full flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                  </button>

                  <div className="relative w-full h-[500px] flex items-center justify-center">
                    {(currentYearData.domain_heads || []).map((head, idx) => {
                      const total = currentYearData.domain_heads?.length || 0;
                      if (total === 0) return null;
                      
                      let diff = idx - domainCarouselIndex;
                      if (diff > total / 2) diff -= total;
                      if (diff < -total / 2) diff += total;

                      const isActive = diff === 0;
                      const isVisible = Math.abs(diff) <= 1;

                      return (
                        <div 
                          key={head.id} 
                          className={`absolute flex flex-col items-center transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 z-50' : 'opacity-0 z-0 pointer-events-none'}`}
                          style={{
                            transform: `translateX(${diff * 320}px) scale(${isActive ? 1.3 : 0.8})`,
                            filter: isActive ? 'none' : 'blur(4px)',
                            opacity: isActive ? 1 : 0.4
                          }}
                        >
                           <div className="relative group">
                              <div className={`w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-3xl ${isActive ? 'border-8 border-[var(--accent-color)]' : 'border-4 border-[var(--border-color)]'}`}>
                                <img src={head.image_url || `https://picsum.photos/seed/${head.id}/400/400`} className="w-full h-full object-cover" alt={head.name} />
                                {isAdmin && isActive && (
                                   <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-[70]"><input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleStageImage(e.target.files[0], 'domain', head.id)} /><span className="text-[11px] font-black uppercase text-white tracking-widest">Update Photo</span></label>
                                )}
                              </div>
                              {isAdmin && isActive && (
                                <button onClick={() => handleRemoveDomain(head.id)} className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg></button>
                              )}
                           </div>
                           
                           {isActive && (
                              <div className="mt-16 text-center animate-fadeInUp">
                                {isAdmin ? (
                                   <div className="space-y-3">
                                      <input className="bg-transparent border-b border-[var(--accent-color)] text-[var(--accent-color)] text-sm font-black uppercase tracking-[0.4em] text-center focus:outline-none w-full" value={head.role} onChange={e => handleUpdateDomain(head.id, 'role', e.target.value)} />
                                      <input className="bg-transparent border-b border-[var(--border-color)] text-5xl font-bold serif-font text-[var(--text-main)] text-center focus:outline-none w-full uppercase" value={head.name} onChange={e => handleUpdateDomain(head.id, 'name', e.target.value)} />
                                   </div>
                                ) : (
                                   <>
                                      <p className="text-[var(--accent-color)] text-[11px] font-black uppercase tracking-[0.4em] mb-6">{head.role}</p>
                                      <h3 className="text-5xl font-bold serif-font text-[var(--text-main)] uppercase tracking-tight">{head.name}</h3>
                                   </>
                                )}
                              </div>
                           )}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={nextDomain} className="absolute right-6 lg:right-0 z-[100] w-16 h-16 bg-[var(--accent-color)] text-black rounded-full flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
                {isAdmin && <div className="text-center mt-16"><button onClick={handleAddDomainHead} className="px-12 py-5 border-2 border-dashed border-[var(--accent-color)] text-[var(--accent-color)] rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[var(--accent-color)] hover:text-black transition-all">+ ARCHIVE NEW DOMAIN HEAD</button></div>}
             </section>

             <section className="mb-32 px-6 text-center">
                <h2 className="text-4xl font-bold serif-font text-[var(--accent-color)] mb-16">Memory Archive Gallery: {activeYear}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                   {(currentYearData.gallery || []).map((img, idx) => (
                     <div key={idx} className="relative group aspect-square rounded-[2rem] overflow-hidden border border-[var(--border-color)] cursor-zoom-in shadow-2xl transition-transform hover:scale-105" onClick={() => setLightboxIndex(idx)}>
                        <img src={img} className="w-full h-full object-cover" alt="Archive Memory" />
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); setJourneyData(prev => prev.map(y => y.year === activeYear ? {...y, gallery: y.gallery.filter(u => u !== img)} : y)); setHasUnsavedChanges(true); }} className="absolute top-4 right-4 p-3 bg-red-600/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all z-[80] shadow-2xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} stroke="currentColor" /></svg></button>}
                     </div>
                   ))}
                </div>
                {isAdmin && (<label className="mt-20 inline-block px-12 py-5 bg-[var(--accent-color)] text-black text-[11px] font-black uppercase rounded-2xl cursor-pointer shadow-3xl hover:brightness-110 transition-all relative z-[70]">+ UPLOAD HISTORICAL PHOTOS</label>)}
                {isAdmin && <input type="file" multiple className="hidden" id="full-journey-upload" onChange={(e) => { if(e.target.files) Array.from(e.target.files).forEach(f => handleStageImage(f, 'gallery_add')); }} />}
             </section>
          </div>
        </div>
      )}

      {/* Sync Status Bar */}
      {isAdmin && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-lg px-4 pointer-events-none">
          <div className="bg-[var(--nav-bg)] backdrop-blur-xl border border-[var(--border-color)] p-5 rounded-[2.5rem] shadow-3xl flex items-center justify-between gap-10 pointer-events-auto">
             <div className="flex items-center gap-4 pl-4"><div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div><p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">{hasUnsavedChanges ? 'Local Changes Detected' : 'Archives Synced'}</p></div>
             <button disabled={!hasUnsavedChanges || isSyncing} onClick={handlePublishAll} className={`px-10 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${!hasUnsavedChanges ? 'bg-white/5 text-gray-400 opacity-50 cursor-not-allowed' : 'bg-[var(--accent-color)] text-black shadow-2xl hover:scale-105 active:scale-95'}`}>{isSyncing ? 'Syncing...' : 'Push to Production'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
