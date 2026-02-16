import React, { useState, useEffect, useRef, useCallback } from 'react';

type GameID = 'tic-tac-toe' | 'sudoku' | 'chess' | '2048' | 'memory-match' | 'snake' | 'slot-machine' | 'tetris' | 'box-tower';

interface GameInfo {
  id: GameID;
  name: string;
  icon: string;
  color: string;
}

const GAMES: GameInfo[] = [
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', icon: '❌⭕', color: 'from-blue-500 to-blue-600' },
  { id: 'sudoku', name: 'Sudoku', icon: '🧩', color: 'from-yellow-500 to-yellow-600' },
  { id: 'chess', name: 'Chess', icon: '♟️', color: 'from-orange-500 to-orange-600' },
  { id: '2048', name: '2048', icon: '🔢', color: 'from-orange-600 to-orange-700' },
  { id: 'memory-match', name: 'Memory Match', icon: '🃏', color: 'from-pink-500 to-pink-600' },
  { id: 'snake', name: 'Snake', icon: '🐍', color: 'from-green-500 to-green-600' },
  { id: 'slot-machine', name: 'Slot Machine', icon: '🎰', color: 'from-red-500 to-red-600' },
  { id: 'tetris', name: 'Tetris', icon: '🟦', color: 'from-purple-500 to-purple-600' },
  { id: 'box-tower', name: 'Box Tower', icon: '🗼', color: 'from-yellow-600 to-yellow-700' },
];

