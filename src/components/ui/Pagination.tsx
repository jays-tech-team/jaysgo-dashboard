import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
export type PaginationMeta = {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component, in pagination we will not show all page numebr in order to avoid layout breaks.
 * @param param0 PaginationProps
 * @returns React Element
 */
const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page = 1, totalPages = 1 } = meta;

  const handleClick = (pageNum: number) => {
    if (pageNum !== page && pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const getVisiblePages = (): (number | string)[] => {
    if (!totalPages) return [];

    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Showing all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculating start and end of visible pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the start
      if (page <= 2) {
        endPage = 3;
      }

      // Adjust if we're near the end
      if (page >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis and middle pages
      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-2 mt-4 justify-center">
      <button
        onClick={() => handleClick(page - 1)}
        disabled={page <= 1}
        className={`px-3 py-1 rounded text-white ${
          page <= 1
            ? "bg-slate-200 text-gray-400 cursor-not-allowed"
            : "bg-slate-300 text-gray-800 hover:bg-gray-400"
        }`}
      >
        <ArrowLeft />
      </button>

      {getVisiblePages().map((pageNum, index) => (
        <button
          key={index}
          onClick={() => typeof pageNum === "number" && handleClick(pageNum)}
          className={`px-3 py-1 rounded text-white ${
            pageNum === page
              ? "bg-brand-500"
              : pageNum === "..."
              ? " !text-gray-800 cursor-default"
              : "bg-slate-300 text-gray-800 hover:bg-gray-400"
          }`}
          disabled={pageNum === "..."}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => handleClick(page + 1)}
        disabled={page >= totalPages}
        className={`px-3 py-1 rounded text-white ${
          page >= totalPages
            ? "bg-slate-200 text-gray-400 cursor-not-allowed"
            : "bg-slate-300 text-gray-800 hover:bg-gray-400"
        }`}
      >
        <ArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
