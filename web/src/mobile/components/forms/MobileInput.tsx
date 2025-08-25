import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface MobileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({
    label,
    error,
    helperText,
    variant = 'default',
    size = 'md',
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    className = '',
    type = 'text',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const actualType = type === 'password' && showPassword ? 'text' : type;

    const sizeClasses = {
      sm: 'h-10 text-sm px-3',
      md: 'h-12 text-base px-4',
      lg: 'h-14 text-lg px-4'
    };

    const variantClasses = {
      default: 'border border-gray-500 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
      filled: 'border-0 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-100',
      outlined: 'border-2 border-gray-500 rounded-lg bg-transparent focus:border-primary-500'
    };

    const inputClasses = `
      w-full
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
      transition-all duration-200
      placeholder:text-gray-400
      disabled:bg-gray-100 disabled:text-gray-500
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Mobile keyboard optimizations
    const mobileProps = {
      autoCapitalize: type === 'email' ? 'none' : 'sentences',
      autoCorrect: type === 'email' || type === 'password' ? 'off' : 'on',
      spellCheck: type === 'email' || type === 'password' ? false : true,
      inputMode: type === 'tel' ? 'tel' as const : 
                type === 'email' ? 'email' as const :
                type === 'number' ? 'numeric' as const : 'text' as const,
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={actualType}
            className={inputClasses}
            {...mobileProps}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';