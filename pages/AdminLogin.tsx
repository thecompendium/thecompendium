
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'compendium26' && password === 'jinchuriki') {
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#000416]">
      <div className="max-w-md w-full bg-[#211f1e] p-12 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold serif-font mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Secure access for club administrators only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-yellow-400 transition-all text-sm text-white"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-yellow-400 transition-all text-sm text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all shadow-xl shadow-yellow-400/10"
          >
            Authenticate
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500">
          Return to <a href="#" className="text-gray-400 hover:text-white underline">Home Page</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
