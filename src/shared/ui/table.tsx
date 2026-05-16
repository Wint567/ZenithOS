"use client";

import { ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends Record<string, unknown>>({ data, columns, sortKey, sortDir, onSort, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/[0.04] text-left text-xs uppercase tracking-[0.08em] text-foreground/45">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={cn("px-4 py-3 font-semibold", column.className)}>
                  <button
                    type="button"
                    disabled={!column.sortable}
                    onClick={() => onSort?.(String(column.key))}
                    className="inline-flex items-center gap-1 disabled:cursor-default"
                  >
                    {column.header}
                    {column.sortable ? <ArrowDownUp className={cn("size-3", sortKey === column.key && sortDir === "desc" && "rotate-180")} /> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row, index) => (
              <tr
                key={String(row.id ?? index)}
                onClick={() => onRowClick?.(row)}
                className={cn("transition hover:bg-white/[0.04]", onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn("px-4 py-3 text-foreground/75", column.className)}>
                    {column.render ? column.render(row) : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
