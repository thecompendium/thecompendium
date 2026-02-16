
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
    if (!id) return;
    const confirmed = window.confirm("⚠ PERMANENT DELETION ⚠\n\nAre you sure you want to remove this record?");
    if (!confirmed) return;
    
    setIsSyncing(true);
    setStatus('Deleting achievement...');
    try {
      await api.achievements.delete(id);
      setAchievements(prev => prev.filter(a => a.id !== id));
      setStatus('Achievement deleted successfully');
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) {
      alert("Error deleting achievement: " + err.message);
      setStatus(null);
    } finally {
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
        {/* ADMIN MODAL (Logic unchanged) */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-2xl w-full bg-[#1e1c1c] p-12 rounded-[3rem] border border-yellow-400/20 shadow-3xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10 text-left">
                <h2 className="text-3xl font-bold serif-font text-white">{formState.id ? 'Edit Record' : 'Add Recognition'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Student Name</label>
                    <input required placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Roll Number</label>
                    <input required placeholder="2x951Axxxx" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.roll_number} onChange={e => setFormState({...formState, roll_number: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Department</label>
                    <input required placeholder="e.g. CSE(DS)" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.department} onChange={e => setFormState({...formState, department: e.target.value})} />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Recognition Category</label>
                    <input required placeholder="e.g. Best Storyteller" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2 text-left">
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

        {/* HEADER */}
        <div className="text-center mb-24 max-w-4xl mx-auto relative">
          <span className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-full mb-8 shadow-xl tracking-widest">Celebrating Excellence</span>
          <h1 className="text-6xl font-bold serif-font mb-8 text-[var(--text-main)]">Student Wall of Fame</h1>
          <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed">Showcasing creativity and exceptional milestones of our students.</p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <button type="button" onClick={() => setShowSubmissionPortal(true)} className="px-10 py-4 bg-[#001bb8] text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px] border border-white/10 hover:bg-[#0025f5] transition-all">SUBMIT STORY</button>
            {isAdmin && <button type="button" onClick={handleOpenAdd} className="px-10 py-4 bg-yellow-400 text-black font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all">+ ADD RECORD</button>}
          </div>
        </div>

        {/* GRID: Unified compact 4-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {achievements.map((ach) => (
            <div key={ach.id} className="group relative glow-card rounded-[1.5rem] overflow-hidden flex flex-col h-full text-left transition-all">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-[50] flex gap-2">
                  <button onClick={() => handleOpenEdit(ach)} className="p-2.5 bg-blue-600 text-white rounded-lg shadow-xl hover:scale-110 active:scale-90 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(ach.id)} className="p-2.5 bg-red-600 text-white rounded-lg shadow-xl hover:scale-110 active:scale-90 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}

              <div className="h-52 overflow-hidden relative border-b border-white/5">
                <img src={ach.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={ach.name} />
                <span className="absolute bottom-4 left-4 px-3 py-1 bg-yellow-400 text-black text-[9px] font-black rounded-lg uppercase tracking-widest shadow-xl">{ach.category}</span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold serif-font text-white mb-1 group-hover:text-yellow-400 transition-colors line-clamp-1">{ach.name}</h3>
                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-4">{ach.roll_number} • {ach.department}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-3 flex-grow italic">"{ach.description}"</p>
                {ach.work_url && (
                  <button onClick={() => window.open(ach.work_url, '_blank')} className="text-[10px] font-black text-white hover:text-yellow-400 uppercase tracking-widest transition-all w-fit flex items-center gap-2 border-b border-white/20 pb-1">PROOF ↗</button>
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
