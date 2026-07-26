import { Component, inject, signal, OnInit } from '@angular/core';
import { RoleApiService } from '../../../core/services/role-api.service';
import { Gym } from '../../../core/models';

@Component({
  selector: 'app-admin-gyms',
  standalone: true,
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">Gym Management</h1>
      <p class="admin-page-sub">Every listing on the platform. {{ gyms().length }} total.</p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

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

  async ngOnInit() {
    await this.reload();
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