const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameID | null>(null);

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'tic-tac-toe': return <TicTacToe onBack={() => setActiveGame(null)} />;
      case '2048': return <Game2048 onBack={() => setActiveGame(null)} />;
      case 'snake': return <SnakeGame onBack={() => setActiveGame(null)} />;
      case 'box-tower': return <BoxTower onBack={() => setActiveGame(null)} />;
      case 'memory-match': return <MemoryMatch onBack={() => setActiveGame(null)} />;
      case 'slot-machine': return <SlotMachine onBack={() => setActiveGame(null)} />;
      case 'sudoku': return <SudokuGame onBack={() => setActiveGame(null)} />;
      case 'chess': return <ChessGame onBack={() => setActiveGame(null)} />;
      case 'tetris': return <TetrisGame onBack={() => setActiveGame(null)} />;
      default: return (
        <div className="flex flex-col items-center justify-center p-20 text-center animate-fadeIn">
          <h2 className="text-4xl font-black serif-font text-white mb-6 uppercase tracking-widest">Coming Soon!</h2>
          <p className="text-gray-400 mb-10">Our developers are polishing this experience. Check back shortly!</p>
          <button onClick={() => setActiveGame(null)} className="px-10 py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest">Dashboard</button>
        </div>
      );
    }
  };

  return (
    <div className="pt-32 pb-40 px-6 min-h-screen bg-gradient-to-br from-[#000b1a] via-[#021496] to-[#000b1a] text-white">
      {activeGame ? (
        renderActiveGame()
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-7xl font-black serif-font text-center mb-20 uppercase tracking-[0.2em] drop-shadow-2xl text-white">Games</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {GAMES.map((game) => (
              <div 
                key={game.id} 
                className={`group relative aspect-square rounded-[3rem] bg-gradient-to-br ${game.color} p-1 shadow-2xl transition-all hover:scale-105 hover:rotate-2 flex flex-col items-center justify-center cursor-pointer`}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="absolute inset-2 rounded-[2.5rem] bg-black/10 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-8xl mb-6 transform group-hover:scale-110 transition-transform drop-shadow-xl">{game.icon}</span>
                  <h3 className="text-3xl font-black serif-font mb-8 text-white">{game.name}</h3>
                  <button className="px-10 py-3.5 bg-white text-gray-900 font-black rounded-xl uppercase tracking-widest text-[13px] shadow-2xl hover:bg-gray-100 transition-colors">Play</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- GAME: TETRIS ---
const TetrisGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const COLS = 10;
  const ROWS = 20;

  const TETROMINOS = {
    I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: 'bg-cyan-400' },
    J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: 'bg-blue-500' },
    L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: 'bg-orange-500' },
    O: { shape: [[1,1], [1,1]], color: 'bg-yellow-400' },
    S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: 'bg-green-500' },
    T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: 'bg-purple-500' },
    Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: 'bg-red-500' },
  };

  const getRandomPiece = () => {
    const keys = Object.keys(TETROMINOS) as (keyof typeof TETROMINOS)[];
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { ...TETROMINOS[key], pos: { x: 3, y: 0 } };
  };

  const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const [piece, setPiece] = useState(getRandomPiece());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const collide = (p: any, g: string[][]) => {
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (p.shape[y][x] !== 0) {
          const newY = y + p.pos.y;
          const newX = x + p.pos.x;
          if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && g[newY][newX] !== '')) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (matrix: number[][]) => {
    return matrix[0].map((_, index) => matrix.map(col => col[index]).reverse());
  };

  const handleMove = (dx: number, dy: number) => {
    if (gameOver) return;
    const newPiece = { ...piece, pos: { x: piece.pos.x + dx, y: piece.pos.y + dy } };
    if (!collide(newPiece, grid)) {
      setPiece(newPiece);
    } else if (dy > 0) {
      // Piece landed
      const newGrid = grid.map(row => [...row]);
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const gridY = y + piece.pos.y;
            const gridX = x + piece.pos.x;
            if (gridY >= 0) newGrid[gridY][gridX] = piece.color;
          }
        });
      });

      // Clear rows
      let rowsCleared = 0;
      const filteredGrid = newGrid.filter(row => {
        if (row.every(cell => cell !== '')) {
          rowsCleared++;
          return false;
        }
        return true;
      });

      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(''));
      }

      setGrid(filteredGrid);
      setScore(s => s + (rowsCleared === 4 ? 800 : rowsCleared * 100));
      
      const nextPiece = getRandomPiece();
      if (collide(nextPiece, filteredGrid)) {
        setGameOver(true);
      } else {
        setPiece(nextPiece);
      }
    }
  };

  const handleRotate = () => {
    if (gameOver) return;
    const rotatedShape = rotate(piece.shape);
    const newPiece = { ...piece, shape: rotatedShape };
    if (!collide(newPiece, grid)) {
      setPiece(newPiece);
    }
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => handleMove(0, 1), Math.max(100, 800 - Math.floor(score / 500) * 50));
    return () => clearInterval(interval);
  }, [piece, grid, gameOver, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleMove(-1, 0);
      if (e.key === 'ArrowRight') handleMove(1, 0);
      if (e.key === 'ArrowDown') handleMove(0, 1);
      if (e.key === 'ArrowUp') handleRotate();
      if (e.key === ' ') { e.preventDefault(); while(!collide({...piece, pos: {x: piece.pos.x, y: piece.pos.y + 1}}, grid)) { piece.pos.y++; } handleMove(0, 1); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [piece, grid, gameOver]);

  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs">← Back to Dashboard</button>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-5xl font-black serif-font uppercase italic text-white">Tetris</h2>
        <div className="bg-white/10 p-4 rounded-xl">
           <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Score</p>
           <p className="text-2xl font-black text-purple-400">{score}</p>
        </div>
      </div>

      <div className="inline-grid grid-cols-10 gap-0.5 bg-black/40 p-2 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
        {grid.map((row, y) => row.map((cell, x) => {
          let displayColor = cell;
          // Check if current piece occupies this spot
          piece.shape.forEach((pRow, py) => {
            pRow.forEach((pValue, px) => {
              if (pValue !== 0 && py + piece.pos.y === y && px + piece.pos.x === x) {
                displayColor = piece.color;
              }
            });
          });

          return (
            <div key={`${x}-${y}`} className={`w-6 h-6 md:w-8 md:h-8 rounded-sm ${displayColor || 'bg-white/5'} transition-all duration-75`}></div>
          );
        }))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
            <h3 className="text-4xl font-black text-red-500 uppercase mb-4">Game Over</h3>
            <button onClick={() => { setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(''))); setScore(0); setPiece(getRandomPiece()); setGameOver(false); }} className="px-8 py-3 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest">Restart</button>
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 text-left">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] font-black uppercase text-yellow-400 mb-2">Controls</p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>Arrow Keys: Move & Rotate</li>
            <li>Space: Hard Drop</li>
          </ul>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-[10px] font-black uppercase text-yellow-400 mb-2">Goal</p>
          <p className="text-xs text-gray-400">Clear horizontal lines to score big. The pace speeds up as you go!</p>
        </div>
      </div>
    </div>
  );
};

