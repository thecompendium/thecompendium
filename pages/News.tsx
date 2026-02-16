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
    console.log('handleDelete called with id:', id);
    
    if (!id) {
      console.error('No ID provided to handleDelete');
      alert('Error: No ID provided');
      return;
    }
    
    const confirmed = window.confirm("⚠ PERMANENT DELETION ⚠\n\nAre you sure you want to delete this publication from the cloud?");
    console.log('User confirmed deletion:', confirmed);
    
    if (!confirmed) {
      console.log('User cancelled deletion');
      return;
    }
    
    console.log('Starting deletion process...');
    setIsSyncing(true);
    setStatus('Deleting publication...');
    
    try {
      console.log('Calling api.publications.delete with id:', id);
      await api.publications.delete(id);
      console.log('API delete successful');
      
      setPublications(prev => {
        const filtered = prev.filter(p => p.id !== id);
        console.log('Filtered publications, before:', prev.length, 'after:', filtered.length);
        return filtered;
      });
      
      setStatus('Publication deleted successfully');
      console.log('UI updated successfully');
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) {
      console.error('Delete error caught:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      alert("Error deleting publication: " + err.message);
      setStatus(null);
    } finally {
      console.log('Deletion process complete');
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
      alert("Title and Cover Image are mandatory.");
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
      alert("Save failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6 bg-[var(--primary-bg)] min-h-screen transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        {/* CRUD MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-2xl w-full bg-[#1a1a1a] p-10 rounded-[3rem] border border-yellow-400/20 shadow-3xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-bold serif-font text-white">{formState.id ? 'Edit Publication' : 'New Publication'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Publication Title</label>
                  <input required placeholder="Enter headline..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-yellow-400 outline-none transition-all" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Author</label>
                    <input required placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-yellow-400 outline-none transition-all" value={formState.author} onChange={e => setFormState({...formState, author: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Category</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-yellow-400 outline-none transition-all" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value as any})}>
                      <option value="Article">Article</option>
                      <option value="College News">College News</option>
                      <option value="Annual Magazine">Annual Magazine</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Summary / Abstract</label>
                  <textarea required rows={4} placeholder="Brief description..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-yellow-400 outline-none transition-all resize-none" value={formState.summary} onChange={e => setFormState({...formState, summary: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl group hover:border-yellow-400/40 transition-all">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Cover Artwork</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cover')} className="text-xs text-gray-400 w-full cursor-pointer" />
                    {formState.image_url && <p className="mt-4 text-[9px] text-green-500 font-bold uppercase tracking-widest">✓ File Staged</p>}
                  </div>
                  <div className="p-6 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl group hover:border-yellow-400/40 transition-all">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Full Document (PDF)</p>
                    <input type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')} className="text-xs text-gray-400 w-full cursor-pointer" />
                    {formState.file_url && <p className="mt-4 text-[9px] text-green-500 font-bold uppercase tracking-widest">✓ PDF Staged</p>}
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-6 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-yellow-500 active:scale-95 transition-all">
                  {isSyncing ? (status || 'Syncing...') : (formState.id ? 'UPDATE ARCHIVE' : 'PUBLISH ENTRY')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-yellow-400/10 text-yellow-500 text-[10px] font-black uppercase rounded-full mb-6 border border-yellow-400/20 tracking-widest">The Knowledge Vault</span>
          <h1 className="text-6xl font-bold serif-font mb-8 text-[var(--text-main)]">Newsroom & Archives</h1>
          <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed">The intellectual record of IARE, curated and published by The Compendium society. Exploring campus culture and academic discourse.</p>
          
          <div className="mt-20 mb-16 relative">
            <input type="text" placeholder="Search by headline, author, or keyword..." className="w-full bg-[var(--input-bg)] border-2 border-[var(--border-color)] rounded-full py-8 pl-10 pr-10 text-xl text-[var(--text-main)] focus:outline-none focus:border-yellow-500 transition-all shadow-2xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['All', 'Article', 'College News', 'Annual Magazine'].map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-yellow-400 text-black shadow-2xl scale-110' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}>{cat}</button>
            ))}
          </div>
          
          {isAdmin && (
            <button type="button" onClick={handleOpenAdd} className="mt-16 px-16 py-6 bg-yellow-400 text-black font-black rounded-[2rem] hover:bg-yellow-500 transition-all shadow-2xl uppercase tracking-[0.3em] text-[10px] active:scale-95">+ NEW PUBLICATION</button>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div className="fixed top-24 right-6 z-[3000] bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-2xl font-black text-sm animate-bounce">
            {status}
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
          {filteredPublications.map((pub) => (
            <div key={pub.id} className="group relative glow-card rounded-[2.5rem] overflow-hidden flex flex-col h-full transition-all">
              
              {/* ADMIN ACTIONS - TOPMOST LAYER */}
              {isAdmin && (
                <div className="absolute top-6 right-6 z-[9999] flex gap-3 pointer-events-auto">
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('Edit clicked for:', pub.title);
                      handleOpenEdit(pub);
                    }}
                    disabled={isSyncing}
                    className="p-3 bg-blue-600 text-white rounded-xl shadow-2xl hover:scale-110 active:scale-90 border border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto" 
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('Delete clicked for:', pub.title, pub.id);
                      handleDelete(pub.id);
                    }}
                    disabled={isSyncing}
                    className="px-5 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase shadow-2xl hover:scale-110 active:scale-90 border border-white/20 transition-all tracking-widest disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto" 
                    title="Delete"
                  >
                    DELETE
                  </button>
                </div>
              )}

              <div 
                className="h-64 cursor-pointer overflow-hidden relative" 
                onClick={() => pub.file_url && window.open(pub.file_url, '_blank')}
              >
                <img src={pub.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={pub.title} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <span className="absolute bottom-6 left-6 px-4 py-1 bg-yellow-400 text-black text-[9px] font-black rounded-lg uppercase tracking-widest shadow-2xl">{pub.category}</span>
              </div>

              <div className="p-10 flex flex-col flex-grow text-left">
                <h3 className="text-2xl font-bold serif-font mb-4 leading-tight text-[var(--text-main)] group-hover:text-yellow-500 transition-colors h-[3.5rem] line-clamp-2">{pub.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-8 line-clamp-4 font-light italic border-l-2 border-yellow-400/30 pl-6 leading-relaxed">"{pub.summary}"</p>
                <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
                  <button type="button" onClick={() => pub.file_url && window.open(pub.file_url, '_blank')} className="text-[10px] font-black text-white hover:text-yellow-400 uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                    {pub.file_url ? 'READ PDF ↗' : 'READ FULL ↗'}
                  </button>
                  <div className="text-right">
                    <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{pub.author}</p>
                    <p className="text-[9px] text-gray-500 font-medium uppercase mt-1">{pub.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;