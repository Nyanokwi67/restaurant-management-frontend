import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-orange-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Message */}
        <p className="text-2xl font-bold text-gray-700 animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;