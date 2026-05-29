interface PaginationControlsLabels {
  pagination: string;
  previous: string;
  next: string;
  page: string;
}

interface PaginationControlsProps {
  currentPage: number;
  pageCount: number;
  pages: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  labels: PaginationControlsLabels;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  pageCount,
  pages,
  hasPreviousPage,
  hasNextPage,
  labels,
  onPageChange,
}: PaginationControlsProps) {
  if (pageCount <= 1) {
    return null;
  }

  const baseButtonClass =
    "inline-flex min-h-11 items-center justify-center rounded-md border px-3 py-2 text-xs uppercase tracking-label transition-colors";
  const inactiveButtonClass =
    "border-border text-muted hover:border-accent/45 hover:text-text";
  const activeButtonClass = "border-accent text-accent";
  const disabledButtonClass =
    "cursor-not-allowed border-border text-muted/45 hover:border-border hover:text-muted/45";

  return (
    <nav aria-label={labels.pagination} className="pt-2">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            className={`${baseButtonClass} ${
              hasPreviousPage ? inactiveButtonClass : disabledButtonClass
            }`}
          >
            {labels.previous}
          </button>
        </li>

        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${labels.page} ${page}`}
                className={`${baseButtonClass} min-w-11 px-0 ${
                  isActive ? activeButtonClass : inactiveButtonClass
                }`}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`${baseButtonClass} ${
              hasNextPage ? inactiveButtonClass : disabledButtonClass
            }`}
          >
            {labels.next}
          </button>
        </li>
      </ul>
    </nav>
  );
}
