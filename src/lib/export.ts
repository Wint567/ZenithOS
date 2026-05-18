type ExportCell = string | number | boolean | null | undefined;

export function downloadCsv(filename: string, rows: Array<Record<string, ExportCell>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: ExportCell) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header] ?? "")).join(","))].join("\n");
  downloadBlob(filename, csv, "text/csv;charset=utf-8");
}

export function downloadJson(filename: string, value: unknown) {
  downloadBlob(filename, JSON.stringify(value, null, 2), "application/json;charset=utf-8");
}

function downloadBlob(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
