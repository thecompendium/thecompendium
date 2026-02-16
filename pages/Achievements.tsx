import React, { useState, useEffect } from 'react';
import { Achievement, AchievementSubmission } from '../types';
import { api, storageService } from '../services/supabase';

interface AchievementsProps {
  achievements: Achievement[];
  isAdmin: boolean;
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, isAdmin, setAchievements }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionPortal, setShowSubmissionPortal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<AchievementSubmission[]>([]);
  
  const initialFormState: Partial<Achievement> = {
    name: '',
    roll_number: '',
    department: '',
    category: '',
    description: '',
    image_url: '',
    work_url: ''
  };

  const [formState, setFormState] = useState<Partial<Achievement>>(initialFormState);
  const [submitFormState, setSubmitFormState] = useState<Partial<AchievementSubmission>>({
    name: '', year: '', branch: '', phone: '', email: '', description: ''
  });

  useEffect(() => {
    if (isAdmin) api.achievements.getAllSubmissions().then(setSubmissions).catch(console.error);
  }, [isAdmin]);

  const handleOpenAdd = () => {
    setFormState(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setFormState(ach);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    console.log('handleDelete called with id:', id);
    
    if (!id) {
      console.error('No ID provided to handleDelete');
      alert('Error: No ID provided');
      return;
    }
    
    const confirmed = window.confirm("⚠ PERMANENT DELETION ⚠\n\nAre you sure you want to remove this record from the Wall of Fame?");
    console.log('User confirmed deletion:', confirmed);
    
    if (!confirmed) {
      console.log('User cancelled deletion');
      return;
    }
    
    console.log('Starting deletion process...');
    setIsSyncing(true);
    setStatus('Deleting achievement...');
    
    try {
      console.log('Calling api.achievements.delete with id:', id);
      await api.achievements.delete(id);
      console.log('API delete successful');
      
      setAchievements(prev => {
        const filtered = prev.filter(a => a.id !== id);
        console.log('Filtered achievements, before:', prev.length, 'after:', filtered.length);
        return filtered;
      });
      
      setStatus('Achievement deleted successfully');
      console.log('UI updated successfully');
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) {
      console.error('Delete error caught:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      alert("Error deleting achievement: " + err.message);
      setStatus(null);
    } finally {
      console.log('Deletion process complete');
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'profile' | 'portfolio') => {
    setIsSyncing(true);
    setStatus(`Uploading ${type === 'profile' ? 'portrait' : 'work proof'}...`);
    try {
      const folder = type === 'profile' ? 'achievements' : 'student_work';
      const url = await storageService.uploadFile(file, folder);
      setFormState(prev => ({ ...prev, [type === 'profile' ? 'image_url' : 'work_url']: url }));
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setIsSyncing(false);
      setStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.image_url) {
      alert("Portrait and Name are required.");
      return;
    }
    setIsSyncing(true);
    try {
      if (formState.id) {
        const updated = await api.achievements.update(formState.id, formState);
        setAchievements(prev => prev.map(a => a.id === updated.id ? updated : a));
      } else {
        const created = await api.achievements.create(formState);
        setAchievements(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await api.achievements.createSubmission(submitFormState);
      alert("Success! Your achievement has been submitted for review.");
      setShowSubmissionPortal(false);
      setSubmitFormState({ name: '', year: '', branch: '', phone: '', email: '', description: '' });
    } catch (e: any) {
      alert("Submission Failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6 bg-[var(--primary-bg)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ADMIN MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-2xl w-full bg-[#1e1c1c] p-12 rounded-[3rem] border border-yellow-400/20 shadow-3xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold serif-font text-white">{formState.id ? 'Edit Record' : 'Add Recognition'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Student Name</label>
                    <input required placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Roll Number</label>
                    <input required placeholder="2x951Axxxx" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.roll_number} onChange={e => setFormState({...formState, roll_number: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Department</label>
                    <input required placeholder="e.g. CSE(DS)" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.department} onChange={e => setFormState({...formState, department: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Recognition Category</label>
                    <input required placeholder="e.g. Best Storyteller" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Description / Achievement Details</label>
                  <textarea required rows={4} placeholder="Tell the story of their success..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none resize-none" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Profile Portrait</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile')} className="text-xs text-gray-400 w-full" />
                  </div>
                  <div className="p-6 bg-black/30 border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Portfolio / Proof (PDF/Img)</p>
                    <input type="file" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'portfolio')} className="text-xs text-gray-400 w-full" />
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-6 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-yellow-500 active:scale-95 transition-all">
                  {isSyncing ? (status || 'Syncing...') : (formState.id ? 'UPDATE RECOGNITION' : 'PUBLISH TO WALL')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VISITOR MODAL */}
        {showSubmissionPortal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[#021496] p-12 rounded-[3rem] border border-white/10 shadow-3xl relative">
              <button type="button" onClick={() => setShowSubmissionPortal(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-4xl font-bold serif-font text-white mb-10">Recognition Portal</h2>
              <form onSubmit={handleVisitorSubmit} className="space-y-8">
                <input required placeholder="Your Full Name" className="w-full bg-[#000a6e] border border-white/20 rounded-2xl px-6 py-5 text-white outline-none" value={submitFormState.name} onChange={e => setSubmitFormState({...submitFormState, name: e.target.value})} />
                <input required placeholder="Roll Number & Dept" className="w-full bg-[#000a6e] border border-white/20 rounded-2xl px-6 py-5 text-white outline-none" value={submitFormState.branch} onChange={e => setSubmitFormState({...submitFormState, branch: e.target.value})} />
                <textarea required rows={5} placeholder="Describe your achievement in detail..." className="w-full bg-[#000a6e] border border-white/20 rounded-2xl px-6 py-5 text-white outline-none resize-none" value={submitFormState.description} onChange={e => setSubmitFormState({...submitFormState, description: e.target.value})} />
                <button disabled={isSyncing} type="submit" className="w-full py-6 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-yellow-500 transition-all">
                  SUBMIT FOR EDITORIAL REVIEW
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-24 max-w-4xl mx-auto relative">
          <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-full mb-8 shadow-xl tracking-widest">Celebrating Excellence</span>
          <h1 className="text-6xl font-bold serif-font mb-8 text-[var(--text-main)]">Student Wall of Fame</h1>
          <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed">Showcasing the creativity, intellectual vigor, and exceptional milestones of our students. We celebrate the voices that shape our collective narrative.</p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            <button type="button" onClick={() => setShowSubmissionPortal(true)} className="px-12 py-5 bg-[#001bb8] text-white font-black rounded-3xl shadow-2xl uppercase tracking-widest text-xs border border-white/10 hover:bg-[#0025f5] transition-all">SUBMIT YOUR STORY</button>
            {isAdmin && <button type="button" onClick={handleOpenAdd} className="px-12 py-5 bg-yellow-400 text-black font-black rounded-3xl shadow-2xl uppercase tracking-widest text-xs hover:bg-yellow-500 transition-all">+ ADD RECORD</button>}
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className="fixed top-24 right-6 z-[3000] bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-2xl font-black text-sm animate-bounce">
            {status}
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {achievements.map((ach) => (
            <div key={ach.id} className="group relative glow-card rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 items-start transition-all duration-500">
              
              {/* ADMIN ACTIONS */}
              {isAdmin && (
                <div className="absolute top-8 right-8 z-[9999] flex gap-3 pointer-events-auto">
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('Edit clicked for:', ach.name);
                      handleOpenEdit(ach);
                    }}
                    disabled={isSyncing}
                    className="p-3 bg-blue-600 text-white rounded-xl shadow-2xl hover:scale-110 active:scale-90 border border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('Delete clicked for:', ach.name, ach.id);
                      handleDelete(ach.id);
                    }}
                    disabled={isSyncing}
                    className="px-5 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase shadow-2xl hover:scale-110 active:scale-90 border border-white/20 transition-all tracking-widest disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                  >
                    DELETE
                  </button>
                </div>
              )}

              <div className="w-full md:w-60 h-60 flex-shrink-0 relative overflow-hidden rounded-[2.5rem] border-4 border-yellow-400/20 shadow-3xl bg-black/40 group-hover:border-yellow-400 transition-all">
                <img src={ach.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={ach.name} />
              </div>

              <div className="flex-grow flex flex-col pt-2">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold serif-font text-[var(--text-main)] mb-1">{ach.name}</h3>
                  <p className="text-[10px] text-yellow-500 font-black tracking-[0.4em] uppercase">{ach.roll_number} • {ach.department}</p>
                </div>
                
                <div className="mb-8">
                  <span className="px-4 py-1.5 bg-yellow-400/10 text-yellow-500 text-[10px] font-black uppercase rounded-lg border border-yellow-400/20 tracking-widest">{ach.category}</span>
                </div>

                <p className="text-sm text-[var(--text-muted)] italic font-light leading-relaxed mb-10 border-l-2 border-yellow-400/30 pl-6 line-clamp-4">
                  "{ach.description}"
                </p>

                {ach.work_url && (
                  <a href={ach.work_url} target="_blank" rel="noopener noreferrer" className="mt-auto text-yellow-400 text-[9px] font-black uppercase tracking-[0.4em] hover:text-yellow-200 transition-all w-fit flex items-center gap-2">
                    VIEW PORTFOLIO / PROOF ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;