// --- GAME: BOX TOWER (ULTIMATE VERSION) ---
const BoxTower: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  interface Box { x: number; width: number; }
  const [boxes, setBoxes] = useState<Box[]>([{ x: 25, width: 50 }]);
  const [currentX, setCurrentX] = useState(0);
  const [dir, setDir] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lastSlice, setLastSlice] = useState<'perfect' | 'normal' | 'miss' | null>(null);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setCurrentX(prev => {
        const speed = (1 + score * 0.08);
        const limit = 100 - boxes[boxes.length - 1].width;
        let next = prev + dir * speed;
        if (next >= 100) { setDir(-1); return 100; }
        if (next <= 0) { setDir(1); return 0; }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [dir, gameOver, boxes, score]);

  const drop = () => {
    if (gameOver) return;
    const last = boxes[boxes.length - 1];
    const left = Math.max(currentX, last.x);
    const right = Math.min(currentX + (boxes[boxes.length-1].width), last.x + last.width);
    const newWidth = right - left;

    if (newWidth <= 0) {
      setGameOver(true);
      setLastSlice('miss');
    } else {
      // Check for perfect drop (within 2% margin)
      const diff = Math.abs(currentX - last.x);
      let widthToUse = newWidth;
      let xToUse = left;

      if (diff < 2) {
        setLastSlice('perfect');
        // Bonus: restore some width or just keep it perfect
        widthToUse = last.width;
        xToUse = last.x;
      } else {
        setLastSlice('normal');
      }

      setBoxes([...boxes, { x: xToUse, width: widthToUse }]);
      setScore(s => s + (diff < 2 ? 2 : 1));
      setCurrentX(0);
      setDir(1);
    }
    
    setTimeout(() => setLastSlice(null), 500);
  };

  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn select-none h-[80vh] flex flex-col">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs">← Back to Dashboard</button>
      
      <div className="flex justify-between items-center mb-8 px-6">
        <div className="text-left">
          <h2 className="text-4xl font-black serif-font uppercase text-white">Box Tower</h2>
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1">Stack with Precision</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-gray-500">Height</p>
          <div className="text-yellow-400 text-4xl font-black drop-shadow-lg">{score}</div>
        </div>
      </div>

      <div 
        className="relative w-full flex-grow bg-[#000821] rounded-[3rem] border-8 border-white/5 overflow-hidden flex flex-col-reverse p-6 shadow-[0_50px_100px_rgba(0,0,0,0.5)] cursor-pointer active:scale-[0.99] transition-transform"
        onClick={drop}
      >
         {/* Static Background Grid */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

         {/* Visual Feedback Overlay */}
         {lastSlice === 'perfect' && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100] animate-ping">
              <span className="text-yellow-400 text-6xl font-black italic uppercase tracking-tighter">PERFECT!</span>
           </div>
         )}

         {/* Stacking Area */}
         <div className="relative w-full h-full flex flex-col-reverse overflow-hidden pt-40">
           <div className="transition-all duration-500 ease-out" style={{ transform: `translateY(${Math.max(0, (boxes.length - 8) * 40)}px)` }}>
              {boxes.map((box, i) => (
                <div 
                  key={i} 
                  className={`h-10 border-t border-black/20 shadow-lg transition-all duration-300 ${i === boxes.length - 1 ? 'bg-white' : 'bg-yellow-400'}`}
                  style={{ 
                    width: `${box.width}%`, 
                    marginLeft: `${box.x}%`,
                    opacity: 1 - (boxes.length - 1 - i) * 0.1,
                    filter: `brightness(${100 - (boxes.length - 1 - i) * 5}%)`
                  }}
                ></div>
              ))}
              
              {!gameOver && (
                <div 
                  className="h-10 bg-white/40 border border-white/20 backdrop-blur-sm shadow-2xl absolute top-0"
                  style={{ 
                    width: `${boxes[boxes.length-1].width}%`, 
                    left: `${currentX}%`,
                    transform: 'translateY(-100%)'
                  }}
                ></div>
              )}
           </div>
         </div>

         {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-50 animate-fadeIn p-10">
               <span className="text-red-500 text-8xl mb-4">💥</span>
               <h3 className="text-5xl font-black serif-font mb-4 uppercase text-white tracking-widest">Tower Fell!</h3>
               <p className="text-gray-400 text-xl mb-12 font-medium">Final Tower Level: <span className="text-yellow-400 font-black">{score}</span></p>
               <button 
                 onClick={(e) => { e.stopPropagation(); setBoxes([{ x: 25, width: 50 }]); setScore(0); setGameOver(false); }} 
                 className="px-14 py-5 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
               >
                 Rebuild Tower
               </button>
            </div>
         )}
      </div>
      <p className="mt-6 text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">Tap anywhere to drop the box</p>
    </div>
  );
};

