import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Container)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  textAlign: 'center',
});

const StatusCode = styled(Typography)({
  fontSize: '6rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #1A5FFF 0%, #1A3D94 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: '16px',
});

const HomeButton = styled(Button)({
  marginTop: '24px',
  background: 'linear-gradient(135deg, #1A5FFF 0%, #1A3D94 100%)',
  color: 'white',
  textTransform: 'none',
  padding: '8px 24px',
  borderRadius: '6px',
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(135deg, #1A5FFF 30%, #1A3D94 100%)',
    boxShadow: '0 4px 8px rgba(26, 95, 255, 0.25)',
  },
});

const NotFoundPage: React.FC = () => {
  return (
    <PageContainer maxWidth="sm">
      <StatusCode variant="h1">
        404
      </StatusCode>
      
      <Typography variant="h4" fontWeight={600} color="text.primary" gutterBottom>
        Page Not Found
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      
      <HomeButton component={Link} to="/" variant="contained" disableElevation>
        Go to Home
      </HomeButton>
    </PageContainer>
  );
};

export default NotFoundPage;