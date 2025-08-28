import React from 'react';
import { Home, ChefHat, Calendar, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const MobileBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: ChefHat, label: 'Cardápio', path: '/menu' },
    { icon: Calendar, label: 'Reservas', path: '/reserva' },
    { icon: User, label: 'Conta', path: '/login' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <IconComponent
                className={`w-6 h-6 mb-1 ${isActive ? 'text-primary-600' : 'text-gray-600'}`}
              />
              <span
                className={`text-xs font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
