// Generic Input component for cross-platform use (Sprint 4)
import React from 'react';
import type { PlatformInputProps } from '../types';

// Web implementation
export const WebInput: React.FC<PlatformInputProps & { className?: string }> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  className = '',
}) => {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

  const getInputType = () => {
    if (secureTextEntry) return 'password';
    switch (keyboardType) {
      case 'email-address':
        return 'email';
      case 'numeric':
        return 'number';
      case 'phone-pad':
        return 'tel';
      default:
        return 'text';
    }
  };

  const getAutoCapitalize = () => {
    switch (autoCapitalize) {
      case 'none':
        return 'off';
      case 'sentences':
        return 'sentences';
      case 'words':
        return 'words';
      case 'characters':
        return 'characters';
      default:
        return 'off';
    }
  };

  return (
    <div className="w-full">
      <input
        type={getInputType()}
        value={value}
        onChange={e => onChangeText(e.target.value)}
        placeholder={placeholder}
        autoCapitalize={getAutoCapitalize()}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Platform adapter hook
export const useInput = () => {
  const isWeb = typeof window !== 'undefined';

  if (isWeb) {
    return WebInput;
  }

  // For React Native, we'll return a different component
  // This will be implemented when we set up React Native
  return WebInput; // Fallback to web for now
};

// Generic Input component that adapts to platform
export const Input: React.FC<PlatformInputProps> = props => {
  const InputComponent = useInput();
  return <InputComponent {...props} />;
};
