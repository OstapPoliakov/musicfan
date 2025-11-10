import { useCallback, useEffect, useRef } from "react"
import { useFetchTracksInfiniteQuery } from "../api/tracksApi"
import s from "./TracksPage.module.css"

export const TracksPage = () => {
  const { data, hasNextPage, isLoading, isFetching, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()

  const pages = data?.pages.flatMap(page => page.data) || []
  //console.log(data)

  const loadMoreHandler = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  // ссылка на DOM-элемент (триггер для автозагрузки)
  const observerRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver отслеживает элементы и сообщает, насколько они видны во viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      // entries - наблюдаемый элемент
      entries => {
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        root: null, // null - по умолчанию, отслеживание относительно окна всего браузера (viewport)
        rootMargin: "100px", // загрузка за N px до появления отслеживаемого элемента во viewport'е
        threshold: 0.1, // (часть от 1) 0.1 = колбэк отработает когда 10% элемента войдет в зону видимости (viewport)
      }
    )

    const currentObserverRef = observerRef.current

    // подписка observer (пересечение DOM-элемента c ref)
    if (currentObserverRef) {
      observer.observe(currentObserverRef)
    }

    // отписка при размонтировании компонента
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [loadMoreHandler])

  return (
    <div>
      <h1>Tracks page</h1>
      <div className={s.list}>
        {pages.map(track => {
          const { title, user, attachments } = track.attributes

          return (
            <div key={track.id} className={s.item}>
              <div>
                <p>Title: {title}</p>
                <p>Name: {user.name}</p>
              </div>
              {attachments.length ? <audio controls src={attachments[0].url} /> : "no file"}
            </div>
          )
        })}
      </div>
      {hasNextPage && (
        <div ref={observerRef}>
          {isFetchingNextPage ? <div>Loading more tracks</div> : <div style={{ height: "20px" }} />}
        </div>
      )}

      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
