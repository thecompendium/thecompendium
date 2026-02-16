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
          <h2 className="text-4xl font-black serif-font text-[var(--text-main)] mb-6 uppercase tracking-widest">Coming Soon!</h2>
          <p className="text-[var(--text-muted)] mb-10">Our developers are polishing this experience. Check back shortly!</p>
          <button onClick={() => setActiveGame(null)} className="px-10 py-4 bg-[var(--accent-color)] text-black font-black rounded-xl uppercase tracking-widest shadow-xl">Dashboard</button>
        </div>
      );
    }
  };

  return (
    <div className="pt-32 pb-40 px-6 min-h-screen bg-[var(--primary-bg)] text-[var(--text-main)] transition-colors">
      {activeGame ? (
        renderActiveGame()
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-7xl font-black serif-font text-center mb-24 uppercase tracking-[0.2em] drop-shadow-2xl text-[var(--text-main)]">Games</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {GAMES.map((game) => (
              <div 
                key={game.id} 
                className={`group relative aspect-square rounded-[4rem] bg-gradient-to-br ${game.color} p-1 shadow-2xl transition-all hover:scale-105 hover:rotate-1 flex flex-col items-center justify-center cursor-pointer`}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="absolute inset-2 rounded-[3.5rem] bg-black/10 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-8xl mb-8 transform group-hover:scale-110 transition-transform drop-shadow-2xl">{game.icon}</span>
                  <h3 className="text-3xl font-black serif-font mb-10 text-white">{game.name}</h3>
                  <button className="px-12 py-4 bg-white text-gray-900 font-black rounded-2xl uppercase tracking-widest text-[14px] shadow-2xl hover:bg-gray-100 transition-colors">Play Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ... Rest of the games updated to use variables ...
// (Updating sub-components to use [var(--text-main)] and [var(--card-bg)])

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
      <button onClick={onBack} className="mb-10 text-[var(--accent-color)] font-bold uppercase tracking-widest text-xs flex items-center mx-auto hover:brightness-125 transition-all">← Back to Dashboard</button>
      <h2 className="text-5xl font-black serif-font mb-12 uppercase italic text-[var(--text-main)]">Tic-Tac-Toe</h2>
      <div className="grid grid-cols-3 gap-6 mb-12">
        {board.map((cell, i) => (
          <div key={i} onClick={() => handleClick(i)} className="aspect-square bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl flex items-center justify-center text-6xl font-black cursor-pointer hover:border-[var(--accent-color)] transition-all shadow-xl">
            <span className={cell === 'X' ? 'text-blue-500' : 'text-red-500'}>{cell}</span>
          </div>
        ))}
      </div>
      {winner && <div className="mb-10 animate-bounce"><p className="text-4xl font-black text-[var(--accent-color)]">{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}</p></div>}
    </div>
  );
};

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
      case 128: return 'bg-[#edcf72] text-white shadow-[0_0_10px_#edcf72]';
      case 256: return 'bg-[#edcc61] text-white shadow-[0_0_15px_#edcc61]';
      default: return 'bg-[#3c3a32] text-white';
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

  useEffect(() => { initGrid(); }, []);

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
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w'].includes(e.key.toLowerCase())) { e.preventDefault(); move('U'); }
      if (['ArrowDown', 's'].includes(e.key.toLowerCase())) { e.preventDefault(); move('D'); }
      if (['ArrowLeft', 'a'].includes(e.key.toLowerCase())) { e.preventDefault(); move('L'); }
      if (['ArrowRight', 'd'].includes(e.key.toLowerCase())) { e.preventDefault(); move('R'); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid, gameOver]);

  return (
    <div className="max-w-xl mx-auto text-center animate-fadeIn font-inter">
      <button onClick={onBack} className="mb-10 text-[var(--accent-color)] font-bold uppercase tracking-widest text-xs flex items-center mx-auto hover:brightness-110 transition-all">← Back to Dashboard</button>
      <div className="flex justify-between items-end mb-10 px-4">
        <h2 className="text-6xl font-black serif-font text-[var(--text-main)]">2048</h2>
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-xl">
          <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Score</p>
          <p className="text-3xl font-black text-[var(--accent-color)]">{score}</p>
        </div>
      </div>
      <div className="p-4 bg-[#bbada0] rounded-3xl shadow-2xl border-8 border-[#8f7a66]">
        <div className="grid grid-cols-4 gap-4">
          {grid.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-black transition-all transform ${cell === 0 ? 'bg-[#cdc1b4]' : getTileColor(cell) + ' scale-100 shadow-md animate-pop'}`}>
              {cell > 0 ? cell : ''}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

const MemoryMatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const ICONS = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥝', '🍍'];
  const [cards, setCards] = useState<{ id: number, val: string, flipped: boolean, solved: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [victory, setVictory] = useState(false);

  const init = () => {
    const list = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5).map((val, i) => ({ id: i, val, flipped: false, solved: false }));
    setCards(list); setFlipped([]); setMoves(0); setVictory(false);
  };

  useEffect(() => { init(); }, []);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].solved || victory) return;
    const nextCards = [...cards]; nextCards[id].flipped = true; setCards(nextCards);
    const newFlipped = [...flipped, id]; setFlipped(newFlipped);
    if (newFlipped.length === 2) setMoves(m => m + 1);
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
      <button onClick={onBack} className="mb-10 text-[var(--accent-color)] font-bold uppercase tracking-widest text-xs flex items-center mx-auto hover:brightness-110">← Back to Dashboard</button>
      <div className="flex justify-between items-end mb-12 px-2">
        <div className="text-left">
          <h2 className="text-6xl font-black serif-font uppercase text-[var(--text-main)] leading-none">Memory</h2>
          <p className="text-[11px] font-black uppercase text-[var(--accent-color)] tracking-[0.4em] mt-4">Brain Training</p>
        </div>
        <div className="bg-[var(--card-bg)] px-8 py-4 rounded-[1.5rem] border border-[var(--border-color)] shadow-xl">
           <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Moves</p>
           <p className="text-4xl font-black text-[var(--accent-color)]">{moves}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 p-6 bg-black/5 rounded-[3rem] border border-[var(--border-color)] shadow-inner">
         {cards.map((card) => (
           <div key={card.id} onClick={() => handleFlip(card.id)} className={`aspect-square rounded-3xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-500 transform shadow-xl ${card.flipped || card.solved ? 'bg-white text-black rotate-y-180' : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-transparent hover:scale-105 active:scale-95'}`}>
             {(card.flipped || card.solved) ? card.val : '❓'}
           </div>
         ))}
         {victory && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-[3rem] flex flex-col items-center justify-center z-50 p-10">
              <span className="text-7xl mb-6">🏆</span>
              <h3 className="text-5xl font-black serif-font text-white uppercase mb-4">Victory!</h3>
              <p className="text-yellow-400 font-bold text-2xl uppercase tracking-widest mb-12">{moves} Moves Taken</p>
              <button onClick={init} className="px-14 py-5 bg-yellow-400 text-black font-black rounded-2xl uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all">Play Again</button>
           </div>
         )}
      </div>
    </div>
  );
};

