
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
    file_url: ''
  };

  const [formState, setFormState] = useState<Partial<Publication>>(initialFormState);

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
    if (!window.confirm("Delete this entry?")) return;
    setIsSyncing(true);
    try {
      await api.publications.delete(id);
      setPublications(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'cover' | 'pdf') => {
    setIsSyncing(true);
    setStatus(`Uploading...`);
    try {
      const url = await storageService.uploadFile(file, type === 'cover' ? 'content' : 'summaries');
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
    <div className="pt-32 pb-32 px-6 bg-[var(--primary-bg)] min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto">
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[#1c1c1c] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-white serif-font">{formState.id ? 'Edit Entry' : 'New Publication'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                  <input required placeholder="Headline..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Author</label>
                    <input required placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none" value={formState.author} onChange={e => setFormState({...formState, author: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value as any})}>
                      <option value="Article">Article</option>
                      <option value="College News">College News</option>
                      <option value="Annual Magazine">Annual Magazine</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Summary</label>
                  <textarea required rows={4} placeholder="Abstract..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none resize-none" value={formState.summary} onChange={e => setFormState({...formState, summary: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Cover Artwork</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cover')} className="text-[10px] text-gray-400" />
                  </div>
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Document (PDF)</p>
                    <input type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')} className="text-[10px] text-gray-400" />
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-5 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[11px] shadow-2xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? (status || 'Saving...') : 'Publish to Newsroom'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="text-left mb-16 border-b border-[var(--border-color)] pb-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
             <div>
                <h1 className="text-5xl font-bold text-[var(--text-main)] mb-4 serif-font">Newsroom & Archives</h1>
                <p className="text-xl text-[var(--text-muted)] font-light max-w-2xl">A curated platform for intellectual dialogue and campus updates.</p>
             </div>
             <div className="flex gap-4">
                {isAdmin && <button onClick={handleOpenAdd} className="px-8 py-3 bg-[var(--accent-color)] text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl">+ New Publication</button>}
                <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-5 py-3 text-[11px] font-bold uppercase tracking-widest focus:outline-none shadow-sm">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
             </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-12">
            <div className="flex flex-wrap gap-2">
              {['All', 'Article', 'College News', 'Annual Magazine'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveFilter(cat)} 
                  className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-[#021496] text-white border-[#021496] shadow-xl' : 'bg-transparent text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'}`}
                >
                  {cat === 'Article' ? 'Articles' : cat} <span className="opacity-40 ml-1">({counts[cat as keyof typeof counts]})</span>
                </button>
              ))}
            </div>

            <div className="relative flex-grow max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-[var(--text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles, authors or topics..."
                className="block w-full pl-11 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-main)] rounded-full text-sm focus:ring-1 focus:ring-[#021496] focus:border-[#021496] outline-none transition-all placeholder:text-[var(--text-muted)]/50 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredAndSortedPublications.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-[var(--text-muted)] italic">No publications found matching your search.</p>
            </div>
          ) : (
            filteredAndSortedPublications.map((pub) => (
              <div key={pub.id} className="group glow-card rounded-[2rem] overflow-hidden flex flex-col h-full text-left shadow-xl transition-all border border-[var(--border-color)] bg-[var(--card-bg)]">
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-[50] flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(pub)} className="p-2 bg-blue-600 text-white rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button onClick={() => handleDelete(pub.id)} className="p-2 bg-red-600 text-white rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                )}
                <div className="h-64 overflow-hidden relative cursor-pointer" onClick={() => pub.file_url && window.open(pub.file_url, '_blank')}>
                  <img src={pub.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={pub.title} />
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-[#021496] text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-2xl border border-white/10">
                      {pub.category === 'Article' ? 'Articles' : pub.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 leading-tight text-[var(--text-main)] group-hover:text-[#021496] transition-colors line-clamp-2 h-[4rem] serif-font">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mb-8 line-clamp-3 leading-relaxed flex-grow font-light">
                    {pub.summary}
                  </p>
                  <button onClick={() => pub.file_url && window.open(pub.file_url, '_blank')} className="text-[10px] font-black text-[var(--text-main)] hover:text-[#021496] uppercase tracking-[0.3em] transition-all flex items-center gap-3">
                    Read Full Piece <span className="text-base">→</span>
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
