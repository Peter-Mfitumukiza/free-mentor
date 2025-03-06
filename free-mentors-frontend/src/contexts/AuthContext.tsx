import React, { createContext, useState, useEffect, useContext } from 'react';

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

const CURRENT_USER_QUERY = `
  query {
    currentUser {
      id
      firstName
      lastName
      email
      role
      bio
      address
      occupation
      expertise
    }
  }
`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // More robust user data fetching
  const fetchUserData = async (authToken: string) => {
    try {
      console.log('Fetching user data with token:', authToken);
      const response = await fetch('http://localhost:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          query: CURRENT_USER_QUERY
        })
      });

      if (!response.ok) {
        console.error('Network error:', response.status);
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('User data response:', data);
      
      if (data.data && data.data.currentUser) {
        setUser(data.data.currentUser);
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Invalid user data response:', data);
        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
        }
        return false;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };

  // Login function - store user data in localStorage as well
  const login = (authToken: string, userData: User) => {
    console.log('Logging in with token:', authToken);
    localStorage.setItem('token', authToken);
    // Also store user data to avoid unnecessary fetching
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  // Logout function
  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('userData');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }
      
      setToken(storedToken);
      
      // If we have cached user data, use it immediately to avoid loading state
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUser(parsedUserData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Error parsing stored user data', e);
        }
      }
      
      // Verify the token is still valid by fetching fresh user data
      const success = await fetchUserData(storedToken);

      console.log("the success pe", success);
      console.log("The stored token", storedToken);
      
      if (!success) {
        // Token was invalid or expired
        // logout();
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