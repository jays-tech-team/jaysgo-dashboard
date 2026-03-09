import { JSX, ReactNode, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  ChevronsUpDown,
} from "lucide-react";
import { useNavigate } from "react-router";
import { buildUrl } from "../../../unities/urlBuilder";

interface TableProps {
  columns: {
    header: string | JSX.Element;
    accessor: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell?: (row: Record<string, any>, onRefresh?: () => void) => ReactNode;
    sortable?: boolean;
    /** When we want to use different key to use sorting other than accessor */
    sortingKey?: string;
    skeletonClass?: string;
  }[];
  data: Record<string, string>[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
  };
  sorting?: {
    sortBy: string | null;
    sortOrder: "asc" | "desc" | null;
    onSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  };
  /**
   * @deprecated
   *
   * No longer in use.
   */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  onRefresh?: () => void;

  /**
   * If provide the path with placeholder (:actionId). on click TD on each Table TR. will redirect to this URL.
   * If You want to exclude any TD. like actions column. add preventClickViewClick on column
   */
  viewPath?: string;
}

export type TableColumns = TableProps["columns"];

export default function Table({
  columns,
  data,
  loading = false,
  pagination,
  sorting,
  onRefresh,
  viewPath,
}: TableProps) {
  const [perPage, setPerPage] = useState(10);

  const redirect = useNavigate();

  const handlePerPageChange = (value: string) => {
    const newPerPage = parseInt(value);
    setPerPage(newPerPage);
    pagination?.onPerPageChange(newPerPage);
  };

  const handleSort = (column: string) => {
    if (!sorting) return;

    const isCurrentColumn = sorting.sortBy === column;
    const newOrder =
      isCurrentColumn && sorting.sortOrder === "asc" ? "desc" : "asc";
    sorting.onSort(column, newOrder);
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400",
                    column.sortable && "cursor-pointer"
                  )}
                  onClick={() =>
                    column.sortable &&
                    handleSort(column.sortingKey || column.accessor)
                  }
                >
                  <div
                    className={cn(
                      "flex items-center justify-center gap-2",
                      column.accessor == sorting?.sortBy
                        ? "bg-gray-100 p-1 rounded-md "
                        : ""
                    )}
                  >
                    {column.header}
                    {column.sortable && (
                      <SortingIcon
                        sorting={sorting}
                        accessor={column.accessor}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <TableSkeleton rowCount={perPage} headings={columns} />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 relative"
                >
                  {columns.map((column, colIndex) => {
                    const isClickEnable =
                      viewPath && column.accessor != "actions";
                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-2 py-4 text-xs text-gray-900 dark:text-gray-100 text-center",
                          isClickEnable ? "cursor-pointer" : ""
                        )}
                        onClick={() => {
                          if (isClickEnable) {
                            redirect(buildUrl(viewPath, row));
                          }
                        }}
                      >
                        {column.cell
                          ? column.cell(row, onRefresh)
                          : ((row[column.accessor] || "") as ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Rows per page:
              </span>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(e.target.value)}
                className="px-2 py-1 border rounded-md text-sm"
              >
                {[10, 20, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {pagination.totalItems} total items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TableSkeleton({
  rowCount,
  headings,
}: {
  rowCount: number;
  headings: TableProps["columns"];
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {headings.map((cols, colIndex) => (
            <td key={colIndex} className="px-4 py-4">
              <div
                className={cn(
                  "h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4",
                  cols.skeletonClass
                )}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function SortingIcon({
  accessor,
  sorting,
}: {
  sorting: TableProps["sorting"];
  accessor: string;
}) {
  const cls = "h-4 w-4";
  if (accessor == sorting?.sortBy) {
    return sorting?.sortOrder == "desc" ? (
      <ChevronsUp className={cn(cls, "text-brand-500 ")} />
    ) : (
      <ChevronsDown className={cn(cls, "text-brand-500 ")} />
    );
  }
  return <ChevronsUpDown className={cn(cls)} />;
}
