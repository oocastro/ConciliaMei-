import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';

import DashboardPage from './pages/dashboard/DashboardPage';
import NotasFiscais from './pages/fiscal/NotasFiscais';
import Conciliacao from './pages/fiscal/Conciliacao';
import Pagamentos from './pages/fiscal/Pagamentos';

import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import RegisterCompany from './pages/auth/register/RegisterCompany';
import CompanyConfirmation from './pages/auth/register/CompanyConfirmation';

import ForgotPasswordPage from './pages/auth/Password-Recovery/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/Password-Recovery/ResetPasswordPage';

import SettingsPage from './pages/settings/SettingsPage';

function App() {
  // TODO: trocar pelo usuário do login (JWT), no formato { name, cnpj }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSection />} />

        <Route path="/auth/sign-up" element={<LoginPage />} />
        <Route path="/auth/signin" element={<RegisterPage />} />
        <Route path="/auth/register-company" element={<RegisterCompany />} />
        <Route path="/auth/register-company/confirm" element={<CompanyConfirmation />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<Navbar />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notas" element={<NotasFiscais />} />
          <Route path="/conciliacao" element={<Conciliacao />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;