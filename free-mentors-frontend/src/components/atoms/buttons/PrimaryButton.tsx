import React, { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded font-medium transition-colors focus:outline-none';
  
  const variantStyles = {
    contained: 'bg-[#1A5FFF] text-white hover:bg-[#1A3D94] focus:ring-2 focus:ring-blue-300',
    outlined: 'border-2 border-[#1A5FFF] text-[#1A5FFF] bg-transparent hover:bg-blue-50 focus:ring-2 focus:ring-blue-200',
  };
  
  const sizeStyles = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;
  
  return (
    <button
      className={buttonStyles}
      {...props}
    >
      {children}
    </button>
  );
};