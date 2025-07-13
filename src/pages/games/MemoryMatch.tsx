import React, { useState, useEffect } from 'react';

const ICONS = [
  '🍎', '🍌', '🍇', '🍉', '🍒', '🍋', '🍓', '🍍',
  '🥝', '🥥', '🥑', '🍆', '🥕', '🌽', '🍄', '🥔',
  '🍪', '🍩', '🍰', '🍫', '🍿', '🍭', '🍬', '🍧',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
];

const GRID_SIZES = [
  { label: '4x4', value: 4 },
  { label: '6x6', value: 6 },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDeck(size: number): { id: number; icon: string; matched: boolean }[] {
  const numPairs = (size * size) / 2;
  const icons = shuffle(ICONS).slice(0, numPairs);
  const deck = shuffle(
    icons.flatMap((icon, i) => [
      { id: i * 2, icon, matched: false },
      { id: i * 2 + 1, icon, matched: false },
    ])
  );
  return deck;
}

// Sound effect utility
function playBeep(freq = 440, duration = 80, type = 'square', vol = 0.08) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + duration / 1000);
    o.onended = () => ctx.close();
  } catch {}
}

export default function MemoryMatch() {
  const [mode, setMode] = useState<'endless' | 'levels' | 'two'>('endless');
  const [size, setSize] = useState(4);
  const [deck, setDeck] = useState(generateDeck(4));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running, gameOver]);

  // Reset game
  const resetGame = (newSize = size) => {
    setDeck(generateDeck(newSize));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setRunning(false);
    setGameOver(false);
  };

  // Handle card click
  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx) || gameOver) return;
    if (!running) setRunning(true);
    setFlipped(f => [...f, idx]);
    playBeep(420, 60, 'triangle', 0.09); // Flip sound
  };

  // Flip/match logic
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1);
      const [i1, i2] = flipped;
      if (deck[i1].icon === deck[i2].icon) {
        setMatched(m => [...m, i1, i2]);
        setFlipped([]);
        playBeep(800, 120, 'square', 0.13); // Match sound
      } else {
        setTimeout(() => setFlipped([]), 900);
        playBeep(180, 120, 'sawtooth', 0.11); // Mismatch sound
      }
    }
  }, [flipped, deck]);

  // Check for game over
  useEffect(() => {
    if (matched.length === deck.length && deck.length > 0) {
      setGameOver(true);
      setRunning(false);
      playBeep(1040, 300, 'triangle', 0.18); // Win sound
    }
  }, [matched, deck]);

  // Change grid size
  const handleSizeChange = (val: number) => {
    setSize(val);
    resetGame(val);
  };

  // Mode selector UI
  const renderModeSelector = () => (
    <div className="flex gap-4 mb-6">
      <button onClick={() => setMode('endless')} className={`px-4 py-2 rounded-lg font-bold shadow ${mode === 'endless' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700'} transition`}>Endless</button>
      <button onClick={() => setMode('levels')} className={`px-4 py-2 rounded-lg font-bold shadow ${mode === 'levels' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700'} transition`}>Levels</button>
      <button onClick={() => setMode('two')} className={`px-4 py-2 rounded-lg font-bold shadow ${mode === 'two' ? 'bg-pink-500 text-white' : 'bg-white text-pink-700'} transition`}>Two Player</button>
    </div>
  );

  // Endless Mode UI
  const renderEndless = () => (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-4 mb-4">
        {GRID_SIZES.map(opt => (
          <button key={opt.value} onClick={() => handleSizeChange(opt.value)} className={`px-4 py-2 rounded-lg font-bold shadow ${size === opt.value ? 'bg-pink-400 text-white' : 'bg-white text-pink-700'} transition`}>{opt.label}</button>
        ))}
      </div>
      <div className="flex gap-8 mb-4">
        <div className="bg-white/80 rounded-xl px-6 py-2 shadow text-pink-700 font-bold text-lg flex items-center gap-2">Moves: {moves}</div>
        <div className="bg-white/80 rounded-xl px-6 py-2 shadow text-pink-700 font-bold text-lg flex items-center gap-2">Time: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</div>
        <button onClick={() => resetGame()} className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-xl shadow transition-all">Restart</button>
      </div>
      <div className={`grid gap-3 w-full max-w-[90vw] mx-auto`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, maxWidth: 90*size }}>
        {deck.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx) || gameOver;
          return (
            <button
              key={card.id}
              className={`relative aspect-square flex items-center justify-center text-3xl md:text-4xl font-extrabold rounded-xl shadow-lg transition-all duration-300 select-none
                ${isFlipped ? 'bg-pink-400 text-white scale-105' : 'bg-white text-pink-500 hover:bg-pink-100'}
                ${matched.includes(idx) ? 'ring-2 ring-green-400' : ''}
                ${flipped.includes(idx) && !matched.includes(idx) ? 'ring-2 ring-yellow-400' : ''}
              `}
              style={{ minWidth: 48, minHeight: 48 }}
              onClick={() => handleCardClick(idx)}
              disabled={isFlipped || flipped.length === 2}
            >
              <span className="transition-all duration-300" style={{ opacity: isFlipped ? 1 : 0 }}>{card.icon}</span>
            </button>
          );
        })}
      </div>
      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center">
            <h3 className="text-3xl font-extrabold text-pink-600 mb-2">You Win!</h3>
            <p className="mb-4 text-pink-700">All pairs matched in {moves} moves and {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}!</p>
            <button onClick={() => resetGame()} className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow transition-all mt-2">Play Again</button>
          </div>
        </div>
      )}
    </div>
  );

  // Scaffold for Levels and Two-Player modes
  const renderLevels = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-pink-700 font-bold text-xl">Levels Mode Coming Soon!</div>
  );
  const renderTwoPlayer = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-pink-700 font-bold text-xl">Two-Player Mode Coming Soon!</div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-pink-300 py-8">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center border border-pink-200 backdrop-blur-2xl w-full max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-4xl font-extrabold mb-4 text-pink-700 drop-shadow text-center font-sans tracking-wide">Memory Match</h2>
        {renderModeSelector()}
        {mode === 'endless' && renderEndless()}
        {mode === 'levels' && renderLevels()}
        {mode === 'two' && renderTwoPlayer()}
      </div>
    </div>
  );
} 