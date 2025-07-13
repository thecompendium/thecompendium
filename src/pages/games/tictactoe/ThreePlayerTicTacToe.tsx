import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie, FaUserNinja } from 'react-icons/fa';
import Confetti from 'react-confetti';

type Player = 'X' | 'O' | '△';
type Cell = Player | null;

const WINNING_LINES_4X4 = [
  // Rows
  [0, 1, 2], [1, 2, 3], [4, 5, 6], [5, 6, 7], [8, 9, 10], [9, 10, 11], [12, 13, 14], [13, 14, 15],
  // Columns
  [0, 4, 8], [4, 8, 12], [1, 5, 9], [5, 9, 13], [2, 6, 10], [6, 10, 14], [3, 7, 11], [7, 11, 15],
  // Diagonals
  [0, 5, 10], [1, 6, 11], [4, 9, 14], [5, 10, 15], [2, 5, 8], [3, 6, 9], [6, 9, 12], [7, 10, 13]
];

export default function ThreePlayerTicTacToe() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Cell[]>(Array(16).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [score, setScore] = useState({ X: 0, O: 0, '△': 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [playerNames, setPlayerNames] = useState({ X: 'Player 1', O: 'Player 2', '△': 'Player 3' });
  const [showNameSetup, setShowNameSetup] = useState(true);

  const players: Player[] = ['X', 'O', '△'];
  const playerColors = {
    X: 'text-blue-600',
    O: 'text-red-600',
    '△': 'text-green-600'
  };

  const playerSymbols = {
    X: <span className="text-blue-600 font-extrabold flex items-center gap-1"><FaUser className="text-blue-600" /> X</span>,
    O: <span className="text-red-600 font-extrabold flex items-center gap-1"><FaUser className="text-red-600" /> O</span>,
    '△': <span className="text-green-600 font-extrabold flex items-center gap-1"><FaUser className="text-green-600" /> △</span>,
  };

  const calculateWinner = (board: Cell[]): Player | 'Draw' | null => {
    for (const [a, b, c] of WINNING_LINES_4X4) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell) ? 'Draw' : null;
  };

  const handleClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const win = calculateWinner(newBoard);
    setWinner(win);

    if (win && win !== 'Draw') {
      setScore(prev => ({ ...prev, [win]: prev[win] + 1 }));
      setShowCelebration(true);
    } else {
      const currentIndex = players.indexOf(currentPlayer);
      const nextIndex = (currentIndex + 1) % players.length;
      setCurrentPlayer(players[nextIndex]);
    }
  };

  const handleNewGame = () => {
    setBoard(Array(16).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setShowCelebration(false);
    setScore({ X: 0, O: 0, '△': 0 });
  };

  const handleBack = () => {
    navigate('/games/tictactoe');
  };

  const celebration = showCelebration && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCelebration(false)}>
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} run={showCelebration} recycle={false} />
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce">
        <h2 className="text-4xl font-bold text-pink-700 mb-4 flex items-center gap-2">
          {winner && <FaUser className={playerColors[winner as Player]} />} {winner && playerNames[winner as Player]} ({winner}) Wins!
        </h2>
        <p className="text-xl text-gray-600">Three Player Victory!</p>
      </div>
    </div>
  );

  // Scoreboard UI
  const scoreCard = (
    <div className="flex items-center justify-center gap-8 mb-6">
      {players.map((player, idx) => (
        <div key={player} className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <FaUser className={playerColors[player]} />
            <span className={`text-2xl font-extrabold ${playerColors[player]}`}>{player}</span>
          </div>
          <span className="text-xs text-gray-500">{playerNames[player]}</span>
          <span className="text-xl font-bold">{score[player]}</span>
        </div>
      ))}
    </div>
  );

  if (showNameSetup) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200/60 to-yellow-100/60">
        <div className="backdrop-blur-xl bg-white/10 border border-pink-200/30 rounded-3xl shadow-xl p-6 flex flex-col items-center max-w-md w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-pink-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FaUser className="inline-block text-pink-400 mr-2 animate-float" />
            3 Player Tic Tac Toe
          </h2>
          <form
            className="flex flex-col gap-4 w-full"
            onSubmit={e => { e.preventDefault(); setShowNameSetup(false); }}
          >
            {players.map((player, idx) => (
              <div key={player} className="flex items-center gap-3">
                <FaUser className={playerColors[player]} />
                <input
                  type="text"
                  className={`flex-1 border rounded px-3 py-2 ${playerColors[player]}`}
                  value={playerNames[player]}
                  onChange={e => setPlayerNames(names => ({ ...names, [player]: e.target.value }))}
                  placeholder={`Player ${idx + 1} name`}
                  required
                />
              </div>
            ))}
            <button type="submit" className="mt-4 bg-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-pink-600 transition-all text-lg">Start Game</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200/60 to-yellow-100/60 relative overflow-hidden">
      {celebration}
      <button 
        onClick={handleBack} 
        className="absolute top-2 left-2 bg-white/30 border border-pink-200/40 px-2 py-1 rounded-xl shadow text-pink-700 font-bold hover:bg-pink-100/40 backdrop-blur-md text-sm"
      >
        ← Back to Menu
      </button>
      <div className="backdrop-blur-xl bg-white/10 border border-pink-200/30 rounded-3xl shadow-xl flex flex-col items-center max-w-2xl w-full mx-auto animate-fade-in relative" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)', height:'90vh', minHeight:'unset', maxHeight:'90vh', overflow:'hidden', padding:'2vh 2vw'}}>
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-pink-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
          <FaUser className="inline-block text-pink-400 mr-2 animate-float" />
          3 Player Tic Tac Toe
        </h2>
        {scoreCard}
        <div className="w-full flex flex-col items-center justify-center flex-1 min-h-0">
          <div className="mb-2 text-base font-semibold text-pink-700 min-h-[1.5rem] flex items-center justify-center" style={{background:'#fff0faee', borderRadius:'8px', padding:'2px 12px', marginBottom:'8px'}}>
            {winner ? (
              <span className="text-green-600 flex items-center gap-2">
                {winner === 'Draw' ? "It's a draw!" : <>{playerSymbols[winner]} {winner} wins!</>}
              </span>
            ) : (
              <span>
                Current Player: <span className={playerColors[currentPlayer]}>
                  {playerSymbols[currentPlayer]} {currentPlayer}
                </span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 flex-grow" style={{width:'min(40vw, 40vh)', height:'min(40vw, 40vh)', minHeight:'180px', minWidth:'180px', background:'#fff0fa77', borderRadius:'12px', padding:'8px'}}>
            {board.map((cell, index) => (
              <button
                key={index}
                className={`w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold rounded-xl border-2 border-pink-400 shadow transition-all duration-200 bg-white/30 hover:scale-105 focus:outline-none ${cell ? playerColors[cell] : 'text-gray-400'} ${!cell && !winner ? 'hover:border-pink-400' : 'border-gray-300'} ${winner && cell ? 'opacity-80' : ''}`}
                onClick={() => handleClick(index)}
                disabled={!!cell || !!winner}
                style={{ aspectRatio: '1', minWidth:0, minHeight:0, cursor: cell || winner ? 'not-allowed' : 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', background: 'transparent' }}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center items-center" style={{position:'absolute', left:0, right:0, bottom:'1.5vh', padding:'0 2vw'}}>
          <button onClick={handleNewGame} className="bg-pink-600 text-white px-8 py-2 rounded-2xl font-bold shadow-lg hover:bg-pink-700 transition-all text-lg border-2 border-pink-300" style={{minWidth:'120px'}}>New Game</button>
        </div>
      </div>
    </div>
  );
} 