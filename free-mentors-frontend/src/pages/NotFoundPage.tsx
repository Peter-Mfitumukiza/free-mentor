import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-blue-500">404</h1>
        
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h2>
        
        <p className="mt-2 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-6">
          <Link 
            to="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 text-sm"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;