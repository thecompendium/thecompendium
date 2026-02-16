
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Publication, Achievement, Event } from '../types';
import { api } from '../services/supabase';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

interface HomeProps {
  onNavigate: (page: Page) => void;
  publications: Publication[];
  achievements: Achievement[];
  events: Event[];
  isAdmin: boolean;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
}

const Home: React.FC<HomeProps> = ({ onNavigate, publications, achievements, events, isAdmin }) => {
  const [heroTitle, setHeroTitle] = useState("Where Student Voices and Achievements Find Their Expression");
  const [heroSub, setHeroSub] = useState("The Compendium is the official news and publication society, providing a curated platform for students to showcase intellectual and creative milestones.");
  
  // Recruitment Section State
  const [joinLink, setJoinLink] = useState("");
  const [joinEnabled, setJoinEnabled] = useState(false);
  const [joinNotice, setJoinNotice] = useState("Applications are currently closed. Next application period opens in April.");

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Live Assistant State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const fetchHomeConfig = useCallback(async () => {
    try {
      const [title, sub, link, enabled, notice] = await Promise.all([
        api.config.get('home_hero_title'),
        api.config.get('home_hero_sub'),
        api.config.get('join_team_link'),
        api.config.get('join_team_enabled'),
        api.config.get('join_team_notice')
      ]);
      if (title) setHeroTitle(title);
      if (sub) setHeroSub(sub);
      if (link) setJoinLink(link);
      if (enabled) setJoinEnabled(enabled === 'true');
      if (notice) setJoinNotice(notice);
    } catch (e) {
      console.warn("Using default config text");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHomeConfig(); }, [fetchHomeConfig]);

  // Encoding utility for audio
  const encodeAudio = (data: Float32Array): string => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Decoding utility for audio
  const decodeAudio = (base64: string): Uint8Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  // AI Assistant Logic
  const startAssistant = async () => {
    if (isLiveActive) return;
    setIsLiveConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64 = encodeAudio(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
            setIsLiveActive(true);
            setIsLiveConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            const content = message.serverContent;
            if (content && content.modelTurn && content.modelTurn.parts) {
              const audioPart = content.modelTurn.parts.find(p => p.inlineData?.data);
              // FIX TS2345: Explicitly capture and check if the data exists and is a string
              const audioData = audioPart?.inlineData?.data;
              if (audioData) {
                const bytes = decodeAudio(audioData);
                const dataInt16 = new Int16Array(bytes.buffer);
                const buffer = audioContextRef.current!.createBuffer(1, dataInt16.length, 24000);
                const channelData = buffer.getChannelData(0);
                for (let i = 0; i < dataInt16.length; i++) {
                  channelData[i] = dataInt16[i] / 32768.0;
                }
                
                const source = audioContextRef.current!.createBufferSource();
                source.buffer = buffer;
                source.connect(outputNodeRef.current!);
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (content && content.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsLiveActive(false),
          onerror: () => setIsLiveActive(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are the official AI representative of The Compendium, the News and Publication Society of IARE. You are friendly, academic yet creative, and professional. Your goal is to help visitors understand that we publish articles, news, and magazines, and that we highlight student achievements. If they ask about joining, tell them to check the "Join Our Team" section on the home page. Speak concisely and warmly.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setIsLiveConnecting(false);
    }
  };

  const stopAssistant = () => {
    sessionRef.current?.close();
    setIsLiveActive(false);
  };

  const handleSync = async () => {
    if (isSyncing || !hasUnsavedChanges) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        api.config.set('home_hero_title', heroTitle),
        api.config.set('home_hero_sub', heroSub),
        api.config.set('join_team_link', joinLink),
        api.config.set('join_team_enabled', joinEnabled.toString()),
        api.config.set('join_team_notice', joinNotice)
      ]);
      setHasUnsavedChanges(false);
      alert("✅ HOME PAGE SYNCED SUCCESSFULLY!");
    } catch (err: any) {
      alert("❌ SYNC FAILED: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="pt-24 bg-[var(--primary-bg)] transition-colors">
      {/* AI ASSISTANT FAB */}
      <div className="fixed bottom-28 right-8 z-[600] group">
        <div className={`absolute bottom-full right-0 mb-4 bg-[#001bb8] p-6 rounded-3xl border border-white/10 shadow-3xl text-white transition-all duration-500 origin-bottom-right ${isLiveActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1 h-4 bg-yellow-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Editor is Listening...</p>
          </div>
        </div>
        
        <button 
          onClick={isLiveActive ? stopAssistant : startAssistant}
          disabled={isLiveConnecting}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${isLiveActive ? 'bg-red-600' : 'bg-yellow-400'} border-4 border-black/10`}
        >
          {isLiveConnecting ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : isLiveActive ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[var(--primary-bg)] to-[var(--secondary-bg)]">
        <div className="relative z-10 max-w-7xl mx-auto text-center py-24">
          <span className="inline-block px-6 py-2 rounded-full bg-yellow-400/10 text-yellow-500 text-small font-black tracking-widest uppercase mb-10 animate-fadeInUp border border-yellow-400/20">
            The Digital Publication Society of IARE
          </span>
          
          <div className="relative group">
            {isAdmin ? (
              <textarea 
                className="w-full bg-transparent text-h1 mb-12 text-center focus:outline-none border-b border-[var(--border-color)] resize-none min-h-[300px] text-[var(--text-main)]"
                value={heroTitle}
                onChange={(e) => { setHeroTitle(e.target.value); setHasUnsavedChanges(true); }}
              />
            ) : (
              <h1 className="text-h1 mb-12 leading-tight animate-fadeInUp whitespace-pre-wrap text-[var(--text-main)]">
                {heroTitle}
              </h1>
            )}
          </div>
          
          <div className="relative group mb-16">
            {isAdmin ? (
              <textarea 
                className="w-full bg-transparent text-h4 text-[var(--text-muted)] max-w-3xl mx-auto text-center focus:outline-none border-b border-[var(--border-color)] resize-none"
                value={heroSub}
                onChange={(e) => { setHeroSub(e.target.value); setHasUnsavedChanges(true); }}
              />
            ) : (
              <p className="text-h4 text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed animate-fadeInUp">
                {heroSub}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center animate-fadeInUp">
            <button 
              onClick={() => onNavigate(Page.News)}
              className="px-12 py-6 bg-[#001529] hover:bg-[#001f3f] text-white border border-white/10 rounded-2xl font-bold text-h6 transition-all transform hover:scale-105 flex items-center justify-center gap-4 shadow-2xl"
            >
              Explore Archives <span className="text-yellow-400">→</span>
            </button>
            <button 
              onClick={() => onNavigate(Page.About)}
              className="px-12 py-6 bg-yellow-400 hover:bg-yellow-500 text-black rounded-2xl font-black transition-all transform hover:scale-105 shadow-2xl uppercase tracking-widest text-small"
            >
              The Society
            </button>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="py-32 px-6 bg-[var(--primary-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="text-yellow-500 text-caption font-black uppercase tracking-[0.4em] mb-4 block">Selected Works</span>
              <h2 className="text-h2 text-[var(--text-main)]">Featured Publications</h2>
            </div>
            <button onClick={() => onNavigate(Page.News)} className="text-[var(--text-muted)] hover:text-yellow-500 flex items-center gap-3 font-bold uppercase tracking-widest text-small transition-all">
              Browse Full Catalog <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.length === 0 ? (
               <div className="col-span-full py-24 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-[3rem]">
                 <p className="text-body font-bold uppercase tracking-widest">Awaiting new publications...</p>
               </div>
            ) : (
              publications.slice(0, 3).map((pub) => (
                <div key={pub.id} className="group glow-card rounded-[2rem] overflow-hidden flex flex-col h-full">
                  <div className="h-60 overflow-hidden relative">
                    <img src={pub.image_url} alt={pub.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute top-6 left-6 px-4 py-1.5 bg-yellow-400 text-black text-caption font-black rounded-xl uppercase tracking-widest shadow-xl">
                      {pub.category}
                    </span>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <p className="text-small text-[var(--text-muted)] font-bold uppercase tracking-widest mb-4">{pub.author} • {pub.date}</p>
                    <h3 className="text-h4 mb-4 text-[var(--text-main)] leading-tight group-hover:text-yellow-500 transition-colors h-[3rem] line-clamp-2">{pub.title}</h3>
                    <p className="text-body text-[var(--text-muted)] mb-8 line-clamp-3 text-small flex-grow">{pub.summary}</p>
                    <button onClick={() => onNavigate(Page.News)} className="text-small font-black text-blue-500 hover:text-yellow-500 uppercase tracking-widest transition-colors w-fit">Read Full Article</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-32 px-6 bg-[var(--primary-bg)] border-t border-white/5">
        <div className="max-w-7xl mx-auto text-left">
          <div className="mb-16">
            <span className="inline-block px-4 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-full mb-6">
              Mark Your Calendar
            </span>
            <h2 className="text-h1 serif-font mb-4 text-[var(--text-main)]">Upcoming Events</h2>
            <p className="text-lg text-[var(--text-muted)] font-light max-w-2xl">
              Join us for workshops, launches, and special events to enhance your writing and publishing skills.
            </p>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-h3 font-semibold mb-2 text-[var(--text-main)]">No Upcoming Events</h3>
              <p className="text-[var(--text-muted)] mb-10 max-w-md">Check back soon for new events and workshops!</p>
              <button onClick={() => onNavigate(Page.Events)} className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-3 uppercase tracking-widest text-xs">View All Events ↗</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="group glow-card rounded-[2rem] overflow-hidden flex flex-col">
                    <div className="h-56 overflow-hidden relative">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-yellow-400 text-black text-caption font-black rounded-xl uppercase tracking-widest shadow-xl">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-h4 mb-4 text-[var(--text-main)] leading-tight group-hover:text-yellow-500 transition-colors line-clamp-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-yellow-500 text-caption font-black uppercase tracking-widest mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {event.location}
                      </div>
                      <p className="text-small text-[var(--text-muted)] mb-8 line-clamp-2">{event.description}</p>
                      <button onClick={() => onNavigate(Page.Events)} className="text-small font-black text-blue-500 hover:text-yellow-500 uppercase tracking-widest transition-colors">More Details</button>
                    </div>
                  </div>
               ))}
               <div className="col-span-full flex justify-center mt-12">
                  <button onClick={() => onNavigate(Page.Events)} className="text-small font-black text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-2">View All Events <span>→</span></button>
               </div>
            </div>
          )}
        </div>
      </section>
      
      {/* (Rest of Home.tsx continues normally with other sections) */}
    </div>
  );
};

export default Home;
