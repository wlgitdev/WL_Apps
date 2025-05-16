import { authApi, userApi } from '@/api';
import { userPlaylistsListSchema } from '@/schemas/Sortify';
import { DynamicList } from '@wl-apps/schema-to-ui';
import { UserPlaylist } from '@wl-apps/types';
import { queryClient } from '@/App';
import { QueryClientProvider } from '@tanstack/react-query';

interface PlaylistsListProps {
  onSelect: (playlists: UserPlaylist[]) => void;
  onCancel: () => void;
}

export const PlaylistsList = ({ onSelect, onCancel }: PlaylistsListProps) => {
  const fetchPlaylists = async () => {
    const userId = await authApi.userId();
    const playlists = await userApi.getUserPlaylists(userId);

    return playlists;
  };

  const schema = {
    ...userPlaylistsListSchema,
    options: {
      ...userPlaylistsListSchema.options,
      selectedActions: [
        {
          label: 'Select',
          onClick: (selectedRows: UserPlaylist[]) => onSelect(selectedRows)
        }
      ]
    }
  };

  Object.entries(schema.columns).forEach(([, column]) => {  
    column.sortable = true;
    column.filterable = true;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <DynamicList<UserPlaylist>
          schema={schema}
          queryKey={['playlists']}
          queryFn={fetchPlaylists}
          className="w-full"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </QueryClientProvider>
  );
};
