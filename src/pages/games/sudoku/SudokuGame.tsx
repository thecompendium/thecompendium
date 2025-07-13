import React from 'react';
import StandardSudoku from './StandardSudoku';

export default function SudokuGame() {
  return <StandardSudoku onBack={() => window.history.back()} />;
} 