// --- GAME: 2048 ---
const Game2048: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-[#eee4da] text-[#776e65]';
      case 4: return 'bg-[#ede0c8] text-[#776e65]';
      case 8: return 'bg-[#f2b179] text-white';
      case 16: return 'bg-[#f59563] text-white';
      case 32: return 'bg-[#f67c5f] text-white';
      case 64: return 'bg-[#f65e3b] text-white';
      case 128: return 'bg-[#edcf72] text-white text-xl shadow-[0_0_10px_#edcf72]';
      case 256: return 'bg-[#edcc61] text-white text-xl shadow-[0_0_15px_#edcc61]';
      case 512: return 'bg-[#edc850] text-white text-xl shadow-[0_0_20px_#edc850]';
      case 1024: return 'bg-[#edc53f] text-white text-lg shadow-[0_0_25px_#edc53f]';
      case 2048: return 'bg-[#edc22e] text-white text-lg shadow-[0_0_30px_#edc22e]';
      default: return 'bg-[#3c3a32] text-white text-sm';
    }
  };

  const addRandom = (g: number[][]): number[][] => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return g;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = g.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const initGrid = () => {
    let newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    newGrid = addRandom(addRandom(newGrid));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const slide = (row: number[]) => {
    let arr = row.filter(x => x !== 0);
    let points = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        points += arr[i];
        arr[i + 1] = 0;
        if (arr[i] === 2048) setWon(true);
      }
    }
    arr = arr.filter(x => x !== 0);
    while (arr.length < 4) arr.push(0);
    return { arr, points };
  };

  const move = (dir: 'L' | 'R' | 'U' | 'D') => {
    if (gameOver) return;

    let current = grid.map(r => [...r]);
    let next: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
    let totalPoints = 0;

    if (dir === 'L') {
      for (let r = 0; r < 4; r++) {
        const { arr, points } = slide(current[r]);
        next[r] = arr;
        totalPoints += points;
      }
    } else if (dir === 'R') {
      for (let r = 0; r < 4; r++) {
        const { arr, points } = slide([...current[r]].reverse());
        next[r] = arr.reverse();
        totalPoints += points;
      }
    } else if (dir === 'U') {
      for (let c = 0; c < 4; c++) {
        const col = [current[0][c], current[1][c], current[2][c], current[3][c]];
        const { arr, points } = slide(col);
        for (let r = 0; r < 4; r++) next[r][c] = arr[r];
        totalPoints += points;
      }
    } else if (dir === 'D') {
      for (let c = 0; c < 4; c++) {
        const col = [current[3][c], current[2][c], current[1][c], current[0][c]];
        const { arr, points } = slide(col);
        for (let r = 0; r < 4; r++) next[3 - r][c] = arr[r];
        totalPoints += points;
      }
    }

    if (JSON.stringify(current) !== JSON.stringify(next)) {
      const withRandom = addRandom(next);
      setGrid(withRandom);
      setScore(s => s + totalPoints);
      
      // Check for Game Over
      if (!canMove(withRandom)) {
        setGameOver(true);
      }
    }
  };

  const canMove = (g: number[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) return true;
        if (c < 3 && g[r][c] === g[r][c + 1]) return true;
        if (r < 3 && g[r][c] === g[r + 1][c]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); move('U'); }
      if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); move('D'); }
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); move('L'); }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); move('R'); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid, gameOver]);

  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn font-inter">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs flex items-center mx-auto hover:text-white transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-10">
        <div className="text-left">
          <h2 className="text-6xl font-black serif-font text-white leading-none">2048</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">The Ultimate Campus Logic Battle</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#bbada0] p-4 rounded-xl min-w-[100px] shadow-lg border-2 border-white/10">
            <p className="text-[10px] font-black uppercase text-white/60 mb-1">Score</p>
            <p className="text-2xl font-black text-white">{score}</p>
          </div>
        </div>
      </div>

      <div className="relative p-4 bg-[#bbada0] rounded-2xl shadow-2xl border-4 border-[#8f7a66]">
        <div className="grid grid-cols-4 gap-4">
          {grid.map((row, r) => row.map((cell, c) => (
            <div 
              key={`${r}-${c}`} 
              className={`aspect-square rounded-xl flex items-center justify-center text-3xl font-black transition-all duration-150 transform ${cell === 0 ? 'bg-white/20' : getTileColor(cell) + ' scale-100 shadow-md animate-pop'}`}
            >
              {cell > 0 ? cell : ''}
            </div>
          )))}
        </div>

        {(gameOver || won) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-50 animate-fadeIn">
            <h3 className={`text-6xl font-black serif-font mb-4 uppercase ${won ? 'text-yellow-400' : 'text-red-500'}`}>
              {won ? 'You Win!' : 'Game Over'}
            </h3>
            <p className="text-white font-bold mb-10 text-xl tracking-widest">Final Score: {score}</p>
            <button 
              onClick={initGrid} 
              className="px-12 py-5 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-yellow-500 hover:scale-105 active:scale-95 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- GAME: CHESS ---
const ChessGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
  type Color = 'w' | 'b';
  interface Piece { type: PieceType; color: Color; }
  type Board = (Piece | null)[][];

  const initialBoard = (): Board => {
    const layout: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    layout.forEach((type, i) => {
      board[0][i] = { type, color: 'b' };
      board[7][i] = { type, color: 'w' };
      board[1][i] = { type: 'p', color: 'b' };
      board[6][i] = { type: 'p', color: 'w' };
    });
    return board;
  };

  const [board, setBoard] = useState<Board>(initialBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<Color>('w');
  const [lastMove, setLastMove] = useState<{ from: [number, number], to: [number, number] } | null>(null);
  const [gameMode, setGameMode] = useState<'PvP' | 'AI'>('AI');
  const [isThinking, setIsThinking] = useState(false);

  const getPieceEmoji = (piece: Piece | null) => {
    if (!piece) return '';
    const emojis: Record<string, string> = {
      'w-p': '♙', 'w-r': '♖', 'w-n': '♘', 'w-b': '♗', 'w-q': '♕', 'w-k': '♔',
      'b-p': '♟', 'b-r': '♜', 'b-n': '♞', 'b-b': '♝', 'b-q': '♛', 'b-k': '♚'
    };
    return emojis[`${piece.color}-${piece.type}`];
  };

  const getValidMoves = useCallback((r: number, c: number, currentBoard: Board): [number, number][] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const { type, color } = piece;

    const addMove = (nr: number, nc: number) => {
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return false;
      const target = currentBoard[nr][nc];
      if (!target) {
        moves.push([nr, nc]);
        return true;
      } else if (target.color !== color) {
        moves.push([nr, nc]);
        return false;
      }
      return false;
    };

    if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      if (!currentBoard[r + dir]?.[c]) {
        moves.push([r + dir, c]);
        if (((color === 'w' && r === 6) || (color === 'b' && r === 1)) && !currentBoard[r + 2 * dir]?.[c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
        const target = currentBoard[r + dr]?.[c + dc];
        if (target && target.color !== color) moves.push([r + dr, c + dc]);
      });
    } else if (type === 'n') {
      [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]].forEach(([dr, dc]) => addMove(r + dr, c + dc));
    } else if (type === 'b' || type === 'r' || type === 'q') {
      const dirs = type === 'b' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] :
                   type === 'r' ? [[1, 0], [-1, 0], [0, 1], [0, -1]] :
                   [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
      dirs.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          if (!addMove(r + dr * i, c + dc * i)) break;
        }
      });
    } else if (type === 'k') {
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }
    return moves;
  }, []);

  const evaluateBoard = (currentBoard: Board) => {
    const values: Record<PieceType, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p) {
          const val = values[p.type];
          score += p.color === 'w' ? val : -val;
        }
      }
    }
    return score;
  };

  const performAIMove = useCallback(() => {
    setIsThinking(true);
    setTimeout(() => {
      let bestMove = null;
      let minScore = Infinity;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.color === 'b') {
            const moves = getValidMoves(r, c, board);
            for (const [nr, nc] of moves) {
              const tempBoard = board.map(row => [...row]);
              tempBoard[nr][nc] = tempBoard[r][c];
              tempBoard[r][c] = null;
              const score = evaluateBoard(tempBoard);
              if (score < minScore) {
                minScore = score;
                bestMove = { from: [r, c], to: [nr, nc] };
              }
            }
          }
        }
      }

      if (bestMove) {
        const { from: [fr, fc], to: [tr, tc] } = bestMove;
        const newBoard = board.map(row => [...row]);
        newBoard[tr][tc] = newBoard[fr][fc];
        newBoard[fr][fc] = null;
        setBoard(newBoard);
        setTurn('w');
        setLastMove({ from: [fr, fc], to: [tr, tc] });
      }
      setIsThinking(false);
    }, 500);
  }, [board, getValidMoves]);

  useEffect(() => {
    if (gameMode === 'AI' && turn === 'b') {
      performAIMove();
    }
  }, [turn, gameMode, performAIMove]);

  const handleSquareClick = (r: number, c: number) => {
    if (isThinking) return;
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      const validMoves = getValidMoves(sr, sc, board);
      if (validMoves.some(([vr, vc]) => vr === r && vc === c)) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = newBoard[sr][sc];
        newBoard[sr][sc] = null;
        setBoard(newBoard);
        setTurn(turn === 'w' ? 'b' : 'w');
        setLastMove({ from: [sr, sc], to: [r, c] });
        setSelected(null);
        return;
      }
    }

    if (piece && piece.color === turn) {
      setSelected([r, c]);
    } else {
      setSelected(null);
    }
  };

  const possibleMoves = selected ? getValidMoves(selected[0], selected[1], board) : [];

  return (
    <div className="max-w-3xl mx-auto text-center animate-fadeIn">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs block mx-auto">← Back to Dashboard</button>
      
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setGameMode('PvP')} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${gameMode === 'PvP' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>PvP Mode</button>
        <button onClick={() => setGameMode('AI')} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${gameMode === 'AI' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>VS AI Mode</button>
      </div>

      <div className="flex justify-between items-center mb-10 px-6">
        <h2 className="text-4xl font-black serif-font uppercase italic">Grand Chess</h2>
        <div className="flex gap-4 items-center">
          <div className={`px-5 py-2 rounded-xl transition-all border ${turn === 'w' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] border-white' : 'bg-black/20 text-gray-500 border-white/10'}`}>
            <p className="text-[10px] font-black uppercase tracking-widest">{turn === 'w' ? (isThinking ? 'Waiting...' : 'White Move') : 'White'}</p>
          </div>
          <div className={`px-5 py-2 rounded-xl transition-all border ${turn === 'b' ? 'bg-black text-white shadow-[0_0_20px_rgba(0,0,0,0.6)] border-white/20' : 'bg-black/20 text-gray-500 border-white/10'}`}>
            <p className="text-[10px] font-black uppercase tracking-widest">{turn === 'b' ? (isThinking ? 'AI Thinking...' : 'Black Move') : 'Black'}</p>
          </div>
        </div>
      </div>

      <div className="relative inline-block p-4 bg-[#1a1a1a] rounded-[2rem] border-8 border-yellow-600 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-8 border-2 border-black/50">
          {board.map((row, r) => row.map((cell, c) => {
            const isDark = (r + c) % 2 === 1;
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isLastMove = (lastMove?.from[0] === r && lastMove?.from[1] === c) || (lastMove?.to[0] === r && lastMove?.to[1] === c);
            const isTarget = possibleMoves.some(([vr, vc]) => vr === r && vc === c);
            
            return (
              <div 
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r, c)}
                className={`
                  w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-5xl cursor-pointer relative
                  ${isDark ? 'bg-[#769656]' : 'bg-[#eeeed2]'}
                  ${isSelected ? 'bg-yellow-400 !text-black z-10' : ''}
                  ${isLastMove && !isSelected ? 'after:absolute after:inset-0 after:bg-yellow-200/40' : ''}
                `}
              >
                <span className={`relative z-10 drop-shadow-md transform transition-transform ${isSelected ? 'scale-110' : 'hover:scale-105'} ${cell?.color === 'w' ? 'text-white stroke-black' : 'text-black'}`}>
                  {getPieceEmoji(cell)}
                </span>
                {isTarget && (
                  <div className={`absolute w-4 h-4 rounded-full ${cell ? 'border-4 border-black/20' : 'bg-black/10'}`}></div>
                )}
              </div>
            );
          }))}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-6">
        <button onClick={() => { setBoard(initialBoard()); setTurn('w'); setSelected(null); setLastMove(null); }} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">New Match</button>
      </div>
    </div>
  );
};

