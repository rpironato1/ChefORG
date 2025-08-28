// Generic Button component for cross-platform use (Sprint 4)
import React from 'react';
import type { PlatformButtonProps } from '../types';

// Web implementation
export const WebButton: React.FC<PlatformButtonProps & { className?: string }> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) => {
  const baseClasses =
    'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const handleClick = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      <div className="flex items-center justify-center">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {title}
      </div>
    </button>
  );
};

// Platform adapter hook
export const useButton = () => {
  const isWeb = typeof window !== 'undefined';

  if (isWeb) {
    return WebButton;
  }

  // For React Native, we'll return a different component
  // This will be implemented when we set up React Native
  return WebButton; // Fallback to web for now
};

// Generic Button component that adapts to platform
export const Button: React.FC<PlatformButtonProps> = props => {
  const ButtonComponent = useButton();
  return <ButtonComponent {...props} />;
};
