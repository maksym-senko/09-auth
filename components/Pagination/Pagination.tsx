import ReactPaginate from 'react-paginate';

export interface PaginationProps {
  pageCount: number; 
  onPageChange: (selectedItem: { selected: number }) => void;
  forcePage: number;
}

export function Pagination({ pageCount, onPageChange, forcePage }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName="pagination"
      activeClassName="active"
      previousLabel="<"
      nextLabel=">"
    />
  );
}