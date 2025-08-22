import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Menu,
  ShoppingCart,
  Calendar,
  BarChart3,
  Settings,
  Utensils,
  ChefHat
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/mesas', icon: Utensils, label: 'Mesas' },
  { path: '/cardapio', icon: Menu, label: 'Cardápio' },
  { path: '/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { path: '/funcionarios', icon: Users, label: 'Funcionários' },
  { path: '/reservas', icon: Calendar, label: 'Reservas' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { path: '/configuracoes', icon: Settings, label: 'Configurações' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <ChefHat className="h-8 w-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-800">ChefORG</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export { Sidebar };
export default Sidebar; 