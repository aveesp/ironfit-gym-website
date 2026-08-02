import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../../core/services/role-api.service';
import { Gym, Offer, OfferScope, OfferType } from '../../../core/models';

const emptyForm = () => ({
  code: '', title: '', description: '',
  type: 'percentage' as OfferType,
  value: null as number | null,
  scope: 'sitewide' as OfferScope,
  gymId: '',
  validFrom: new Date().toISOString().slice(0, 10),
  validUntil: '',
  usageLimit: 0,
});

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-page-head">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="admin-page-title">Offer Management</h1>
          <p class="admin-page-sub">Discount codes and promotions.</p>
        </div>
        <button (click)="toggleForm()" class="btn-primary text-sm">
          {{ showForm() ? 'Cancel' : '+ New Offer' }}
        </button>
      </div>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    <div class="admin-stat-grid mb-8">
      <div class="card p-5"><div class="admin-stat-value">{{ offers().length }}</div><div class="admin-stat-label">Total offers</div></div>
      <div class="card p-5"><div class="admin-stat-value text-primary">{{ liveCount() }}</div><div class="admin-stat-label">Live now</div></div>
      <div class="card p-5"><div class="admin-stat-value">{{ inactiveCount() }}</div><div class="admin-stat-label">Inactive / expired</div></div>
      <div class="card p-5"><div class="admin-stat-value">{{ totalRedemptions() }}</div><div class="admin-stat-label">Total redemptions</div></div>
    </div>

    @if (showForm()) {
      <div class="card p-6 mb-8">
        <h2 class="font-display text-lg font-bold text-white uppercase mb-5">New offer</h2>
        <form (ngSubmit)="save()" #offerForm="ngForm" class="admin-form-grid">
          <label class="admin-field">
            <span>Code <b>*</b></span>
            <input name="code" [(ngModel)]="form.code" required placeholder="NEWYEAR25" class="input-field">
            <small>Saved uppercase. Letters, numbers, dash, underscore.</small>
          </label>

          <label class="admin-field">
            <span>Title <b>*</b></span>
            <input name="title" [(ngModel)]="form.title" required placeholder="New Year 25% off" class="input-field">
          </label>

          <label class="admin-field admin-field-wide">
            <span>Description</span>
            <input name="description" [(ngModel)]="form.description"
                   placeholder="Shown to members when the code is applied" class="input-field">
          </label>

          <label class="admin-field">
            <span>Discount type <b>*</b></span>
            <select name="type" [(ngModel)]="form.type" class="input-field">
              <option value="percentage">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
            </select>
          </label>

          <label class="admin-field">
            <span>{{ form.type === 'percentage' ? 'Percent off' : 'Amount off (₹)' }} <b>*</b></span>
            <input type="number" name="value" [(ngModel)]="form.value" required min="1"
                   [max]="form.type === 'percentage' ? 100 : null"
                   [placeholder]="form.type === 'percentage' ? '25' : '500'" class="input-field">
          </label>

          <label class="admin-field">
            <span>Applies to <b>*</b></span>
            <select name="scope" [(ngModel)]="form.scope" class="input-field">
              <option value="sitewide">Whole site</option>
              <option value="gym">A single gym</option>
            </select>
          </label>

          @if (form.scope === 'gym') {
            <label class="admin-field">
              <span>Gym <b>*</b></span>
              <select name="gymId" [(ngModel)]="form.gymId" required class="input-field">
                <option value="">Select a gym…</option>
                @for (g of gyms(); track g.id) {
                  <option [value]="g.id">{{ g.name }}</option>
                }
              </select>
            </label>
          }

          <label class="admin-field">
            <span>Valid from</span>
            <input type="date" name="validFrom" [(ngModel)]="form.validFrom" class="input-field">
          </label>

          <label class="admin-field">
            <span>Valid until</span>
            <input type="date" name="validUntil" [(ngModel)]="form.validUntil" class="input-field">
            <small>Leave blank for no end date</small>
          </label>

          <label class="admin-field">
            <span>Usage limit</span>
            <input type="number" name="usageLimit" [(ngModel)]="form.usageLimit" min="0" class="input-field">
            <small>0 means unlimited</small>
          </label>

          <div class="admin-actions">
            <button type="submit" [disabled]="saving() || offerForm.invalid"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {{ saving() ? 'Creating…' : 'Create Offer' }}
            </button>
            <button type="button" (click)="toggleForm()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    }

    @if (loading()) {
      <p class="text-gray-400">Loading offers...</p>
    } @else if (offers().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">🎟️</div>
        <h2 class="font-display text-xl font-bold text-white uppercase mb-2">No offers yet</h2>
        <p class="text-gray-400">Create your first discount code to get started.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Code</th>
              <th class="text-left p-4 text-gray-400 font-medium">Discount</th>
              <th class="text-left p-4 text-gray-400 font-medium">Applies to</th>
              <th class="text-left p-4 text-gray-400 font-medium">Valid</th>
              <th class="text-left p-4 text-gray-400 font-medium">Used</th>
              <th class="text-left p-4 text-gray-400 font-medium">Status</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (o of offers(); track o.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="admin-code">{{ o.code }}</div>
                  <div class="text-gray-500 text-xs mt-1">{{ o.title }}</div>
                </td>
                <td class="p-4 text-white font-semibold">{{ discountLabel(o) }}</td>
                <td class="p-4 text-gray-300">
                  {{ o.scope === 'sitewide' ? 'Whole site' : (o.gymName || gymName(o.gymId)) }}
                </td>
                <td class="p-4 text-gray-300 whitespace-nowrap">
                  {{ o.validFrom || '—' }}<br>
                  <span class="text-gray-500 text-xs">to {{ o.validUntil || 'no end' }}</span>
                </td>
                <td class="p-4 text-gray-300">
                  {{ o.usedCount }}{{ o.usageLimit > 0 ? ' / ' + o.usageLimit : '' }}
                </td>
                <td class="p-4">
                  <span [class]="'status-pill ' + statusClass(o)">{{ statusLabel(o) }}</span>
                </td>
                <td class="p-4 text-right whitespace-nowrap">
                  <button (click)="toggle(o)" [disabled]="busy() === o.id"
                          class="btn-secondary text-xs py-1.5 px-3 mr-2 disabled:opacity-50">
                    {{ o.active ? 'Disable' : 'Enable' }}
                  </button>
                  <button (click)="remove(o)" [disabled]="busy() === o.id"
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
export class AdminOffersComponent implements OnInit {
  private api = inject(RoleApiService);

  offers = signal<Offer[]>([]);
  gyms = signal<Gym[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  showForm = signal(false);
  saving = signal(false);
  form = emptyForm();

  liveCount = computed(() => this.offers().filter(o => o.live).length);
  inactiveCount = computed(() => this.offers().filter(o => !o.live).length);
  totalRedemptions = computed(() => this.offers().reduce((sum, o) => sum + (o.usedCount ?? 0), 0));

  async ngOnInit() {
    await this.reload();
  }

  discountLabel(o: Offer) {
    return o.type === 'percentage' ? `${o.value}% off` : `₹${o.value} off`;
  }

  gymName(gymId: string | null) {
    return this.gyms().find(g => g.id === gymId)?.name ?? '—';
  }

  /** live is server-computed, so the badge cannot disagree with the public list. */
  statusLabel(o: Offer) {
    if (o.live) return 'live';
    if (!o.active) return 'disabled';
    if (o.usageLimit > 0 && o.usedCount >= o.usageLimit) return 'exhausted';
    return 'expired';
  }

  statusClass(o: Offer) {
    if (o.live) return 'status-pill-active';
    return o.active ? 'status-pill-pending' : 'status-pill-rejected';
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.form = emptyForm();
  }

  private async reload() {
    this.loading.set(true);
    try {
      // Gyms are needed for the scope picker and to name gym-scoped offers.
      const [offers, gyms] = await Promise.all([
        this.api.getAllOffers(),
        this.api.getGyms().catch(() => [] as Gym[]),
      ]);
      this.offers.set(offers);
      this.gyms.set(gyms);
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load offers.'} — is the API running?`);
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
      await this.api.createOffer({
        code: f.code.trim().toUpperCase(),
        title: f.title.trim(),
        description: f.description.trim(),
        type: f.type,
        value: Number(f.value) || 0,
        scope: f.scope,
        gymId: f.scope === 'gym' ? f.gymId : null,
        gymName: f.scope === 'gym' ? this.gymName(f.gymId) : null,
        validFrom: f.validFrom,
        validUntil: f.validUntil,
        usageLimit: Number(f.usageLimit) || 0,
      });
      this.notice.set(`${f.code.toUpperCase()} created.`);
      this.showForm.set(false);
      this.form = emptyForm();
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not create the offer.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggle(offer: Offer) {
    this.busy.set(offer.id);
    try {
      const res = await this.api.toggleOffer(offer.id);
      this.notice.set(`${offer.code} ${res.active ? 'enabled' : 'disabled'}.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not update the offer.');
    } finally {
      this.busy.set(null);
    }
  }

  async remove(offer: Offer) {
    if (!confirm(`Delete ${offer.code}? This cannot be undone.`)) return;
    this.busy.set(offer.id);
    try {
      await this.api.deleteOffer(offer.id);
      this.notice.set(`${offer.code} deleted.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Delete failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
