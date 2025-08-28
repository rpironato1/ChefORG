import React, { useState } from 'react';
import { MobileHeader } from '../navigation/MobileHeader';
import { MobileDrawer } from '../navigation/MobileDrawer';
import { MobileBottomNavigation } from '../navigation/MobileBottomNavigation';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} />
        <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="pb-16">{children}</main>
        <MobileBottomNavigation />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Sidebar />
        <div className="md:ml-64">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
