import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../../core/services/role-api.service';
import { BulkImportResult, Nutritionist } from '../../../core/models';
import { BulkUploadComponent, BulkUploadConfig } from '../../../shared/components/bulk-upload/bulk-upload.component';

const emptyForm = () => ({
  name: '', slug: '', title: '', photo: '', bio: '',
  email: '', phone: '',
  specializations: '', certifications: '', languages: '',
  experience: 0, consultationFee: 0,
  online: true, inPerson: false,
});


/** Spreadsheet cells are all strings — turn them into the shapes the API wants. */
function splitList(value: string): string[] {
  // Pipes let a cell contain commas without needing quotes in the sheet.
  return String(value ?? '').split(/[|,]/).map(v => v.trim()).filter(Boolean);
}

function toBool(value: string, fallback: boolean): boolean {
  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return fallback;
  return ['true', 'yes', 'y', '1'].includes(v);
}

function toNutritionistPayload(row: Record<string, string>): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: row['name'] ?? '',
    slug: (row['slug'] ?? '').toLowerCase(),
    title: row['title'] ?? '',
    photo: row['photo'] ?? '',
    bio: row['bio'] ?? '',
    email: row['email'] ?? '',
    phone: row['phone'] ?? '',
    specializations: splitList(row['specializations']),
    certifications: splitList(row['certifications']),
    languages: splitList(row['languages']),
    // Defaults to Online so a blank column still yields a bookable profile.
    consultationModes: splitList(row['consultationModes']).length
      ? splitList(row['consultationModes'])
      : ['Online'],
  };
  if (String(row['experience'] ?? '').trim()) payload['experience'] = Number(row['experience']);
  if (String(row['consultationFee'] ?? '').trim()) payload['consultationFee'] = Number(row['consultationFee']);
  return payload;
}

const HEADER_ALIASES: Record<string, string> = {
  nutritionistname: 'name', fullname: 'name',
  url: 'slug', handle: 'slug',
  role: 'title', designation: 'title',
  contactemail: 'email', emailaddress: 'email',
  contactphone: 'phone', phonenumber: 'phone', mobile: 'phone',
  about: 'bio', description: 'bio',
  years: 'experience', yearsofexperience: 'experience',
  fee: 'consultationFee', consultationfee: 'consultationFee', price: 'consultationFee',
  modes: 'consultationModes', consultationmodes: 'consultationModes', mode: 'consultationModes',
  specialisations: 'specializations', skills: 'specializations',
  certs: 'certifications',
  languagesspoken: 'languages', speaks: 'languages',
  photourl: 'photo', imageurl: 'photo',
};

