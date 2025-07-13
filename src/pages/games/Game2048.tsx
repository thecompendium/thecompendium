import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 4;
const START_TILES = 2;
const WIN_TILE = 2048;
// Enhanced colors for each tile value
const TILE_COLORS: Record<number, string> = {
  2: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  4: 'bg-yellow-200 text-yellow-800 border-yellow-400',
  8: 'bg-orange-300 text-white border-orange-400',
  16: 'bg-orange-400 text-white border-orange-500',
  32: 'bg-orange-500 text-white border-orange-600',
  64: 'bg-orange-600 text-white border-orange-700',
  128: 'bg-green-300 text-white border-green-400',
  256: 'bg-green-400 text-white border-green-500',
  512: 'bg-green-500 text-white border-green-600',
  1024: 'bg-blue-400 text-white border-blue-500',
  2048: 'bg-blue-600 text-white border-blue-700 animate-pulse',
};

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

function getRandomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function getEmptyCells(grid: number[][]) {
  const empty: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  return empty;
}

function cloneGrid(grid: number[][]) {
  return grid.map(row => [...row]);
}

function transpose(grid: number[][]) {
  return grid[0].map((_, c) => grid.map(row => row[c]));
}

function reverseRows(grid: number[][]) {
  return grid.map(row => [...row].reverse());
}

function slideAndMerge(row: number[]) {
  let arr = row.filter(x => x !== 0);
  let merged: number[] = [];
  let score = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      merged.push(arr[i] * 2);
      score += arr[i] * 2;
      i++;
    } else {
      merged.push(arr[i]);
    }
  }
  while (merged.length < GRID_SIZE) merged.push(0);
  return { row: merged, score };
}

function moveGrid(grid: number[][], dir: 'left' | 'right' | 'up' | 'down') {
  let moved = false;
  let score = 0;
  let newGrid = cloneGrid(grid);
  if (dir === 'up' || dir === 'down') {
    newGrid = transpose(newGrid);
  }
  if (dir === 'right' || dir === 'down') {
    newGrid = reverseRows(newGrid);
  }
  for (let r = 0; r < GRID_SIZE; r++) {
    const { row, score: rowScore } = slideAndMerge(newGrid[r]);
    if (row.some((val, i) => val !== newGrid[r][i])) moved = true;
    newGrid[r] = row;
    score += rowScore;
  }
  if (dir === 'right' || dir === 'down') {
    newGrid = reverseRows(newGrid);
  }
  if (dir === 'up' || dir === 'down') {
    newGrid = transpose(newGrid);
  }
  return { newGrid, moved, score };
}

function canMove(grid: number[][]) {
  if (getEmptyCells(grid).length > 0) return true;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (
        (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) ||
        (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c])
      ) {
        return true;
      }
    }
  }
  return false;
}

function hasWon(grid: number[][]) {
  return grid.some(row => row.includes(WIN_TILE));
}

function spawnRandomTile(grid: number[][]) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = getRandomTileValue();
  const newGrid = cloneGrid(grid);
  newGrid[r][c] = value;
  return newGrid;
}

function getInitialGrid() {
  let grid = Array(GRID_SIZE)
    .fill(0)
    .map(() => Array(GRID_SIZE).fill(0));
  for (let i = 0; i < START_TILES; i++) {
    grid = spawnRandomTile(grid);
  }
  return grid;
}

const getHighScore = () => Number(localStorage.getItem('highscore-2048') || 0);
const setHighScore = (score: number) => localStorage.setItem('highscore-2048', String(score));

