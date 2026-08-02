import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../../core/services/role-api.service';
import { Gym, Trainer } from '../../../core/models';

const emptyForm = () => ({
  name: '', slug: '', title: '', photo: '', bio: '',
  specializations: '', certifications: '', timings: '',
  experience: 0,
  freelance: true,
  monthlyRate: null as number | null,
  gymIds: [] as string[],
});

@Component({
  selector: 'app-admin-trainers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-page-head">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="admin-page-title">Trainer Management</h1>
          <p class="admin-page-sub">Onboard freelance trainers who work out of your partner gyms.</p>
        </div>
        <button (click)="toggleForm()" class="btn-primary text-sm">
          {{ showForm() ? 'Cancel' : '+ Onboard Trainer' }}
        </button>
      </div>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    <div class="admin-stat-grid mb-8">
      <div class="card p-5"><div class="admin-stat-value">{{ trainers().length }}</div><div class="admin-stat-label">Trainers</div></div>
      <div class="card p-5"><div class="admin-stat-value text-primary">{{ freelanceCount() }}</div><div class="admin-stat-label">Freelance</div></div>
      <div class="card p-5"><div class="admin-stat-value">{{ inHouseCount() }}</div><div class="admin-stat-label">In-house</div></div>
      <div class="card p-5"><div class="admin-stat-value">{{ avgRate() }}</div><div class="admin-stat-label">Avg monthly rate</div></div>
    </div>

    @if (showForm()) {
      <div class="card p-6 mb-8">
        <h2 class="font-display text-lg font-bold text-white uppercase mb-5">New trainer</h2>
        <form (ngSubmit)="save()" #tForm="ngForm" class="admin-form-grid">
          <label class="admin-field">
            <span>Full name <b>*</b></span>
            <input name="name" [(ngModel)]="form.name" (ngModelChange)="onNameChange($event)"
                   required placeholder="Kabir Sethi" class="input-field">
          </label>

          <label class="admin-field">
            <span>Slug <b>*</b></span>
            <input name="slug" [(ngModel)]="form.slug" (ngModelChange)="slugTouched = true"
                   required placeholder="kabir-sethi" class="input-field">
            <small>Public URL: /trainers/{{ form.slug || '…' }}</small>
          </label>

          <label class="admin-field">
            <span>Title</span>
            <input name="title" [(ngModel)]="form.title" placeholder="Freelance Strength Coach" class="input-field">
          </label>

          <label class="admin-field">
            <span>Photo URL</span>
            <input name="photo" [(ngModel)]="form.photo" placeholder="https://…" class="input-field">
          </label>

          <label class="admin-field admin-field-wide">
            <span>Bio</span>
            <textarea name="bio" [(ngModel)]="form.bio" rows="2"
                      placeholder="Independent coach available at partner gyms…" class="input-field"></textarea>
          </label>

          <div class="admin-field admin-field-wide admin-check-row">
            <label><input type="checkbox" name="freelance" [(ngModel)]="form.freelance"> Freelance trainer</label>
          </div>

          <label class="admin-field">
            <span>
              Monthly rate (₹)
              @if (form.freelance) { <b>*</b> }
            </span>
            <input type="number" name="monthlyRate" [(ngModel)]="form.monthlyRate"
                   [required]="form.freelance" min="1" placeholder="8000" class="input-field">
            <small>Shown on the trainer's public card</small>
          </label>

          <label class="admin-field">
            <span>Years of experience</span>
            <input type="number" name="experience" [(ngModel)]="form.experience" min="0" max="70" class="input-field">
          </label>

          <div class="admin-field admin-field-wide">
            <span>Trains at</span>
            @if (gyms().length === 0) {
              <small>No gyms available to link.</small>
            } @else {
              <div class="admin-gym-picker">
                @for (g of gyms(); track g.id) {
                  <label>
                    <input type="checkbox" [checked]="form.gymIds.includes(g.id)"
                           (change)="toggleGym(g.id)"> {{ g.name }}
                  </label>
                }
              </div>
            }
          </div>

          <label class="admin-field admin-field-wide">
            <span>Specialisations</span>
            <input name="specializations" [(ngModel)]="form.specializations"
                   placeholder="Strength Training, Powerlifting, CrossFit" class="input-field">
            <small>Comma separated — members filter by these</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Certifications</span>
            <input name="certifications" [(ngModel)]="form.certifications"
                   placeholder="NASM-CPT, CSCS" class="input-field">
            <small>Comma separated</small>
          </label>

          <label class="admin-field admin-field-wide">
            <span>Availability</span>
            <input name="timings" [(ngModel)]="form.timings"
                   placeholder="Mon-Fri 6am-10am, Sat 7am-11am" class="input-field">
            <small>Comma separated</small>
          </label>

          <div class="admin-actions">
            <button type="submit" [disabled]="saving() || tForm.invalid"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {{ saving() ? 'Onboarding…' : 'Onboard Trainer' }}
            </button>
            <button type="button" (click)="toggleForm()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading()) {
      <p class="text-gray-400">Loading trainers...</p>
    } @else if (trainers().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">💪</div>
        <h2 class="font-display text-xl font-bold text-white uppercase mb-2">No trainers yet</h2>
        <p class="text-gray-400">Onboard your first freelance trainer to get started.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Trainer</th>
              <th class="text-left p-4 text-gray-400 font-medium">Type</th>
              <th class="text-left p-4 text-gray-400 font-medium">Monthly</th>
              <th class="text-left p-4 text-gray-400 font-medium">Trains at</th>
              <th class="text-left p-4 text-gray-400 font-medium">Status</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (t of trainers(); track t.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ t.name }}</div>
                  <div class="text-gray-500 text-xs">{{ t.title || '—' }}</div>
                </td>
                <td class="p-4">
                  <span [class]="'status-pill ' + (t.freelance ? 'status-pill-pending' : 'status-pill-active')">
                    {{ t.freelance ? 'freelance' : 'in-house' }}
                  </span>
                </td>
                <td class="p-4 text-white font-semibold">{{ rateLabel(t) }}</td>
                <td class="p-4 text-gray-300">{{ gymList(t) }}</td>
                <td class="p-4">
                  <span [class]="'status-pill ' + (t.active !== false ? 'status-pill-active' : 'status-pill-rejected')">
                    {{ t.active !== false ? 'live' : 'hidden' }}
                  </span>
                </td>
                <td class="p-4 text-right whitespace-nowrap">
                  <button (click)="toggle(t)" [disabled]="busy() === t.id"
                          class="btn-secondary text-xs py-1.5 px-3 mr-2 disabled:opacity-50">
                    {{ t.active !== false ? 'Hide' : 'Show' }}
                  </button>
                  <button (click)="remove(t)" [disabled]="busy() === t.id"
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
export class AdminTrainersComponent implements OnInit {
  private api = inject(RoleApiService);

  trainers = signal<Trainer[]>([]);
  gyms = signal<Gym[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  showForm = signal(false);
  saving = signal(false);
  form = emptyForm();
  slugTouched = false;

  freelanceCount = computed(() => this.trainers().filter(t => t.freelance).length);
  inHouseCount = computed(() => this.trainers().filter(t => !t.freelance).length);
  avgRate = computed(() => {
    const rates = this.trainers().filter(t => t.freelance && t.monthlyRate).map(t => t.monthlyRate!);
    if (!rates.length) return '—';
    return '₹' + Math.round(rates.reduce((a, b) => a + b, 0) / rates.length).toLocaleString('en-IN');
  });

  async ngOnInit() {
    await this.reload();
  }

  rateLabel(t: Trainer) {
    return t.monthlyRate ? `₹${t.monthlyRate.toLocaleString('en-IN')}/mo` : '—';
  }

  gymList(t: Trainer) {
    if (t.gyms?.length) return t.gyms.map(g => g.name).join(', ');
    return t.gymName || '—';
  }

  toggleGym(id: string) {
    this.form.gymIds = this.form.gymIds.includes(id)
      ? this.form.gymIds.filter(g => g !== id)
      : [...this.form.gymIds, id];
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
      const [trainers, gyms] = await Promise.all([
        this.api.getAllTrainers(),
        this.api.getGyms().catch(() => [] as Gym[]),
      ]);
      this.trainers.set(trainers);
      this.gyms.set(gyms);
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load trainers.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  async save() {
    this.saving.set(true);
    this.error.set('');
    this.notice.set('');
    const f = this.form;
    try {
      await this.api.createTrainer({
        name: f.name.trim(),
        slug: this.slugify(f.slug),
        title: f.title.trim(),
        photo: f.photo.trim(),
        bio: f.bio.trim(),
        specializations: f.specializations,
        certifications: f.certifications,
        timings: f.timings,
        experience: Number(f.experience) || 0,
        freelance: f.freelance,
        monthlyRate: Number(f.monthlyRate) || 0,
        // Names are sent with ids so the public card can show them without
        // a second lookup per trainer.
        gyms: f.gymIds.map(id => ({ id, name: this.gyms().find(g => g.id === id)?.name ?? '' })),
      });

      this.notice.set(`${f.name} onboarded.`);
      this.showForm.set(false);
      this.form = emptyForm();
      this.slugTouched = false;
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not onboard the trainer.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(t: Trainer) {
    this.busy.set(t.id);
    try {
      const res = await this.api.toggleTrainer(t.id);
      this.notice.set(`${t.name} is now ${res.active ? 'visible' : 'hidden'} on the site.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not update.');
    } finally {
      this.busy.set(null);
    }
  }

  async remove(t: Trainer) {
    if (!confirm(`Remove ${t.name}? This cannot be undone.`)) return;
    this.busy.set(t.id);
    try {
      await this.api.deleteTrainer(t.id);
      this.notice.set(`${t.name} removed.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Delete failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
