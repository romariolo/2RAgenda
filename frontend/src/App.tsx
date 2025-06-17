import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando todos os componentes de página
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a Página Inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Rotas para o fluxo de autenticação */}
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rota para o painel do profissional (área logada) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Rota dinâmica para a página pública de agendamento */}
        <Route path="/agendar/:slug" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;