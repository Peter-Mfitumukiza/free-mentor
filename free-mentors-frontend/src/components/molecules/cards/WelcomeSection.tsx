import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserRole } from '../../../contexts/AuthContext';
import { School, Refresh } from '@mui/icons-material';

interface WelcomeSectionProps {
  userName: string;
  userRole?: string;
  refreshData: () => void;
  isLoading: boolean;
}

const WelcomeContainer = styled(Paper)({
  borderRadius: '10px',
  boxShadow: 'none',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  marginBottom: '16px',
  background: 'linear-gradient(135deg, rgba(26, 95, 255, 0.02) 0%, rgba(26, 61, 148, 0.03) 100%)',
});

const WelcomeContent = styled(Box)({
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '16px',
});

const WelcomeIcon = styled(Box)({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #1A5FFF 0%, #1A3D94 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  flexShrink: 0,
});

const RefreshButton = styled(Button)({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '13px',
  padding: '6px 12px',
  height: '32px',
  color: '#555',
  borderColor: '#e0e0e0',
  backgroundColor: 'white',
  '&:hover': {
    borderColor: '#d0d0d0',
    backgroundColor: 'white',
  },
});

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  userName, 
  userRole, 
  refreshData,
  isLoading
}) => {
  // Determine the welcome message based on user role
  const getWelcomeMessage = () => {
    if (userRole === UserRole.MENTOR) {
      return "You're signed in as a mentor. You can help users with their career questions and guide them through their professional journey.";
    } else if (userRole === UserRole.ADMIN) {
      return "You have administrative access to the platform. You can manage users, monitor activity, and ensure the platform runs smoothly.";
    } else {
      return "Find a mentor to help guide your career journey. Our experienced mentors can provide valuable insights and advice tailored to your needs.";
    }
  };

  return (
    <WelcomeContainer>
      <WelcomeContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WelcomeIcon>
            <School sx={{ color: 'white', fontSize: 24 }} />
          </WelcomeIcon>
          <Box>
            <Typography variant="h6" fontWeight={600} fontSize={16} gutterBottom>
              Welcome, {userName || 'User'}!
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize={13}>
              {getWelcomeMessage()}
            </Typography>
          </Box>
        </Box>
        
        <RefreshButton
          variant="outlined"
          startIcon={<Refresh sx={{ fontSize: 16 }} />}
          onClick={refreshData}
          disabled={isLoading}
          size="small"
        >
          Refresh
        </RefreshButton>
      </WelcomeContent>
    </WelcomeContainer>
  );
};

export default WelcomeSection;