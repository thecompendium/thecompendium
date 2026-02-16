import React, { useState, useMemo } from 'react';
import { Publication } from '../types';
import { api, storageService } from '../services/supabase';

interface NewsProps {
  publications: Publication[];
  isAdmin: boolean;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
}

const News: React.FC<NewsProps> = ({ publications, isAdmin, setPublications }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const matchesFilter = activeFilter === 'All' || pub.category === activeFilter;
      const lowerQuery = searchQuery.toLowerCase();
      return matchesFilter && (
        pub.title.toLowerCase().includes(lowerQuery) || 
        pub.author.toLowerCase().includes(lowerQuery) ||
        pub.summary.toLowerCase().includes(lowerQuery)
      );
    });
  }, [activeFilter, searchQuery, publications]);

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
    <div className="pt-32 pb-32 px-6 bg-[var(--primary-bg)] min-h-screen transition-all">
      <div className="max-w-7xl mx-auto">
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[#1a1a1a] p-8 rounded-[2rem] border border-yellow-400/20 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold serif-font text-white">{formState.id ? 'Edit Entry' : 'New Entry'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                  <input required placeholder="Headline..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Author</label>
                    <input required placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none" value={formState.author} onChange={e => setFormState({...formState, author: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value as any})}>
                      <option value="Article">Article</option>
                      <option value="College News">College News</option>
                      <option value="Annual Magazine">Annual Magazine</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Summary</label>
                  <textarea required rows={3} placeholder="Brief abstract..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none resize-none" value={formState.summary} onChange={e => setFormState({...formState, summary: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Cover</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cover')} className="text-[10px] text-gray-400" />
                  </div>
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">PDF</p>
                    <input type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')} className="text-[10px] text-gray-400" />
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? (status || 'Saving...') : (formState.id ? 'UPDATE ENTRY' : 'PUBLISH')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-500 text-[9px] font-black uppercase rounded-full mb-5 border border-yellow-400/20 tracking-[0.2em]">The Knowledge Vault</span>
          <h1 className="text-4xl md:text-5xl font-bold serif-font mb-6 text-[var(--text-main)]">Newsroom & Archives</h1>
          <p className="text-base text-[var(--text-muted)] font-light leading-relaxed max-w-xl mx-auto">The intellectual record of IARE, curated and published by The Compendium society.</p>
          
          <div className="mt-10 mb-8 relative max-w-xl mx-auto">
            <input type="text" placeholder="Search archive..." className="w-full bg-[var(--input-bg)] border-2 border-[var(--border-color)] rounded-full py-4 px-8 text-base text-[var(--text-main)] focus:outline-none focus:border-yellow-500 transition-all shadow-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['All', 'Article', 'College News', 'Annual Magazine'].map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}>{cat}</button>
            ))}
          </div>
          
          {isAdmin && (
            <button type="button" onClick={handleOpenAdd} className="mt-10 px-8 py-3 bg-yellow-400 text-black font-black rounded-xl hover:bg-yellow-500 transition-all shadow-lg uppercase tracking-widest text-[9px]">+ NEW ENTRY</button>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPublications.map((pub) => (
            <div key={pub.id} className="group relative glow-card rounded-[1rem] overflow-hidden flex flex-col h-full text-left shadow-lg">
              {isAdmin && (
                <div className="absolute top-3 right-3 z-[50] flex gap-1.5">
                  <button onClick={() => handleOpenEdit(pub)} className="p-1.5 bg-blue-600 text-white rounded shadow-lg hover:scale-105 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(pub.id)} className="p-1.5 bg-red-600 text-white rounded shadow-lg hover:scale-105 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}

              <div className="h-44 overflow-hidden relative cursor-pointer" onClick={() => pub.file_url && window.open(pub.file_url, '_blank')}>
                <img src={pub.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={pub.title} />
                <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-black rounded uppercase tracking-widest shadow-xl">{pub.category}</span>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-base font-bold serif-font mb-1.5 leading-tight text-[var(--text-main)] group-hover:text-yellow-500 transition-colors h-[2.5rem] line-clamp-2">{pub.title}</h3>
                <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest mb-3">{pub.author} • {pub.date}</p>
                <p className="text-xs text-[var(--text-muted)] mb-5 line-clamp-3 italic leading-relaxed flex-grow">"{pub.summary}"</p>
                <button onClick={() => pub.file_url && window.open(pub.file_url, '_blank')} className="text-[9px] font-black text-white hover:text-yellow-400 uppercase tracking-widest transition-all w-fit border-b border-white/20 pb-0.5">READ PDF →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;