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

  const handleAcceptSubmission = (sub: AchievementSubmission) => {
    setFormState({
      name: sub.name,
      department: `${sub.branch} (Year ${sub.year})`,
      description: sub.description,
      roll_number: '', 
      category: '',    
      image_url: '',   
    });
    setShowModal(true);
  };

  const handleDismissSubmission = async (id: string) => {
    if (!confirm("Dismiss this submission?")) return;
    setIsSyncing(true);
    try {
      await api.achievements.deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSyncing(false);
    }
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
    } catch (e: any) {
      alert("Failed: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 min-h-screen relative overflow-hidden bg-white">
      {/* BACKGROUND PATTERN LAYER */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-100"
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
            <div className="max-w-xl w-full bg-[#1e1c1c] p-8 rounded-[2rem] border border-white/5 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold serif-font text-white">Share Your Story</h2>
                <button type="button" onClick={() => setShowSubmissionPortal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleVisitorSubmit} className="space-y-5 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                  <input required placeholder="Your name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none" value={submitFormState.name} onChange={e => setSubmitFormState({...submitFormState, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Year</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none" value={submitFormState.year} onChange={e => setSubmitFormState({...submitFormState, year: e.target.value})}>
                      <option value="">Year</option>
                      <option value="1">1st</option>
                      <option value="2">2nd</option>
                      <option value="3">3rd</option>
                      <option value="4">4th</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Branch</label>
                    <input required placeholder="e.g. CSE" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none" value={submitFormState.branch} onChange={e => setSubmitFormState({...submitFormState, branch: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Phone</label>
                    <input required placeholder="Contact" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none" value={submitFormState.phone} onChange={e => setSubmitFormState({...submitFormState, phone: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
                    <input required type="email" placeholder="Institutional" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none" value={submitFormState.email} onChange={e => setSubmitFormState({...submitFormState, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Achievement</label>
                  <textarea required rows={3} placeholder="Describe briefly..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-sm text-white outline-none resize-none" value={submitFormState.description} onChange={e => setSubmitFormState({...submitFormState, description: e.target.value})} />
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[10px] shadow-xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? 'Submitting...' : 'SUBMIT STORY'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADMIN MANAGEMENT MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-[#1e1c1c] p-8 rounded-[2rem] border border-yellow-400/20 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8 text-left">
                <h2 className="text-2xl font-bold serif-font text-white">{formState.id ? 'Edit Achievement' : 'Add Achievement'}</h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Name</label>
                    <input required placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Roll No.</label>
                    <input required placeholder="2x951Axxxx" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none" value={formState.roll_number} onChange={e => setFormState({...formState, roll_number: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Dept.</label>
                    <input required placeholder="CSE(DS)" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none" value={formState.department} onChange={e => setFormState({...formState, department: e.target.value})} />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                    <input required placeholder="Best Writer" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                  <textarea required rows={3} placeholder="Tell the story..." className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none resize-none" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Portrait</p>
                    <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile')} className="text-[10px] text-gray-400 w-full" />
                  </div>
                  <div className="p-4 bg-black/30 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-2">Portfolio</p>
                    <input type="file" onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'portfolio')} className="text-[10px] text-gray-400 w-full" />
                  </div>
                </div>
                <button disabled={isSyncing} type="submit" className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest text-[9px] shadow-xl hover:bg-yellow-500 transition-all">
                  {isSyncing ? 'Syncing...' : (formState.id ? 'UPDATE' : 'PUBLISH')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-20 max-w-3xl mx-auto relative">
          <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-[9px] font-black uppercase rounded-full mb-6 shadow-xl tracking-widest">Celebrating Excellence</span>
          <h1 className="text-4xl md:text-5xl font-bold serif-font mb-6 text-slate-900">Student Wall of Fame</h1>
          <p className="text-base text-slate-500 font-light leading-relaxed max-w-xl mx-auto">Showcasing creativity and exceptional milestones of our students.</p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button type="button" onClick={() => setShowSubmissionPortal(true)} className="px-8 py-3.5 bg-[#021496] text-white font-black rounded-xl shadow-xl uppercase tracking-widest text-[9px] border border-white/10 hover:bg-[#0025f5] transition-all">SUBMIT STORY</button>
            {isAdmin && <button type="button" onClick={handleOpenAdd} className="px-8 py-3.5 bg-yellow-500 text-black font-black rounded-xl shadow-xl uppercase tracking-widest text-[9px] hover:bg-yellow-600 transition-all">+ ADD RECORD</button>}
          </div>
        </div>

        {/* ADMIN SUBMISSION LOGS */}
        {isAdmin && submissions.length > 0 && (
          <section className="mb-24 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
              <h2 className="text-2xl font-bold serif-font text-slate-900">Pending Review</h2>
              <span className="ml-auto px-3 py-0.5 bg-white rounded-full border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">{submissions.length} Total</span>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/95 shadow-2xl backdrop-blur-md">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Student</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Achievement</th>
                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <p className="text-slate-900 font-bold mb-0.5">{sub.name}</p>
                        <p className="text-yellow-600 text-[8px] font-black uppercase">{sub.branch} • Yr {sub.year}</p>
                      </td>
                      <td className="px-6 py-6 max-w-xs">
                        <p className="text-slate-500 text-xs italic line-clamp-2">"{sub.description}"</p>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleAcceptSubmission(sub)} className="px-4 py-1.5 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg text-[9px] font-black uppercase hover:bg-green-600 hover:text-white transition-all">Accept</button>
                          <button onClick={() => handleDismissSubmission(sub.id)} className="px-4 py-1.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Dismiss</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* PUBLIC WALL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {achievements.map((ach) => (
            <div key={ach.id} className="group relative glow-card rounded-[1.25rem] overflow-hidden flex flex-col h-full text-left transition-all shadow-lg">
              {isAdmin && (
                <div className="absolute top-3 right-3 z-[50] flex gap-1.5">
                  <button onClick={() => handleOpenEdit(ach)} className="p-1.5 bg-blue-600 text-white rounded shadow-xl hover:scale-105 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(ach.id)} className="p-1.5 bg-red-600 text-white rounded shadow-xl hover:scale-105 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}

              <div className="h-48 overflow-hidden relative border-b border-white/5">
                <img src={ach.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={ach.name} />
                <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-yellow-400 text-black text-[8px] font-black rounded uppercase tracking-widest shadow-xl">{ach.category}</span>
              </div>

              <div className="p-5 flex flex-col flex-grow bg-[#211f1e]/95 backdrop-blur-sm">
                <h3 className="text-base font-bold serif-font text-white mb-0.5 group-hover:text-yellow-400 transition-colors line-clamp-1">{ach.name}</h3>
                <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest mb-3">{ach.roll_number} • {ach.department}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-5 line-clamp-3 flex-grow italic">"{ach.description}"</p>
                {ach.work_url && (
                  <button onClick={() => window.open(ach.work_url, '_blank')} className="text-[9px] font-black text-white hover:text-yellow-400 uppercase tracking-widest transition-all w-fit flex items-center gap-1.5 border-b border-white/20 pb-0.5">PROOF ↗</button>
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