@Component({
  selector: 'app-admin-nutrition',
  standalone: true,
  imports: [FormsModule, BulkUploadComponent],
  template: `
    <header class="admin-page-head">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="admin-page-title">Nutrition Management</h1>
          <p class="admin-page-sub">Onboard nutritionists so members can find and connect with them.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button (click)="toggleUpload()" class="btn-secondary text-sm">
            {{ showUpload() ? 'Cancel' : '⬆ Bulk Upload' }}
          </button>
          <button (click)="toggleForm()" class="btn-primary text-sm">
            {{ showForm() ? 'Cancel' : '+ Onboard Nutritionist' }}
          </button>
        </div>
      </div>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    @if (showUpload()) {
      <app-bulk-upload [config]="uploadConfig"
                       (completed)="onImported($event)"
                       (failed)="error.set($event)" />
    }

    <div class="admin-stat-grid mb-8">
      <div class="card p-5"><div class="admin-stat-value">{{ people().length }}</div><div class="admin-stat-label">Nutritionists</div></div>
      <div class="card p-5"><div class="admin-stat-value text-primary">{{ activeCount() }}</div><div class="admin-stat-label">Live on site</div></div>
      <div class="card p-5"><div class="admin-stat-value">{{ onlineCount() }}</div><div class="admin-stat-label">Offer online</div></div>
      <div class="card p-5"><div class="admin-stat-value">{{ specialityCount() }}</div><div class="admin-stat-label">Specialisations</div></div>
    </div>

    @if (showForm()) {
      <div class="card p-6 mb-8">
        <h2 class="font-display text-lg font-bold text-white uppercase mb-5">New nutritionist</h2>
        <form (ngSubmit)="save()" #nutForm="ngForm" class="admin-form-grid">
          <label class="admin-field">
            <span>Full name <b>*</b></span>
            <input name="name" [(ngModel)]="form.name" (ngModelChange)="onNameChange($event)"
                   required placeholder="Dr. Anita Rao" class="input-field">
          </label>

          <label class="admin-field">
            <span>Slug <b>*</b></span>
            <input name="slug" [(ngModel)]="form.slug" (ngModelChange)="slugTouched = true"
                   required placeholder="anita-rao" class="input-field">
            <small>Public URL: /nutritionists/{{ form.slug || '…' }}</small>
          </label>

          <label class="admin-field">
            <span>Title</span>
            <input name="title" [(ngModel)]="form.title" placeholder="Sports Nutritionist" class="input-field">
          </label>

          <label class="admin-field">
            <span>Photo URL</span>
            <input name="photo" [(ngModel)]="form.photo" placeholder="https://…" class="input-field">
          </label>

          <label class="admin-field admin-field-wide">
            <span>Bio</span>
            <textarea name="bio" [(ngModel)]="form.bio" rows="2"
                      placeholder="Helps athletes fuel properly…" class="input-field"></textarea>
          </label>

          <label class="admin-field">
            <span>Email</span>
            <input name="email" [(ngModel)]="form.email" placeholder="anita@example.com" class="input-field">
          </label>

          <label class="admin-field">
            <span>Phone</span>
            <input name="phone" [(ngModel)]="form.phone" placeholder="+91 90000 12345" class="input-field">
          </label>

          <label class="admin-field">
            <span>Years of experience</span>
            <input type="number" name="experience" [(ngModel)]="form.experience" min="0" max="70" class="input-field">
          </label>

          <label class="admin-field">
            <span>Consultation fee (₹)</span>
            <input type="number" name="consultationFee" [(ngModel)]="form.consultationFee" min="0" class="input-field">
          </label>

          <label class="admin-field admin-field-wide">
            <span>Specialisations</span>
            <input name="specializations" [(ngModel)]="form.specializations"
                   placeholder="Weight Loss, Sports Nutrition, PCOS, Gut Health" class="input-field">
            <small>Comma separated — members filter by these</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Certifications</span>
            <input name="certifications" [(ngModel)]="form.certifications"
                   placeholder="RD, MSc Nutrition" class="input-field">
            <small>Comma separated</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Languages</span>
            <input name="languages" [(ngModel)]="form.languages"
                   placeholder="English, Hindi, Marathi" class="input-field">
            <small>Comma separated</small>
          </label>

          <div class="admin-field admin-field-wide admin-check-row">
            <label><input type="checkbox" name="online" [(ngModel)]="form.online"> Consults online</label>
            <label><input type="checkbox" name="inPerson" [(ngModel)]="form.inPerson"> Consults in person</label>
          </div>

          <div class="admin-actions">
            <button type="submit" [disabled]="saving() || nutForm.invalid"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {{ saving() ? 'Onboarding…' : 'Onboard Nutritionist' }}
            </button>
            <button type="button" (click)="toggleForm()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading()) {
      <p class="text-gray-400">Loading nutritionists...</p>
    } @else if (people().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">🥗</div>
        <h2 class="font-display text-xl font-bold text-white uppercase mb-2">No nutritionists yet</h2>
        <p class="text-gray-400">Onboard your first nutritionist so members can start connecting.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Nutritionist</th>
              <th class="text-left p-4 text-gray-400 font-medium">Specialisations</th>
              <th class="text-left p-4 text-gray-400 font-medium">Experience</th>
              <th class="text-left p-4 text-gray-400 font-medium">Fee</th>
              <th class="text-left p-4 text-gray-400 font-medium">Modes</th>
              <th class="text-left p-4 text-gray-400 font-medium">Status</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (n of people(); track n.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ n.name }}</div>
                  <div class="text-gray-500 text-xs">{{ n.title || '—' }}</div>
                </td>
                <td class="p-4 text-gray-300">{{ (n.specializations || []).join(', ') || '—' }}</td>
                <td class="p-4 text-gray-300">{{ n.experience ? n.experience + ' yrs' : '—' }}</td>
                <td class="p-4 text-gray-300">{{ n.consultationFee ? '₹' + n.consultationFee : 'Free' }}</td>
                <td class="p-4 text-gray-300">{{ (n.consultationModes || []).join(', ') || '—' }}</td>
                <td class="p-4">
                  <span [class]="'status-pill ' + (n.active !== false ? 'status-pill-active' : 'status-pill-rejected')">
                    {{ n.active !== false ? 'live' : 'hidden' }}
                  </span>
                </td>
                <td class="p-4 text-right whitespace-nowrap">
                  <button (click)="toggle(n)" [disabled]="busy() === n.id"
                          class="btn-secondary text-xs py-1.5 px-3 mr-2 disabled:opacity-50">
                    {{ n.active !== false ? 'Hide' : 'Show' }}
                  </button>
                  <button (click)="remove(n)" [disabled]="busy() === n.id"
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
export class AdminNutritionComponent implements OnInit {
  private api = inject(RoleApiService);

  people = signal<Nutritionist[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  showForm = signal(false);
  showUpload = signal(false);

  /** Everything the shared upload panel needs to import nutritionists. */
  uploadConfig: BulkUploadConfig = {
    label: 'nutritionists',
    singular: 'nutritionist',
    templateFile: 'ironfit-nutritionist-import-template.csv',
    templateHeaders: ['name','slug','title','email','phone','bio','experience','consultationFee','consultationModes','specializations','certifications','languages'],
    templateSample: ['Dr. Anita Rao','anita-rao','Sports Nutritionist','anita@example.com','+91 90000 12345','Helps athletes fuel properly.','8','1200','Online | In-person','Weight Loss | PCOS','RD | MSc Nutrition','English | Hindi'],
    headerAliases: HEADER_ALIASES,
    mapRow: toNutritionistPayload,
    submit: (rows, dryRun) => this.api.bulkCreateNutritionists(rows, dryRun),
  };

  toggleUpload() {
    this.showUpload.update(v => !v);
  }

  async onImported(result: BulkImportResult) {
    const skipped = result.duplicates + result.invalid;
    this.notice.set(
      `Imported ${result.created} nutritionist${result.created === 1 ? '' : 's'}` +
      (skipped > 0 ? ` — ${skipped} row(s) skipped.` : '.'),
    );
    await this.reload();
  }
  saving = signal(false);
  form = emptyForm();
  slugTouched = false;

  activeCount = computed(() => this.people().filter(n => n.active !== false).length);
  onlineCount = computed(() => this.people().filter(n => n.consultationModes?.includes('Online')).length);
  specialityCount = computed(() =>
    new Set(this.people().flatMap(n => n.specializations ?? [])).size);

  async ngOnInit() {
    await this.reload();
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.form = emptyForm();
      this.slugTouched = false;
    }
  }

  onNameChange(name: string) {
    if (!this.slugTouched) this.form.slug = this.slugify(name);
  }

  private slugify(v: string) {
    return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  private async reload() {
    this.loading.set(true);
    try {
      this.people.set(await this.api.getAllNutritionists());
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load nutritionists.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  async save() {
    this.saving.set(true);
    this.error.set('');
    this.notice.set('');
    const f = this.form;

    const modes: string[] = [];
    if (f.online) modes.push('Online');
    if (f.inPerson) modes.push('In-person');

    try {
      await this.api.createNutritionist({
        name: f.name.trim(),
        slug: this.slugify(f.slug),
        title: f.title.trim(),
        photo: f.photo.trim(),
        bio: f.bio.trim(),
        email: f.email.trim(),
        phone: f.phone.trim(),
        // Sent as comma strings; the API splits and trims them.
        specializations: f.specializations,
        certifications: f.certifications,
        languages: f.languages,
        experience: Number(f.experience) || 0,
        consultationFee: Number(f.consultationFee) || 0,
        consultationModes: modes,
      } as any);

      this.notice.set(`${f.name} onboarded.`);
      this.showForm.set(false);
      this.form = emptyForm();
      this.slugTouched = false;
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not onboard the nutritionist.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(n: Nutritionist) {
    this.busy.set(n.id);
    try {
      const res = await this.api.toggleNutritionist(n.id);
      this.notice.set(`${n.name} is now ${res.active ? 'visible' : 'hidden'} on the site.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not update.');
    } finally {
      this.busy.set(null);
    }
  }

  async remove(n: Nutritionist) {
    if (!confirm(`Remove ${n.name}? This cannot be undone.`)) return;
    this.busy.set(n.id);
    try {
      await this.api.deleteNutritionist(n.id);
      this.notice.set(`${n.name} removed.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Delete failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
