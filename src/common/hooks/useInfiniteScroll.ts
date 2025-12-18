import { useCallback, useEffect, useRef } from "react"

type Props = {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  rootMargin?: string
  threshold?: number
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetching,
  fetchNextPage,
  rootMargin = "100px",
  threshold = 0.1,
}: Props) => {
  // ссылка на DOM-элемент (триггер для автозагрузки)
  const observerRef = useRef<HTMLDivElement>(null)

  const loadMoreHandler = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  useEffect(() => {
    // IntersectionObserver отслеживает элементы и сообщает, насколько они видны во viewport
    const observer = new IntersectionObserver(
      // entries - наблюдаемый элемент
      entries => {
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        root: null, // null - по умолчанию, отслеживание относительно окна всего браузера (viewport)
        rootMargin, // загрузка за N px до появления отслеживаемого элемента во viewport'е
        threshold, // (часть от 1) 0.1 = колбэк отработает когда 10% элемента войдет в зону видимости (viewport)
      }
    )

    const currentObserverRef = observerRef.current

    // подписка observer (пересечение viewport DOM-элемента c ref)
    if (currentObserverRef) {
      // начинает наблюдение за элементом
      observer.observe(currentObserverRef)
    }

    // Функция очистки - прекращает наблюдение при размонтировании компонента
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [loadMoreHandler, rootMargin, threshold])

  return { observerRef }
}
