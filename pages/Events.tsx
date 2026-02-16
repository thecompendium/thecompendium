
import React, { useState } from 'react';
import { Event } from '../types';
import { api, storageService } from '../services/supabase';

interface EventsProps {
  events: Event[];
  isAdmin: boolean;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const Events: React.FC<EventsProps> = ({ events, isAdmin, setEvents }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  const initialFormState: Partial<Event> = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image_url: '',
    registration_link: '',
    summary_file_url: ''
  };

  const [formState, setFormState] = useState<Partial<Event>>(initialFormState);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const handleOpenAdd = () => {
    setFormState(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (event: Event) => {
    setFormState(event);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    const confirmed = window.confirm("⚠ PERMANENT DELETION ⚠\n\nAre you sure you want to remove this event record?");
    if (!confirmed) return;
    
    setIsSyncing(true);
    setStatus('Deleting event...');
    try {
      await api.events.delete(id);
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setStatus('Event deleted successfully');
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) {
      alert("Error deleting event: " + err.message);
      setStatus(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'poster' | 'summary') => {
    setIsSyncing(true);
    setStatus(`Uploading ${type === 'poster' ? 'artwork' : 'document'}...`);
    try {
      const folder = type === 'poster' ? 'events' : 'summaries';
      const url = await storageService.uploadFile(file, folder);
      setFormState(prev => ({ ...prev, [type === 'poster' ? 'image_url' : 'summary_file_url']: url }));
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
      alert("Event Title and Poster Artwork are required.");
      return;
    }
    setIsSyncing(true);
    try {
      if (formState.id) {
        const updated = await api.events.update(formState.id, formState);
        setEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev));
      } else {
        const created = await api.events.create(formState);
        setEvents(prev => [...prev, created].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }
      setShowModal(false);
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6 bg-[var(--primary-bg)] min-h-screen transition-all">
      <div className="max-w-7xl mx-auto">
        {/* MODAL OMITTED FOR BREVITY, LOGIC UNCHANGED */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-2xl w-full bg-[#1c1c1c] p-10 rounded-[3rem] border border-yellow-400/20 shadow-3xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold serif-font text-white">{formState.id ? 'Edit Event Details' : 'Schedule New Event'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Event Title</label>
                  <input required placeholder="What's happening?" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400 transition-all" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Event Date</label>
                    <input required type="date" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400 transition-all" value={formState.date} onChange={e => setFormState({...formState, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Location</label>
                    <input required placeholder="Venue / Online Link" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400 transition-all" value={formState.location} onChange={e => setFormState({...formState, location: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Description</label>
                  <textarea required rows={4} placeholder="Agenda and details..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none resize-none focus:border-yellow-400 transition-all" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Registration Link (Optional)</label>
                  <input placeholder="Google Form / External Link" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400 transition-all" value={formState.registration_link} onChange={e => setFormState({...formState, registration_link: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Poster Artwork</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'poster')} className="text-xs text-gray-400 w-full cursor-pointer" />
                  </div>
                  <div className="p-6 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Event Report (PDF)</p>
                    <input type="file" accept=".pdf" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'summary')} className="text-xs text-gray-400 w-full cursor-pointer" />
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-6 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-yellow-500 transition-all active:scale-95">
                  {isSyncing ? (status || 'Syncing...') : (formState.id ? 'UPDATE EVENT ARCHIVE' : 'CONFIRM & SCHEDULE')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-yellow-400/10 text-yellow-500 text-[10px] font-black uppercase rounded-full mb-6 border border-yellow-400/20 tracking-widest">Society Engagement</span>
          <h1 className="text-6xl font-bold serif-font mb-8 text-[var(--text-main)]">Upcoming Gatherings</h1>
          <p className="text-xl text-[var(--text-muted)] font-light max-w-2xl mx-auto leading-relaxed">Workshops, summits, and intellectual discussions hosted by our society.</p>
          {isAdmin && (
            <button type="button" onClick={handleOpenAdd} className="mt-12 px-12 py-4 bg-yellow-400 text-black font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all">+ SCHEDULE EVENT</button>
          )}
        </div>

        {/* GRID: lg:grid-cols-4 for compact rectangular layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div key={event.id} className="group relative glow-card rounded-[1.25rem] overflow-hidden flex flex-col h-full shadow-2xl transition-all text-left">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-[50] flex gap-2">
                  <button onClick={() => handleOpenEdit(event)} className="p-2.5 bg-blue-600 text-white rounded-lg shadow-xl hover:scale-110 active:scale-90 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="p-2.5 bg-red-600 text-white rounded-lg shadow-xl hover:scale-110 active:scale-90 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}

              <div className="h-48 overflow-hidden relative">
                <img src={event.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={event.title} />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-yellow-400 text-black text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl">{formatDate(event.date)}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold serif-font mb-2 leading-tight group-hover:text-yellow-500 transition-colors h-[2.8rem] text-[var(--text-main)] line-clamp-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-yellow-500 text-[9px] font-black uppercase tracking-widest mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed mb-6 flex-grow italic line-clamp-3">"{event.description}"</p>
                <div className="flex flex-col gap-3 mt-auto">
                  {event.registration_link && (
                    <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-yellow-400 text-black text-[9px] font-black rounded-xl text-center shadow-lg uppercase tracking-widest transition-all hover:bg-yellow-500 active:scale-95">REGISTER ↗</a>
                  )}
                  {event.summary_file_url && (
                    <button type="button" onClick={() => window.open(event.summary_file_url, '_blank')} className="w-full py-3 bg-white/5 text-white text-[9px] font-black rounded-xl text-center border border-white/10 uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95">REPORT ↗</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
