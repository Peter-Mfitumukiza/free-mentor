import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Button, 
  FormControl, 
  CircularProgress, 
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FilterList } from '@mui/icons-material';
import { UserRole } from '../../../contexts/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  expertise?: string;
  occupation?: string;
}

interface UserTableProps {
  users: User[];
  handleRoleChange: (email: string, newRole: string) => Promise<void>;
  actionInProgress: string | null;
  isRoleMenuOpen: { [key: string]: boolean };
  handleRoleButtonClick: (email: string) => void;
}

// Styled components
const TableContainer = styled(Box)({
  '& .table-row': {
    display: 'grid',
    gridTemplateColumns: '2.5fr 2.5fr 1fr 1fr',
    padding: '14px 24px',
    borderBottom: '1px solid #e5e7eb',
    '&:hover': {
      backgroundColor: '#f9fafb',
    },
  },
  '& .table-header': {
    backgroundColor: '#f9fafb',
    fontWeight: 600,
    color: '#555',
    fontSize: '13px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    borderBottom: '2px solid #e0e0e0',
  },
  minHeight: '600px', // Minimum height to maintain consistent UI
});

const UserCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const UserInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const UserAvatar = styled(Avatar)({
  width: 32,
  height: 32,
  fontSize: '13px',
  fontWeight: 600,
  boxShadow: 'none',
});

const RoleCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const RoleChip = styled(Chip)({
  borderRadius: '4px',
  fontWeight: 500,
  height: '24px',
  width: '80px',
  textAlign: 'center',
  fontSize: '13px',
  boxShadow: 'none',
});

const ActionsCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const ChangeRoleButton = styled(Button)({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  fontSize: '13px',
  padding: '6px 12px',
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  color: '#555',
  minWidth: '120px',
  '&:hover': {
    backgroundColor: '#f9fafb',
    borderColor: '#d0d0d0',
  },
});

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  handleRoleChange, 
  actionInProgress, 
  isRoleMenuOpen, 
  handleRoleButtonClick 
}) => {
  // Generate avatar color based on email
  const getAvatarColor = (email: string) => {
    const colors = [
      '#1A5FFF', // primary blue
      '#1A3D94', // darker blue
      '#3B82F6', // lighter blue
      '#0F766E', // teal
      '#7C3AED', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
    ];
    
    // Simple hash function to get consistent color for same email
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = ((hash << 5) - hash) + email.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Generate user initials for avatar
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Map user roles to display values and colors
  const getRoleChipProps = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Admin',
          sx: { bgcolor: 'rgba(147, 51, 234, 0.1)', color: '#9333ea', border: '1px solid rgba(147, 51, 234, 0.2)' }
        };
      case 'MENTOR':
        return {
          label: 'Mentor',
          sx: { bgcolor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', border: '1px solid rgba(22, 163, 74, 0.2)' }
        };
      case 'USER':
        return {
          label: 'Mentee',
          sx: { bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.2)' }
        };
      default:
        return {
          label: role,
          sx: { bgcolor: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', border: '1px solid rgba(107, 114, 128, 0.2)' }
        };
    }
  };

  return (
    <TableContainer>
      <Box className="table-row table-header" sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <Box>User</Box>
        <Box>Email</Box>
        <Box>Role</Box>
        <Box sx={{ textAlign: 'right' }}>Actions</Box>
      </Box>

      {users.map((user) => (
        <Box key={user.id || user.email} className="table-row">
          <UserCell>
            <UserAvatar sx={{ bgcolor: getAvatarColor(user.email) }}>
              {getUserInitials(user.firstName, user.lastName)}
            </UserAvatar>
            <UserInfo>
              <Typography variant="body2" fontWeight={500} fontSize={14}>
                {user.firstName} {user.lastName}
              </Typography>
              {user.occupation && (
                <Typography variant="caption" color="text.secondary" fontSize={12}>
                  {user.occupation}
                </Typography>
              )}
            </UserInfo>
          </UserCell>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontSize={14}>
              {user.email}
            </Typography>
          </Box>

          <RoleCell>
            <RoleChip 
              {...getRoleChipProps(user.role)}
              size="small"
            />
          </RoleCell>

          <ActionsCell>
            <FormControl size="small" sx={{ display: 'block', position: 'relative' }}>
              <ChangeRoleButton
                onClick={() => handleRoleButtonClick(user.email)}
                disabled={actionInProgress === user.email}
                endIcon={<FilterList sx={{ fontSize: 16 }} />}
              >
                Change role
              </ChangeRoleButton>
              
              {isRoleMenuOpen[user.email] && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  mt: 0.5, 
                  bgcolor: 'white', 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                  borderRadius: 1, 
                  border: '1px solid #e5e7eb',
                  zIndex: 10,
                  width: 150
                }}>
                  {Object.values(UserRole).map(
                    (role) =>
                      role !== user.role && (
                        <MenuItem 
                          key={role} 
                          value={role} 
                          sx={{ fontSize: '14px' }}
                          onClick={() => handleRoleChange(user.email, role)}
                        >
                          {role === 'USER' ? 'Mentee' : role.charAt(0) + role.slice(1).toLowerCase()}
                        </MenuItem>
                      )
                    )}
                </Box>
              )}
            </FormControl>

            {actionInProgress === user.email && (
              <CircularProgress size={18} sx={{ color: '#1A5FFF', ml: 1 }} />
            )}
          </ActionsCell>
        </Box>
      ))}
      
      {users.length === 0 && (
        // Display placeholder rows only when there are no users
        Array.from({ length: 10 }).map((_, index) => (
          <Box key={`empty-row-${index}`} className="table-row" sx={{ height: '53px' }}></Box>
        ))
      )}

      {users.length === 0 && (
        <Box sx={{ position: 'relative', py: 8, textAlign: 'center', color: '#666' }}>
          <Typography fontSize={14}>No users match your search criteria.</Typography>
          <Button 
            sx={{ mt: 1, color: '#1A5FFF', fontSize: 14 }}
          >
            Clear filters
          </Button>
        </Box>
      )}
    </TableContainer>
  );
};

export default UserTable;