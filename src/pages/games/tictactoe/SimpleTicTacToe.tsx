import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserTie } from 'react-icons/fa';
import Confetti from 'react-confetti';

export default function SimpleTicTacToe() {
  const navigate = useNavigate();
  const [board, setBoard] = React.useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = React.useState(true);
  const [winner, setWinner] = React.useState<string | null>(null);
  const [score, setScore] = React.useState({ X: 0, O: 0 });
  const [showCelebration, setShowCelebration] = React.useState(false);

  const handleBack = () => {
    navigate('/games/tictactoe');
  };

  function calculateWinner(b: (string | null)[]) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.every(cell => cell) ? 'Draw' : null;
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

  function handleClick(i: number) {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    playBeep(420, 60, 'triangle', 0.09); // Place sound
    const win = calculateWinner(newBoard);
    setWinner(win);
    setXIsNext(!xIsNext);
    if (win && win !== 'Draw') {
      setScore(prev => ({ ...prev, [win]: prev[win] + 1 }));
      setShowCelebration(true);
      playBeep(1040, 300, 'triangle', 0.18); // Win sound
    } else if (win === 'Draw') {
      playBeep(180, 120, 'sawtooth', 0.11); // Draw sound
    }
  }

  function handleNewGame() {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
    setShowCelebration(false);
    setScore({ X: 0, O: 0 });
    playBeep(220, 100, 'sawtooth', 0.10); // Restart sound
  }

  // Scoreboard UI
  const scoreCard = (
    <div className="flex items-center justify-center gap-8 mb-6">
      <div className="flex flex-col items-center">
        <span className="text-4xl text-blue-700 font-extrabold mb-1 flex items-center gap-2"><FaUser className="text-blue-700" /> X</span>
        <span className="text-blue-700 text-lg font-bold">Player 1</span>
        <span className="text-3xl font-extrabold text-blue-700 drop-shadow">{score.X}</span>
      </div>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-blue-100 shadow-inner text-xl font-bold text-blue-700">VS</div>
      <div className="flex flex-col items-center">
        <span className="text-4xl text-orange-500 font-extrabold mb-1 flex items-center gap-2"><FaUser className="text-orange-500" /> O</span>
        <span className="text-orange-500 text-lg font-bold">Player 2</span>
        <span className="text-3xl font-extrabold text-orange-500 drop-shadow">{score.O}</span>
      </div>
    </div>
  );

  // Celebration overlay
  const celebration = showCelebration && (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in cursor-pointer" onClick={() => setShowCelebration(false)}>
      <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} run={showCelebration} recycle={false} />
      <div className="bg-white/90 rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center border border-blue-200 animate-pop">
        <h2 className="text-5xl font-extrabold mb-4 text-blue-700 drop-shadow text-center animate-bounce flex items-center gap-3">
          <FaUser className={winner==='X'?'text-blue-700':'text-orange-500'} /> {winner === 'X' ? 'Player 1' : 'Player 2'} Wins! {winner==='X'?'X':'O'}
        </h2>
        <p className="text-lg text-gray-500 mt-2">Click anywhere to continue</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-200/60 to-orange-100/60 relative overflow-hidden">
      {celebration}
      <button onClick={handleBack} className="absolute top-2 left-2 bg-white/30 border border-blue-200/40 px-2 py-1 rounded-xl shadow text-blue-700 font-bold hover:bg-blue-100/40 backdrop-blur-md text-sm">← Back to Menu</button>
      <div className="backdrop-blur-xl bg-white/10 border border-blue-200/30 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full mx-auto animate-fade-in relative" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.18)', height:'90vh', minHeight:'unset', maxHeight:'90vh', overflow:'hidden', padding:'2vh 2vw'}}>
        <h2 className="text-xl md:text-2xl font-extrabold mb-1 text-blue-700 drop-shadow text-center font-sans tracking-wide animate-bounce" style={{ fontFamily: 'Playfair Display, serif' }}>
          <FaUser className="inline-block text-blue-400 mr-2 animate-float" /> Simple Two Player
        </h2>
        {scoreCard}
        <div className="w-full flex flex-col items-center justify-center flex-1 min-h-0">
          <div className="mb-2 text-base font-semibold text-blue-800 min-h-[1.5rem] flex items-center justify-center" style={{background:'#f8fafcbb', borderRadius:'8px', padding:'2px 12px', marginBottom:'8px'}}>
            {winner ? (
              winner === 'Draw' ? (
                <span className="text-gray-700 animate-fade-in">It's a draw!</span>
              ) : (
                <span className={`text-green-600 animate-fade-in flex items-center gap-2`}><FaUser className={winner==='X'?'text-blue-700':'text-orange-500'} /> Winner: {winner === 'X' ? 'Player 1' : 'Player 2'} {winner}</span>
              )
            ) : (
              <span>Turn: <span className={xIsNext ? 'text-blue-700 font-bold flex items-center gap-1' : 'text-orange-500 font-bold flex items-center gap-1'}>{xIsNext ? <><FaUser className="text-blue-700" /> Player 1 X</> : <><FaUser className="text-orange-500" /> Player 2 O</>}</span></span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 flex-grow" style={{width:'min(40vw, 40vh)', height:'min(40vw, 40vh)', minHeight:'180px', minWidth:'180px', background:'#f8fafc77', borderRadius:'12px', padding:'8px'}}>
            {board.map((cell, i) => (
              <button
                key={i}
                className={`w-full h-full flex items-center justify-center text-2xl md:text-3xl font-extrabold rounded-2xl border-2 border-blue-400 shadow transition-all duration-200 bg-white/30 hover:scale-105 focus:outline-none ${cell === 'X' ? 'text-blue-700' : cell === 'O' ? 'text-orange-500' : 'text-gray-400'} ${winner && (cell === 'X' || cell === 'O') ? 'opacity-80' : ''} ${!cell && !winner && 'hover:ring-4 hover:ring-blue-200/30'} animate-pop`}
                onClick={() => handleClick(i)}
                disabled={!!cell || !!winner}
                style={{ aspectRatio: '1', minWidth:0, minHeight:0, cursor: cell || winner ? 'not-allowed' : 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', background: 'transparent' }}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center items-center" style={{position:'absolute', left:0, right:0, bottom:'1.5vh', padding:'0 2vw'}}>
          <button onClick={handleNewGame} className="bg-blue-600 text-white px-8 py-2 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all text-lg border-2 border-blue-300" style={{minWidth:'120px'}}>New Game</button>
        </div>
      </div>
    </div>
  );
} 