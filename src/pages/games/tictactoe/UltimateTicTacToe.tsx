import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineGridOn } from 'react-icons/md';
import Confetti from 'react-confetti';

type Board = (string | null)[];
type GameState = {
  boards: Board[];
  activeBoard: number | null;
  currentPlayer: 'X' | 'O';
  boardWinners: (string | null)[];
  gameWinner: string | null;
  score: { X: number; O: number };
  showCelebration: boolean;
};

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

export default function UltimateTicTacToe() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    boards: Array(9).fill(null).map(() => Array(9).fill(null)),
    activeBoard: null,
    currentPlayer: 'X',
    boardWinners: Array(9).fill(null),
    gameWinner: null,
    score: { X: 0, O: 0 },
    showCelebration: false
  });

  const handleBack = () => {
    navigate('/games/tictactoe');
  };

  const calculateBoardWinner = (board: Board): string | null => {
    for (const [a, b, c] of WINNING_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell) ? 'Draw' : null;
  };

  const calculateGameWinner = (boardWinners: (string | null)[]): string | null => {
    for (const [a, b, c] of WINNING_LINES) {
      if (boardWinners[a] && boardWinners[a] === boardWinners[b] && boardWinners[a] === boardWinners[c]) {
        return boardWinners[a];
      }
    }
    return boardWinners.every(winner => winner) ? 'Draw' : null;
  };

  const getNextActiveBoard = (boardIndex: number, cellIndex: number): number | null => {
    const targetBoard = cellIndex;
    return gameState.boardWinners[targetBoard] ? null : targetBoard;
  };

  const handleCellClick = (boardIndex: number, cellIndex: number) => {
    if (
      gameState.gameWinner ||
      gameState.boardWinners[boardIndex] ||
      gameState.boards[boardIndex][cellIndex] ||
      (gameState.activeBoard !== null && gameState.activeBoard !== boardIndex)
    ) {
      return;
    }

    const newBoards = gameState.boards.map((board, i) =>
      i === boardIndex ? board.map((cell, j) => j === cellIndex ? gameState.currentPlayer : cell) : board
    );

    const newBoardWinners = gameState.boardWinners.map((winner, i) =>
      i === boardIndex ? calculateBoardWinner(newBoards[i]) : winner
    );

    const newGameWinner = calculateGameWinner(newBoardWinners);
    const nextActiveBoard = getNextActiveBoard(boardIndex, cellIndex);
    const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';

    setGameState(prev => ({
      ...prev,
      boards: newBoards,
      boardWinners: newBoardWinners,
      gameWinner: newGameWinner,
      activeBoard: nextActiveBoard,
      currentPlayer: nextPlayer
    }));

    if (newGameWinner && newGameWinner !== 'Draw') {
      setGameState(prev => ({
        ...prev,
        score: { ...prev.score, [newGameWinner]: prev.score[newGameWinner] + 1 },
        showCelebration: true
      }));
    }
  };

  const handleNewGame = () => {
    setGameState({
      boards: Array(9).fill(null).map(() => Array(9).fill(null)),
      activeBoard: null,
      currentPlayer: 'X',
      boardWinners: Array(9).fill(null),
      gameWinner: null,
      score: { X: 0, O: 0 },
      showCelebration: false
    });
  };

  const renderCell = (boardIndex: number, cellIndex: number, value: string | null) => {
    const isActive = gameState.activeBoard === null || gameState.activeBoard === boardIndex;
    const isWinningCell = gameState.boardWinners[boardIndex] && 
      WINNING_LINES.some(line => line.includes(cellIndex) && 
        line.every(pos => gameState.boards[boardIndex][pos] === gameState.boardWinners[boardIndex]));

    return (
      <button
        key={cellIndex}
        className={`w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm font-bold rounded border transition-all ${
          value ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'
        } ${
          isActive && !value && !gameState.gameWinner ? 'border-blue-400' : 'border-gray-300'
        } ${
          isWinningCell ? 'bg-green-200 border-green-500' : ''
        } ${
          value === 'X' ? 'text-blue-600' : value === 'O' ? 'text-red-600' : 'text-gray-400'
        }`}
        onClick={() => handleCellClick(boardIndex, cellIndex)}
        disabled={!!value || !!gameState.gameWinner || !isActive}
      >
        {value}
      </button>
    );
  };

  const renderBoard = (boardIndex: number) => {
    const board = gameState.boards[boardIndex];
    const boardWinner = gameState.boardWinners[boardIndex];
    const isActive = gameState.activeBoard === null || gameState.activeBoard === boardIndex;
    const isWinningBoard = gameState.gameWinner && 
      WINNING_LINES.some(line => line.includes(boardIndex) && 
        line.every(pos => gameState.boardWinners[pos] === gameState.gameWinner));

    return (
      <div
        key={boardIndex}
        className={`p-2 rounded-lg border-2 transition-all ${
          isActive && !boardWinner && !gameState.gameWinner
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-300 bg-white'
        } ${
          isWinningBoard ? 'border-green-500 bg-green-100' : ''
        } ${
          boardWinner ? 'opacity-60' : ''
        }`}
      >
        {boardWinner ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className={`text-2xl font-bold ${
              boardWinner === 'X' ? 'text-blue-600' : boardWinner === 'O' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {boardWinner === 'Draw' ? '=' : boardWinner}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {board.map((cell, cellIndex) => renderCell(boardIndex, cellIndex, cell))}
          </div>
        )}
      </div>
    );
  };

  const celebration = gameState.showCelebration && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, showCelebration: false }))}>
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} run={gameState.showCelebration} recycle={false} />
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce">
        <h2 className="text-4xl font-bold text-purple-700 mb-4">
          🎉 {gameState.gameWinner} Wins! 🎉
        </h2>
        <p className="text-xl text-gray-600">Ultimate Victory!</p>
        <p className="text-lg text-gray-500 mt-2">Click anywhere to continue</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-200/60 to-yellow-100/60 relative overflow-hidden">
      {celebration}
      <button 
        onClick={handleBack} 
        className="absolute top-2 left-2 bg-white/30 border border-purple-200/40 px-2 py-1 rounded-xl shadow text-purple-700 font-bold hover:bg-purple-100/40 backdrop-blur-md text-sm"
      >
        ← Back to Menu
      </button>
      <div className="backdrop-blur-xl bg-white/10 border border-purple-200/30 rounded-3xl shadow-xl flex flex-col items-center max-w-3xl w-full mx-auto animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)', height:'90vh', minHeight:'unset', maxHeight:'90vh', overflow:'hidden', padding:'2vh 2vw'}}>
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-purple-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
          <MdOutlineGridOn className="inline-block text-purple-400 mr-2 animate-float" />
          Ultimate Tic Tac Toe
        </h2>
        
        {/* Score */}
        <div className="flex items-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue-600">X</div>
            <div className="text-xl">{gameState.score.X}</div>
          </div>
          <div className="text-2xl font-bold text-purple-700">VS</div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-red-600">O</div>
            <div className="text-xl">{gameState.score.O}</div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 text-lg font-semibold text-purple-700">
          {gameState.gameWinner ? (
            <span className="text-green-600">
              {gameState.gameWinner === 'Draw' ? "It's a draw!" : `${gameState.gameWinner} wins the game!`}
            </span>
          ) : (
            <span>
              Current Player: <span className={gameState.currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}>
                {gameState.currentPlayer}
              </span>
            </span>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {gameState.boards.map((_, boardIndex) => renderBoard(boardIndex))}
        </div>

        <button 
          onClick={handleNewGame} 
          className="bg-purple-500 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-purple-600 transition-all text-lg"
        >
          New Game
        </button>
      </div>
    </div>
  );
} 