export default function Game2048() {
  const [grid, setGrid] = useState(getInitialGrid());
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [moved, setMoved] = useState(false);
  const [animDir, setAnimDir] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [popTiles, setPopTiles] = useState<{[key: string]: boolean}>({});
  const boardRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useEffect(() => {
    if (gameOver || won) return;
    const handleKey = (e: KeyboardEvent) => {
      let dir: 'left' | 'right' | 'up' | 'down' | null = null;
      if (e.key === 'ArrowLeft') dir = 'left';
      if (e.key === 'ArrowRight') dir = 'right';
      if (e.key === 'ArrowUp') dir = 'up';
      if (e.key === 'ArrowDown') dir = 'down';
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid, gameOver, won]);

  // Touch controls
  useEffect(() => {
    if (gameOver || won) return;
    let startX = 0, startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) move('right');
        else if (dx < -30) move('left');
      } else {
        if (dy > 30) move('down');
        else if (dy < -30) move('up');
      }
    };
    const board = boardRef.current;
    if (board) {
      board.addEventListener('touchstart', handleTouchStart);
      board.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      if (board) {
        board.removeEventListener('touchstart', handleTouchStart);
        board.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [grid, gameOver, won]);

  function move(dir: 'left' | 'right' | 'up' | 'down') {
    if (gameOver || won) return;
    setAnimDir(dir);
    const { newGrid, moved, score: gained } = moveGrid(grid, dir);
    if (!moved) return;
    playBeep(340, 60, 'triangle', 0.07); // Move sound
    if (gained > 0) playBeep(660, 120, 'square', 0.12); // Merge sound
    let withTile = spawnRandomTile(newGrid);
    // Find which tile is new for pop-in animation
    const newPopTiles: {[key: string]: boolean} = {};
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (withTile[r][c] !== 0 && grid[r][c] === 0 && newGrid[r][c] === 0) {
          newPopTiles[`${r}-${c}`] = true;
        }
      }
    }
    setPopTiles(newPopTiles);
    setGrid(withTile);
    setScore(s => {
      const newScore = s + gained;
      if (newScore > highScore) {
        setHighScore(newScore);
        setHighScoreState(newScore);
      }
      return newScore;
    });
    setMoved(true);
    setTimeout(() => setMoved(false), 150);
    setTimeout(() => setPopTiles({}), 180);
  }

  // Check for win/lose
  useEffect(() => {
    if (hasWon(grid)) {
      setWon(true);
      playBeep(1040, 300, 'triangle', 0.18); // Win sound
    }
    else if (!canMove(grid)) {
      setGameOver(true);
      playBeep(120, 300, 'sawtooth', 0.18); // Game over sound
    }
  }, [grid]);

  function restart() {
    setGrid(getInitialGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setAnimDir(null);
    setPopTiles({});
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative bg-yellow-100 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col items-center border border-yellow-200/50 backdrop-blur-2xl max-w-2xl w-full mx-auto animate-fade-in mt-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-4xl font-extrabold mb-2 text-yellow-700 drop-shadow text-center font-sans tracking-wide select-none">2048</h2>
        <div className="flex items-center gap-6 mb-6 w-full justify-between flex-wrap">
          <div className="flex flex-col items-center bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-2xl px-6 py-3 shadow-lg border border-yellow-100/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-200">SCORE</span>
            <span className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">{score}</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-2xl px-6 py-3 shadow-lg border border-yellow-100/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-200">BEST</span>
            <span className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">{highScore}</span>
          </div>
          <button
            onClick={restart}
            className="ml-auto bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:ring-2 focus:ring-yellow-300 text-white font-bold p-3 rounded-full shadow-lg transition-all flex items-center justify-center outline-none border-2 border-yellow-200 dark:border-yellow-600 hover:shadow-xl hover:scale-110 transform"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
        <div className="w-full h-1 mb-6 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 rounded-full opacity-70 shadow-inner" />
        <div
          ref={boardRef}
          className={'relative grid gap-3 md:gap-4 w-[340px] h-[340px] md:w-[420px] md:h-[420px] bg-yellow-100 rounded-3xl p-3 md:p-4 shadow-2xl border-2 border-yellow-200/50 backdrop-blur-xl transition-all duration-200 hover:shadow-3xl'}
          style={{ touchAction: 'none' }}
        >
          {/* Grid background with subtle pattern */}
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[20%] h-[20%] bg-yellow-50 rounded-2xl border border-yellow-200 shadow-inner"
              style={{
                left: `${(i % GRID_SIZE) * 25}%`,
                top: `${Math.floor(i / GRID_SIZE) * 25}%`,
                zIndex: 0,
              }}
            />
          ))}
          {/* Tiles */}
          {grid.map((row, r) =>
            row.map((val, c) =>
              val !== 0 ? (
                <div
                  key={r + '-' + c + '-' + val + '-' + moved}
                  className={`absolute flex items-center justify-center font-extrabold text-2xl md:text-3xl rounded-2xl border-2 select-none transition-all duration-200 hover:scale-105 transform ${TILE_COLORS[val] || 'bg-gray-700 text-white border-gray-800'}
                    ${animDir && moved ? `animate-slide-${animDir}` : ''}
                    ${popTiles[`${r}-${c}`] ? 'animate-pop-in' : ''}
                    shadow-lg hover:shadow-2xl
                  `}
                  style={{
                    left: `${c * 25}%`,
                    top: `${r * 25}%`,
                    width: '20%',
                    height: '20%',
                    zIndex: 1,
                  }}
                >
                  <div className="relative">
                    {val}
                    {/* Subtle glow effect */}
                    <div className={`absolute inset-0 rounded-2xl blur-sm opacity-50 ${val === 2048 ? 'bg-theme-yellow' : 'bg-yellow-400'}`} style={{ zIndex: -1 }}></div>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-md rounded-3xl z-20 animate-fade-in">
            <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-900/90 rounded-3xl p-10 shadow-2xl text-center border border-yellow-200/50 dark:border-gray-800/50 backdrop-blur-sm">
              <h3 className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-300 mb-2">Game Over</h3>
              <p className="mb-4 text-yellow-800 dark:text-yellow-100">No more moves possible.</p>
              <button onClick={restart} className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all mt-2 focus:ring-2 focus:ring-yellow-300 hover:shadow-xl hover:scale-105 transform">Restart</button>
            </div>
          </div>
        )}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-200/80 dark:bg-yellow-900/80 backdrop-blur-md rounded-3xl z-20 animate-fade-in">
            <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-900/90 rounded-3xl p-10 shadow-2xl text-center border border-yellow-200/50 dark:border-gray-800/50 backdrop-blur-sm">
              <h3 className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-300 mb-2">You Win!</h3>
              <p className="mb-4 text-yellow-800 dark:text-yellow-100">You made 2048! Keep playing for a higher score.</p>
              <button onClick={restart} className="bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all mt-2 focus:ring-2 focus:ring-yellow-300 hover:shadow-xl hover:scale-105 transform">Restart</button>
            </div>
          </div>
        )}
      </div>
      {/* Animations for sliding and pop-in */}
      <style>{`
        @keyframes slide-left { 0% { transform: translateX(40px); } 100% { transform: translateX(0); } }
        @keyframes slide-right { 0% { transform: translateX(-40px); } 100% { transform: translateX(0); } }
        @keyframes slide-up { 0% { transform: translateY(40px); } 100% { transform: translateY(0); } }
        @keyframes slide-down { 0% { transform: translateY(-40px); } 100% { transform: translateY(0); } }
        .animate-slide-left { animation: slide-left 0.15s cubic-bezier(.4,2,.6,1) both; }
        .animate-slide-right { animation: slide-right 0.15s cubic-bezier(.4,2,.6,1) both; }
        .animate-slide-up { animation: slide-up 0.15s cubic-bezier(.4,2,.6,1) both; }
        .animate-slide-down { animation: slide-down 0.15s cubic-bezier(.4,2,.6,1) both; }
        @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0.5; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.18s cubic-bezier(.4,2,.6,1) both; }
        .animate-fade-in { animation: fade-in 0.3s ease; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .shadow-3xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
} 