import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';

// Páginas Públicas
import Home from './pages/public/Home';
import MenuPublico from './pages/public/MenuPublico';
import ReservaOnline from './pages/public/ReservaOnline';

// Páginas de Cliente
import CheckinQR from './pages/cliente/CheckinQR';
import PinMesa from './pages/cliente/PinMesa';
import CardapioMesa from './pages/cliente/CardapioMesa';
import ChegadaSemReserva from './pages/cliente/ChegadaSemReserva';
import AcompanharPedido from './pages/cliente/AcompanharPedido';
import Pagamento from './pages/cliente/Pagamento';
import Feedback from './pages/cliente/Feedback';

// Páginas de Autenticação
import Login from './pages/auth/Login';

// Layout Administrativo
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas Administrativas
import Dashboard from './pages/admin/Dashboard';
import PainelCozinha from './pages/staff/PainelCozinha';
import PainelGarcom from './pages/staff/PainelGarcom';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Páginas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPublico />} />
        <Route path="/reserva" element={<ReservaOnline />} />
        
        {/* Páginas de Cliente - Rotas Dinâmicas */}
        <Route path="/checkin" element={<CheckinQR />} />
        <Route path="/chegada-sem-reserva" element={<ChegadaSemReserva />} />
        <Route path="/mesa/:numeroMesa/pin" element={<PinMesa />} />
        <Route path="/mesa/:numeroMesa/cardapio" element={<CardapioMesa />} />
        <Route path="/mesa/:numeroMesa/acompanhar" element={<AcompanharPedido />} />
        <Route path="/mesa/:numeroMesa/pagamento" element={<Pagamento />} />
        <Route path="/mesa/:numeroMesa/feedback" element={<Feedback />} />

        {/* Autenticação */}
        <Route path="/admin/login" element={<Login />} />

        {/* Área Administrativa - Protegida */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Rotas específicas por papel */}
                <Route path="/recepcao" element={
                  <ProtectedRoute requiredRole="recepcao">
                    <div>Painel Recepção - Em breve</div>
                  </ProtectedRoute>
                } />
                
                <Route path="/garcom" element={
                  <ProtectedRoute requiredRole="garcom">
                    <PainelGarcom />
                  </ProtectedRoute>
                } />
                
                <Route path="/cozinha" element={
                  <ProtectedRoute requiredRole="cozinheiro">
                    <PainelCozinha />
                  </ProtectedRoute>
                } />
                
                <Route path="/caixa" element={
                  <ProtectedRoute requiredRole="caixa">
                    <div>Painel Caixa - Em breve</div>
                  </ProtectedRoute>
                } />
                
                <Route path="/gerencia" element={
                  <ProtectedRoute requiredRole="gerente">
                    <div>Painel Gerência - Em breve</div>
                  </ProtectedRoute>
                } />

                {/* Página de Acesso Negado */}
                <Route path="/acesso-negado" element={
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h2>
                    <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
                  </div>
                } />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />

        {/* Rota de fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AppProvider>
  );
}

export default App; 