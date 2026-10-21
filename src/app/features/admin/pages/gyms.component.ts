import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../../core/services/role-api.service';
import { BulkGymResult, BulkRowStatus, Gym } from '../../../core/models';
import { parseCsvToObjects, toCsv, downloadCsv } from '../../../core/utils/csv';

/** Blank form state, also used to reset after a successful save. */
const emptyForm = () => ({
  name: '', slug: '', description: '',
  city: '', location: '', address: '',
  price: null as number | null,
  email: '', phone: '', whatsapp: '', image: '',
  amenities: '', facilities: '', tags: '',
  featured: false, openNow: true,
});

/** Mirrors the server's cap so the UI can warn before an upload is rejected. */
const BULK_LIMIT = 200;

/**
 * Spreadsheet headers people actually type, mapped to the field names the API
 * expects. Keys are already lower-cased with spaces/underscores stripped.
 */
const HEADER_ALIASES: Record<string, string> = {
  gymname: 'name', title: 'name',
  url: 'slug', urlslug: 'slug', handle: 'slug',
  about: 'description', summary: 'description',
  area: 'location', locality: 'location', neighbourhood: 'location', neighborhood: 'location',
  town: 'city',
  monthlyprice: 'price', pricepermonth: 'price', fee: 'price', monthlyfee: 'price',
  contactemail: 'email', emailaddress: 'email',
  contactphone: 'phone', phonenumber: 'phone', mobile: 'phone',
  whatsappnumber: 'whatsapp',
  imageurl: 'image', coverimage: 'image', photo: 'image',
  isfeatured: 'featured',
  open: 'openNow', opennow: 'openNow', currentlyopen: 'openNow',
};

/** Spreadsheet cells are all strings — turn them into the shapes the API wants. */
function splitList(value: string): string[] {
  // Pipes let a cell contain commas without needing quotes in the sheet.
  return String(value ?? '')
    .split(/[|,]/)
    .map(v => v.trim())
    .filter(Boolean);
}

function toBool(value: string, fallback: boolean): boolean {
  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return fallback;
  return ['true', 'yes', 'y', '1'].includes(v);
}

function toGymPayload(row: Record<string, string>): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: row['name'] ?? '',
    slug: (row['slug'] ?? '').toLowerCase(),
    description: row['description'] ?? '',
    city: row['city'] ?? '',
    location: row['location'] ?? '',
    address: row['address'] ?? '',
    email: row['email'] ?? '',
    phone: row['phone'] ?? '',
    whatsapp: row['whatsapp'] ?? '',
    amenities: splitList(row['amenities']),
    facilities: splitList(row['facilities']),
    tags: splitList(row['tags']),
    featured: toBool(row['featured'], false),
    openNow: toBool(row['openNow'], true),
  };

  // Only send price when the cell had something, so a blank does not become 0
  // and silently show as "₹0/mo".
  if (String(row['price'] ?? '').trim()) payload['price'] = Number(row['price']);
  // The model stores an array; a sheet realistically carries one cover image.
  if (String(row['image'] ?? '').trim()) payload['images'] = [row['image'].trim()];

  return payload;
}

