import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaRobot, FaCogs, FaChessBoard } from 'react-icons/fa';
import { MdOutlineGridOn } from 'react-icons/md';
import { GiPartyPopper } from 'react-icons/gi';

export default function TicTacToeMenu() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/games');
  };

  const handleModeSelect = (mode: string) => {
    navigate(`/games/tictactoe/${mode}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-200/60 to-blue-300/60 overflow-hidden">
      <button onClick={handleBack} className="absolute top-4 left-4 bg-white/30 border border-blue-200/40 px-3 py-1.5 rounded-xl shadow text-blue-700 font-bold hover:bg-blue-100/40 backdrop-blur-md">← Back to Games</button>
      <div className="backdrop-blur-xl bg-white/10 border border-blue-200/30 rounded-3xl shadow-xl p-6 flex flex-col items-center max-w-lg w-full mx-auto animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)', minHeight:'unset'}}>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-blue-700 drop-shadow-lg text-center font-sans tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
          <GiPartyPopper className="inline-block text-3xl md:text-4xl mr-2 text-blue-400 animate-float" />
          Tic-Tac-Toe Modes
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-xs items-center">
          <button onClick={() => handleModeSelect('simple')} className="w-64 max-w-full bg-blue-500/90 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all focus:outline-none transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <FaUserFriends className="text-2xl" /> Simple Two Player
          </button>
          <button onClick={() => handleModeSelect('ultimate')} className="w-64 max-w-full bg-purple-500/90 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all focus:outline-none transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <MdOutlineGridOn className="text-2xl" /> Ultimate Tic Tac Toe
          </button>
          <button onClick={() => handleModeSelect('three-player')} className="w-64 max-w-full bg-pink-500/90 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all focus:outline-none transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <FaUserFriends className="text-2xl" /> 3 Player Mode
          </button>
          <button onClick={() => handleModeSelect('ai')} className="w-64 max-w-full bg-green-500/90 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all focus:outline-none transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <FaRobot className="text-2xl" /> AI Challenge
          </button>
          <button onClick={() => handleModeSelect('custom')} className="w-64 max-w-full bg-yellow-500/90 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl transition-all focus:outline-none transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <FaCogs className="text-2xl" /> Custom Rule
          </button>
        </div>
      </div>
    </div>
  );
} 