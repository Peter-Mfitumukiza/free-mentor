import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  AccountCircle,
  KeyboardArrowDown as ArrowDownIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../../contexts/AuthContext';

const SidebarContainer = styled(Box)({
  width: 260,
  height: '100vh',
  background: 'linear-gradient(135deg, #1A5FFF 0%, #1A3D94 100%)',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 100,
});

const SidebarHeader = styled(Box)({
  padding: '24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const NavItem = styled(ListItem)<{ isactive: 'true' | 'false' }>(({ isactive }) => ({
  margin: '4px 12px',
  padding: '10px 16px',
  borderRadius: '4px',
  backgroundColor: isactive === 'true' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  color: isactive === 'true' ? 'white' : 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: isactive === 'true' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}));

const NavItemIcon = styled(ListItemIcon)<{ isactive: 'true' | 'false' }>(({ isactive }) => ({
  minWidth: 36,
  color: isactive === 'true' ? 'white' : 'rgba(255, 255, 255, 0.8)',
}));

const MainContent = styled(Box)({
  marginLeft: 260,
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  flexGrow: 1,
  padding: '20px',
});

const UserSection = styled(Box)({
  marginTop: 'auto',
  padding: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleUserMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/auth");
  };

  const getUserInitials = () => {
    if (!user || !user.firstName || !user.lastName) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const isPathActive = (path: string): boolean => {
    if (path === '/admin') {
      return location.pathname.includes('admin') || location.pathname.includes('users');
    }
    
    if (path === '/mentorship-requests') {
      return location.pathname.includes('mentorship-requests');
    }

    if (path === '/my-sessions') {
      return location.pathname.includes('my-sessions');
    }
    
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' }
    ];

    if (user?.role === UserRole.ADMIN) {
      baseItems.push({ path: '/admin', icon: <PeopleIcon />, text: 'Users' });
    } else if (user?.role === UserRole.MENTOR) {
      baseItems.push({ path: '/mentorship-requests', icon: <PeopleIcon />, text: 'Mentorship Requests' });
    } else if (user?.role === UserRole.USER) {
      baseItems.push({ path: '/my-sessions', icon: <HistoryIcon />, text: 'My Sessions' });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarContainer>
        <SidebarHeader>
          <Typography variant="h6" fontWeight={600} fontSize={18}>
            Free Mentors
          </Typography>
        </SidebarHeader>

        <List sx={{ py: 1 }}>
          {navItems.map((item) => (
            <NavItem 
              key={item.path} 
              component={Link} 
              to={item.path}
              isactive={isPathActive(item.path) ? 'true' : 'false'}
              disablePadding
            >
              <NavItemIcon isactive={isPathActive(item.path) ? 'true' : 'false'}>
                {item.icon}
              </NavItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isPathActive(item.path) ? 600 : 400,
                  fontSize: '14px'
                }} 
              />
            </NavItem>
          ))}
        </List>

        <UserSection>
          <UserInfo onClick={handleUserMenuClick}>
            {user ? (
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 36, height: 36 }}>
                {getUserInitials()}
              </Avatar>
            ) : (
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 36, height: 36 }}>
                <AccountCircle />
              </Avatar>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight={500} fontSize={14}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }} fontSize={12}>
                {user?.email || 'guest@example.com'}
              </Typography>
            </Box>
            <ArrowDownIcon sx={{ fontSize: 18, opacity: 0.8 }} />
          </UserInfo>
        </UserSection>
      </SidebarContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: {
            minWidth: 200,
            mt: 1,
            borderRadius: '6px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <MenuItem sx={{ py: 1 }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" fontWeight={500}>
              {user?.role || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'guest@example.com'}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1, gap: 1, mt: 1 }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      <MainContent>
        {children}
      </MainContent>
    </Box>
  );
};

export default SidebarLayout;