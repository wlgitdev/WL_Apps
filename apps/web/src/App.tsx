import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@components/layout/MainLayout';
import { LoginPage } from '@pages/Auth/LoginPage';
import { AuthProvider, useAuth } from '@context/AuthContext';
import { HomePage } from '@pages/Home/HomePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Navigate to="/login" replace /> : <>{children}</>;
};

function App() {
  const queryClient = new QueryClient(); 
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;