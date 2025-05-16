import {
  type TrackStatesExtended as EntityType,
  TrackStatesNamingScheme as EntityNamingScheme,
  TrackStatesExtended,
  UserPlaylist
} from '@wl-apps/types';
import { trackStatesApi as entityApi } from '@/api';
import { trackStatesListSchema as entitySchema } from '@/schemas/Sortify';

import { DynamicList } from '@wl-apps/schema-to-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { authApi, userApi } from '@/api';
import { TRACK_STATES_STATUS, BatchUpdate } from '@wl-apps/types';
import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { PlaylistsList } from '@/components/Sortify/PlaylistsList';
import { queryClient } from '@/App';

export const TrackStatesPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<EntityType[]>([]);
  const [modalMode, setModalMode] = useState<'add' | 'remove'>('add');

  const selectedSetToRemove = {
    label: '❌ Set To-Remove',
    async onClick(selectedRows: EntityType[]) {
      try {
        const updates = selectedRows.map(
          row =>
            ({
              recordId: row.recordId,
              data: { ...row, status: TRACK_STATES_STATUS.TO_REMOVE }
            } as BatchUpdate<EntityType>)
        );
        await entityApi.updateBatch(updates);
        queryClient.invalidateQueries({ queryKey: [EntityNamingScheme.MODEL] });
      } catch (error) {
        handleError('Unable to update status');
      }
    }
  };
  const selectedSetSkip = {
    label: '⏭️ Set Skip',
    async onClick(selectedRows: EntityType[]) {
      try {
        const updates = selectedRows.map(
          row =>
            ({
              recordId: row.recordId,
              data: { ...row, status: TRACK_STATES_STATUS.SKIP }
            } as BatchUpdate<EntityType>)
        );
        await entityApi.updateBatch(updates);
        queryClient.invalidateQueries({ queryKey: [EntityNamingScheme.MODEL] });
      } catch (error) {
        handleError('Unable to update status');
      }
    }
  };
  const selectedSetNull = {
    label: '⭕ Set Null',
    async onClick(selectedRows: EntityType[]) {
      try {
        const updates = selectedRows.map(
          row =>
            ({
              recordId: row.recordId,
              data: { ...row, status: TRACK_STATES_STATUS.NULL }
            } as BatchUpdate<EntityType>)
        );
        await entityApi.updateBatch(updates);
        queryClient.invalidateQueries({ queryKey: [EntityNamingScheme.MODEL] });
      } catch (error) {
        handleError('Unable to update status');
      }
    }
  };
  const selectedAddTargetPlaylist = {
    label: '➕ Add Target Playlist...',
    async onClick(selectedRows: EntityType[]) {
      setSelectedTracks(selectedRows);
      setModalMode('add');
      setShowPlaylistModal(true);
    }
  };
  const selectedRemoveTargetPlaylist = {
    label: '➖ Remove Target Playlist...',
    async onClick(selectedRows: EntityType[]) {
      setSelectedTracks(selectedRows);
      setModalMode('remove');
      setShowPlaylistModal(true);
    }
  };
  const selectedSyncChanges = {
    label: '🔁 Sync Changes',
    async onClick(selectedRows: EntityType[]) {
      try {
        const batchUpdates: BatchUpdate<EntityType>[] = selectedRows
          .filter(row => row.recordId)
          .map(
            row =>
              ({
                recordId: row.recordId,
                data: row
              } as BatchUpdate<EntityType>)
          );

        if (batchUpdates.length > 0) {
          const userId = await authApi.userId();
          await userApi.syncChangesToSpotify(userId, batchUpdates);
        }
      } catch (error) {
        handleError('Unable to sync changes');
      }
    }
  };
  const rowActions = (row: TrackStatesExtended) => {
    return [
      {
        label: '🔗',
        variant: 'secondary',
        onClick: () => {
          if (row.external_url_spotify) {
            window.open(row.external_url_spotify, '_blank');
          }
        },
        hidden: !row.external_url_spotify
      }
    ];
  };

  const entitySchemaExtended = {
    ...entitySchema,
    columns: {
      ...entitySchema.columns,
      actions: {
        label: 'Actions',
        field: 'actions',
        type: 'action',
        sortable: false,
        format: {
          action: {
            variant: 'primary'
          }
        }
      }
    },
    options: {
      ...entitySchema.options,
      selectedActions: [
        selectedSetToRemove,
        selectedSetSkip,
        selectedSetNull,
        selectedAddTargetPlaylist,
        selectedRemoveTargetPlaylist,
        selectedSyncChanges
      ]
    }
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const fetchRecords = async () => {
    const records = (await userApi.getUserTrackStates()).map(item => {
    const transformedItem = { 
      ...item, 
      actions: rowActions(item) // Call the function to get actions array
    } as TrackStatesExtended;

      transformedItem.targetPlaylists = [`${transformedItem.targetPlaylists.length}`]
      transformedItem.date_added = typeof(transformedItem.date_added) == 'string' ? new Date(transformedItem.date_added) : transformedItem.date_added
      return transformedItem;
    });

    return records;
  };

  const handlePlaylistAdd = async (playlists: UserPlaylist[]) => {
    try {
      const updates = selectedTracks.map(
        track =>
          ({
            recordId: track.recordId,
            data: {
              ...track,
              targetPlaylists: [
                ...new Set([
                  ...(track.targetPlaylists || []),
                  ...playlists.map(p => p.id)
                ])
              ]
            }
          } as BatchUpdate<EntityType>)
      );
      await entityApi.updateBatch(updates);
      queryClient.invalidateQueries({ queryKey: [EntityNamingScheme.MODEL] });
      setShowPlaylistModal(false);
    } catch (error) {
      handleError('Unable to update playlists');
    }
  };
  const handlePlaylistRemove = async (playlists: UserPlaylist[]) => {
    try {
      const updates = selectedTracks.map(
        track =>
          ({
            recordId: track.recordId,
            data: {
              ...track,
              targetPlaylists: (track.targetPlaylists || []).filter(
                id => !playlists.map(p => p.id).includes(id)
              )
            }
          } as BatchUpdate<EntityType>)
      );
      await entityApi.updateBatch(updates);
      queryClient.invalidateQueries({ queryKey: [EntityNamingScheme.MODEL] });
      setShowPlaylistModal(false);
    } catch (error) {
      handleError('Unable to remove playlists');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4">
        <h1 className="text-2xl mb-4">{EntityNamingScheme.PLURAL}</h1>
        <DynamicList<EntityType>
          schema={entitySchemaExtended}
          queryKey={[EntityNamingScheme.MODEL]}
          queryFn={fetchRecords}
          className="w-full"
        />
        <Modal open={!!error} onClose={() => setError(null)} title="Error">
          <p className="text-red-600">{error}</p>
        </Modal>
        <Modal
          open={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          title={`${modalMode === 'add' ? 'Add to' : 'Remove'} Playlists`}
        >
          <PlaylistsList
            onSelect={
              modalMode === 'add' ? handlePlaylistAdd : handlePlaylistRemove
            }
            onCancel={() => setShowPlaylistModal(false)}
          />
        </Modal>
      </div>
    </QueryClientProvider>
  );
};