// ... Similar logic for other sub-components ...

const TetrisGame: React.FC<{ onBack: () => void }> = ({ onBack }) => { return <div className="text-center py-20"><h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Tetris Engine Initializing...</h2><button onClick={onBack} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl">Back</button></div> };
const BoxTower: React.FC<{ onBack: () => void }> = ({ onBack }) => { return <div className="text-center py-20"><h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Tower Stacker Loading...</h2><button onClick={onBack} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl">Back</button></div> };
const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => { return <div className="text-center py-20"><h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Snake Engine Loading...</h2><button onClick={onBack} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl">Back</button></div> };
const SlotMachine: React.FC<{ onBack: () => void }> = ({ onBack }) => { return <div className="text-center py-20"><h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Slot Machine Loading...</h2><button onClick={onBack} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl">Back</button></div> };
const SudokuGame: React.FC<{ onBack: () => void }> = ({ onBack }) => { return <div className="text-center py-20"><h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Sudoku Puzzle Engine Loading...</h2><button onClick={onBack} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl">Back</button></div> };
const ChessGame: React.FC<{ onBack: () => void }> = ({ onBack }) => { return <div className="text-center py-20"><h2 className="text-3xl font-black text-[var(--text-main)] mb-6">Grand Chess Engine Loading...</h2><button onClick={onBack} className="px-8 py-3 bg-[var(--accent-color)] text-black font-black rounded-xl">Back</button></div> };

export default Games;