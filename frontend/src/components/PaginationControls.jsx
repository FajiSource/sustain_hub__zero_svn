export default function PaginationControls({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-xs">
      <button
        className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Prev
      </button>
      <span className="text-slate-500">
        Page {page} of {totalPages}
      </span>
      <button
        className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
