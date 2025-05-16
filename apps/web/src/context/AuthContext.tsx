import { 
  createContext, 
  useContext, 
  useState,  
  type FC,
  type ReactNode,
  useEffect
} from 'react';
import { authApi } from '@/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isConnectedToSpotify: boolean;
  login: () => void; 
  logout: () => void;
  userId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    authApi.isAuthenticated()
  );

  const [isConnectedToSpotify, setIsConnectedToSpotify] = useState(false);
  useEffect(() => {
    authApi.isConnectedToSpotify().then(setIsConnectedToSpotify);
  }, []);

  const [userId, setUserId] = useState('');
  useEffect(() => {
    authApi.userId().then(setUserId);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isConnectedToSpotify, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};