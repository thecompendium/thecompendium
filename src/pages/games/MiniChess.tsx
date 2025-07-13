import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Undo2, Crown, Zap } from 'lucide-react';

// Chess piece types
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type Color = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: Color;
  hasMoved?: boolean;
}

interface Position {
  row: number;
  col: number;
}

interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isCastling?: boolean;
  isEnPassant?: boolean;
  isPromotion?: boolean;
  promotionPiece?: PieceType;
  notation: string;
}

// Unicode chess pieces
const PIECE_SYMBOLS = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

// Initial board setup
function getInitialBoard(): (Piece | null)[][] {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Set up other pieces
  const pieces: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieces[col], color: 'black' };
    board[7][col] = { type: pieces[col], color: 'white' };
  }
  
  return board;
}

// Convert position to algebraic notation
function positionToNotation(pos: Position): string {
  const files = 'abcdefgh';
  const ranks = '87654321';
  return files[pos.col] + ranks[pos.row];
}

// Convert algebraic notation to position
function notationToPosition(notation: string): Position {
  const files = 'abcdefgh';
  const ranks = '87654321';
  return {
    col: files.indexOf(notation[0]),
    row: ranks.indexOf(notation[1])
  };
}

// Get all legal moves for a piece
function getLegalMoves(board: (Piece | null)[][], pos: Position): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];
  
  const moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Forward move
      const forward = { row: pos.row + direction, col: pos.col };
      if (forward.row >= 0 && forward.row < 8 && !board[forward.row][forward.col]) {
        moves.push(forward);
        
        // Double move from starting position
        if (pos.row === startRow) {
          const doubleForward = { row: pos.row + 2 * direction, col: pos.col };
          if (!board[doubleForward.row][doubleForward.col]) {
            moves.push(doubleForward);
          }
        }
      }
      
      // Diagonal captures
      const diagonals = [
        { row: pos.row + direction, col: pos.col - 1 },
        { row: pos.row + direction, col: pos.col + 1 }
      ];
      
      diagonals.forEach(diag => {
        if (diag.row >= 0 && diag.row < 8 && diag.col >= 0 && diag.col < 8) {
          const targetPiece = board[diag.row][diag.col];
          if (targetPiece && targetPiece.color !== piece.color) {
            moves.push(diag);
          }
        }
      });
      break;
      
    case 'rook':
      addStraightMoves(board, pos, piece.color, moves);
      break;
      
    case 'bishop':
      addDiagonalMoves(board, pos, piece.color, moves);
      break;
      
    case 'queen':
      addStraightMoves(board, pos, piece.color, moves);
      addDiagonalMoves(board, pos, piece.color, moves);
      break;
      
    case 'king':
      // Regular king moves
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const newPos = { row: pos.row + dr, col: pos.col + dc };
          if (isValidPosition(newPos) && (!board[newPos.row][newPos.col] || board[newPos.row][newPos.col]!.color !== piece.color)) {
            moves.push(newPos);
          }
        }
      }
      
      // Castling
      if (!piece.hasMoved) {
        // Kingside castling
        if (board[pos.row][7] && board[pos.row][7]!.type === 'rook' && !board[pos.row][7]!.hasMoved) {
          if (!board[pos.row][5] && !board[pos.row][6]) {
            moves.push({ row: pos.row, col: 6 });
          }
        }
        // Queenside castling
        if (board[pos.row][0] && board[pos.row][0]!.type === 'rook' && !board[pos.row][0]!.hasMoved) {
          if (!board[pos.row][1] && !board[pos.row][2] && !board[pos.row][3]) {
            moves.push({ row: pos.row, col: 2 });
          }
        }
      }
      break;
      
    case 'knight':
      const knightMoves = [
        { row: pos.row - 2, col: pos.col - 1 }, { row: pos.row - 2, col: pos.col + 1 },
        { row: pos.row - 1, col: pos.col - 2 }, { row: pos.row - 1, col: pos.col + 2 },
        { row: pos.row + 1, col: pos.col - 2 }, { row: pos.row + 1, col: pos.col + 2 },
        { row: pos.row + 2, col: pos.col - 1 }, { row: pos.row + 2, col: pos.col + 1 }
      ];
      
      knightMoves.forEach(move => {
        if (isValidPosition(move) && (!board[move.row][move.col] || board[move.row][move.col]!.color !== piece.color)) {
          moves.push(move);
        }
      });
      break;
  }
  
  return moves;
}

