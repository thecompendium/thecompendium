// Sudoku logic utility for number-only boards
// Checks if placing val at (row, col) is valid for the given board and region sizes

export function isValidSudokuCell(
  board: (number|null)[][],
  row: number,
  col: number,
  val: number,
  size: number,
  boxRows: number,
  boxCols: number
): boolean {
  // Check row and column
  for (let i = 0; i < size; i++) {
    if (board[row][i] === val && i !== col) return false;
    if (board[i][col] === val && i !== row) return false;
  }
  // Check box/region
  const boxRow = Math.floor(row / boxRows) * boxRows;
  const boxCol = Math.floor(col / boxCols) * boxCols;
  for (let r = 0; r < boxRows; r++) for (let c = 0; c < boxCols; c++) {
    const rr = boxRow + r, cc = boxCol + c;
    if (board[rr][cc] === val && (rr !== row || cc !== col)) return false;
  }
  return true;
}

// Generate a full valid 9x9 Sudoku solution using backtracking
function fillSudoku(board: number[][], row = 0, col = 0): boolean {
  if (row === 9) return true;
  if (col === 9) return fillSudoku(board, row + 1, 0);
  if (board[row][col] !== 0) return fillSudoku(board, row, col + 1);
  const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
  for (const num of nums) {
    if (isValidSudokuCell(board, row, col, num, 9, 3, 3)) {
      board[row][col] = num;
      if (fillSudoku(board, row, col + 1)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

// Remove cells to create a puzzle (difficulty: number of clues)
function removeCells(board: number[][], clues = 30): (number|null)[][] {
  const puzzle = board.map(row => row.slice());
  let cellsToRemove = 81 - clues;
  while (cellsToRemove > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== null) {
      puzzle[r][c] = null;
      cellsToRemove--;
    }
  }
  return puzzle;
}

// Generate a random puzzle and its solution
export function generateSudokuPuzzle(clues = 30): { puzzle: (number|null)[][], solution: number[][] } {
  const solution = Array(9).fill(0).map(() => Array(9).fill(0));
  fillSudoku(solution);
  const puzzle = removeCells(solution, clues);
  return { puzzle, solution };
} 