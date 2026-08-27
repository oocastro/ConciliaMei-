import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import Dashboard from './pages/Dashboard';
import NotasFiscais from './pages/NotasFiscais';
import Concialiacao from './pages/conciliacao';
import Comprovantes from './pages/Comprovantes';
import Configuracao from './pages/Configuracao';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notas" element={<NotasFiscais />} />
            <Route path="/conciliacao" element={<Concialiacao />} />
            <Route path="/comprovantes" element={<Comprovantes />} />
            <Route path="/configuracoes" element={<Configuracao />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;