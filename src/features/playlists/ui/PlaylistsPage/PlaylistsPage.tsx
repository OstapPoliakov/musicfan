import s from "./PlaylistsPage.module.css"
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistsApi"
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx"
import { useState, type ChangeEvent } from "react"
import { useDebounceValue } from "@/common/hooks"
import { Pagination } from "@/common/components"
import { PlaylistsList } from "../PlaylistsList/PlaylistsList"

export const PlaylistsPage = () => {
  // храним текущий искомый плейлист
  const [search, setSearch] = useState("")
  // храним номер текущей страницы (пагинация)
  const [currentPage, setCurrentPage] = useState(1)
  // храним кол-во отображаемых (на одной странице) плейлистов
  const [pageSize, setPageSize] = useState(4)

  const debounceSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery(
    { search: debounceSearch, pageNumber: currentPage, pageSize },
    {
      refetchOnReconnect: true, // перезапрос данных при возврате из режима офлайн
      //pollingInterval: 3000,        // перезапрос данных каждые 3000 мс
      //skipPollingIfUnfocused: true, // (если текущая вкладка не в фокусе, то не делать запросы)
    }
  )

  // обработчик события изменение кол-ва отображаемых (на одной странице) плейлистов
  const changePageSizeHandler = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // обработчик события поиск плейлиста (из поисковой строки)
  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />

      {/* Строка поиска плейлиста */}
      <input type="search" placeholder={"Search playlist by title"} onChange={e => searchPlaylistHandler(e)} />

      <PlaylistsList playlists={data?.data || []} isPlaylistsLoading={isLoading} />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}
