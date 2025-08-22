import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

export const SwipeGestureDemo: React.FC = () => {
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0 });
  const [lastSwipe, setLastSwipe] = useState<'left' | 'right' | null>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeCount(prev => ({ ...prev, left: prev.left + 1 }));
      setLastSwipe('left');
      setTimeout(() => setLastSwipe(null), 1000);
    },
    onSwipedRight: () => {
      setSwipeCount(prev => ({ ...prev, right: prev.right + 1 }));
      setLastSwipe('right');
      setTimeout(() => setLastSwipe(null), 1000);
    },
    trackMouse: true, // Allow mouse for desktop testing
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: true,
  });

  const reset = () => {
    setSwipeCount({ left: 0, right: 0 });
    setLastSwipe(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg m-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Teste de Gestos Touch
      </h3>
      
      <div 
        {...swipeHandlers}
        className={`
          min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg
          flex flex-col items-center justify-center
          transition-all duration-300 p-6
          ${lastSwipe === 'left' ? 'bg-red-50 border-red-300' : ''}
          ${lastSwipe === 'right' ? 'bg-green-50 border-green-300' : ''}
          ${!lastSwipe ? 'bg-gray-50' : ''}
        `}
      >
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            👆 Deslize ou arraste nesta área
          </p>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <ArrowLeft className={`w-5 h-5 ${lastSwipe === 'right' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Direita: {swipeCount.right}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <ArrowRight className={`w-5 h-5 ${lastSwipe === 'left' ? 'text-red-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Esquerda: {swipeCount.left}</span>
            </div>
          </div>
          
          {lastSwipe && (
            <div className={`text-sm font-medium ${
              lastSwipe === 'left' ? 'text-red-600' : 'text-green-600'
            }`}>
              Swipe para {lastSwipe === 'left' ? 'esquerda' : 'direita'} detectado!
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={reset}
          className="flex items-center space-x-2 mx-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>💡 Em dispositivos móveis: Use os dedos para deslizar</p>
        <p>🖱️ No desktop: Clique e arraste com o mouse</p>
      </div>
    </div>
  );
};