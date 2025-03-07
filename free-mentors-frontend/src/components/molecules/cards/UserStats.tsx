import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Person as PersonIcon, 
  SupervisorAccount as AdminIcon, 
  School as MentorIcon 
} from '@mui/icons-material';

interface UserCounts {
  total: number;
  admin: number;
  mentor: number;
  mentee: number;
}

interface UserStatsProps {
  userCounts: UserCounts;
}

// Styled components
const StatsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginTop: '16px',
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '6px',
  flexGrow: 1,
  minWidth: '160px',
  maxWidth: '200px',
});

const StatIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  width: '32px',
  height: '32px',
});

const UserStats: React.FC<UserStatsProps> = ({ userCounts }) => {
  // Get stat item style based on role
  const getStatItemStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: <AdminIcon fontSize="small" />,
          bgColor: 'rgba(147, 51, 234, 0.1)',
          iconColor: '#9333ea',
          label: 'Admins'
        };
      case 'mentor':
        return {
          icon: <MentorIcon fontSize="small" />,
          bgColor: 'rgba(22, 163, 74, 0.1)',
          iconColor: '#16a34a',
          label: 'Mentors'
        };
      case 'mentee':
        return {
          icon: <PersonIcon fontSize="small" />,
          bgColor: 'rgba(37, 99, 235, 0.1)',
          iconColor: '#2563eb', 
          label: 'Mentees'
        };
      default:
        return {
          icon: <PersonIcon fontSize="small" />,
          bgColor: 'rgba(107, 114, 128, 0.1)',
          iconColor: '#6b7280',
          label: 'Total'
        };
    }
  };

  return (
    <StatsContainer>
      <StatItem sx={{ border: '1px solid rgba(107, 114, 128, 0.2)', bgcolor: 'rgba(107, 114, 128, 0.05)' }}>
        <StatIconWrapper sx={{ bgcolor: getStatItemStyle('total').bgColor }}>
          {getStatItemStyle('total').icon}
        </StatIconWrapper>
        <Box>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {getStatItemStyle('total').label}
          </Typography>
          <Typography variant="h6" fontSize={16} fontWeight={500}>
            {userCounts.total} users
          </Typography>
        </Box>
      </StatItem>
      
      <StatItem sx={{ border: '1px solid rgba(147, 51, 234, 0.2)', bgcolor: 'rgba(147, 51, 234, 0.05)' }}>
        <StatIconWrapper sx={{ bgcolor: getStatItemStyle('admin').bgColor }}>
          {getStatItemStyle('admin').icon}
        </StatIconWrapper>
        <Box>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {getStatItemStyle('admin').label}
          </Typography>
          <Typography variant="h6" fontSize={16} fontWeight={500}>
            {userCounts.admin}
          </Typography>
        </Box>
      </StatItem>
      
      <StatItem sx={{ border: '1px solid rgba(22, 163, 74, 0.2)', bgcolor: 'rgba(22, 163, 74, 0.05)' }}>
        <StatIconWrapper sx={{ bgcolor: getStatItemStyle('mentor').bgColor }}>
          {getStatItemStyle('mentor').icon}
        </StatIconWrapper>
        <Box>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {getStatItemStyle('mentor').label}
          </Typography>
          <Typography variant="h6" fontSize={16} fontWeight={500}>
            {userCounts.mentor}
          </Typography>
        </Box>
      </StatItem>
      
      <StatItem sx={{ border: '1px solid rgba(37, 99, 235, 0.2)', bgcolor: 'rgba(37, 99, 235, 0.05)' }}>
        <StatIconWrapper sx={{ bgcolor: getStatItemStyle('mentee').bgColor }}>
          {getStatItemStyle('mentee').icon}
        </StatIconWrapper>
        <Box>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            {getStatItemStyle('mentee').label}
          </Typography>
          <Typography variant="h6" fontSize={16} fontWeight={500}>
            {userCounts.mentee}
          </Typography>
        </Box>
      </StatItem>
    </StatsContainer>
  );
};

export default UserStats;