// --- GAME: SUDOKU ---
const SudokuGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  type Difficulty = 'Easy' | 'Medium' | 'Hard';
  const [grid, setGrid] = useState<(number | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialGrid, setInitialGrid] = useState<(number | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [solution, setSolution] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [gameOver, setGameOver] = useState(false);

  const generateSudoku = () => {
    const board = Array(9).fill(0).map(() => Array(9).fill(0));
    const isValid = (b: number[][], r: number, c: number, n: number) => {
      for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
      const startR = Math.floor(r / 3) * 3;
      const startC = Math.floor(c / 3) * 3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[startR + i][startC + j] === n) return false;
      return true;
    };
    const solve = (b: number[][]) => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (b[r][c] === 0) {
            const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
            for (let n of nums) {
              if (isValid(b, r, c, n)) {
                b[r][c] = n;
                if (solve(b)) return true;
                b[r][c] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    solve(board);
    return board;
  };

  const startNewGame = (diff: Difficulty = difficulty) => {
    const sol = generateSudoku();
    setSolution(sol);
    const holes = diff === 'Easy' ? 30 : diff === 'Medium' ? 45 : 60;
    const puzzle = sol.map(row => [...row]);
    let count = 0;
    while (count < holes) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== null) {
        puzzle[r][c] = null as any;
        count++;
      }
    }
    const formattedPuzzle = puzzle.map(row => row.map(val => val === 0 ? null : val));
    setGrid(formattedPuzzle);
    setInitialGrid(formattedPuzzle.map(r => [...r]));
    setGameOver(false);
    setSelected(null);
  };

  useEffect(() => { startNewGame(); }, []);

  const handleInput = (num: number) => {
    if (!selected || gameOver) return;
    const [r, c] = selected;
    if (initialGrid[r][c] !== null) return;
    const nextGrid = grid.map(row => [...row]);
    nextGrid[r][c] = num;
    setGrid(nextGrid);
    const isComplete = nextGrid.every((row, ri) => row.every((val, ci) => val === solution[ri][ci]));
    if (isComplete) setGameOver(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') handleInput(parseInt(e.key));
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (!selected) return;
        const [r, c] = selected;
        if (initialGrid[r][c] === null) {
          const nextGrid = grid.map(row => [...row]);
          nextGrid[r][c] = null;
          setGrid(nextGrid);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, grid, gameOver]);

  return (
    <div className="max-w-2xl mx-auto text-center animate-fadeIn">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs block mx-auto">← Back to Dashboard</button>
      <h2 className="text-5xl font-black serif-font mb-8 uppercase italic text-white">Sudoku</h2>
      <div className="flex justify-center gap-3 mb-10">
        {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
          <button key={d} onClick={() => { setDifficulty(d); startNewGame(d); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${difficulty === d ? 'bg-yellow-400 text-black shadow-xl scale-110' : 'bg-white/10 text-white'}`}>{d}</button>
        ))}
      </div>
      <div className="inline-grid grid-cols-9 gap-0 bg-[#1c1c1c] p-2 rounded-2xl border-4 border-yellow-600 shadow-2xl overflow-hidden mb-12">
        {grid.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} onClick={() => setSelected([r, c])} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-black cursor-pointer border border-white/5 ${(selected?.[0] === r && selected?.[1] === c) ? 'bg-yellow-400 text-black' : 'hover:bg-white/5'} ${initialGrid[r][c] !== null ? 'text-gray-400' : 'text-white'}`}>{cell || ''}</div>
        )))}
      </div>
      <div className="grid grid-cols-9 gap-2 max-w-md mx-auto mb-12">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleInput(n)} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center font-black text-xl hover:bg-yellow-400 hover:text-black transition-all border border-white/10">{n}</button>
        ))}
      </div>
    </div>
  );
};

