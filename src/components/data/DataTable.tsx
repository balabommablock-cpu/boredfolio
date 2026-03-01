import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

/*
 * DATA TABLE
 * ──────────
 * The workhorse. Used for: fund listings, holdings, peer comparisons,
 * AUM flows, manager rosters, and 30+ other contexts.
 *
 * Features: sortable columns, sticky header, row hover,
 * optional pagination, responsive scroll, zebra rows optional.
 *
 * Design: cream borders, sage sort indicators, mono numbers.
 */

type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  minWidth?: string;
  sticky?: boolean; // stick to left (for name columns)
  headerClass?: string;
  cellClass?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  sortable?: boolean;
  defaultSort?: { key: string; direction: SortDirection };
  onSort?: (key: string, direction: SortDirection) => void;
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
  emptyMessage?: string;
  compact?: boolean;
  striped?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
  className?: string;
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  sortable = true,
  defaultSort,
  onSort,
  onRowClick,
  highlightRow,
  emptyMessage = "No data available",
  compact = false,
  striped = false,
  stickyHeader = true,
  maxHeight,
  className,
  pagination = false,
  pageSize = 25,
  currentPage: controlledPage,
  totalItems,
  onPageChange,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<{
    key: string;
    direction: SortDirection;
  }>(defaultSort || { key: "", direction: null });

  const [internalPage, setInternalPage] = useState(1);
  const page = controlledPage ?? internalPage;

  const handleSort = (key: string) => {
    if (!sortable) return;
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;

    let newDir: SortDirection = "asc";
    if (internalSort.key === key) {
      if (internalSort.direction === "asc") newDir = "desc";
      else if (internalSort.direction === "desc") newDir = null;
    }

    setInternalSort({ key, direction: newDir });
    onSort?.(key, newDir);
  };

  // Sort data internally if no external sort handler
  const sortedData = useMemo(() => {
    if (onSort || !internalSort.direction || !internalSort.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[internalSort.key];
      const bVal = b[internalSort.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let cmp = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }

      return internalSort.direction === "desc" ? -cmp : cmp;
    });
  }, [data, internalSort, onSort]);

  // Paginate
  const totalPages = Math.ceil((totalItems ?? sortedData.length) / pageSize);
  const paginatedData = pagination && !totalItems
    ? sortedData.slice((page - 1) * pageSize, page * pageSize)
    : sortedData;

  const cellPadding = compact ? "px-3 py-2" : "px-4 py-3";

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "overflow-x-auto border border-cream-300 rounded-lg",
          maxHeight && "overflow-y-auto"
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className={cn(stickyHeader && "sticky top-0 z-10")}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                  className={cn(
                    "bg-cream-100 text-left font-sans text-xs font-semibold",
                    "uppercase tracking-[0.1em] text-ink-400",
                    "border-b border-cream-300",
                    cellPadding,
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable && sortable && "cursor-pointer select-none hover:text-ink-700 transition-colors",
                    col.sticky && "sticky left-0 z-20 bg-cream-100",
                    col.headerClass
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortable && (
                      <SortIndicator
                        active={internalSort.key === col.key}
                        direction={
                          internalSort.key === col.key
                            ? internalSort.direction
                            : null
                        }
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-sm text-ink-400 py-12"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={String(row[keyField])}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-cream-200 last:border-0",
                    "transition-colors duration-100",
                    onRowClick && "cursor-pointer",
                    highlightRow?.(row)
                      ? "bg-sage-50"
                      : striped && rowIdx % 2 === 1
                        ? "bg-cream-100/50"
                        : "bg-cream-50",
                    "hover:bg-cream-200/60"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "text-sm text-ink-900",
                        cellPadding,
                        col.align === "right" && "text-right font-mono tabular-nums",
                        col.align === "center" && "text-center",
                        col.sticky && "sticky left-0 z-10 bg-inherit",
                        col.cellClass
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIdx)
                        : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-xs text-ink-400">
            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalItems ?? sortedData.length)} of {totalItems ?? sortedData.length}
          </span>
          <div className="flex items-center gap-1">
            <PaginationButton
              disabled={page <= 1}
              onClick={() => {
                const p = page - 1;
                setInternalPage(p);
                onPageChange?.(p);
              }}
            >
              ‹ Prev
            </PaginationButton>
            {generatePageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-xs text-ink-400">
                  …
                </span>
              ) : (
                <PaginationButton
                  key={p}
                  active={p === page}
                  onClick={() => {
                    setInternalPage(p as number);
                    onPageChange?.(p as number);
                  }}
                >
                  {p}
                </PaginationButton>
              )
            )}
            <PaginationButton
              disabled={page >= totalPages}
              onClick={() => {
                const p = page + 1;
                setInternalPage(p);
                onPageChange?.(p);
              }}
            >
              Next ›
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sort Indicator ── */
function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  return (
    <span className="inline-flex flex-col ml-0.5">
      <svg
        className={cn(
          "h-2.5 w-2.5 -mb-0.5",
          active && direction === "asc" ? "text-sage-500" : "text-ink-300"
        )}
        viewBox="0 0 8 5" fill="currentColor"
      >
        <path d="M4 0L8 5H0L4 0Z" />
      </svg>
      <svg
        className={cn(
          "h-2.5 w-2.5",
          active && direction === "desc" ? "text-sage-500" : "text-ink-300"
        )}
        viewBox="0 0 8 5" fill="currentColor"
      >
        <path d="M4 5L0 0H8L4 5Z" />
      </svg>
    </span>
  );
}

/* ── Pagination Button ── */
function PaginationButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-7 min-w-[1.75rem] px-2 rounded text-xs font-medium",
        "transition-colors duration-150 focus-ring",
        active
          ? "bg-sage-500 text-white"
          : disabled
            ? "text-ink-300 cursor-not-allowed"
            : "text-ink-500 hover:bg-cream-200 hover:text-ink-700"
      )}
    >
      {children}
    </button>
  );
}

/* ── Page number generator ── */
function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}

export default DataTable;
