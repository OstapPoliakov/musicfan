import { useState } from "react"
import s from "./PlaylistsList.module.css"
import { useForm } from "react-hook-form"
import type { PlaylistData, UpdatePlaylistArgs } from "@/features/playlists/api/playlistsApi.types"
import { useDeletePlaylistMutation } from "@/features/playlists/api/playlistsApi"
import { EditPlaylistForm } from "../EditPlaylistForm/EditPlaylistForm"
import { PlaylistItem } from "../PlaylistItem/PlaylistItem"

type Props = {
  playlists: PlaylistData[]
  isPlaylistsLoading: boolean
}

export const PlaylistsList = ({ playlists, isPlaylistsLoading }: Props) => {
  // храним id обновляемого плейлиста
  const [playlistId, setPlaylistId] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

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
    <div className={s.items}>
      {!playlists?.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playlists?.map(playlist => {
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
  )
}
