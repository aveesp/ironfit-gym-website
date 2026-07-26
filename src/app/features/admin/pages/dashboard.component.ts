import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleApiService } from '../../../core/services/role-api.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { AdminStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">Dashboard</h1>
      <p class="admin-page-sub">Live overview of the IronFit platform.</p>
    </header>

    @if (error()) {
      <div class="admin-error">{{ error() }}</div>
    }

    @if (loading()) {
      <p class="text-gray-400">Loading stats...</p>
    } @else {
      <!-- 'as' is only allowed on a primary @if, so this is nested rather than @else if -->
      @if (stats(); as s) {
      <div class="admin-stat-grid">
        <div class="card p-5"><div class="admin-stat-value">{{ s.users.total }}</div><div class="admin-stat-label">Total users</div></div>
        <div class="card p-5"><div class="admin-stat-value">{{ s.users.members }}</div><div class="admin-stat-label">Members</div></div>
        <div class="card p-5"><div class="admin-stat-value">{{ s.users.owners }}</div><div class="admin-stat-label">Gym owners</div></div>
        <div class="card p-5"><div class="admin-stat-value text-primary">{{ s.users.pendingOwners }}</div><div class="admin-stat-label">Awaiting approval</div></div>
        <div class="card p-5"><div class="admin-stat-value">{{ s.gyms.total }}</div><div class="admin-stat-label">Gyms listed</div></div>
        <div class="card p-5"><div class="admin-stat-value">{{ s.gyms.featured }}</div><div class="admin-stat-label">Featured gyms</div></div>
        <div class="card p-5"><div class="admin-stat-value">{{ s.blogs.total }}</div><div class="admin-stat-label">Blog posts</div></div>
        <div class="card p-5"><div class="admin-stat-value text-primary">{{ s.bookings.pending }}</div><div class="admin-stat-label">Pending bookings</div></div>
      </div>

      @if (s.users.pendingOwners > 0) {
        <div class="status-banner status-banner-pending mt-8">
          <span class="text-2xl">⏳</span>
          <div>
            <strong class="block mb-1">
              {{ s.users.pendingOwners }} gym {{ s.users.pendingOwners === 1 ? 'owner is' : 'owners are' }} waiting for approval
            </strong>
            <a routerLink="../gym-owners" class="text-sm underline">Review them now</a>
          </div>
        </div>
      }

      <h2 class="font-display text-lg font-bold text-white uppercase mt-10 mb-4">Quick actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a routerLink="../gym-owners" class="quick-link"><span class="text-2xl">🤝</span><span class="font-semibold">Approve owners</span></a>
        <a routerLink="../gyms" class="quick-link"><span class="text-2xl">🏋️</span><span class="font-semibold">Manage gyms</span></a>
        <a routerLink="../bookings" class="quick-link"><span class="text-2xl">📅</span><span class="font-semibold">Manage bookings</span></a>
        <a routerLink="../users" class="quick-link"><span class="text-2xl">👥</span><span class="font-semibold">Manage users</span></a>
      </div>
      }
    }
  `,
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(RoleApiService);
  auth = inject(FirebaseAuthService);

  stats = signal<AdminStats | null>(null);
  loading = signal(true);
  error = signal('');

  async ngOnInit() {
    try {
      this.stats.set(await this.api.getStats());
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load stats.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }
}
