import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { BulkImportResult, BulkRowStatus } from '../../../core/models';
import { parseCsvToObjects, toCsv, downloadCsv } from '../../../core/utils/csv';

/**
 * Everything that differs between a gym, trainer and nutritionist import.
 * The panel itself — file picking, preview, confirm, result — is identical.
 */
export interface BulkUploadConfig {
  /** Plural noun shown to the admin, e.g. "gyms". */
  label: string;
  /** Singular noun for the import button, e.g. "gym". */
  singular: string;
  templateFile: string;
  templateHeaders: string[];
  /** One filled example row, so the expected format is obvious. */
  templateSample: string[];
  /** Loose header spellings mapped to API field names. */
  headerAliases: Record<string, string>;
  /** Turns one CSV row into the payload the API expects. */
  mapRow: (row: Record<string, string>) => Record<string, unknown>;
  /** Calls the matching bulk endpoint. */
  submit: (rows: Record<string, unknown>[], dryRun: boolean) => Promise<BulkImportResult>;
}

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  template: `
    <div class="card p-6 mb-8">
      <div class="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 class="font-display text-lg font-bold text-white uppercase">Bulk upload {{ config.label }}</h2>
          <p class="admin-page-sub">Upload a CSV to add many {{ config.label }} at once. Up to {{ limit }} rows.</p>
        </div>
        <button type="button" (click)="downloadTemplate()" class="btn-secondary text-sm">
          ⬇ Download template
        </button>
      </div>

      <label class="csv-drop">
        <input type="file" accept=".csv,text/csv" (change)="onFileSelected($event)" hidden>
        <span class="text-3xl">📄</span>
        <span class="csv-drop-title">{{ fileName() || 'Choose a CSV file' }}</span>
        <span class="csv-drop-hint">
          Required columns: <code>name</code> and <code>slug</code>. Everything else is optional.
        </span>
      </label>

      @if (parseError()) {
        <div class="admin-error mt-4">{{ parseError() }}</div>
      }

      @if (preview(); as p) {
        <div class="bulk-summary">
          <div class="bulk-stat"><span class="bulk-stat-value">{{ p.total }}</span><span>rows</span></div>
          <div class="bulk-stat bulk-stat-ok"><span class="bulk-stat-value">{{ p.valid ?? p.created }}</span><span>ready</span></div>
          <div class="bulk-stat bulk-stat-warn"><span class="bulk-stat-value">{{ p.duplicates }}</span><span>duplicates</span></div>
          <div class="bulk-stat bulk-stat-bad"><span class="bulk-stat-value">{{ p.invalid }}</span><span>invalid</span></div>
        </div>

        @if (p.invalid > 0 || p.duplicates > 0) {
          <p class="text-gray-400 text-sm mb-3">Rows with a problem are skipped — the rest still import.</p>
        }

        <div class="card overflow-x-auto mb-5">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-dark-500">
                <th class="text-left p-3 text-gray-400 font-medium">Row</th>
                <th class="text-left p-3 text-gray-400 font-medium">Name</th>
                <th class="text-left p-3 text-gray-400 font-medium">Slug</th>
                <th class="text-left p-3 text-gray-400 font-medium">Status</th>
                <th class="text-left p-3 text-gray-400 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              @for (r of p.results; track r.row) {
                <tr class="border-b border-dark-600">
                  <td class="p-3 text-gray-500">{{ r.row }}</td>
                  <td class="p-3 text-white">{{ r.name || '—' }}</td>
                  <td class="p-3 text-gray-300">{{ r.slug || '—' }}</td>
                  <td class="p-3"><span [class]="'status-pill ' + statusClass(r.status)">{{ r.status }}</span></td>
                  <td class="p-3 text-gray-400">{{ r.error || '' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="admin-actions">
          @if (!finished()) {
            <button type="button" (click)="runImport()"
                    [disabled]="importing() || (p.valid ?? 0) === 0"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {{ importing()
                  ? 'Importing…'
                  : 'Import ' + (p.valid ?? 0) + ' ' + config.singular + ((p.valid ?? 0) === 1 ? '' : 's') }}
            </button>
          }
          <button type="button" (click)="reset()" class="btn-secondary">
            {{ finished() ? 'Upload another' : 'Clear' }}
          </button>
        </div>
      }
    </div>
  `,
})
export class BulkUploadComponent {
  @Input({ required: true }) config!: BulkUploadConfig;
  /** Emits the finished result so the host can refresh its list and show a notice. */
  @Output() completed = new EventEmitter<BulkImportResult>();
  @Output() failed = new EventEmitter<string>();

  /** Mirrors the server cap so the hint matches what the API will accept. */
  limit = 200;

  fileName = signal('');
  parseError = signal('');
  preview = signal<BulkImportResult | null>(null);
  importing = signal(false);
  finished = signal(false);

  /** Parsed rows held back until the admin confirms the previewed import. */
  private pendingRows: Record<string, unknown>[] = [];

  reset() {
    this.fileName.set('');
    this.parseError.set('');
    this.preview.set(null);
    this.finished.set(false);
    this.pendingRows = [];
  }

  statusClass(status: BulkRowStatus) {
    if (status === 'created' || status === 'valid') return 'status-pill-active';
    if (status === 'duplicate') return 'status-pill-pending';
    return 'status-pill-rejected';
  }

  downloadTemplate() {
    downloadCsv(this.config.templateFile, toCsv(this.config.templateHeaders, [this.config.templateSample]));
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.reset();
    this.fileName.set(file.name);

    try {
      const text = await file.text();
      const { rows, error } = parseCsvToObjects(text, this.config.headerAliases);
      if (error) { this.parseError.set(error); return; }
      if (rows.length === 0) { this.parseError.set('No data rows found'); return; }
      if (!('name' in rows[0]) || !('slug' in rows[0])) {
        this.parseError.set('The file needs at least a "name" and a "slug" column');
        return;
      }

      this.pendingRows = rows.map(this.config.mapRow);

      // Let the server judge the rows, so the preview uses exactly the same
      // rules as the real import rather than a second copy that can drift.
      this.preview.set(await this.config.submit(this.pendingRows, true));
    } catch (e: any) {
      this.parseError.set(e?.message ?? 'Could not read that file.');
    } finally {
      // Lets the same file be re-selected after a fix.
      input.value = '';
    }
  }

  async runImport() {
    this.importing.set(true);
    try {
      const result = await this.config.submit(this.pendingRows, false);
      this.preview.set(result);
      this.finished.set(true);
      this.completed.emit(result);
    } catch (e: any) {
      this.failed.emit(e?.message ?? 'Import failed.');
    } finally {
      this.importing.set(false);
    }
  }
}
