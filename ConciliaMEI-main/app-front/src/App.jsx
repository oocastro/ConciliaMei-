import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotasFiscais from './pages/fiscal/NotasFiscais';
import Conciliacao from './pages/fiscal/Conciliacao';
import Pagamentos from './pages/fiscal/Pagamentos';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RegisterCompany from './pages/auth/RegisterCompany';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import HeroSection from './pages/hero/HeroSection';

function App() {
  // TODO: trocar pelo usuário do login (JWT), no formato { name, cnpj }
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Sem Navbar) */}
      <Route path="/" element={<HeroSection />} />
        <Route path="/auth/sign-up" element={<LoginPage />} />
        <Route path="/auth/signin" element={<RegisterPage />} />
        <Route path="/auth/register-company" element={<RegisterCompany />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rotas Privadas (Com Navbar) */}
        <Route element={< Navbar/>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notas" element={<NotasFiscais />} />
          <Route path="/conciliacao" element={<Conciliacao />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;