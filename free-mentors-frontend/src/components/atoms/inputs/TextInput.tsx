import React, { InputHTMLAttributes } from 'react';

interface PrimaryInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fullWidth?: boolean;
  error?: string;
}

export const PrimaryInput: React.FC<PrimaryInputProps> = ({
  label,
  fullWidth = false,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  const baseInputStyles = 'border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300';
  const errorInputStyles = error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`mb-4 ${widthStyles}`}>
      <label 
        htmlFor={inputId} 
        className="block text-text-primary text-xs font-medium mb-1"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`${baseInputStyles} ${errorInputStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};