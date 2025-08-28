import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface MobileTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const MobileTextArea = forwardRef<HTMLTextAreaElement, MobileTextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      resize = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default:
        'border border-gray-500 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
      filled: 'border-0 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-100',
      outlined: 'border-2 border-gray-500 rounded-lg bg-transparent focus:border-primary-500',
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const textareaClasses = `
      w-full
      min-h-[100px]
      px-4 py-3
      text-base
      ${variantClasses[variant]}
      ${resizeClasses[resize]}
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
      transition-all duration-200
      placeholder:text-gray-400
      disabled:bg-gray-100 disabled:text-gray-500
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    // Mobile optimizations
    const mobileProps = {
      autoCapitalize: 'sentences',
      autoCorrect: 'on',
      spellCheck: true,
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea ref={ref} className={textareaClasses} {...mobileProps} {...props} />

        {(error || helperText) && (
          <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

MobileTextArea.displayName = 'MobileTextArea';
