
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    console.log('Sending message:', formState);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormState({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="pt-32 pb-24 px-4 bg-[#000821]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h1 className="text-6xl font-bold serif-font mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">Have questions, submissions, or ideas? We'd love to hear from you!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-4xl font-bold serif-font mb-12">Get In Touch</h2>
            <div className="space-y-12">
               <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold serif-font mb-1">Email Us</h4>
                    <p className="text-gray-400">thecompendiumiare@gmail.com</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-pink-400 shadow-inner">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold serif-font mb-1">Follow Us</h4>
                    <p className="text-gray-400">@thecompendium.iare</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-600 shadow-inner">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold serif-font mb-1">Connect With Us</h4>
                    <p className="text-gray-400">@the-compendium-iare</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-12 rounded-[2rem] bg-[#211f1e] shadow-2xl border border-white/5">
            <h2 className="text-4xl font-bold serif-font mb-8">Send a message</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Your name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="your@email.com"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">Message</label>
                  <textarea 
                    rows={6} 
                    required 
                    placeholder="Your message"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none"
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  ></textarea>
               </div>
               <button 
                type="submit" 
                disabled={isSent}
                className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-400/5 ${isSent ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black hover:bg-yellow-500'}`}
               >
                 {isSent ? 'Message Sent!' : 'Send Message'} {!isSent && <span>→</span>}
               </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