@Component({
  selector: 'app-admin-gyms',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-page-head">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="admin-page-title">Gym Management</h1>
          <p class="admin-page-sub">Every listing on the platform. {{ gyms().length }} total.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button (click)="toggleUpload()" class="btn-secondary text-sm">
            {{ showUpload() ? 'Cancel' : '⬆ Bulk Upload' }}
          </button>
          <button (click)="toggleForm()" class="btn-primary text-sm">
            {{ showForm() ? 'Cancel' : '+ Add Gym' }}
          </button>
        </div>
      </div>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    @if (showUpload()) {
      <div class="card p-6 mb-8">
        <div class="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 class="font-display text-lg font-bold text-white uppercase">Bulk upload gyms</h2>
            <p class="admin-page-sub">Upload a CSV to add many gyms at once. Up to {{ bulkLimit }} rows.</p>
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
            <p class="text-gray-400 text-sm mb-3">
              Rows with a problem are skipped — the rest still import.
            </p>
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
            @if (!imported()) {
              <button type="button" (click)="runImport()"
                      [disabled]="importing() || (p.valid ?? 0) === 0"
                      class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {{ importing() ? 'Importing…' : 'Import ' + (p.valid ?? 0) + ' gym' + ((p.valid ?? 0) === 1 ? '' : 's') }}
              </button>
            }
            <button type="button" (click)="resetUpload()" class="btn-secondary">
              {{ imported() ? 'Upload another' : 'Clear' }}
            </button>
          </div>
        }
      </div>
    }

    @if (showForm()) {
      <div class="card p-6 mb-8">
        <h2 class="font-display text-lg font-bold text-white uppercase mb-5">New gym</h2>

        <form (ngSubmit)="save()" #gymForm="ngForm" class="admin-form-grid">
          <label class="admin-field">
            <span>Name <b>*</b></span>
            <input name="name" [(ngModel)]="form.name" (ngModelChange)="onNameChange($event)"
                   required placeholder="Iron Beast Gym" class="input-field">
          </label>

          <label class="admin-field">
            <span>Slug <b>*</b></span>
            <input name="slug" [(ngModel)]="form.slug" (ngModelChange)="slugTouched = true"
                   required placeholder="iron-beast-gym" class="input-field">
            <small>Public URL: /gyms/{{ form.slug || '…' }}</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Description</span>
            <textarea name="description" [(ngModel)]="form.description" rows="2"
                      placeholder="Premium fitness facility with…" class="input-field"></textarea>
          </label>

          <label class="admin-field">
            <span>City</span>
            <input name="city" [(ngModel)]="form.city" placeholder="New York" class="input-field">
          </label>

          <label class="admin-field">
            <span>Area / locality</span>
            <input name="location" [(ngModel)]="form.location" placeholder="Downtown" class="input-field">
          </label>

          <label class="admin-field admin-field-wide">
            <span>Address</span>
            <input name="address" [(ngModel)]="form.address"
                   placeholder="123 Fitness Ave, Manhattan, NY 10001" class="input-field">
          </label>

          <label class="admin-field">
            <span>Price per month (₹)</span>
            <input type="number" name="price" [(ngModel)]="form.price" min="0"
                   placeholder="3999" class="input-field">
          </label>

          <label class="admin-field">
            <span>Contact email</span>
            <input type="email" name="email" [(ngModel)]="form.email"
                   placeholder="owner@irongym.com" class="input-field">
            <small>Enquiries for this gym are emailed here</small>
          </label>

          <label class="admin-field">
            <span>Phone</span>
            <input name="phone" [(ngModel)]="form.phone" placeholder="+91 98765 43210" class="input-field">
          </label>

          <label class="admin-field">
            <span>WhatsApp</span>
            <input name="whatsapp" [(ngModel)]="form.whatsapp" placeholder="+919876543210" class="input-field">
          </label>

          <label class="admin-field">
            <span>Cover image URL</span>
            <input name="image" [(ngModel)]="form.image" placeholder="https://…" class="input-field">
          </label>

          <label class="admin-field admin-field-wide">
            <span>Amenities</span>
            <input name="amenities" [(ngModel)]="form.amenities"
                   placeholder="Locker Rooms, Showers, Parking, WiFi" class="input-field">
            <small>Comma separated</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Facilities</span>
            <input name="facilities" [(ngModel)]="form.facilities"
                   placeholder="Cardio Zone, Free Weights, Pool" class="input-field">
            <small>Comma separated</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Tags</span>
            <input name="tags" [(ngModel)]="form.tags"
                   placeholder="CrossFit, Personal Training, Yoga" class="input-field">
            <small>Comma separated — used by the filters on /gyms</small>
          </label>

          <div class="admin-field admin-field-wide admin-check-row">
            <label><input type="checkbox" name="featured" [(ngModel)]="form.featured"> Featured on the homepage</label>
            <label><input type="checkbox" name="openNow" [(ngModel)]="form.openNow"> Currently open</label>
          </div>

          <div class="admin-actions">
            <button type="submit" [disabled]="saving() || gymForm.invalid"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {{ saving() ? 'Saving…' : 'Create Gym' }}
            </button>
            <button type="button" (click)="toggleForm()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading()) {
      <p class="text-gray-400">Loading gyms...</p>
    } @else if (gyms().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">🏗️</div>
        <p class="text-gray-400">No gyms found in the database.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Gym</th>
              <th class="text-left p-4 text-gray-400 font-medium">City</th>
              <th class="text-left p-4 text-gray-400 font-medium">Price</th>
              <th class="text-left p-4 text-gray-400 font-medium">Featured</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (g of gyms(); track g.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ g.name }}</div>
                  <div class="text-gray-500 text-xs">{{ g.location }}</div>
                </td>
                <td class="p-4 text-gray-300">{{ g.city }}</td>
                <td class="p-4 text-gray-300">{{ g.priceLabel }}</td>
                <td class="p-4">
                  <button (click)="toggleFeatured(g)" [disabled]="busy() === g.id"
                          [class]="g.featured ? 'status-pill status-pill-active' : 'status-pill status-pill-pending'">
                    {{ g.featured ? 'featured' : 'standard' }}
                  </button>
                </td>
                <td class="p-4 text-right">
                  <button (click)="remove(g)" [disabled]="busy() === g.id"
                          class="admin-danger-btn">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminGymsComponent implements OnInit {
  private api = inject(RoleApiService);

  gyms = signal<Gym[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  showForm = signal(false);
  saving = signal(false);
  form = emptyForm();
  /** Stops the auto-slug from clobbering a slug the admin typed themselves. */
  slugTouched = false;

  // ── Bulk upload ──
  bulkLimit = BULK_LIMIT;
  showUpload = signal(false);
  fileName = signal('');
  parseError = signal('');
  preview = signal<BulkGymResult | null>(null);
  importing = signal(false);
  imported = signal(false);
  /** Parsed rows held back until the admin confirms the previewed import. */
  private pendingRows: Record<string, unknown>[] = [];

  async ngOnInit() {
    await this.reload();
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.resetForm();
  }

  toggleUpload() {
    this.showUpload.update(v => !v);
    if (!this.showUpload()) this.resetUpload();
  }

  resetUpload() {
    this.fileName.set('');
    this.parseError.set('');
    this.preview.set(null);
    this.imported.set(false);
    this.pendingRows = [];
  }

  statusClass(status: BulkRowStatus) {
    if (status === 'created' || status === 'valid') return 'status-pill-active';
    if (status === 'duplicate') return 'status-pill-pending';
    return 'status-pill-rejected';
  }

  downloadTemplate() {
    const headers = [
      'name', 'slug', 'description', 'city', 'location', 'address',
      'price', 'email', 'phone', 'whatsapp', 'image',
      'amenities', 'facilities', 'tags', 'featured', 'openNow',
    ];
    const sample = [
      'Iron Beast Gym', 'iron-beast-gym', 'Premium facility with expert trainers.',
      'Pune', 'Baner', '123 Fitness Ave, Baner, Pune 411045',
      '3999', 'owner@ironbeast.com', '+91 98765 43210', '+919876543210',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'Locker Rooms | Showers | Parking', 'Cardio Zone | Free Weights', 'CrossFit | Yoga',
      'true', 'true',
    ];
    downloadCsv('ironfit-gym-import-template.csv', toCsv(headers, [sample]));
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.resetUpload();
    this.fileName.set(file.name);

    try {
      const text = await file.text();
      const { rows, error } = parseCsvToObjects(text, HEADER_ALIASES);
      if (error) { this.parseError.set(error); return; }

      const missing = rows.findIndex(r => !r['name'] || !r['slug']);
      if (rows.length === 0) { this.parseError.set('No data rows found'); return; }
      if (!('name' in rows[0]) || !('slug' in rows[0])) {
        this.parseError.set('The file needs at least a "name" and a "slug" column');
        return;
      }
      void missing; // per-row problems are reported by the dry run, not here

      this.pendingRows = rows.map(toGymPayload);

      // Let the server judge the rows, so the preview uses exactly the same
      // rules as the real import rather than a second copy that can drift.
      this.preview.set(await this.api.bulkCreateGyms(this.pendingRows, true));
    } catch (e: any) {
      this.parseError.set(e?.message ?? 'Could not read that file.');
    } finally {
      // Lets the same file be re-selected after a fix.
      input.value = '';
    }
  }

  async runImport() {
    this.importing.set(true);
    this.error.set('');
    try {
      const result = await this.api.bulkCreateGyms(this.pendingRows, false);
      this.preview.set(result);
      this.imported.set(true);
      this.notice.set(
        `Imported ${result.created} gym${result.created === 1 ? '' : 's'}` +
        (result.duplicates + result.invalid > 0
          ? ` — ${result.duplicates + result.invalid} row(s) skipped.`
          : '.'),
      );
      await this.reload();
    } catch (e: any) {
      this.error.set(e?.message ?? 'Import failed.');
    } finally {
      this.importing.set(false);
    }
  }

  private resetForm() {
    this.form = emptyForm();
    this.slugTouched = false;
  }

  onNameChange(name: string) {
    if (!this.slugTouched) this.form.slug = this.slugify(name);
  }

  private slugify(value: string) {
    return value.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private toList(value: string): string[] {
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }

  async save() {
    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    const f = this.form;
    try {
      await this.api.createGym({
        name: f.name.trim(),
        slug: this.slugify(f.slug),
        description: f.description.trim(),
        city: f.city.trim(),
        location: f.location.trim(),
        address: f.address.trim(),
        price: Number(f.price) || 0,
        email: f.email.trim(),
        phone: f.phone.trim(),
        whatsapp: f.whatsapp.trim(),
        images: f.image.trim() ? [f.image.trim()] : [],
        amenities: this.toList(f.amenities),
        facilities: this.toList(f.facilities),
        tags: this.toList(f.tags),
        featured: f.featured,
        openNow: f.openNow,
      });

      this.notice.set(`${f.name} was created.`);
      this.showForm.set(false);
      this.resetForm();
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not create the gym.');
    } finally {
      this.saving.set(false);
    }
  }

  private async reload() {
    this.loading.set(true);
    try {
      this.gyms.set(await this.api.getGyms());
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load gyms.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleFeatured(gym: Gym) {
    this.busy.set(gym.id);
    try {
      await this.api.updateGym(gym.id, { featured: !gym.featured });
      this.notice.set(`${gym.name} is now ${!gym.featured ? 'featured' : 'standard'}.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Update failed.');
    } finally {
      this.busy.set(null);
    }
  }

  async remove(gym: Gym) {
    if (!confirm(`Delete "${gym.name}"? This cannot be undone.`)) return;
    this.busy.set(gym.id);
    try {
      await this.api.deleteGym(gym.id);
      this.notice.set(`${gym.name} was deleted.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Delete failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
