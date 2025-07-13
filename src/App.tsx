import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Publications from "./pages/Publications";
import Events from "./pages/Events";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PublicationCategory from './pages/publications/PublicationCategory';
import PDFViewer from './components/PDFViewer';
import TimelineYear from './pages/TimelineYear';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Games from './pages/Games';
import TicTacToeMenu from './pages/games/tictactoe/TicTacToeMenu';
import SimpleTicTacToe from './pages/games/tictactoe/SimpleTicTacToe';
import UltimateTicTacToe from './pages/games/tictactoe/UltimateTicTacToe';
import ThreePlayerTicTacToe from './pages/games/tictactoe/ThreePlayerTicTacToe';
import AITicTacToe from './pages/games/tictactoe/AITicTacToe';
import CustomRuleTicTacToe from './pages/games/tictactoe/CustomRuleTicTacToe';
import SudokuGame from './pages/games/sudoku/SudokuGame';
import Chess from './pages/games/MiniChess';
import Game2048 from './pages/games/Game2048';
import MemoryMatch from './pages/games/MemoryMatch';
import Snake from './pages/games/Snake';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/events" element={<Events />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/publications/:category" element={<PublicationCategory />} />
          <Route path="/view-pdf/:pdfUrl" element={<PDFViewer />} />
          <Route path="/timeline/:year" element={<TimelineYear />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/tictactoe" element={<TicTacToeMenu />} />
          <Route path="/games/tictactoe/simple" element={<SimpleTicTacToe />} />
          <Route path="/games/tictactoe/ultimate" element={<UltimateTicTacToe />} />
          <Route path="/games/tictactoe/three-player" element={<ThreePlayerTicTacToe />} />
          <Route path="/games/tictactoe/ai" element={<AITicTacToe />} />
          <Route path="/games/tictactoe/custom" element={<CustomRuleTicTacToe />} />
          <Route path="/games/sudoku" element={<SudokuGame />} />
          <Route path="/games/chess" element={<Chess />} />
          <Route path="/games/2048" element={<Game2048 />} />
          <Route path="/games/memory" element={<MemoryMatch />} />
          <Route path="/games/snake" element={<Snake />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
