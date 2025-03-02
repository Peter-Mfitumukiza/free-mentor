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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken: string) => {
    try {
      console.log('Fetching user data with token:', authToken);
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          query: CURRENT_USER_QUERY
        })
      });
      
      const data = await response.json();
      console.log('User data response:', data);
      
      if (data.data && data.data.currentUser) {
        setUser(data.data.currentUser);
      } else {
        console.error('Invalid user data response:', data);
        logout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (authToken: string, userData: User) => {
    console.log('Logging in with token:', authToken);
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

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