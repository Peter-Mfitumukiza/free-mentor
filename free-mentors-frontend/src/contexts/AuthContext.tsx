import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllUsers } from '../api/graphqlApi';
import { toast } from 'react-hot-toast';

export enum UserRole {
  USER = 'USER',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  bio?: string;
  address?: string;
  occupation?: string;
  expertise?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUserData = async (authToken: string) => {
    try {
      const users = await getAllUsers(authToken);
      
      const storedUserData = localStorage.getItem('userData');
      let currentUser = null;

      if (storedUserData) {
        try {
          const parsedStoredUser = JSON.parse(storedUserData);
          
          currentUser = users.find(
            (u) => u.email === parsedStoredUser.email
          );
        } catch (e) {
          console.error('Error parsing stored user data', e);
        }
      }

      if (!currentUser && users.length > 0) {
        console.warn('No user found matching stored email. Using first user as fallback.');
        currentUser = users[0];
      }
      
      if (currentUser) {
        if (!Object.values(UserRole).includes(currentUser.role)) {
          console.error('Invalid user role:', currentUser.role);
          return false;
        }
        
        const updatedUserData = {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          role: currentUser.role,
          bio: currentUser.bio,
          address: currentUser.address,
          occupation: currentUser.occupation,
          expertise: currentUser.expertise
        };

        setUser(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('No matching user found or authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };

  const login = (authToken: string, userData: User) => {
    const fullUserData = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      bio: userData.bio,
      address: userData.address,
      occupation: userData.occupation,
      expertise: userData.expertise
    };
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('userData', JSON.stringify(fullUserData));
    
    setToken(authToken);
    setUser(fullUserData);
    setIsAuthenticated(true);
    setLoading(false);

    toast.success(`Welcome, ${fullUserData.firstName}!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);

    toast.success('You have been logged out.');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('userData');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }
      
      setToken(storedToken);
      
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          
          if (parsedUserData && parsedUserData.role) {
            setUser(parsedUserData);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error('Error parsing stored user data', e);
        }
      }
      
      try {
        const success = await fetchUserData(storedToken);
        
        if (!success) {
          logout();
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        logout();
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};