import React, { useState, useMemo } from 'react';
import { Publication } from '../types';
import { api, storageService } from '../services/supabase';

interface NewsProps {
  publications: Publication[];
  isAdmin: boolean;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
}

type SortOption = 'newest' | 'oldest' | 'title';

const News: React.FC<NewsProps> = ({ publications, isAdmin, setPublications }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showModal, setShowModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  const initialFormState: Partial<Publication> = {
    title: '',
    author: '',
    category: 'Article',
    summary: '',
    image_url: '',
    file_url: '',
    link: '#'
  };

  const [formState, setFormState] = useState<Partial<Publication>>(initialFormState);

  // Dynamic Category Counts
  const counts = useMemo(() => {
    return {
      All: publications.length,
      Article: publications.filter(p => p.category === 'Article').length,
      'College News': publications.filter(p => p.category === 'College News').length,
      'Annual Magazine': publications.filter(p => p.category === 'Annual Magazine').length,
    };
  }, [publications]);

  const filteredAndSortedPublications = useMemo(() => {
    let result = publications.filter(pub => {
      const matchesFilter = activeFilter === 'All' || pub.category === activeFilter;
      const lowerQuery = searchQuery.toLowerCase();
      return matchesFilter && (
        pub.title.toLowerCase().includes(lowerQuery) || 
        pub.author.toLowerCase().includes(lowerQuery) ||
        pub.summary.toLowerCase().includes(lowerQuery)
      );
    });

    return result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date).getTime();
      const dateB = new Date(b.created_at || b.date).getTime();

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [activeFilter, searchQuery, sortBy, publications]);

  const handleOpenAdd = () => {
    setFormState(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (pub: Publication) => {
    setFormState(pub);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this publication?");
    if (!confirmed) return;
    
    setIsSyncing(true);
    setStatus('Deleting publication...');
    try {
      await api.publications.delete(id);
      setPublications(prev => prev.filter(p => p.id !== id));
      setStatus('Deleted successfully');
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) {
      alert("Error: " + err.message);
      setStatus(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'cover' | 'pdf') => {
    setIsSyncing(true);
    setStatus(`Uploading ${type === 'cover' ? 'artwork' : 'document'}...`);
    try {
      const folder = type === 'cover' ? 'content' : 'summaries';
      const url = await storageService.uploadFile(file, folder);
      setFormState(prev => ({ ...prev, [type === 'cover' ? 'image_url' : 'file_url']: url }));
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setIsSyncing(false);
      setStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.image_url) {
      alert("Title and Cover are required.");
      return;
    }
    setIsSyncing(true);
    try {
      if (formState.id) {
        const updated = await api.publications.update(formState.id, formState);
        setPublications(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await api.publications.create({
          ...formState,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
        setPublications(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 bg-[#001bb8] min-h-screen transition-all">
      <div className="max-w-7xl mx-auto">
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[#1a1a1a] p-8 rounded-[2rem] border border-yellow-400/20 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8 text-left">
                <h2 className="text-2xl font-bold text-white">{formState.id ? 'Edit Entry' : 'New Entry'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                  <input required placeholder="Headline..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Author</label>
                    <input required placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none" value={formState.author} onChange={e => setFormState({...formState, author: e.target.value})} />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value as any})}>
                      <option value="Article">Article</option>
                      <option value="College News">College News</option>
                      <option value="Annual Magazine">Annual Magazine</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Summary</label>
                  <textarea required rows={3} placeholder="Brief abstract..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none resize-none" value={formState.summary} onChange={e => setFormState({...formState, summary: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Cover</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cover')} className="text-[10px] text-gray-400 w-full" />
                  </div>
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">PDF</p>
                    <input type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')} className="text-[10px] text-gray-400 w-full" />
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? (status || 'Saving...') : (formState.id ? 'UPDATE ENTRY' : 'PUBLISH')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER & FILTERS */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="w-full md:max-w-md">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search publications..." 
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-6 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'All', key: 'All' },
                { label: 'Articles', key: 'Article' },
                { label: 'College News', key: 'College News' },
                { label: 'Annual Magazine', key: 'Annual Magazine' }
              ].map(cat => (
                <button 
                  key={cat.key} 
                  onClick={() => setActiveFilter(cat.key)} 
                  className={`px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all border ${
                    activeFilter === cat.key 
                      ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.2)]' 
                      : 'bg-white/5 border-transparent text-gray-200 hover:text-white'
                  }`}
                >
                  {cat.label} <span className="opacity-50 ml-1">({counts[cat.key as keyof typeof counts]})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 border-t border-white/5 pt-8">
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2">Newsroom & Archives</h1>
              <p className="text-base text-gray-300 max-w-lg">The intellectual record of IARE, curated and published by The Compendium society.</p>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <button type="button" onClick={handleOpenAdd} className="px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all text-[12px] uppercase tracking-widest shadow-xl">+ NEW ENTRY</button>
              )}
              
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[#1a1a1a] border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-[12px] font-bold text-gray-300 uppercase tracking-widest focus:outline-none focus:border-yellow-400 cursor-pointer appearance-none shadow-xl"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID - Redesigned to match reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedPublications.length === 0 ? (
            <div className="col-span-full py-24 text-center opacity-50 border-2 border-dashed border-white/10 rounded-3xl">
              <p className="text-xl italic font-light">No results found for your selection...</p>
            </div>
          ) : (
            filteredAndSortedPublications.map((pub) => (
              <div key={pub.id} className="group relative bg-[#0d121f] rounded-xl overflow-hidden flex flex-col h-full text-left shadow-2xl transition-all hover:-translate-y-1">
                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-[50] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(pub)} className="p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(pub.id)} className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:scale-105 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}

                {/* Top Image Container */}
                <div 
                  className="h-56 overflow-hidden relative cursor-pointer" 
                  onClick={() => pub.file_url && window.open(pub.file_url, '_blank')}
                >
                  <img src={pub.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={pub.title} />
                  {/* Category Badge - Pill shape, top left as per image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-[#001bb8] text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-xl">
                      {pub.category === 'Article' ? 'Articles' : pub.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 leading-tight text-white group-hover:text-yellow-400 transition-colors line-clamp-2 h-[4rem]">
                    {pub.title}
                  </h3>
                  
                  <p className="text-base text-gray-300 mb-8 line-clamp-3 leading-relaxed flex-grow opacity-90">
                    {pub.summary}
                  </p>
                  
                  <button 
                    onClick={() => pub.file_url && window.open(pub.file_url, '_blank')} 
                    className="text-base font-bold text-white hover:text-yellow-400 transition-all w-fit flex items-center gap-2 group/link"
                  >
                    Read {pub.category === 'Article' ? 'article' : 'news'} <span className="text-xl group-hover/link:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;