// --- GAME: TIC-TAC-TOE ---
const TicTacToe: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const calculateWinner = (squares: any[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return squares.includes(null) ? null : 'Draw';
  };
  const winner = calculateWinner(board);
  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const nextBoard = [...board];
    nextBoard[i] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext(!isXNext);
  };
  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs">← Back to Dashboard</button>
      <h2 className="text-5xl font-black serif-font mb-8 uppercase italic text-white">Tic-Tac-Toe</h2>
      <div className="grid grid-cols-3 gap-4 mb-12">
        {board.map((cell, i) => (
          <div key={i} onClick={() => handleClick(i)} className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center text-5xl font-black cursor-pointer hover:bg-white/10 transition-colors border border-white/10"><span className={cell === 'X' ? 'text-blue-400' : 'text-red-400'}>{cell}</span></div>
        ))}
      </div>
      {winner && <div className="mb-10 animate-bounce"><p className="text-3xl font-black text-yellow-400">{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}</p></div>}
    </div>
  );
};

// --- GAME: SNAKE ---
const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const GRID_SIZE = 20;
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([5, 5]);
  const [dir, setDir] = useState([0, 1]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const reset = () => { setSnake([[10, 10]]); setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]); setDir([0, 1]); setScore(0); setGameOver(false); };
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const nextHead = [(head[0] + dir[0] + GRID_SIZE) % GRID_SIZE, (head[1] + dir[1] + GRID_SIZE) % GRID_SIZE];
        if (prev.some(s => s[0] === nextHead[0] && s[1] === nextHead[1])) { setGameOver(true); return prev; }
        const newSnake = [nextHead, ...prev];
        if (nextHead[0] === food[0] && nextHead[1] === food[1]) { setScore(s => s + 10); setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]); } else newSnake.pop();
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [dir, food, gameOver]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dir[0] !== 1) setDir([-1, 0]);
      if (e.key === 'ArrowDown' && dir[0] !== -1) setDir([1, 0]);
      if (e.key === 'ArrowLeft' && dir[1] !== 1) setDir([0, -1]);
      if (e.key === 'ArrowRight' && dir[1] !== -1) setDir([0, 1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);
  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs">← Back to Dashboard</button>
      <h2 className="text-5xl font-black serif-font uppercase italic text-white mb-4">Snake</h2>
      <div className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden mx-auto" style={{ width: '400px', height: '400px', display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => {
          const r = Math.floor(i / GRID_SIZE);
          const c = i % GRID_SIZE;
          const isSnake = snake.some(s => s[0] === r && s[1] === c);
          const isFood = food[0] === r && food[1] === c;
          return <div key={i} className={`w-full h-full ${isSnake ? 'bg-green-400' : isFood ? 'bg-red-500' : ''}`}></div>;
        })}
      </div>
      {gameOver && <button onClick={reset} className="mt-8 px-10 py-4 bg-yellow-400 text-black font-black rounded-xl uppercase tracking-widest">Restart</button>}
    </div>
  );
};

