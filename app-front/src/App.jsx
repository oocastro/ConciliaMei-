
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

import DashboardPage from "./pages/dashboard/DashboardPage";
import Conciliacao from "./pages/fiscal/Conciliacao";
import Pagamentos from "./pages/fiscal/Pagamentos";
import Extratos from "./pages/fiscal/Extratos";

import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import ForgotPasswordPage from "./pages/auth/Password-Recovery/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/Password-Recovery/ResetPasswordPage";
import SettingsPage from "./pages/settings/SettingsPage";

function RequireAuth() {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página inicial pública */}
        <Route path="/" element={<HeroSection />} />

        {/* Autenticação */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signin" element={<LoginPage />} />
        <Route path="/auth/sign-up" element={<RegisterPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Recuperação de senha */}
        <Route
          path="/auth/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/auth/reset-password"
          element={<ResetPasswordPage />}
        />

        {/* Área autenticada */}
        <Route element={<RequireAuth />}>
          <Route element={<Navbar />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/conciliacao" element={<Conciliacao />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/extratos" element={<Extratos />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Caminho antigo de notas fiscais */}
        <Route
          path="/notas"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
