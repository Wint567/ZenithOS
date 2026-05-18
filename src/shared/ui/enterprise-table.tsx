"use client";

import { ArrowDownUp, Check, ChevronDown, Download, Rows3, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { downloadCsv, downloadJson } from "@/lib/export";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { Button } from "@/shared/ui/button";
import { Dropdown } from "@/shared/ui/dropdown";
import type { TableDensity } from "@/types";

type ExportValue = string | number | boolean | null | undefined;

export type EnterpriseColumn<T> = {
  id: string;
  header: string;
  accessor?: (row: T) => ExportValue;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  hideable?: boolean;
  className?: string;
};

export type BulkAction<T> = {
  id: string;
  label: string;
  tone?: "neutral" | "danger";
  action: (rows: T[]) => void;
};

type EnterpriseTableProps<T> = {
  tableId: string;
  rows: T[];
  columns: EnterpriseColumn<T>[];
  getRowId: (row: T) => string;
  onRowOpen?: (row: T) => void;
  bulkActions?: BulkAction<T>[];
  empty?: React.ReactNode;
  mobileCard?: (row: T, selected: boolean, toggle: () => void) => React.ReactNode;
};

function SelectionCheckbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="size-4 rounded border-[var(--line)] bg-[var(--surface-0)] accent-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
    />
  );
}

