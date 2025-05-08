import { type FC } from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const Loading: FC<LoadingProps> = ({ 
  size = 'medium', 
  message = 'Loading...' 
}) => {
  // Determine spinner size based on prop
  const spinnerSize = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`${spinnerSize} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-2 text-gray-600">{message}</p>
      )}
    </div>
  );
};