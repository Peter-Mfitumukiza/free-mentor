import { UserRole } from '../contexts/AuthContext';

const SERVICE_ACCESS = {
  [UserRole.USER]: {
    mentorsList: true,
    sessionRequest: true,
    profileEdit: true,
    dashboard: true,
    profile: true,
  },
  [UserRole.MENTOR]: {
    mentorsList: true,
    sessionRequest: true,
    profileEdit: true,
    dashboard: true,
    profile: true,
    mentorDashboard: true,
  },
  [UserRole.ADMIN]: {
    mentorsList: true,
    sessionRequest: true,
    profileEdit: true,
    dashboard: true,
    profile: true,
    adminPanel: true,
    userManagement: true,
    admin: true,
  }
};

export const hasServiceAccess = (user: any, service: string) => {
  // Validate user and role
  if (!user || !user.role) {
    console.error('No user or role found');
    return false;
  }

  // Ensure the role is a valid UserRole
  if (!Object.values(UserRole).includes(user.role)) {
    console.error(`Invalid role: ${user.role}`);
    return false;
  }

  // Check service access
  const hasAccess = SERVICE_ACCESS[user.role][service] || false;

  console.log('Service Access Check:', {
    user: user.email,
    role: user.role,
    service,
    hasAccess
  });

  return hasAccess;
};