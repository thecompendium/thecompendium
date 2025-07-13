import React, { useState } from 'react';
import { isValidSudokuCell, generateSudokuPuzzle } from '../../../utils/sudokuLogic';
import { FaRegLightbulb } from 'react-icons/fa';

const THEME = {
  bg: 'bg-orange-50',
  border: 'border-orange-400',
  region: 'border-orange-600',
  cell: 'bg-white',
  initial: 'bg-orange-100 text-orange-700',
  input: 'text-orange-900',
  error: 'bg-red-200 border-red-500',
  ring: 'ring-orange-400',
};

const CLUES_FOR_SIZE = 9 * 9 > 36 ? 32 : 24; // 32 clues for 9x9, 24 for smaller

function deepCopy(board) {
  return board.map(row => [...row]);
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

export default function StandardSudoku({ onBack }) {
  const [puzzleData, setPuzzleData] = useState(() => generateSudokuPuzzle(CLUES_FOR_SIZE));
  const [board, setBoard] = useState(() => deepCopy(puzzleData.puzzle));
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [cluesLeft, setCluesLeft] = useState(Math.floor(CLUES_FOR_SIZE / 4));

  const isInitial = (r, c) => puzzleData.puzzle[r][c] !== null;

  const handleInput = (row, col, val) => {
    if (isInitial(row, col)) return;
    const newBoard = deepCopy(board);
    newBoard[row][col] = val;
    setBoard(newBoard);
    setMessage(null);
    playBeep(420, 60, 'triangle', 0.09); // Input sound
  };

  const checkSolution = () => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (!val || !isValidSudokuCell(board, r, c, val, 9, 3, 3)) {
        setMessage('There are mistakes or empty cells!');
        playBeep(180, 120, 'sawtooth', 0.11); // Error sound
        return;
      }
    }
    setMessage('Congratulations! Sudoku solved!');
    playBeep(1040, 300, 'triangle', 0.18); // Win sound
  };

  const handleNewGame = () => {
    const newPuzzle = generateSudokuPuzzle(CLUES_FOR_SIZE);
    setPuzzleData(newPuzzle);
    setBoard(deepCopy(newPuzzle.puzzle));
    setMessage(null);
    setSelected(null);
    setCluesLeft(Math.floor(CLUES_FOR_SIZE / 4));
    setShowSolution(false);
    playBeep(220, 100, 'sawtooth', 0.10); // Restart sound
  };

  const revealClue = () => {
    if (cluesLeft === 0) return;
    const empties = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (!isInitial(r, c) && (board[r][c] === null || board[r][c] !== puzzleData.solution[r][c])) {
        empties.push([r, c]);
      }
    }
    if (empties.length === 0) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    const newBoard = deepCopy(board);
    newBoard[r][c] = puzzleData.solution[r][c];
    setBoard(newBoard);
    setCluesLeft(cluesLeft - 1);
    setMessage(null);
    playBeep(800, 120, 'square', 0.13); // Reveal clue sound
  };

  const userHasInput = board.some((row, r) => row.some((cell, c) => !isInitial(r, c) && cell !== null));

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${THEME.bg}`}>
      <button onClick={onBack} className={`absolute top-4 left-4 bg-white border ${THEME.border} px-3 py-1.5 rounded-xl shadow text-orange-700 font-bold hover:bg-orange-100 backdrop-blur-md`}>← Back to Modes</button>
      <div className={`bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center border ${THEME.border} max-w-2xl w-full mx-auto animate-fade-in`}>
        <h2 className="text-4xl font-extrabold mb-6 text-orange-700 drop-shadow text-center font-sans tracking-wide">Standard Sudoku</h2>
        <div className="mb-4 text-lg text-orange-700">Classic 9x9 Sudoku with a modern UI!</div>
        <div className="mb-4 flex gap-2 items-center">
          <button onClick={handleNewGame} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-orange-600 transition-all text-lg">New Game</button>
          <button onClick={revealClue} disabled={cluesLeft === 0} className={`flex items-center gap-2 bg-white border ${THEME.border} px-4 py-2 rounded-xl font-bold shadow hover:bg-orange-100 transition-all text-lg ${cluesLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>{<FaRegLightbulb className="text-yellow-400 text-2xl" />}<span>{cluesLeft}</span></button>
          <button onClick={() => setShowSolution(s => !s)} className="bg-gray-700 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-gray-900 transition-all text-lg">{showSolution ? 'Hide Solution' : 'Show Solution'}</button>
          {userHasInput && <button onClick={checkSolution} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-green-700 transition-all text-lg">Check Solution</button>}
        </div>
        <div className="mb-4">
          {message && <div className="text-center text-lg font-semibold text-red-700 bg-orange-100 rounded-xl px-4 py-2 shadow animate-pop">{message}</div>}
        </div>
        <div className="relative flex justify-center items-center" style={{boxShadow:'0 4px 32px 0 rgba(255,140,0,0.10)'}}>
          <div className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-orange-300/60" style={{zIndex:1}} />
          <div className="grid grid-cols-9 gap-0.5 bg-white p-2 rounded-2xl shadow-inner border-2 border-orange-400" style={{width:'min(90vw,480px)'}}>
            {(showSolution ? puzzleData.solution : board).map((row, r) => row.map((cell, c) => {
              const thickLeft = c % 3 === 0 && c !== 0;
              const thickTop = r % 3 === 0 && r !== 0;
              const isInit = isInitial(r, c);
              const hasConflict = !isInit && board[r][c] && !isValidSudokuCell(board, r, c, board[r][c], 9, 3, 3);
              return (
                <div
                  key={r + '-' + c}
                  className={`relative aspect-square w-8 sm:w-10 md:w-12 flex items-center justify-center rounded-none border text-xl sm:text-2xl font-bold transition-all
                    ${isInit ? THEME.initial : THEME.cell}
                    ${thickLeft ? 'border-l-4 ' + THEME.region : ''} ${thickTop ? 'border-t-4 ' + THEME.region : ''}
                    ${hasConflict ? THEME.error + ' animate-shake' : ''}
                    hover:bg-orange-50 focus-within:bg-orange-50 hover:shadow-lg focus-within:shadow-lg`}
                  onClick={() => setSelected([r, c])}
                  style={{transition:'box-shadow 0.2s, background 0.2s'}}
                >
                  {isInit || showSolution ? (cell ?? '') : (
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`w-full h-full text-center bg-transparent outline-none ${THEME.input}`}
                      value={cell ?? ''}
                      onChange={e => {
                        const v = parseInt(e.target.value);
                        handleInput(r, c, isNaN(v) ? null : v);
                      }}
                      style={{caretColor: '#ea580c'}}
                    />
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      </div>
    </div>
  );
} 