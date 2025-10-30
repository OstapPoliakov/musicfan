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

export const PlaylistsPage = () => {
  // храним id обновляемого плейлиста
  const [playlistId, setPlaylistId] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
  const { data } = useFetchPlaylistsQuery()

  const [deletePlaylist] = useDeletePlaylistMutation()
  const [updatePlaylist] = useUpdatePlaylistMutation()

  // callback-функция обработчик события удаления плейлиста
  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm("Are you sure you want to delete the playlist?")) {
      deletePlaylist(playlistId)
    }
  }

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

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = body => {
    // раннее прерывание, если playlistId === null
    if (!playlistId) return

    // обновляем данные плейлиста
    updatePlaylist({
      playlistId,
      body,
    }).then(() => {
      setPlaylistId(null)
    })
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h2>Edit playlist</h2>
                  <div>
                    <input {...register("title")} placeholder={"title"} />
                  </div>
                  <div>
                    <input {...register("description")} placeholder={"description"} />
                  </div>
                  <button type={"submit"}>save</button>
                  <button type={"button"} onClick={() => editPlaylistHandler(null)}>
                    cancel
                  </button>
                </form>
              ) : (
                <div>
                  <div>title: {playlist.attributes.title}</div>
                  <div>description: {playlist.attributes.description}</div>
                  <div>userName: {playlist.attributes.user.name}</div>
                  <button onClick={() => deletePlaylistHandler(playlist.id)}>
                    delete
                  </button>
                  <button onClick={() => editPlaylistHandler(playlist)}>update</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
