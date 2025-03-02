import React from 'react'
import Typography from '@mui/material/Typography'

interface TitleProps {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
}

export const Title: React.FC<TitleProps> = ({
  children,
  variant = 'h5',
  className = ''
}) => {
  return (
    <div>
      <Typography 
        component={variant} 
        variant={variant} 
        className={`text-primary ${className}`}
      >
        {children}
      </Typography>
    </div>
  )
}