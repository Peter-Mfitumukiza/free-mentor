import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Chip,
  CircularProgress 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BusinessCenter, Message } from '@mui/icons-material';

interface MentorCardProps {
  mentor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    expertise?: string;
  };
  handleRequestSession: (email: string) => Promise<void>;
  isRequesting: boolean;
}

const StyledCard = styled(Card)({
  borderRadius: '10px',
  boxShadow: 'none',
  border: '1px solid #e5e7eb',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: '#bfdbfe',
  }
});

const MentorAvatar = styled(Avatar)({
  width: 48,
  height: 48,
  backgroundColor: 'rgba(26, 95, 255, 0.1)',
  color: '#1A5FFF',
  fontSize: '1.2rem',
  fontWeight: 600,
  marginBottom: '12px',
});

const ExpertiseChip = styled(Chip)({
  borderRadius: '16px',
  fontSize: '0.7rem',
  height: '22px',
  backgroundColor: 'rgba(26, 95, 255, 0.08)',
  color: '#1A5FFF',
  marginBottom: '16px',
  fontWeight: 500,
});

const SessionButton = styled(Button)({
  marginTop: 'auto',
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  height: '40px',
  background: 'linear-gradient(135deg, #1A5FFF 0%, #1A3D94 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1A5FFF 20%, #1A3D94 100%)',
  },
  '&.Mui-disabled': {
    background: '#E0E0E0',
    color: '#FFFFFF',
  }
});

const BioText = styled(Typography)({
  color: '#555',
  marginBottom: '24px',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.5',
});

const MentorCard: React.FC<MentorCardProps> = ({ mentor, handleRequestSession, isRequesting }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <StyledCard>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <MentorAvatar>
            {getInitials(mentor.firstName, mentor.lastName)}
          </MentorAvatar>
          <ExpertiseChip 
            icon={<BusinessCenter style={{ fontSize: 12 }} />}
            label={mentor.expertise || "General Mentoring"} 
          />
        </Box>
        
        <Typography variant="subtitle1" fontWeight={600} fontSize={15} gutterBottom>
          {mentor.firstName} {mentor.lastName}
        </Typography>
        
        <BioText variant="body2" fontSize={13}>
          {mentor.bio || "This mentor hasn't added a bio yet. They're still available for mentoring sessions on their area of expertise."}
        </BioText>
        
        <SessionButton 
          variant="contained" 
          startIcon={isRequesting ? <CircularProgress size={14} color="inherit" /> : <Message sx={{ fontSize: 16 }} />}
          disabled={isRequesting}
          onClick={() => handleRequestSession(mentor.email)}
          disableElevation
          size="small"
          sx={{ fontSize: 13 }}
        >
          {isRequesting ? 'Requesting...' : 'Request Session'}
        </SessionButton>
      </CardContent>
    </StyledCard>
  );
};

export default MentorCard;