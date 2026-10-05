import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './components/sidebar';
import Dashboard from './pages/Dashboard';
import NotasFiscais from './pages/NotasFiscais';
import Conciliacao from './pages/Conciliacao';
import Comprovantes from './pages/Comprovantes';
import Configuracao from './pages/Configuracao';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function AppLayout({ user }) {
  return (
    <div className="flex min-h-screen gap-3 bg-muted p-3 sm:gap-4 sm:p-4">
      <Sidebar user={user} />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}


function App() {
  // TODO: trocar pelo usuário do login (JWT), no formato { name, cnpj }
  const user = null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/nova-senha" element={<ResetPasswordPage />} />
        <Route path="/esqueceu-sua-senha" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout user={user} />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/notas" element={<NotasFiscais />} />
          <Route path="/conciliacao" element={<Conciliacao />} />
          <Route path="/comprovantes" element={<Comprovantes />} />
          <Route path="/configuracoes" element={<Configuracao />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;