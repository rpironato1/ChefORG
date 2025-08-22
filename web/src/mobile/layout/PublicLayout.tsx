import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MobileHeader } from '../navigation/MobileHeader';
import { MobileDrawer } from '../navigation/MobileDrawer';
import { MobileBottomNavigation } from '../navigation/MobileBottomNavigation';
import { PWAInstallBanner } from '../components/pwa/PWAInstallBanner';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Configure swipe navigation based on current route
  const getSwipeRoutes = () => {
    switch (location.pathname) {
      case '/':
        return { left: '/menu' };
      case '/menu':
        return { left: '/reserva', right: '/' };
      case '/reserva':
        return { right: '/menu' };
      default:
        return {};
    }
  };

  const swipeHandlers = useSwipeNavigation({
    routes: getSwipeRoutes(),
    enableSwipeNavigation: !mobileMenuOpen
  });

  // Pull to refresh handler
  const handleRefresh = async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would refresh page data
    window.location.reload();
  };

  const { touchHandlers, refreshState } = usePullToRefresh({
    onRefresh: handleRefresh,
    disabled: mobileMenuOpen
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} />
        <MobileDrawer 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
        
        {/* Pull to refresh indicator */}
        {refreshState.isActive && (
          <div 
            className="fixed top-16 left-0 right-0 flex justify-center z-30 transition-transform duration-200"
            style={{ transform: `translateY(${Math.min(refreshState.pullDistance - 60, 40)}px)` }}
          >
            <div className="bg-white rounded-full shadow-lg p-2">
              <div className={`w-6 h-6 border-2 border-primary-600 rounded-full ${
                refreshState.isRefreshing ? 'animate-spin border-t-transparent' : ''
              } ${refreshState.isTriggered ? 'border-t-transparent animate-pulse' : ''}`} />
            </div>
          </div>
        )}
        
        <main 
          className="pb-16" 
          {...swipeHandlers} 
          {...touchHandlers}
        >
          {children}
        </main>
        <MobileBottomNavigation />
        <PWAInstallBanner />
      </div>
      
      {/* Desktop Layout - Public Header */}
      <div className="hidden md:block">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">ChefORG</span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="#sobre" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Sobre
                </Link>
                <Link to="#cardapio" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Cardápio
                </Link>
                <Link to="#contato" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Contato
                </Link>
                <button
                  onClick={() => navigate('/reserva')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Reservar Mesa
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">ChefORG</span>
                </div>
                <p className="text-gray-400">
                  Experiência gastronômica única com sabores excepcionais e ambiente sofisticado.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
                <ul className="space-y-2">
                  <li><Link to="#sobre" className="text-gray-400 hover:text-white transition-colors">Sobre</Link></li>
                  <li><Link to="/menu" className="text-gray-400 hover:text-white transition-colors">Cardápio</Link></li>
                  <li><Link to="/reserva" className="text-gray-400 hover:text-white transition-colors">Reservas</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>(11) 3333-4444</li>
                  <li>contato@cheforg.com</li>
                  <li>Rua das Flores, 123</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© 2024 ChefORG. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};