import { PageSizeSelector } from "./PageSizeSelector/PageSizeSelector"
import s from "./Pagination.module.css"
import { PaginationControl } from "./PaginationControl/PaginationControl"

type Props = {
  currentPage: number
  setCurrentPage: (page: number) => void
  pagesCount: number
  pageSize: number
  changePageSize: (size: number) => void
}

export const Pagination = ({ currentPage, setCurrentPage, pagesCount, pageSize, changePageSize }: Props) => {
  // раннее прерывание (если количество страниц 0 или 1, то и нечего отображать)
  if (pagesCount <= 1) return null

  return (
    <div className={s.container}>
      <div className={s.pagination}>
        <PaginationControl currentPage={currentPage} pagesCount={pagesCount} setCurrentPage={setCurrentPage} />
        <PageSizeSelector pageSize={pageSize} changePageSize={changePageSize} />
      </div>
    </div>
  )
}
