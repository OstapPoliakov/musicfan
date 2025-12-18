import type { Images } from "@/common/types"
import defaultPlaylistCover from "@/assets/images/default-playlist-cover.png"
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlistsApi"
import type { ChangeEvent } from "react"
import s from "./PlaylistCover.module.css"
import { errorToast } from "@/common/utils"

type Props = {
  playlistId: string
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalImageCover = images.main.find(img => img.type === "original")

  const imgCoverSrc = originalImageCover ? originalImageCover.url : defaultPlaylistCover

  const uploadPlaylistCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const maxImageCoverSize = 1024 * 1024 // 1 Mb
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"]

    const file = event.target.files?.length && event.target.files[0]

    // раннее прерывание, если файл не был загружен
    if (!file) return

    if (!allowedFileTypes.includes(file.type)) {
      errorToast("Only PNG, JPEG of GIF image types are allowed!")
      return
    }

    if (file.size > maxImageCoverSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxImageCoverSize / 1024)} KB`)
      return
    }

    uploadPlaylistCover({
      playlistId,
      file,
    })
  }

  const deletePlaylistCoverHandler = () => {
    deletePlaylistCover(playlistId)
  }

  return (
    <>
      <img src={imgCoverSrc} alt="cover" width={"100px"} className={s.cover} />
      <input type="file" accept="image/jpeg,image/png,image/gif" onChange={uploadPlaylistCoverHandler} />
      {originalImageCover && <button onClick={deletePlaylistCoverHandler}>delete cover</button>}
    </>
  )
}