// --- GAME: SLOT MACHINE ---
const SlotMachine: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
  const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setReels([SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]]);
      count++;
      if (count > 20) { clearInterval(interval); setSpinning(false); }
    }, 100);
  };
  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs">← Back to Dashboard</button>
      <h2 className="text-6xl font-black serif-font mb-16 uppercase text-white">Slot Machine</h2>
      <div className="bg-[#1c1c1c] p-12 rounded-[3rem] border-8 border-yellow-600 shadow-2xl">
        <div className="flex justify-center gap-8 mb-12">
           {reels.map((s, i) => <div key={i} className="w-28 h-36 bg-black rounded-2xl flex items-center justify-center text-6xl shadow-inner border border-white/5">{s}</div>)}
        </div>
        <button onClick={spin} disabled={spinning} className="w-full py-8 text-2xl font-black uppercase tracking-widest bg-red-600 text-white rounded-3xl hover:scale-105 active:scale-95 transition-all">PULL LEVER</button>
      </div>
    </div>
  );
};

// --- GAME: MEMORY MATCH ---
const MemoryMatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const ICONS = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥝', '🍍'];
  const [cards, setCards] = useState<{ id: number, val: string, flipped: boolean, solved: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [victory, setVictory] = useState(false);

  const init = () => {
    const list = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((val, i) => ({ id: i, val, flipped: false, solved: false }));
    setCards(list);
    setFlipped([]);
    setMoves(0);
    setVictory(false);
  };

  useEffect(() => { init(); }, []);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].solved || victory) return;

    const nextCards = [...cards];
    nextCards[id].flipped = true;
    setCards(nextCards);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
    }
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [id1, id2] = flipped;
      if (cards[id1].val === cards[id2].val) {
        setTimeout(() => {
          setCards(prev => {
            const updated = prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, solved: true } : c);
            if (updated.every(c => c.solved)) setVictory(true);
            return updated;
          });
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === id1 || c.id === id2) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn relative">
      <button onClick={onBack} className="mb-10 text-yellow-400 font-bold uppercase tracking-widest text-xs flex items-center mx-auto hover:text-white transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
        Back to Dashboard
      </button>
      
      <div className="flex justify-between items-end mb-12 px-2">
        <div className="text-left">
          <h2 className="text-5xl font-black serif-font uppercase text-white leading-none">Memory</h2>
          <p className="text-[10px] font-black uppercase text-pink-400 tracking-[0.3em] mt-3">Find the pairs</p>
        </div>
        <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
           <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Move Count</p>
           <p className="text-3xl font-black text-pink-400">{moves}</p>
        </div>
      </div>

      <div className="relative grid grid-cols-4 gap-4 p-4 bg-black/20 rounded-[2rem] border border-white/5 shadow-inner">
         {cards.map((card) => (
           <div 
             key={card.id} 
             onClick={() => handleFlip(card.id)} 
             className={`aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-500 transform preserve-3d shadow-xl ${card.flipped || card.solved ? 'bg-white text-black rotate-y-180 scale-100 shadow-pink-500/20' : 'bg-white/5 text-transparent border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95'}`}
           >
             {(card.flipped || card.solved) ? card.val : '❓'}
           </div>
         ))}

         {victory && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center z-50 animate-fadeIn">
              <span className="text-6xl mb-6">🏆</span>
              <h3 className="text-5xl font-black serif-font text-white uppercase mb-2">Victory!</h3>
              <p className="text-pink-400 font-bold text-xl uppercase tracking-widest mb-10">Solved in {moves} Moves</p>
              <button 
                onClick={init} 
                className="px-10 py-4 bg-pink-500 text-white font-black rounded-xl uppercase tracking-widest shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:bg-pink-600 hover:scale-105 active:scale-95 transition-all"
              >
                Play Again
              </button>
           </div>
         )}
      </div>

      <button onClick={init} className="mt-10 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors tracking-[0.2em] py-2 px-6 border border-white/5 rounded-full">
        Reset Board
      </button>
    </div>
  );
};

export default Games;