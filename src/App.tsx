import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { PublicLayout } from './mobile/layout/PublicLayout';
import { ResponsiveLayout } from './mobile/layout/ResponsiveLayout';

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// Load modular home page
const ModularHomePage = React.lazy(() => import('./modules/home').then(module => ({ default: module.ModularHomePage })));
// Keep original home as fallback
const MenuPublico = React.lazy(() => import('./pages/public/MenuPublico'));
const ReservaOnline = React.lazy(() => import('./pages/public/ReservaOnline'));

// Client pages
const CheckinQR = React.lazy(() => import('./pages/cliente/CheckinQR'));
const PinMesa = React.lazy(() => import('./pages/cliente/PinMesa'));
const CardapioMesa = React.lazy(() => import('./pages/cliente/CardapioMesa'));
const ChegadaSemReserva = React.lazy(() => import('./pages/cliente/ChegadaSemReserva'));
const AcompanharPedido = React.lazy(() => import('./pages/cliente/AcompanharPedido'));
const Pagamento = React.lazy(() => import('./pages/cliente/Pagamento'));
const Feedback = React.lazy(() => import('./pages/cliente/Feedback'));

// Auth pages
const Login = React.lazy(() => import('./pages/auth/Login'));

// Sprint 3 Demo
const Sprint3Demo = React.lazy(() => import('./components/Sprint3Demo'));

// Layout Administrativo
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin pages - lazy loaded
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const PainelCozinha = React.lazy(() => import('./pages/staff/PainelCozinha'));
const PainelGarcom = React.lazy(() => import('./pages/staff/PainelGarcom'));

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Páginas Públicas com PublicLayout */}
          <Route path="/" element={
            <PublicLayout>
              <ModularHomePage />
            </PublicLayout>
          } />
          <Route path="/menu" element={
            <PublicLayout>
              <MenuPublico />
            </PublicLayout>
          } />
          <Route path="/reserva" element={
            <PublicLayout>
              <ReservaOnline />
            </PublicLayout>
          } />
          
          {/* Páginas de Cliente - Rotas Dinâmicas */}
          <Route path="/checkin" element={<CheckinQR />} />
          <Route path="/chegada-sem-reserva" element={<ChegadaSemReserva />} />
          <Route path="/mesa/:numeroMesa/pin" element={<PinMesa />} />
          <Route path="/mesa/:numeroMesa/cardapio" element={<CardapioMesa />} />
          <Route path="/mesa/:numeroMesa/acompanhar" element={<AcompanharPedido />} />
          <Route path="/mesa/:numeroMesa/pagamento" element={<Pagamento />} />
          <Route path="/mesa/:numeroMesa/feedback" element={<Feedback />} />

          {/* Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Sprint 3 Demo */}
          <Route path="/sprint3-demo" element={
            <PublicLayout>
              <Sprint3Demo />
            </PublicLayout>
          } />

          {/* Área Administrativa com ResponsiveLayout */}
          <Route path="/admin/*" element={
            <ResponsiveLayout>
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
            </ResponsiveLayout>
          } />

          {/* Rota de fallback */}
          <Route path="*" element={
            <PublicLayout>
              <ModularHomePage />
            </PublicLayout>
          } />
        </Routes>
      </Suspense>
    </AppProvider>
  );
}

export default App; 