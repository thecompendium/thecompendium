import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaUser } from 'react-icons/fa';
import Confetti from 'react-confetti';

type Player = 'X' | 'O';
type Cell = Player | null;
type Difficulty = 'Easy' | 'Medium' | 'Hard';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

export default function AITicTacToe() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [score, setScore] = useState({ Player: 0, AI: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiTimeout, setAiTimeout] = useState(5000); // 5 seconds

  const handleBack = () => {
    navigate('/games/tictactoe');
  };

  const calculateWinner = (board: Cell[]): Player | 'Draw' | null => {
    for (const [a, b, c] of WINNING_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell) ? 'Draw' : null;
  };

  const getAvailableMoves = (board: Cell[]): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  };

  const minimax = (board: Cell[], depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
    const winner = calculateWinner(board);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'Draw') return 0;
    
    const availableMoves = getAvailableMoves(board);
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of availableMoves) {
        const newBoard = board.slice();
        newBoard[move] = 'O';
        const score = minimax(newBoard, depth + 1, alpha, beta, false);
        maxEval = Math.max(maxEval, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of availableMoves) {
        const newBoard = board.slice();
        newBoard[move] = 'X';
        const score = minimax(newBoard, depth + 1, alpha, beta, true);
        minEval = Math.min(minEval, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const getBestMove = (board: Cell[]): number => {
    const availableMoves = getAvailableMoves(board);
    let bestMove = -1;
    let bestValue = -Infinity;
    
    for (const move of availableMoves) {
      const newBoard = board.slice();
      newBoard[move] = 'O';
      let value;
      
      switch (difficulty) {
        case 'Easy':
          // Random move with some intelligence
          value = Math.random() * 5 - 2;
          break;
        case 'Medium':
          // Mix of random and minimax
          value = Math.random() > 0.3 ? minimax(newBoard, 0, -Infinity, Infinity, false) : Math.random() * 5 - 2;
          break;
        case 'Hard':
          // Full minimax
          value = minimax(newBoard, 0, -Infinity, Infinity, false);
          break;
        default:
          value = minimax(newBoard, 0, -Infinity, Infinity, false);
      }
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
    
    return bestMove;
  };

  const makeAIMove = async () => {
    setIsAIThinking(true);
    
    // AI timeout simulation
    const timeoutPromise = new Promise<number>((_, reject) => {
      setTimeout(() => reject(new Error('AI timeout')), aiTimeout);
    });
    
    const aiMovePromise = new Promise<number>((resolve) => {
      setTimeout(() => {
        const move = getBestMove(board);
        resolve(move);
      }, 1000 + Math.random() * 2000); // 1-3 seconds thinking time
    });
    
    try {
      const move = await Promise.race([aiMovePromise, timeoutPromise]);
      
      const newBoard = board.slice();
      newBoard[move] = 'O';
      setBoard(newBoard);
      
      const win = calculateWinner(newBoard);
      setWinner(win);
      
      if (win && win !== 'Draw') {
        setScore(prev => ({ ...prev, AI: prev.AI + 1 }));
        setShowCelebration(true);
      } else if (!win) {
        setIsPlayerTurn(true);
      }
    } catch (error) {
      // AI timeout - make a random move
      const availableMoves = getAvailableMoves(board);
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      const newBoard = board.slice();
      newBoard[randomMove] = 'O';
      setBoard(newBoard);
      
      const win = calculateWinner(newBoard);
      setWinner(win);
      
      if (win && win !== 'Draw') {
        setScore(prev => ({ ...prev, AI: prev.AI + 1 }));
        setShowCelebration(true);
      } else if (!win) {
        setIsPlayerTurn(true);
      }
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleClick = (index: number) => {
    if (winner || board[index] || !isPlayerTurn || isAIThinking) return;

    const newBoard = board.slice();
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const win = calculateWinner(newBoard);
    setWinner(win);
    
    if (win && win !== 'Draw') {
      setScore(prev => ({ ...prev, Player: prev.Player + 1 }));
      setShowCelebration(true);
    } else if (!win) {
      setIsPlayerTurn(false);
    }
  };

  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setShowCelebration(false);
    setIsAIThinking(false);
    setScore({ Player: 0, AI: 0 });
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && !isAIThinking) {
      makeAIMove();
    }
  }, [isPlayerTurn, winner, isAIThinking]);

  const celebration = showCelebration && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setShowCelebration(false)}>
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} run={showCelebration} recycle={false} />
      <div className="backdrop-blur-xl bg-white/10 border border-green-200/30 rounded-3xl shadow-xl px-8 py-6 flex flex-col items-center animate-pop" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)'}}>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-green-700 drop-shadow text-center animate-bounce flex items-center gap-3">
          <FaRobot className="text-green-500" /> {winner === 'X' ? 'You Win!' : winner === 'O' ? 'AI Wins!' : 'Draw!'}
        </h2>
        <p className="text-lg text-gray-500 mt-2">Click anywhere to continue</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-200/60 to-blue-100/60 relative overflow-hidden">
      {celebration}
      <button onClick={handleBack} className="absolute top-2 left-2 bg-white/30 border border-green-200/40 px-2 py-1 rounded-xl shadow text-green-700 font-bold hover:bg-green-100/40 backdrop-blur-md text-sm">← Back to Menu</button>
      <div className="backdrop-blur-xl bg-white/10 border border-green-200/30 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full mx-auto animate-fade-in relative" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)', height:'90vh', minHeight:'unset', maxHeight:'90vh', overflow:'hidden', padding:'2vh 2vw'}}>
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-green-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
          <FaRobot className="inline-block text-green-400 mr-2 animate-float" /> AI Challenge
        </h2>
        <div className="w-full flex flex-col items-center justify-center flex-1 min-h-0">
          <div className="mb-2 text-base font-semibold text-green-700 min-h-[1.5rem] flex items-center justify-center" style={{background:'#e6fff0ee', borderRadius:'8px', padding:'2px 12px', marginBottom:'8px'}}>
            {winner ? (
              winner === 'Draw' ? (
                <span className="text-gray-700 animate-fade-in">It's a draw!</span>
              ) : (
                <span className={`text-green-600 animate-fade-in flex items-center gap-2`}><FaRobot className={winner==='X'?'text-blue-700':'text-red-500'} /> Winner: {winner === 'X' ? 'You' : 'AI'} {winner}</span>
              )
            ) : (
              <span className="font-bold">{isPlayerTurn ? 'Your turn' : 'AI thinking...'}</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 flex-grow" style={{width:'min(40vw, 40vh)', height:'min(40vw, 40vh)', minHeight:'180px', minWidth:'180px', background:'#e6fff077', borderRadius:'12px', padding:'8px'}}>
            {board.map((cell, i) => (
              <button
                key={i}
                className={`w-full h-full flex items-center justify-center text-2xl md:text-3xl font-extrabold rounded-2xl border-2 border-green-400 shadow transition-all duration-200 bg-white/30 hover:scale-105 focus:outline-none ${cell === 'X' ? 'text-blue-700' : cell === 'O' ? 'text-red-500' : 'text-gray-400'} ${winner && (cell === 'X' || cell === 'O') ? 'opacity-80' : ''} ${!cell && !winner && 'hover:ring-4 hover:ring-green-200/30'} animate-pop`}
                onClick={() => handleClick(i)}
                disabled={!!cell || !!winner || !isPlayerTurn || isAIThinking}
                style={{ aspectRatio: '1', minWidth:0, minHeight:0, cursor: cell || winner ? 'not-allowed' : 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', background: 'transparent' }}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center items-center" style={{position:'absolute', left:0, right:0, bottom:'1.5vh', padding:'0 2vw'}}>
          <button onClick={handleNewGame} className="bg-green-600 text-white px-8 py-2 rounded-2xl font-bold shadow-lg hover:bg-green-700 transition-all text-lg border-2 border-green-300" style={{minWidth:'120px'}}>New Game</button>
        </div>
      </div>
    </div>
  );
} 