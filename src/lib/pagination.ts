export interface PaginationState {
  currentPage: number;
  pageCount: number;
  startIndex: number;
  endIndex: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  pages: number[];
}

export function getPaginationState(
  itemCount: number,
  currentPage: number,
  itemsPerPage: number,
): PaginationState {
  const pageCount = Math.max(1, Math.ceil(itemCount / itemsPerPage));
  const normalizedPage = Math.min(Math.max(currentPage, 1), pageCount);
  const startIndex = (normalizedPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage: normalizedPage,
    pageCount,
    startIndex,
    endIndex,
    hasPreviousPage: normalizedPage > 1,
    hasNextPage: normalizedPage < pageCount,
    pages: Array.from({ length: pageCount }, (_, index) => index + 1),
  };
}

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number,
): T[] {
  if (items.length <= itemsPerPage) {
    return items;
  }

  const { startIndex, endIndex } = getPaginationState(
    items.length,
    currentPage,
    itemsPerPage,
  );

  return items.slice(startIndex, endIndex);
}
