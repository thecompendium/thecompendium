import React, { useRef, useEffect, useState } from 'react';

const GRID_W = 20;
const GRID_H = 20;
// Optimize cell size to fit everything in one frame
const CELL_SIZE = 24; // was 32, reduced for better fit
const CANVAS_W = GRID_W * CELL_SIZE;
const CANVAS_H = GRID_H * CELL_SIZE;
const INIT_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const INIT_DIR = { x: 1, y: 0 };
const SPEEDS = [
  { label: 'Slow', value: 180 },
  { label: 'Normal', value: 120 },
  { label: 'Fast', value: 70 },
];

function getRandomFood(snake, exclude = []) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_W),
      y: Math.floor(Math.random() * GRID_H),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y) || exclude.some(e => e.x === pos.x && e.y === pos.y));
  return pos;
}

function playBeep(freq = 440, duration = 80, type = 'square', vol = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

export default function Snake() {
  const [snake, setSnake] = useState(INIT_SNAKE);
  const [dir, setDir] = useState(INIT_DIR);
  const [food, setFood] = useState(getRandomFood(INIT_SNAKE));
  const [redFood, setRedFood] = useState(null); // {x, y, timer}
  const [redTimer, setRedTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake-highscore') || 0));
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS[1].value);
  const [speedLabel, setSpeedLabel] = useState(SPEEDS[1].label);
  const [blink, setBlink] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showSpeedSelect, setShowSpeedSelect] = useState(true);
  const canvasRef = useRef(null);
  const moveRef = useRef(dir);
  moveRef.current = dir;

  // Handle keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!running && !gameOver) {
          startGame();
        } else if (running) {
          setPaused(p => !p);
        }
        return;
      }
      // Speed change shortcuts
      if (e.key === 'f' || e.key === 'F') {
        setSpeed(SPEEDS[2].value);
        setSpeedLabel(SPEEDS[2].label);
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        setSpeed(SPEEDS[1].value);
        setSpeedLabel(SPEEDS[1].label);
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        setSpeed(SPEEDS[0].value);
        setSpeedLabel(SPEEDS[0].label);
        return;
      }
      if (!running || paused) return;
      if (e.key === 'ArrowUp' || e.key === '2') if (dir.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' || e.key === '8') if (dir.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' || e.key === '4') if (dir.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' || e.key === '6') if (dir.x !== -1) setDir({ x: 1, y: 0 });
      if (e.key === 'p' || e.key === 'P' || e.key === '0') setPaused(p => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir, running, paused, gameOver]);

  // Blinking food
  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 400);
    return () => clearInterval(interval);
  }, []);

  // Red food timer
  useEffect(() => {
    if (!redFood) return;
    if (!running || paused) return;
    if (redTimer <= 0) return;
    const t = setTimeout(() => setRedTimer(ti => ti - 1), speed);
    if (redTimer === 1) setRedFood(null);
    return () => clearTimeout(t);
  }, [redFood, redTimer, running, paused, speed]);

  // Game loop
  useEffect(() => {
    if (!running || gameOver || paused) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const next = { x: prev[0].x + moveRef.current.x, y: prev[0].y + moveRef.current.y };
        // Collision
        if (
          next.x < 0 || next.x >= GRID_W ||
          next.y < 0 || next.y >= GRID_H ||
          prev.some(s => s.x === next.x && s.y === next.y)
        ) {
          playBeep(110, 200, 'square', 0.2); // Crash sound
          setGameOver(true);
          setRunning(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snake-highscore', String(score));
          }
          return prev;
        }
        let grow = false;
        let ateRed = false;
        if (next.x === food.x && next.y === food.y) {
          setScore(s => s + 1);
          setFood(getRandomFood([next, ...prev], redFood ? [redFood] : []));
          playBeep(880, 80, 'square', 0.15); // Eat sound
          grow = true;
          // 1 in 5 chance to spawn red food
          if (!redFood && Math.random() < 0.2) {
            const rf = getRandomFood([next, ...prev], [food]);
            setRedFood(rf);
            setRedTimer(8); // 8 moves to eat
          }
          // Speed up every 5 points
          // (removed, now user sets speed)
        } else if (redFood && next.x === redFood.x && next.y === redFood.y) {
          setScore(s => s + 5);
          setRedFood(null);
          setRedTimer(0);
          playBeep(1200, 120, 'square', 0.18); // Bonus eat sound
          grow = true;
        }
        return grow ? [next, ...prev] : [next, ...prev.slice(0, -1)];
      });
    }, speed);
    return () => clearInterval(interval);
  }, [running, food, redFood, gameOver, speed, score, paused, highScore, redTimer]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    // Nokia green background
    ctx.fillStyle = '#b6e2b6';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    // Draw snake
    ctx.fillStyle = '#111';
    snake.forEach((s, i) => {
      ctx.fillRect(s.x * CELL_SIZE, s.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    // Draw food
    if (blink) {
      ctx.fillStyle = '#39ff14';
      ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    // Draw red food
    if (redFood && blink) {
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(redFood.x * CELL_SIZE, redFood.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      // Draw timer bar
      ctx.fillStyle = '#fff';
      ctx.fillRect(redFood.x * CELL_SIZE, redFood.y * CELL_SIZE + CELL_SIZE - 3, Math.max(2, (CELL_SIZE - 2) * (redTimer / 8)), 2);
    }
    // Draw grid (retro look)
    ctx.strokeStyle = '#7bb77b';
    for (let x = 0; x <= CANVAS_W; x += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }
    // LCD border
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.lineWidth = 1;
    // Pause overlay
    if (paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.font = 'bold 32px monospace';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_W / 2, CANVAS_H / 2);
    }
  }, [snake, food, redFood, blink, paused, redTimer]);

  // Start/reset
  const startGame = () => {
    setSnake(INIT_SNAKE);
    setDir(INIT_DIR);
    setFood(getRandomFood(INIT_SNAKE));
    setRedFood(null);
    setRedTimer(0);
    setScore(0);
    setGameOver(false);
    setRunning(true);
    setPaused(false);
    setShowSpeedSelect(false);
  };

  // Speed selector UI
  const renderSpeedSelector = () => (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="text-green-900 font-mono text-lg tracking-widest">Select Speed:</div>
      <div className="flex gap-4">
        {SPEEDS.map(opt => (
          <button
            key={opt.label}
            onClick={() => { setSpeed(opt.value); setSpeedLabel(opt.label); }}
            className={`px-6 py-2 rounded-lg font-bold shadow border-2 border-green-700 ${speedLabel === opt.label ? 'bg-green-700 text-white' : 'bg-white text-green-900'} transition`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-green-700 overflow-hidden" style={{ overscrollBehavior: 'none' }}>
      <div className="bg-green-100/90 rounded-[2rem] shadow-2xl p-4 md:p-6 flex flex-col items-center border-6 border-green-700 backdrop-blur-2xl w-full max-w-lg mx-auto animate-fade-in relative" style={{ boxShadow: '0 0 0 12px #222 inset', maxHeight: '95vh', minWidth: 480, maxWidth: 480 }}>
        <h2 className="text-2xl font-extrabold mb-2 text-green-900 drop-shadow text-center font-mono tracking-widest" style={{ letterSpacing: '0.15em' }}>SNAKE</h2>
        {showSpeedSelect && renderSpeedSelector()}
        {/* Score bar above grid */}
        <div className="flex items-center justify-center w-full mb-2" style={{ minHeight: 40 }}>
          <div className="bg-green-900 rounded-lg px-4 py-1 shadow text-green-200 font-mono text-lg flex items-center gap-3 tracking-widest lcd-border" style={{ fontFamily: 'monospace, monospace', letterSpacing: '0.1em', border: '2px solid #39ff14', textShadow: '0 0 6px #39ff14', minWidth: 360, justifyContent: 'center' }}>
            SCORE: {score}
            <span className="ml-4">HI: {highScore}</span>
            <span className="ml-4">SPEED: {speedLabel}</span>
          </div>
        </div>
        {/* Game grid with phone frame */}
        <div className="flex flex-col items-center justify-center w-full" style={{ position: 'relative', minHeight: 520 }}>
          <div className="bg-green-200 border-3 border-green-700 rounded-lg p-2 flex flex-col items-center" style={{ boxShadow: '0 0 0 6px #222 inset' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="rounded-md shadow-lg border-2 border-green-700 bg-green-200"
              style={{ maxWidth: '100%', height: 'auto', imageRendering: 'pixelated', background: '#b6e2b6', display: 'block' }}
            />
            {/* Controls below grid */}
            <div className="flex gap-4 mt-3 mb-1 w-full items-center justify-center" style={{ minHeight: 45 }}>
              <button onClick={startGame} className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-1.5 rounded-lg shadow transition-all text-base font-mono tracking-widest" style={{ minWidth: 80 }}>
                {running ? 'Restart' : 'Start'}
              </button>
              <button onClick={() => setPaused(p => !p)} className={`bg-green-300 hover:bg-green-400 text-green-900 font-bold px-6 py-1.5 rounded-lg shadow transition-all text-base font-mono tracking-widest ${!running ? 'opacity-50 pointer-events-none' : ''}`} style={{ minWidth: 80 }}>Pause</button>
            </div>
          </div>
        </div>
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-green-100 rounded-xl shadow-2xl p-6 text-center border-3 border-green-700" style={{ minWidth: 320 }}>
              <h3 className="text-2xl font-extrabold text-green-900 mb-2 font-mono tracking-widest">GAME OVER</h3>
              <p className="mb-3 text-green-800 font-mono text-lg">Final Score: {score}</p>
              <button onClick={startGame} className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-2 rounded-lg shadow transition-all mt-2 font-mono tracking-widest">Play Again</button>
            </div>
          </div>
        )}
        {/* Nokia-style bottom bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-green-900 font-mono text-xs opacity-70 tracking-widest">ARROWS/2-4-6-8: MOVE &nbsp; SPACE: START/PAUSE &nbsp; P/0: PAUSE &nbsp; F/N/S: SPEED</div>
      </div>
    </div>
  );
} 