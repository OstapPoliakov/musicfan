import type {
  PlaylistsResponse,
  FetchPlaylistsArgs,
  CreatePlaylistArgs,
  PlaylistData,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"
import { baseApi } from "@/app/api/baseApi"
import type { Images } from "@/common/types"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // GET-запрос (получение плейлистов)
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: params => ({
        url: "playlists",
        params,
      }),
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
    updatePlaylist: build.mutation<void, { playlistId: PlaylistData["id"]; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        method: "put",
        url: `playlists/${playlistId}`,
        body,
      }),
      invalidatesTags: ["Playlist"],
    }),
    // POST-запрос (загрузка обложки плейлиста)
    uploadPlaylistCover: build.mutation<Images, { playlistId: PlaylistData["id"]; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)

        return {
          method: "post",
          url: `playlists/${playlistId}/images/main`,
          body: formData,
        }
      },
      invalidatesTags: ["Playlist"],
    }),
    // DELETE-запрос (удаление обложки плейлиста)
    deletePlaylistCover: build.mutation<void, PlaylistData["id"]>({
      query: playlistId => {
        return {
          method: "delete",
          url: `playlists/${playlistId}/images/main`,
        }
      },
      invalidatesTags: ["Playlist"],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
