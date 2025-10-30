import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  PlaylistsResponse,
  FetchPlaylistsArgs,
  CreatePlaylistArgs,
  PlaylistData,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"

export const playlistsApi = createApi({
  reducerPath: "playlistsApi",
  // обертка над нативным fetch
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    // api-key будет улетать c каждым запросом в заголовках (headers)
    headers: {
      "API-KEY": import.meta.env.VITE_API_KEY,
    },
    // прикрепляет к каждому запросу accesss-token
    prepareHeaders: headers => {
      headers.set("Authorization", `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
    },
  }),
  // аналог instance из axios
  endpoints: build => ({
    // GET-запрос (получение плейлистов)
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => `playlists`,
    }),
    // POST-запрос (создания плейлиста)
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: body => ({
        method: "post",
        url: "playlists",
        body,
      }),
    }),
    // DELETE-запрос (удаление плейлиста)
    deletePlaylist: build.mutation<void, PlaylistData["id"]>({
      query: playlistId => ({
        method: "delete",
        url: `playlists/${playlistId}`,
      }),
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
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistsApi
