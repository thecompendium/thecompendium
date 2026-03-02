
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

  const fetchSubmissions = async () => {
    if (isAdmin) {
      try {
        const data = await api.achievements.getAllSubmissions();
        setSubmissions(data);
      } catch (e) {
        console.error("Submissions fetch failed", e);
      }
    }
  };

  useEffect(() => {
    fetchSubmissions();
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
    const confirmed = window.confirm("Are you sure you want to delete this achievement?");
    if (!confirmed) return;
    
    setIsSyncing(true);
    setStatus('Deleting...');
    try {
      await api.achievements.delete(id);
      setAchievements(prev => prev.filter(a => a.id !== id));
      setStatus('Deleted');
      setTimeout(() => setStatus(null), 2000);
    } catch (err: any) {
      alert("Error: " + err.message);
      setStatus(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'profile' | 'portfolio') => {
    setIsSyncing(true);
    setStatus(`Uploading...`);
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
      alert("Achievement submitted for review.");
      setShowSubmissionPortal(false);
      setSubmitFormState({ name: '', year: '', branch: '', phone: '', email: '', description: '' });
      if (isAdmin) fetchSubmissions();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 min-h-screen relative overflow-hidden bg-[var(--primary-bg)] transition-colors">
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{ 
          backgroundImage: `url('https://ekrrilidqrjbddapdfkc.supabase.co/storage/v1/object/public/the_compendium_files/site_assets/Untitled%20design%20(2).png')`,
          backgroundSize: '1000px',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* VISITOR SUBMISSION MODAL */}
        {showSubmissionPortal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[var(--card-bg)] p-10 rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold serif-font text-[var(--text-main)]">Share Your Story</h2>
                <button type="button" onClick={() => setShowSubmissionPortal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleVisitorSubmit} className="space-y-6 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Full Name</label>
                  <input required placeholder="Your name" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={submitFormState.name} onChange={e => setSubmitFormState({...submitFormState, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Year</label>
                    <select className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={submitFormState.year} onChange={e => setSubmitFormState({...submitFormState, year: e.target.value})}>
                      <option value="">Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Branch</label>
                    <input required placeholder="e.g. CSE" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={submitFormState.branch} onChange={e => setSubmitFormState({...submitFormState, branch: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone</label>
                    <input required placeholder="Contact" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={submitFormState.phone} onChange={e => setSubmitFormState({...submitFormState, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Email</label>
                    <input required type="email" placeholder="Institutional" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={submitFormState.email} onChange={e => setSubmitFormState({...submitFormState, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Achievement Description</label>
                  <textarea required rows={4} placeholder="Describe briefly..." className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none resize-none focus:border-[#021496]" value={submitFormState.description} onChange={e => setSubmitFormState({...submitFormState, description: e.target.value})} />
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-5 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[11px] shadow-2xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? 'Submitting...' : 'SUBMIT FOR REVIEW'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[var(--card-bg)] p-10 rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold serif-font text-[var(--text-main)]">{formState.id ? 'Edit Record' : 'Add New Record'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Full Name</label>
                  <input required placeholder="Student name" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Roll Number</label>
                    <input placeholder="Roll/ID" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={formState.roll_number} onChange={e => setFormState({...formState, roll_number: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Department</label>
                    <input placeholder="Department" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={formState.department} onChange={e => setFormState({...formState, department: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Category</label>
                  <input placeholder="e.g. Arts, Sports" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none focus:border-[#021496]" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Description</label>
                  <textarea rows={4} placeholder="Brief description" className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-[var(--text-main)] outline-none resize-none focus:border-[#021496]" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--card-bg)] border border-dashed border-[var(--border-color)] rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Portrait (required)</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile')} className="text-[10px] text-[var(--text-main)]" />
                    {status && <p className="text-sm text-[var(--text-muted)] mt-2">{status}</p>}
                  </div>
                  <div className="p-4 bg-[var(--card-bg)] border border-dashed border-[var(--border-color)] rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Work / Project (optional)</p>
                    <input type="file" accept="*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'portfolio')} className="text-[10px] text-[var(--text-main)]" />
                  </div>
                </div>

                <button disabled={isSyncing} type="submit" className="w-full py-5 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[11px] shadow-2xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? (status || 'Saving...') : (formState.id ? 'SAVE CHANGES' : 'ADD RECORD')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-[#021496]/10 text-[#021496] text-[10px] font-black uppercase rounded-full mb-8 shadow-sm tracking-[0.2em] border border-[#021496]/20">Celebrating Excellence</span>
          <h1 className="text-5xl md:text-6xl font-bold serif-font mb-6 text-[var(--text-main)] drop-shadow-sm">Student Wall of Fame</h1>
          <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed max-w-xl mx-auto">Showcasing creativity and exceptional milestones of our students.</p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <button 
              type="button" 
              onClick={() => setShowSubmissionPortal(true)} 
              className="px-10 py-4 bg-[#021496] text-white font-black rounded-xl shadow-xl uppercase tracking-widest text-[11px] border border-white/10 hover:brightness-110 transition-all"
            >
              SUBMIT YOUR STORY
            </button>
            {isAdmin && (
              <button 
                type="button" 
                onClick={handleOpenAdd} 
                className={`px-10 py-4 font-black rounded-xl shadow-xl uppercase tracking-widest text-[11px] hover:brightness-110 transition-all border border-black/10 ${localStorage.getItem('compendium_theme') === 'light' ? 'bg-[#021496] text-white' : 'bg-yellow-400 text-black'}`}
              >
                + ADD NEW RECORD
              </button>
            )}
          </div>
        </div>

        {/* PUBLIC WALL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {achievements.map((ach) => (
            <div key={ach.id} className="group relative glow-card rounded-[2.5rem] overflow-hidden flex flex-col h-full text-left transition-all shadow-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-[50] flex gap-2">
                  <button onClick={() => handleOpenEdit(ach)} className="p-2 bg-blue-600 text-white rounded-xl shadow-2xl hover:scale-110 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(ach.id)} className="p-2 bg-red-600 text-white rounded-xl shadow-2xl hover:scale-110 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}

              <div className="h-56 overflow-hidden relative border-b border-[var(--border-color)]">
                <img src={ach.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={ach.name} />
                <span className="absolute bottom-5 left-5 px-3 py-1 bg-[#021496] text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-2xl border border-white/10">
                  {ach.category}
                </span>
              </div>

              <div className="p-8 flex flex-col flex-grow transition-colors">
                <h3 className="text-2xl font-bold serif-font text-[var(--text-main)] mb-1 group-hover:text-[#021496] transition-colors line-clamp-1">{ach.name}</h3>
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] mb-6">{ach.roll_number} • {ach.department}</p>
                <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8 line-clamp-3 flex-grow italic font-light">"{ach.description}"</p>
                {ach.work_url && (
                  <button onClick={() => window.open(ach.work_url, '_blank')} className="text-[11px] font-black text-[var(--text-main)] hover:text-[#021496] uppercase tracking-widest transition-all w-fit flex items-center gap-2 border-b-2 border-[var(--border-color)] pb-1">VIEW WORK ↗</button>
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
