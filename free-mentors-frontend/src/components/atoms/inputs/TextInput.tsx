import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled TextField with no bottom margin
const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    height: '60px',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
    },
    '&:hover fieldset': {
      borderColor: '#d0d0d0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00408a',
      borderWidth: '1px',
      fontSize: '14px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#00408a',
    },
  },
  '& .MuiInputBase-input': {
    paddingTop: '15px',
    paddingBottom: '15px',
    fontSize: '14px',
  },
  // Removing default bottom margin
  marginBottom: '0',
}));

interface PrimaryInputProps {
  label: string;
  type?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  fullWidth?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const PrimaryInput: React.FC<PrimaryInputProps> = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  required = false,
  fullWidth = false,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledTextField
      id={inputId}
      name={name}
      label={label}
      type={type === 'password' && showPassword ? 'text' : type}
      value={value}
      onChange={onChange}
      required={required}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error}
      disabled={disabled}
      className={className}
      variant="outlined"
      InputProps={{
        endAdornment: type === 'password' ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      {...props}
    />
  );
};