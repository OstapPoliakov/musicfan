import s from "./PlaylistsPage.module.css"
import {
  useDeletePlaylistMutation,
  useFetchPlaylistsQuery,
  useUpdatePlaylistMutation,
} from "@/features/playlists/api/playlistsApi"
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx"
import { useForm, type SubmitHandler } from "react-hook-form"
import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/playlistsApi.types"
import { useState } from "react"
import { PlaylistItem } from "../PlaylistItem/PlaylistItem"
import { EditPlaylistForm } from "../EditPlaylistForm/EditPlaylistForm"

export const PlaylistsPage = () => {
  // храним id обновляемого плейлиста
  const [playlistId, setPlaylistId] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
  const { data } = useFetchPlaylistsQuery()

  const [deletePlaylist] = useDeletePlaylistMutation()

  // callback-функция обработчик события удаления плейлиста
  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm("Are you sure you want to delete the playlist?")) {
      deletePlaylist(playlistId)
    }
  }

  // обработчик события обновления плейлиста
  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map(tag => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />

      <div className={s.items}>
        {data?.data.map(playlist => {
          // есть ли среди всех плейлистов тот, который надо обновить
          const isEditing = playlist.id === playlistId

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  playlistId={playlistId}
                  setPlaylistId={setPlaylistId}
                  editPlaylist={editPlaylistHandler}
                  handleSubmit={handleSubmit}
                  register={register}
                />
              ) : (
                <PlaylistItem
                  playlist={playlist}
                  deletePlaylistHandler={deletePlaylistHandler}
                  editPlaylistHandler={editPlaylistHandler}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
