import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500 mb-4'></div>
        <p className='text-gray-700'>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingComponent;
