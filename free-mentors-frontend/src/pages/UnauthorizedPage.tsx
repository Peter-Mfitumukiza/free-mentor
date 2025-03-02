import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <svg 
          className="mx-auto h-16 w-16 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Unauthorized Access</h2>
        
        <p className="mt-2 text-gray-600">
          Sorry, you don't have the required permissions to access this page.
        </p>
        
        <p className="mt-1 text-sm text-gray-500">
          Current role: {user?.role || 'Unknown'}
        </p>
        
        <div className="mt-6">
          <Link 
            to="/dashboard" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 text-sm"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            to="/profile" 
            className="inline-block ml-4 text-blue-500 hover:text-blue-700 font-medium text-sm"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;