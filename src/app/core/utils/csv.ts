/**
 * Minimal RFC 4180 CSV reader.
 *
 * Written by hand rather than pulled from a library because the only hard part
 * is quoting, and splitting on commas quietly corrupts any row with an address
 * like "123 Fitness Ave, Pune" — which is most of them.
 */

/** Splits CSV text into rows of raw cells, honouring quotes and escaped quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  // Normalise line endings so Windows exports behave like everything else.
  const src = text.replace(/\r\n?/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const char = src[i];

    if (inQuotes) {
      if (char === '"') {
        // "" inside a quoted field is a literal quote.
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') { inQuotes = true; continue; }
    if (char === ',') { row.push(field); field = ''; continue; }
    if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += char;
  }

  // Flush whatever the file ended on, unless it ended on a clean newline.
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  // Drop blank lines — trailing newlines are extremely common in exports.
  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

/**
 * Parses CSV into objects keyed by the header row.
 *
 * Headers are matched case-insensitively and ignore spaces/underscores, so
 * "Gym Name", "gym_name" and "gymname" all land on the same field.
 */
export function parseCsvToObjects(
  text: string,
  headerAliases: Record<string, string> = {},
): { rows: Record<string, string>[]; headers: string[]; error?: string } {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], headers: [], error: 'The file is empty' };
  if (table.length === 1) return { rows: [], headers: table[0], error: 'The file has a header row but no data' };

  const normalise = (h: string) => h.trim().toLowerCase().replace(/[\s_-]/g, '');
  const headers = table[0].map(h => h.trim());

  const keys = headers.map(h => {
    const key = normalise(h);
    return headerAliases[key] ?? key;
  });

  const rows = table.slice(1).map(cells => {
    const obj: Record<string, string> = {};
    keys.forEach((key, i) => { obj[key] = (cells[i] ?? '').trim(); });
    return obj;
  });

  return { rows, headers };
}

/** Builds a CSV file from rows, quoting only where it is actually needed. */
export function toCsv(headers: string[], rows: string[][]): string {
  const cell = (v: string) =>
    /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  return [headers, ...rows].map(r => r.map(cell).join(',')).join('\n');
}

/** Triggers a browser download without needing a server round-trip. */
export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
