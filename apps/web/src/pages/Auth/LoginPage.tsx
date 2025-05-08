import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@components/Auth/LoginForm';
import { authApi } from '@api/auth';
import { useAuth } from '@context/AuthContext';
import { type LoginCredentials } from '@wl-apps/types';
import { ApiError } from '@/api/errors';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleLogin = async (credentials: LoginCredentials) => {
  try {
    setIsLoading(true);
    setError(undefined);
    const response = await authApi.login(credentials);
    
    if (response.token) {
      login(response.token);  // Update auth context with token from data object
      navigate('/');
    } else {
      throw new Error('Invalid server response format / login failed');
    }
  } catch (err) {
    setError(err instanceof ApiError ? err.message : 'Failed to login');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In
          </h2>
        </div>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};