export function EnterpriseTable<T>({ tableId, rows, columns, getRowId, onRowOpen, bulkActions = [], empty, mobileCard }: EnterpriseTableProps<T>) {
  const preferences = useWorkspaceStore((state) => state.tablePreferences[tableId]);
  const setPreferences = useWorkspaceStore((state) => state.setTablePreferences);
  const pushColumns = columns.map((column) => column.id);
  const visibleIds = preferences?.visibleColumns?.length ? preferences.visibleColumns : pushColumns;
  const density = preferences?.density ?? "comfortable";
  const sortKey = preferences?.sortKey;
  const sortDir = preferences?.sortDir ?? "asc";
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleColumns = columns.filter((column) => visibleIds.includes(column.id));
  const selectedRows = rows.filter((row) => selectedIds.has(getRowId(row)));
  const allSelected = rows.length > 0 && selectedRows.length === rows.length;
  const partiallySelected = selectedRows.length > 0 && !allSelected;

  const sortedRows = useMemo(() => {
    const sortable = columns.find((column) => column.id === sortKey);
    if (!sortable) return rows;
    return [...rows].sort((a, b) => {
      const left = sortable.accessor?.(a) ?? "";
      const right = sortable.accessor?.(b) ?? "";
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * (sortDir === "asc" ? 1 : -1);
    });
  }, [columns, rows, sortDir, sortKey]);

  function toggleRow(row: T) {
    const id = getRowId(row);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(rows.map(getRowId)));
  }

  function toggleColumn(id: string) {
    const next = visibleIds.includes(id) ? visibleIds.filter((columnId) => columnId !== id) : [...visibleIds, id];
    setPreferences(tableId, { visibleColumns: next.length ? next : [id] });
  }

  function setDensity(densityMode: TableDensity) {
    setPreferences(tableId, { density: densityMode });
  }

  function sort(column: EnterpriseColumn<T>) {
    if (!column.sortable) return;
    setPreferences(tableId, {
      sortKey: column.id,
      sortDir: sortKey === column.id && sortDir === "asc" ? "desc" : "asc",
    });
  }

  function exportRows(format: "csv" | "json") {
    const exportRows = (selectedRows.length ? selectedRows : sortedRows).map((row) =>
      columns.reduce<Record<string, ExportValue>>((acc, column) => {
        acc[column.header] = column.accessor?.(row) ?? "";
        return acc;
      }, {}),
    );
    if (format === "csv") downloadCsv(`${tableId}.csv`, exportRows);
    else downloadJson(`${tableId}.json`, exportRows);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!sortedRows.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) => Math.min(value + 1, sortedRows.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      onRowOpen?.(sortedRows[activeIndex]);
    }
    if (event.key === "Escape") setSelectedIds(new Set());
  }

  const densityClass = density === "compact" ? "px-3 py-2" : density === "spacious" ? "px-5 py-4" : "px-4 py-3";

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-0)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] p-3">
        <div className="mr-auto text-sm text-[var(--muted)]">
          {selectedRows.length ? <span className="font-medium text-foreground">{selectedRows.length} selected</span> : `${rows.length} records`}
        </div>
        {bulkActions.length ? (
          <Dropdown
            align="right"
            trigger={<Button variant="secondary" size="sm" disabled={!selectedRows.length}><SlidersHorizontal className="size-4" /> Bulk actions</Button>}
          >
            {(close) => (
              <div className="grid gap-1">
                {bulkActions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      item.action(selectedRows);
                      setSelectedIds(new Set());
                      close();
                    }}
                    className={cn("rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[var(--surface-1)]", item.tone === "danger" && "text-[var(--badge-danger-fg)]")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </Dropdown>
        ) : null}
        <Dropdown align="right" trigger={<Button variant="secondary" size="sm"><Rows3 className="size-4" /> View</Button>}>
          {() => (
            <div className="grid gap-3 p-1">
              <div>
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Columns</p>
                {columns.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={visibleIds.includes(column.id)}
                    disabled={column.hideable === false}
                    onClick={() => toggleColumn(column.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-[var(--surface-1)] disabled:opacity-50"
                  >
                    <span className="grid size-4 place-items-center rounded border border-[var(--line)]">{visibleIds.includes(column.id) ? <Check className="size-3" /> : null}</span>
                    {column.header}
                  </button>
                ))}
              </div>
              <div className="border-t border-[var(--line)] pt-3">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Density</p>
                {(["compact", "comfortable", "spacious"] as TableDensity[]).map((item) => (
                  <button key={item} type="button" onClick={() => setDensity(item)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm capitalize transition hover:bg-[var(--surface-1)]">
                    {item}
                    {density === item ? <Check className="size-4 text-[var(--accent)]" /> : null}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Dropdown>
        <Dropdown align="right" trigger={<Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>}>
          {(close) => (
            <div className="grid gap-1">
              <button type="button" role="menuitem" onClick={() => { exportRows("csv"); close(); }} className="rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[var(--surface-1)]">Export CSV</button>
              <button type="button" role="menuitem" onClick={() => { exportRows("json"); close(); }} className="rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[var(--surface-1)]">Export JSON</button>
            </div>
          )}
        </Dropdown>
      </div>

      {sortedRows.length ? (
        <div tabIndex={0} onKeyDown={onKeyDown} role="grid" aria-rowcount={sortedRows.length} className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-1)] text-left text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                <tr>
                  <th className={cn("w-10", densityClass)}>
                    <SelectionCheckbox checked={allSelected} indeterminate={partiallySelected} onChange={toggleAll} label="Select all rows" />
                  </th>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      aria-sort={sortKey === column.id ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                      className={cn(densityClass, "font-semibold", column.className)}
                    >
                      <button type="button" disabled={!column.sortable} onClick={() => sort(column)} className="inline-flex items-center gap-1 disabled:cursor-default">
                        {column.header}
                        {column.sortable ? <ArrowDownUp className={cn("size-3", sortKey === column.id && sortDir === "desc" && "rotate-180")} /> : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, index) => {
                  const rowId = getRowId(row);
                  const selected = selectedIds.has(rowId);
                  return (
                    <tr
                      key={rowId}
                      aria-selected={selected}
                      onDoubleClick={() => onRowOpen?.(row)}
                      className={cn("border-b border-[var(--line)] transition last:border-b-0 hover:bg-[var(--surface-1)]", activeIndex === index && "bg-[var(--surface-1)]", selected && "bg-[var(--accent)]/10")}
                    >
                      <td className={densityClass}>
                        <SelectionCheckbox checked={selected} onChange={() => toggleRow(row)} label={`Select row ${rowId}`} />
                      </td>
                      {visibleColumns.map((column) => (
                        <td key={column.id} className={cn(densityClass, "text-foreground/75", column.className)}>
                          <button type="button" onClick={() => onRowOpen?.(row)} className="w-full text-left">
                            {column.render ? column.render(row) : String(column.accessor?.(row) ?? "")}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 p-3 md:hidden">
            {sortedRows.map((row) => {
              const id = getRowId(row);
              const selected = selectedIds.has(id);
              return (
                <div key={id} className={cn("rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-3", selected && "border-[var(--accent)] bg-[var(--accent)]/10")}>
                  {mobileCard ? mobileCard(row, selected, () => toggleRow(row)) : (
                    <button type="button" onClick={() => onRowOpen?.(row)} className="flex w-full items-center justify-between text-left">
                      <span className="font-medium">{id}</span>
                      <ChevronDown className="size-4 text-[var(--muted)]" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6">{empty}</div>
      )}
    </div>
  );
}
