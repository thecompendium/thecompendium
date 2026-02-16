import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, message } = formState;
    const destinationEmail = 'thecompendiumiare@gmail.com';
    
    const subject = encodeURIComponent(`TC - New Message from ${name}`);
    const body = encodeURIComponent(
      `SENDER DETAILS\n` +
      `--------------------------\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `MESSAGE CONTENT\n` +
      `--------------------------\n` +
      `${message}\n\n` +
      `--------------------------\n` +
      `Sent via The Compendium website.`
    );

    const mailtoUrl = `mailto:${destinationEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormState({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="pt-32 pb-24 px-4 bg-[#000821] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-500 text-[9px] font-black uppercase rounded-full mb-5 border border-yellow-400/20 tracking-widest">Reach out to us</span>
          <h1 className="text-4xl md:text-5xl font-bold serif-font mb-4 text-white">Contact Us</h1>
          <p className="text-base text-gray-400 font-light max-w-xl mx-auto">Have questions, submissions, or ideas? We'd love to hear from you!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold serif-font mb-10 text-white">Get In Touch</h2>
            <div className="space-y-10">
               <a href="mailto:thecompendiumiare@gmail.com" className="flex gap-5 items-start group cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 shadow-inner group-hover:bg-blue-400/10 transition-all border border-white/5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold serif-font mb-0.5 text-white group-hover:text-blue-400 transition-colors">Email Us</h4>
                    <p className="text-sm text-gray-400 font-light group-hover:text-gray-300">thecompendiumiare@gmail.com</p>
                  </div>
               </a>

               <a href="https://www.instagram.com/thecompendium.iare" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-start group cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-pink-400 shadow-inner group-hover:bg-pink-400/10 transition-all border border-white/5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold serif-font mb-0.5 text-white group-hover:text-pink-400 transition-colors">Follow Us</h4>
                    <p className="text-sm text-gray-400 font-light group-hover:text-gray-300">@thecompendium.iare</p>
                  </div>
               </a>

               <a href="https://www.linkedin.com/in/the-compendium-iare-987b35212/" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-start group cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600/10 transition-all border border-white/5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold serif-font mb-0.5 text-white group-hover:text-blue-500 transition-colors">Connect With Us</h4>
                    <p className="text-sm text-gray-400 font-light group-hover:text-gray-300">@the-compendium-iare</p>
                  </div>
               </a>
            </div>
          </div>

          <div className="p-10 rounded-[2rem] bg-[#211f1e] shadow-2xl border border-white/5 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold serif-font mb-8 text-white">Send Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-1 text-left">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Name</label>
                  <input type="text" required placeholder="Your name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none transition-all shadow-inner" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} />
               </div>
               <div className="space-y-1 text-left">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
                  <input type="email" required placeholder="your@email.com" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none transition-all shadow-inner" value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} />
               </div>
               <div className="space-y-1 text-left">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Message</label>
                  <textarea rows={4} required placeholder="How can we help?" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-yellow-400 outline-none transition-all resize-none shadow-inner" value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})}></textarea>
               </div>
               <div className="pt-2">
                 <button type="submit" disabled={isSent} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl ${isSent ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-[1.02] active:scale-[0.98]'}`}>
                   {isSent ? (
                     <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> CLIENT LAUNCHED</>
                   ) : (
                     <>SEND MESSAGE <span className="text-base">→</span></>
                   )}
                 </button>
                 <p className="mt-4 text-[9px] text-center text-gray-500 uppercase tracking-widest font-bold opacity-60">
                   This launches your default email app to send a message to us.
                 </p>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;