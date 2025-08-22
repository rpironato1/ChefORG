import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-primary-600 text-white rounded-lg shadow-lg p-4 z-40 md:hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              Instalar ChefORG
            </p>
            <p className="text-xs text-primary-100 mt-1">
              Acesse rapidamente direto da sua tela inicial
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleInstall}
            className="flex items-center space-x-1 bg-white text-primary-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-primary-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Instalar</span>
          </button>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="text-primary-100 hover:text-white p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};