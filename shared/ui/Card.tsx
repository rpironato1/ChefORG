// Generic Card component for cross-platform use (Sprint 4)
import React from 'react';
import type { PlatformCardProps } from '../types';

// Web implementation
export const WebCard: React.FC<PlatformCardProps & { className?: string }> = ({
  children,
  title,
  subtitle,
  onPress,
  style,
  className = '',
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden';
  const interactiveClasses = onPress
    ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200'
    : '';

  const handleClick = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={handleClick}
      style={style}
    >
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

// Platform adapter hook
export const useCard = () => {
  const isWeb = typeof window !== 'undefined';

  if (isWeb) {
    return WebCard;
  }

  // For React Native, we'll return a different component
  // This will be implemented when we set up React Native
  return WebCard; // Fallback to web for now
};

// Generic Card component that adapts to platform
export const Card: React.FC<PlatformCardProps> = props => {
  const CardComponent = useCard();
  return <CardComponent {...props} />;
};
