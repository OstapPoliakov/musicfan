type Props = {
  observerRef: React.RefObject<HTMLDivElement | null>
  isFetchingNextPage: boolean
}

export const LoadingTrigger = ({ observerRef, isFetchingNextPage }: Props) => {
  return (
    <div ref={observerRef}>
      {isFetchingNextPage ? <div>Loading more tracks</div> : <div style={{ height: "20px" }} />}
    </div>
  )
}
