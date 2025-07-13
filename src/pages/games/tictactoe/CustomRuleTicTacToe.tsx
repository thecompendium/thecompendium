import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCogs, FaUser } from 'react-icons/fa';
import Confetti from 'react-confetti';

type Player = string;
type Cell = Player | null;

interface GameConfig {
  boardSize: number;
  numPlayers: number;
  players: Player[];
  symbols: string[];
  winLength: number;
}

export default function CustomRuleTicTacToe() {
  const navigate = useNavigate();
  const [showConfig, setShowConfig] = useState(true);
  const [showNameSetup, setShowNameSetup] = useState(false);
  const [config, setConfig] = useState({
    boardSize: 3,
    numPlayers: 2,
    winLength: 3,
    players: ['A', 'B'],
    symbols: ['X', 'O']
  });
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);
  const [nameInputs, setNameInputs] = useState<string[]>(['Player 1', 'Player 2']);
  const [board, setBoard] = useState<Cell[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [score, setScore] = useState<{ [key: string]: number }>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiRun, setConfettiRun] = useState(false);
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleBack = () => {
    navigate('/games/tictactoe');
  };

  // Symbol and color mapping for up to 6 players
  const symbolList = ['X', 'O', '△', '◆', '⬢', '⬣'];
  const colorList = ['text-blue-600', 'text-red-600', 'text-green-600', 'text-yellow-600', 'text-purple-600', 'text-pink-600'];

  // Generate winning lines based on board size and win length
  const winningLines = useMemo(() => {
    const lines: number[][] = [];
    const size = config.boardSize;
    const winLen = config.winLength;

    // Rows
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winLen; col++) {
        const line = [];
        for (let i = 0; i < winLen; i++) {
          line.push(row * size + col + i);
        }
        lines.push(line);
      }
    }

    // Columns
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winLen; row++) {
        const line = [];
        for (let i = 0; i < winLen; i++) {
          line.push((row + i) * size + col);
        }
        lines.push(line);
      }
    }

    // Diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - winLen; row++) {
      for (let col = 0; col <= size - winLen; col++) {
        const line = [];
        for (let i = 0; i < winLen; i++) {
          line.push((row + i) * size + (col + i));
        }
        lines.push(line);
      }
    }

    // Diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - winLen; row++) {
      for (let col = winLen - 1; col < size; col++) {
        const line = [];
        for (let i = 0; i < winLen; i++) {
          line.push((row + i) * size + (col - i));
        }
        lines.push(line);
      }
    }

    return lines;
  }, [config.boardSize, config.winLength]);

  const calculateWinner = (board: Cell[]): Player | 'Draw' | null => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(cell => cell) ? 'Draw' : null;
  };

  const handleClick = (index: number) => {
    if (winner || board[index]) return;

    const newBoard = board.slice();
    newBoard[index] = config.players[currentPlayer];
    setBoard(newBoard);

    const win = calculateWinner(newBoard);
    setWinner(win);

    if (win && win !== 'Draw') {
      setScore(prev => ({ ...prev, [win]: (prev[win] || 0) + 1 }));
      setShowCelebration(true);
    } else {
      const nextIndex = (currentPlayer + 1) % config.numPlayers;
      setCurrentPlayer(nextIndex);
    }
  };

  const handleNewGame = () => {
    const newBoardSize = config.boardSize * config.boardSize;
    setBoard(Array(newBoardSize).fill(null));
    setWinner(null);
    setCurrentPlayer(0);
    setShowCelebration(false);
    setScore({});
  };

  const handleConfigChange = (newConfig: Partial<GameConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    // Always update players and symbols arrays if numPlayers changes
    if (newConfig.numPlayers !== undefined) {
      const newPlayers = [];
      const newSymbols = [];
      for (let i = 0; i < newConfig.numPlayers; i++) {
        newPlayers.push(String.fromCharCode(65 + i)); // A, B, C, etc.
        newSymbols.push(symbolList[i] || '👤');
      }
      updatedConfig.players = newPlayers;
      updatedConfig.symbols = newSymbols;
    }
    setConfig(updatedConfig);
    // Reset game with new config
    const newBoardSize = updatedConfig.boardSize * updatedConfig.boardSize;
    setBoard(Array(newBoardSize).fill(null));
    setWinner(null);
    setCurrentPlayer(0);
    setScore({});
  };

  // Update nameInputs when numPlayers changes
  React.useEffect(() => {
    setNameInputs(Array(config.numPlayers).fill('').map((_, i) => playerNames[i] || `Player ${i + 1}`));
  }, [config.numPlayers]);

  // Auto-restart on draw
  React.useEffect(() => {
    if (winner === 'Draw') {
      const t = setTimeout(() => {
        handleNewGame();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [winner]);

  // Celebration overlay
  const celebration = showCelebration && (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in cursor-pointer" onClick={() => { setShowCelebration(false); setConfettiRun(false); }}>
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} run={confettiRun} recycle={false} />
      <div className="bg-white/90 rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center border border-yellow-200 animate-pop">
        <h2 className="text-5xl font-extrabold mb-4 text-yellow-700 drop-shadow text-center animate-bounce flex items-center gap-3">
          <FaUser className={colorList[currentPlayer]} /> {symbolList[currentPlayer]} {playerNames[currentPlayer]} Wins!
        </h2>
        <p className="text-lg text-gray-500 mt-2">Click anywhere to continue</p>
      </div>
    </div>
  );

  // When showCelebration is set, start confetti and keep it running until overlay is closed
  React.useEffect(() => {
    if (showCelebration) {
      setConfettiRun(true);
    } else {
      setConfettiRun(false);
      if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
    }
  }, [showCelebration]);

  // Debug: log state transitions
  React.useEffect(() => {
    // Remove this in production
    // console.log('showConfig:', showConfig, 'showNameSetup:', showNameSetup, 'board:', board);
  }, [showConfig, showNameSetup, board]);

  if (showConfig || showNameSetup) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200/60 to-indigo-100/60">
        <button 
          onClick={handleBack} 
          className="absolute top-4 left-4 bg-white/30 border border-yellow-200/40 px-3 py-1.5 rounded-xl shadow text-yellow-700 font-bold hover:bg-yellow-100/40 backdrop-blur-md"
        >
          ← Back to Menu
        </button>
        <div className="backdrop-blur-xl bg-white/10 border border-yellow-200/30 rounded-3xl shadow-xl p-6 flex flex-col items-center max-w-md w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-yellow-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
            <FaCogs className="inline-block text-yellow-400 mr-2 animate-float" />
            Custom Rules
          </h2>
          
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-2">Board Size:</label>
              <select 
                value={config.boardSize} 
                onChange={(e) => handleConfigChange({ boardSize: parseInt(e.target.value) })}
                className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-2 text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value={3}>3x3</option>
                <option value={4}>4x4</option>
                <option value={5}>5x5</option>
                <option value={6}>6x6</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-2">Number of Players:</label>
              <select 
                value={config.numPlayers} 
                onChange={(e) => handleConfigChange({ numPlayers: parseInt(e.target.value) })}
                className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-2 text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
                <option value={5}>5 Players</option>
                <option value={6}>6 Players</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-700 mb-2">Win Length:</label>
              <select 
                value={config.winLength} 
                onChange={(e) => handleConfigChange({ winLength: parseInt(e.target.value) })}
                className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-2 text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value={3}>3 in a row</option>
                <option value={4}>4 in a row</option>
                <option value={5}>5 in a row</option>
              </select>
            </div>

            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold text-yellow-700 mb-3">Players:</h3>
              <form
                className="grid grid-cols-2 gap-3"
                onSubmit={e => {
                  e.preventDefault();
                  setPlayerNames([...nameInputs]);
                  setShowNameSetup(false);
                  setShowConfig(false);
                  setBoard(Array(config.boardSize * config.boardSize).fill(null));
                  setWinner(null);
                  setCurrentPlayer(0);
                  setScore({});
                }}
              >
                {config.players.map((player, idx) => (
                  <div key={player} className={`flex items-center gap-2 bg-white rounded-lg p-3 shadow border-2 ${colorList[idx]} transition-all`}>
                    <FaUser className={colorList[idx]} />
                    <span className={`text-2xl font-extrabold ${colorList[idx]}`}>{symbolList[idx]}</span>
                    <input
                      type="text"
                      className={`flex-1 border-none outline-none bg-transparent text-base px-2 py-1 ${colorList[idx]}`}
                      value={nameInputs[idx]}
                      onChange={e => setNameInputs(inputs => inputs.map((n, i) => i === idx ? e.target.value : n))}
                      placeholder={`Player ${idx + 1} name`}
                      required
                    />
                  </div>
                ))}
                <button type="submit" className="col-span-2 mt-4 bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-yellow-600 transition-all text-lg">Start Game</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN GAME UI
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200/60 to-indigo-100/60">
      <button onClick={handleBack} className="absolute top-4 left-4 bg-white/30 border border-yellow-200/40 px-3 py-1.5 rounded-xl shadow text-yellow-700 font-bold hover:bg-yellow-100/40 backdrop-blur-md">← Back to Menu</button>
      <div className="backdrop-blur-xl bg-white/10 border border-yellow-200/30 rounded-3xl shadow-xl p-6 flex flex-col items-center max-w-2xl w-full mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-yellow-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
          <FaCogs className="inline-block text-yellow-400 mr-2 animate-float" />
          Custom Rules
        </h2>
        {/* Scoreboard */}
        <div className="flex gap-4 mb-4">
          {playerNames.map((name, idx) => (
            <div key={idx} className={`flex flex-col items-center ${colorList[idx]}`}>
              <span className="font-bold text-2xl">{symbolList[idx]}</span>
              <span className="text-sm">{name}</span>
              <span className="text-lg font-bold">{score[config.players[idx]] || 0}</span>
            </div>
          ))}
        </div>
        {/* Turn indicator */}
        <div className="mb-2 text-lg font-semibold">
          Turn: <span className={colorList[currentPlayer]}>{playerNames[currentPlayer]}</span>
        </div>
        {/* Board */}
        <div
          className="grid mb-4"
          style={{
            gridTemplateColumns: `repeat(${config.boardSize}, 1fr)`,
            gap: config.boardSize > 6 ? '2px' : '8px',
            width: 'min(60vw, 60vh)',
            height: 'min(60vw, 60vh)',
            minHeight: '240px',
            minWidth: '240px',
            background:'#fffbeeb0',
            borderRadius:'18px',
            padding:'12px',
            margin:'0 auto',
            justifyItems: 'center',
            alignItems: 'center',
          }}
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              className={`aspect-square w-full h-full rounded-xl border-2 font-bold text-2xl flex items-center justify-center transition-all ${cell ? colorList[config.players.indexOf(cell)] : 'text-gray-400'} ${!cell && !winner ? 'hover:border-yellow-400' : 'border-gray-300'} ${winner && cell ? 'opacity-80' : ''}`}
              onClick={() => handleClick(idx)}
              disabled={!!cell || !!winner}
              style={{ aspectRatio: '1/1', minWidth: '32px', minHeight: '32px', fontSize: `clamp(0.7rem, ${Math.floor(24 / config.boardSize)}vw, 1.5rem)` }}
            >
              {cell ? symbolList[config.players.indexOf(cell)] : ''}
            </button>
          ))}
        </div>
        {/* New Game Button */}
        <button onClick={handleNewGame} className="mt-2 bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-yellow-600 transition-all text-lg">New Game</button>
      </div>
      {celebration}
    </div>
  );
} 