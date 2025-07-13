import React from 'react';
import { useNavigate } from 'react-router-dom';
import SudokuGame from './games/SudokuGame';
import Chess from './games/MiniChess';
import Game2048 from './games/Game2048';
import MemoryMatch from './games/MemoryMatch';

const GAME_LIST = [
  { key: 'tictactoe', label: 'Tic-Tac-Toe', icon: '❌⭕', color: 'from-blue-400 to-blue-600', path: '/games/tictactoe' },
  { key: 'sudoku', label: 'Sudoku', icon: '🧩', color: 'from-yellow-400 to-yellow-600', path: '/games/sudoku' },
  { key: 'chess', label: 'Chess', icon: '♟️', color: 'from-amber-400 to-amber-600', path: '/games/chess' },
  { key: '2048', label: '2048', icon: '🔢', color: 'from-orange-400 to-orange-600', path: '/games/2048' },
  { key: 'memory', label: 'Memory Match', icon: '🃏', color: 'from-pink-400 to-pink-600', path: '/games/memory' },
  { key: 'snake', label: 'Snake', icon: '🐍', color: 'from-green-400 to-green-600', path: '/games/snake' },
];

function Games() {
  const navigate = useNavigate();

  const handleGameSelect = (gamePath: string) => {
    navigate(gamePath);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Vibrant moving background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="animate-gradient-move bg-gradient-to-br from-pink-400 via-blue-400 to-yellow-300 opacity-70 w-full h-full absolute" style={{filter:'blur(60px)'}} />
        {/* Floating blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400/40 rounded-full blur-3xl animate-blob1" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/40 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-yellow-300/40 rounded-full blur-2xl animate-blob3" />
      </div>
      <h1 className="text-5xl font-extrabold mb-12 text-gray-800 drop-shadow-lg text-center font-sans tracking-wide animate-fade-in">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-5xl px-4">
        {GAME_LIST.map((game) => (
          <div
            key={game.key}
            className={`rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-gray-200 backdrop-blur-2xl bg-gradient-to-br ${game.color} transition-transform hover:scale-105 animate-fade-in`}
          >
            <div className="text-6xl mb-4 drop-shadow-lg">{game.icon}</div>
            <div className="text-2xl font-bold mb-6 text-white drop-shadow text-center">{game.label}</div>
            <button
              onClick={() => handleGameSelect(game.path)}
              className="mt-2 bg-white/90 text-gray-900 px-8 py-3 rounded-xl font-bold shadow hover:bg-white transition-all text-lg"
            >
              Play
            </button>
          </div>
        ))}
      </div>
      {/* Animated background styles */}
      <style jsx>{`
        .animate-gradient-move {
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
        .animate-blob1 {
          animation: blob1 7s infinite;
        }
        .animate-blob2 {
          animation: blob2 9s infinite;
        }
        .animate-blob3 {
          animation: blob3 11s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, 50px) scale(1.1); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, 30px) scale(1.1); }
          66% { transform: translate(-50px, -30px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Games; 