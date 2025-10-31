import type {
  PlaylistsResponse,
  FetchPlaylistsArgs,
  CreatePlaylistArgs,
  PlaylistData,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"
import { baseApi } from "@/app/api/baseApi"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // GET-запрос (получение плейлистов)
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => `playlists`,
      providesTags: ["Playlist"],
    }),
    // POST-запрос (создания плейлиста)
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: body => ({
        method: "post",
        url: "playlists",
        body,
      }),
      invalidatesTags: ["Playlist"],
    }),
    // DELETE-запрос (удаление плейлиста)
    deletePlaylist: build.mutation<void, PlaylistData["id"]>({
      query: playlistId => ({
        method: "delete",
        url: `playlists/${playlistId}`,
      }),
      invalidatesTags: ["Playlist"],
    }),
    // PUT-запрос (изменение плейлиста)
    updatePlaylist: build.mutation<
      void,
      { playlistId: PlaylistData["id"]; body: UpdatePlaylistArgs }
    >({
      query: ({ playlistId, body }) => ({
        method: "put",
        url: `playlists/${playlistId}`,
        body,
      }),
      invalidatesTags: ["Playlist"],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistsApi
