import { FC, ReactNode, useState } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { HomePage } from './HomePage';
import { SERVER_API_ROUTES } from '@wl-apps/utils';
import { TrackStatesNamingScheme } from '@wl-apps/types';
import { Dropdown, DropdownItem } from '@components/common/Dropdown';
import { TrackStatesPage } from './TrackStatesPage';
import { userApi } from "@/api";

interface MainLayoutProps {
  children: ReactNode;
}

export const SortifyLayout: FC<MainLayoutProps> = ({ children }) => {
  const { isConnectedToSpotify, userId } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnectSpotify = async () => {
    if (!userId) {
      return;
    }
    
    const authUrl = await userApi.getSpotifyAuthUrl(userId);
    
    if (!authUrl) {
      return;
    }

    // Redirect to Spotify authorization page
    window.location.href = authUrl;
  };

  const handleSyncLikedSongs = async () => {
    if (!userId || isSyncing) return;
    
    try {
      setIsSyncing(true);
      await userApi.syncLikedSongs(userId);
    } catch (error) {
      console.error('Failed to sync liked songs:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const SettingsTrigger = (
    <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
      Settings
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">
                  <Link
                    to={`/${SERVER_API_ROUTES.sortify.home}`}
                    className="text-xl font-bold"
                  >
                    Sortify
                  </Link>
                </h1>
                <Dropdown trigger={SettingsTrigger}>
                  <Link to={`/${SERVER_API_ROUTES.sortify.trackStates.base}`}>
                    <DropdownItem>{TrackStatesNamingScheme.PLURAL}</DropdownItem>
                  </Link>
                </Dropdown>
              </div>
            </div>
            <div className="flex items-center">
              {!isConnectedToSpotify && (
                <button
                  onClick={handleConnectSpotify}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                  Connect Spotify
                </button>
              )}
              {isConnectedToSpotify && (
                <button
                  onClick={handleSyncLikedSongs}
                  disabled={isSyncing}
                  className={`relative px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    isSyncing 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <span className={`${isSyncing ? 'invisible' : ''}`}>
                    Sync Liked Songs
                  </span>
                  {isSyncing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export const SortifyPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <SortifyLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold mb-6">Sortify</h2>
            </div>
          </SortifyLayout>
        } 
      />
      <Route 
        path="/home" 
        element={
          <SortifyLayout>
            <HomePage />
          </SortifyLayout>
        } 
      />
      <Route 
        path="/track-states" 
        element={
          <SortifyLayout>
            <TrackStatesPage />
          </SortifyLayout>
        } 
      />
    </Routes>
  );
};

export default SortifyPage;