function addStraightMoves(board: (Piece | null)[][], pos: Position, color: Color, moves: Position[]) {
  const directions = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];
  
  directions.forEach(dir => {
    let current = { row: pos.row + dir.row, col: pos.col + dir.col };
    while (isValidPosition(current)) {
      const piece = board[current.row][current.col];
      if (!piece) {
        moves.push({ ...current });
      } else {
        if (piece.color !== color) {
          moves.push({ ...current });
        }
        break;
      }
      current = { row: current.row + dir.row, col: current.col + dir.col };
    }
  });
}

function addDiagonalMoves(board: (Piece | null)[][], pos: Position, color: Color, moves: Position[]) {
  const directions = [{ row: -1, col: -1 }, { row: -1, col: 1 }, { row: 1, col: -1 }, { row: 1, col: 1 }];
  
  directions.forEach(dir => {
    let current = { row: pos.row + dir.row, col: pos.col + dir.col };
    while (isValidPosition(current)) {
      const piece = board[current.row][current.col];
      if (!piece) {
        moves.push({ ...current });
      } else {
        if (piece.color !== color) {
          moves.push({ ...current });
        }
        break;
      }
      current = { row: current.row + dir.row, col: current.col + dir.col };
    }
  });
}

function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

// Check if a king is in check
function isKingInCheck(board: (Piece | null)[][], color: Color): boolean {
  // Find the king
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        const moves = getLegalMoves(board, { row, col });
        if (moves.some(move => move.row === kingPos!.row && move.col === kingPos!.col)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Check if a move would put/leave the king in check
function isMoveValid(board: (Piece | null)[][], from: Position, to: Position): boolean {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  
  const piece = newBoard[to.row][to.col];
  if (!piece) return false;
  
  return !isKingInCheck(newBoard, piece.color);
}

// Check for checkmate
function isCheckmate(board: (Piece | null)[][], color: Color): boolean {
  if (!isKingInCheck(board, color)) return false;
  
  // Check if any legal move can get out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getLegalMoves(board, { row, col });
        for (const move of moves) {
          if (isMoveValid(board, { row, col }, move)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

// Check for stalemate
function isStalemate(board: (Piece | null)[][], color: Color): boolean {
  if (isKingInCheck(board, color)) return false;
  
  // Check if any legal move exists
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getLegalMoves(board, { row, col });
        for (const move of moves) {
          if (isMoveValid(board, { row, col }, move)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

// --- AI LOGIC ---
// Fine-tuned sound effect utility
function playChessSound(type: 'move' | 'capture' | 'check' | 'checkmate' | 'castle' | 'promote' | 'restart') {
  switch (type) {
    case 'move': playBeep(420, 60, 'triangle', 0.09); break;
    case 'capture': playBeep(220, 120, 'square', 0.13); break;
    case 'check': playBeep(900, 120, 'sawtooth', 0.13); break;
    case 'checkmate': playBeep(1040, 300, 'triangle', 0.18); break;
    case 'castle': playBeep(660, 120, 'triangle', 0.13); break;
    case 'promote': playBeep(1200, 180, 'triangle', 0.15); break;
    case 'restart': playBeep(220, 100, 'sawtooth', 0.10); break;
  }
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

export default function Chess() {
  const [board, setBoard] = useState(getInitialBoard());
  const [currentTurn, setCurrentTurn] = useState<Color>('white');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [gameHistory, setGameHistory] = useState<Move[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate' | 'stalemate' | 'check'>('playing');
  const [checkmateColor, setCheckmateColor] = useState<Color | null>(null);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  // Add state for captured pieces
  const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

  // --- AI Improvements ---
  // Piece values and piece-square tables
  const PIECE_VALUES = { pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 20000 };
  const PAWN_TABLE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // ... (add more tables for other pieces if desired)
  function evaluateBoard(board: (Piece | null)[][]): number {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        let val = PIECE_VALUES[piece.type];
        // Add piece-square table bonus for pawns
        if (piece.type === 'pawn') {
          val += piece.color === 'white' ? PAWN_TABLE[r][c] : PAWN_TABLE[7 - r][c];
        }
        score += piece.color === 'white' ? val : -val;
      }
    }
    return score;
  }

  function getAllLegalMoves(board: (Piece | null)[][], color: Color): {from: Position, to: Position}[] {
    const moves: {from: Position, to: Position}[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const legal = getLegalMoves(board, {row, col}).filter(move => isMoveValid(board, {row, col}, move));
          for (const to of legal) {
            moves.push({from: {row, col}, to});
          }
        }
      }
    }
    return moves;
  }

  // Improved minimax with move ordering (captures first) and higher depth
  function minimax(board: (Piece | null)[][], depth: number, maximizing: boolean): [number, {from: Position, to: Position} | null] {
    if (depth === 0) return [evaluateBoard(board), null];
    const color: Color = maximizing ? 'black' : 'white';
    let bestEval = maximizing ? -Infinity : Infinity;
    let bestMove: {from: Position, to: Position} | null = null;
    let moves = getAllLegalMoves(board, color);
    // Move ordering: captures first
    moves = moves.sort((a, b) => {
      const capA = board[a.to.row][a.to.col];
      const capB = board[b.to.row][b.to.col];
      return (capB ? 1 : 0) - (capA ? 1 : 0);
    });
    for (const move of moves) {
      const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
      newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
      newBoard[move.from.row][move.from.col] = null;
      const [evalScore] = minimax(newBoard, depth - 1, !maximizing);
      if (maximizing) {
        if (evalScore > bestEval) {
          bestEval = evalScore;
          bestMove = move;
        }
      } else {
        if (evalScore < bestEval) {
          bestEval = evalScore;
          bestMove = move;
        }
      }
    }
    return [bestEval, bestMove];
  }

  // Check game status after each move
  useEffect(() => {
    const legalMoves = getAllLegalMoves(board, currentTurn);
    if (isCheckmate(board, currentTurn)) {
      setGameStatus('checkmate');
      setCheckmateColor(currentTurn);
      playChessSound('checkmate');
    } else if (isStalemate(board, currentTurn)) {
      setGameStatus('stalemate');
      setCheckmateColor(null);
      playChessSound('checkmate');
    } else if (legalMoves.length === 0) {
      if (isKingInCheck(board, currentTurn)) {
        setGameStatus('checkmate');
        setCheckmateColor(currentTurn);
        playChessSound('checkmate');
      } else {
        setGameStatus('stalemate');
        setCheckmateColor(null);
        playChessSound('checkmate');
      }
    } else if (isKingInCheck(board, currentTurn)) {
      setGameStatus('check');
      setCheckmateColor(null);
      playChessSound('check');
    } else {
      setGameStatus('playing');
      setCheckmateColor(null);
    }
  }, [board, currentTurn]);

  // AI move effect
  useEffect(() => {
    if (gameStatus === 'playing' && currentTurn === 'black') {
      setAiThinking(true);
      setTimeout(() => {
        // Increase minimax depth for medium-hard AI
        const [, aiMove] = minimax(board, 4, true); // depth 4 for more intense play
        if (aiMove) {
          makeMove(aiMove.from, aiMove.to);
        }
        setAiThinking(false);
      }, 600);
    }
    // eslint-disable-next-line
  }, [board, currentTurn, gameStatus]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate' || currentTurn !== 'white' || aiThinking) return;
    
    const piece = board[row][col];
    
    // If clicking on a piece of the current player's color
    if (piece && piece.color === currentTurn) {
      setSelectedPiece({ row, col });
      const moves = getLegalMoves(board, { row, col }).filter(move => 
        isMoveValid(board, { row, col }, move)
      );
      setLegalMoves(moves);
    }
    // If clicking on a legal move square
    else if (selectedPiece && legalMoves.some(move => move.row === row && move.col === col)) {
      makeMove(selectedPiece, { row, col });
    }
    // Deselect
    else {
      setSelectedPiece(null);
      setLegalMoves([]);
    }
  };

  const makeMove = (from: Position, to: Position) => {
    const piece = board[from.row][from.col];
    if (!piece) return;

    const newBoard = board.map(row => [...row]);
    const captured = newBoard[to.row][to.col];

    // Track captured pieces
    if (captured) {
      if (captured.color === 'white') setCapturedWhite(prev => [...prev, captured.type]);
      else setCapturedBlack(prev => [...prev, captured.type]);
      playChessSound('capture');
    }
    
    // Handle castling
    let isCastling = false;
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      isCastling = true;
      const rookCol = to.col > from.col ? 7 : 0;
      const newRookCol = to.col > from.col ? 5 : 3;
      newBoard[to.row][newRookCol] = newBoard[to.row][rookCol];
      newBoard[to.row][rookCol] = null;
      if (newBoard[to.row][newRookCol]) {
        newBoard[to.row][newRookCol]!.hasMoved = true;
      }
      playChessSound('castle');
    }
    
    // Handle pawn promotion
    let isPromotion = false;
    let promotionPiece: PieceType = 'queen';
    if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
      isPromotion = true;
      newBoard[to.row][to.col] = { type: promotionPiece, color: piece.color };
      playChessSound('promote');
    } else {
      newBoard[to.row][to.col] = { ...piece, hasMoved: true };
      if (!captured && !isCastling) playChessSound('move');
    }
    
    newBoard[from.row][from.col] = null;
    
    // Create move notation
    const notation = `${piece.type === 'pawn' ? '' : piece.type.toUpperCase()}${positionToNotation(from)}${captured ? 'x' : ''}${positionToNotation(to)}${isPromotion ? '=Q' : ''}`;
    
    const move: Move = {
      from,
      to,
      piece,
      captured,
      isCastling,
      isPromotion,
      promotionPiece,
      notation
    };
    
    setBoard(newBoard);
    setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
    setSelectedPiece(null);
    setLegalMoves([]);
    setGameHistory([...gameHistory, move]);
  };

  const restartGame = () => {
    setBoard(getInitialBoard());
    setCurrentTurn('white');
    setSelectedPiece(null);
    setLegalMoves([]);
    setGameHistory([]);
    setGameStatus('playing');
    setCheckmateColor(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    playChessSound('restart');
  };

  const undoMove = () => {
    if (gameHistory.length === 0) return;
    
    // For simplicity, just restart the game
    // In a full implementation, you'd want to store the full game state
    restartGame();
  };

  const isSquareSelected = (row: number, col: number) => {
    return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
  };

  const isLegalMove = (row: number, col: number) => {
    return legalMoves.some(move => move.row === row && move.col === col);
  };

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full h-full min-h-screen">
        <h2 className="text-5xl font-extrabold mb-6 text-amber-700 dark:text-amber-300 drop-shadow text-center font-sans tracking-wide select-none bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Chess</h2>
        {/* Game Over Banner */}
        {(gameStatus === 'checkmate' || gameStatus === 'stalemate') && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
            <div className="bg-white/90 rounded-3xl shadow-2xl px-12 py-10 flex flex-col items-center border border-amber-200 animate-pop">
              <h2 className="text-4xl font-extrabold mb-4 text-amber-700 drop-shadow text-center animate-bounce">
                {gameStatus === 'checkmate' ? (
                  <>
                    {checkmateColor === 'white' ? 'Black Wins!' : 'White Wins!'}
                  </>
                ) : (
                  'Draw!'
                )}
              </h2>
              <button onClick={restartGame} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl shadow transition-all mt-2 text-lg">New Game</button>
            </div>
          </div>
        )}
        {/* Captured pieces - Black */}
        <div className="flex justify-center items-center mb-2 min-h-[32px]">
          {capturedWhite.map((type, idx) => (
            <span key={idx} className="text-2xl md:text-3xl text-gray-900 dark:text-white mx-1 drop-shadow">{PIECE_SYMBOLS['white'][type]}</span>
          ))}
        </div>
        <div className="flex flex-row items-center justify-center w-full gap-12">
          {/* Controls */}
          <div className="flex flex-col gap-6 items-center justify-center">
            <div className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg border ${currentTurn === 'white' ? 'bg-white/90 border-amber-200' : 'bg-gray-800/90 border-gray-700'}`}>
              <div className={`w-4 h-4 rounded-full ${currentTurn === 'white' ? 'bg-white border-2 border-gray-800' : 'bg-gray-800 border-2 border-white'}`}></div>
              <span className="font-bold text-amber-800 dark:text-amber-200 text-lg">{currentTurn === 'white' ? "White's Turn" : "Black's Turn"}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex items-center gap-2 bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105 transform text-lg"
              >
                <RotateCcw className="w-5 h-5" />
                New Game
              </button>
              <button
                onClick={undoMove}
                className="flex items-center gap-2 bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-105 transform text-lg"
                disabled={gameHistory.length === 0}
              >
                <Undo2 className="w-5 h-5" />
                Undo
              </button>
            </div>
          </div>
          {/* Chess Board */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="grid grid-cols-8 gap-0 w-[90vw] max-w-[700px] h-[90vw] max-h-[700px] bg-gradient-to-br from-yellow-50 to-yellow-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-1 shadow-xl border-2 border-yellow-200 dark:border-gray-700">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isSelected = isSquareSelected(rowIndex, colIndex);
                  const isLegal = isLegalMove(rowIndex, colIndex);
                  const isLight = isLightSquare(rowIndex, colIndex);
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`relative flex items-center justify-center text-4xl md:text-5xl cursor-pointer transition-all duration-150 select-none
                        ${isLight ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-yellow-300 dark:bg-yellow-700'}
                        ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2 z-10' : ''}
                        ${isLegal ? 'after:absolute after:w-3/5 after:h-3/5 after:rounded-full after:bg-green-400/30 after:content-[""] after:z-0' : ''}
                        hover:scale-105 hover:z-20 hover:shadow-lg
                      `}
                      style={{ aspectRatio: '1/1' }}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {piece && (
                        <span className={`drop-shadow-lg ${piece.color === 'white' ? 'text-white' : 'text-gray-900'}`}>{PIECE_SYMBOLS[piece.color][piece.type]}</span>
                      )}
                      {/* File labels */}
                      {rowIndex === 7 && (
                        <div className="absolute bottom-1 right-1 text-xs font-bold text-yellow-700 dark:text-yellow-300 opacity-60">
                          {String.fromCharCode(97 + colIndex)}
                        </div>
                      )}
                      {/* Rank labels */}
                      {colIndex === 0 && (
                        <div className="absolute top-1 left-1 text-xs font-bold text-yellow-700 dark:text-yellow-300 opacity-60">
                          {8 - rowIndex}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* Captured pieces - White */}
        <div className="flex justify-center items-center mt-2 min-h-[32px]">
          {capturedBlack.map((type, idx) => (
            <span key={idx} className="text-2xl md:text-3xl text-gray-900 dark:text-white mx-1 drop-shadow">{PIECE_SYMBOLS['black'][type]}</span>
          ))}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fade-in 0.3s ease; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
} 