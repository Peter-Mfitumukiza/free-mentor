import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Material UI Button with exact original colors
const StyledButton = styled(MuiButton)(() => ({
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  borderRadius: '6px', // Default rounded
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#1A5FFF',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1A3D94',
    },
    '&:focus': {
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)', // Focus ring equivalent
    },
  },
  '&.MuiButton-outlinedPrimary': {
    borderWidth: '2px',
    borderColor: '#1A5FFF',
    color: '#1A5FFF',
    '&:hover': {
      backgroundColor: 'rgba(26, 95, 255, 0.04)',
      borderColor: '#1A5FFF',
    },
    '&:focus': {
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)', // Focus ring equivalent
    },
  },
  '&.MuiButton-login': {
    backgroundColor: '#004aad',
    color: 'white',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#003c8a',
    },
  },
  '&.MuiButton-openAccount': {
    backgroundColor: '#0063cc',
    color: 'white',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#004fa3',
    },
  },
  '&.MuiButton-sizeLarge': {
    padding: '14px 20px', // py-4 px-5
    fontSize: '14px', // text-base
  },
  '&.MuiButton-sizeMedium': {
    padding: '12px 20px', // py-3 px-5
    fontSize: '14px', // text-base
  },
  '&.MuiButton-sizeSmall': {
    padding: '8px 16px', // py-2 px-4
    fontSize: '12px', // text-sm
  },
}));

interface PrimaryButtonProps {
  variant?: 'contained' | 'outlined' | 'login' | 'openAccount';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  // Map our custom variants to Material UI variants
  const getMuiVariant = () => {
    if (variant === 'outlined') return 'outlined';
    return 'contained'; // Default to contained for all other variants
  };

  // Add custom class for our special variants
  const getCustomClass = () => {
    if (variant === 'login') return 'MuiButton-login';
    if (variant === 'openAccount') return 'MuiButton-openAccount';
    return '';
  };

  return (
    <StyledButton
      variant={getMuiVariant()}
      size={size}
      fullWidth={fullWidth}
      color="primary"
      className={`${getCustomClass()} ${className}`}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export { PrimaryButton };
export default PrimaryButton;