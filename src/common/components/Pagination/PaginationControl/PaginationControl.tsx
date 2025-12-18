import { getPaginationPages } from "@/common/utils"
import s from "./PaginationControl.module.css"

type Props = {
  currentPage: number
  pagesCount: number
  setCurrentPage: (page: number) => void
}

export const PaginationControl = ({ currentPage, pagesCount, setCurrentPage }: Props) => {
  const pages = getPaginationPages(currentPage, pagesCount)

  return (
    <>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span className={s.ellipsis} key={`ellipsis-${idx}`}>
            ...
          </span>
        ) : (
          <button
            key={page}
            className={page === currentPage ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton}
            onClick={() => page !== currentPage && setCurrentPage(Number(page))}
            disabled={page === currentPage}
            type="button"
          >
            {page}
          </button>
        )
      )}
    </>
  )
}
