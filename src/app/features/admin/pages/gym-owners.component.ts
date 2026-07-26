import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RoleApiService } from '../../../core/services/role-api.service';
import { UserProfile } from '../../../core/models';

@Component({
  selector: 'app-admin-gym-owners',
  standalone: true,
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">Gym Owner Management</h1>
      <p class="admin-page-sub">Approve new gym owners and review existing ones.</p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    <h2 class="font-display text-lg font-bold text-white uppercase mb-4">
      Awaiting approval
      @if (pending().length) { <span class="text-primary">({{ pending().length }})</span> }
    </h2>

    @if (loading()) {
      <p class="text-gray-400 mb-10">Loading...</p>
    } @else if (pending().length === 0) {
      <div class="card p-8 text-center mb-10">
        <div class="text-4xl mb-3">✅</div>
        <p class="text-gray-400">No gym owners waiting for approval.</p>
      </div>
    } @else {
      <div class="space-y-3 mb-10">
        @for (u of pending(); track u.uid) {
          <div class="card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="text-white font-semibold">{{ u.displayName }}</div>
              <div class="text-gray-400 text-sm break-all">{{ u.email }}</div>
              <div class="text-gray-500 text-xs mt-1">Requested {{ shortDate(u.createdAt) }}</div>
            </div>
            <div class="flex gap-2">
              <button (click)="approve(u)" [disabled]="busy() === u.uid"
                      class="btn-primary text-sm py-2 px-5 disabled:opacity-50">Approve</button>
              <button (click)="reject(u)" [disabled]="busy() === u.uid"
                      class="btn-secondary text-sm py-2 px-5 disabled:opacity-50">Reject</button>
            </div>
          </div>
        }
      </div>
    }

    <h2 class="font-display text-lg font-bold text-white uppercase mb-4">All gym owners</h2>
    @if (owners().length === 0) {
      <div class="card p-8 text-center">
        <p class="text-gray-400">No gym owner accounts yet.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Owner</th>
              <th class="text-left p-4 text-gray-400 font-medium">Status</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (u of owners(); track u.uid) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ u.displayName }}</div>
                  <div class="text-gray-500 text-xs break-all">{{ u.email }}</div>
                </td>
                <td class="p-4"><span [class]="'status-pill status-pill-' + u.status">{{ u.status }}</span></td>
                <td class="p-4 text-right">
                  @if (u.status !== 'active') {
                    <button (click)="approve(u)" [disabled]="busy() === u.uid"
                            class="btn-primary text-xs py-1.5 px-4 disabled:opacity-50">Approve</button>
                  } @else {
                    <button (click)="reject(u)" [disabled]="busy() === u.uid"
                            class="admin-danger-btn">Revoke</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminGymOwnersComponent implements OnInit {
  private api = inject(RoleApiService);

  private users = signal<UserProfile[]>([]);
  pending = signal<UserProfile[]>([]);
  owners = computed(() => this.users().filter(u => u.role === 'owner'));

  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  async ngOnInit() {
    await this.reload();
  }

  shortDate(iso: string) {
    return iso ? new Date(iso).toLocaleDateString() : '—';
  }

  private async reload() {
    this.loading.set(true);
    try {
      const [pending, users] = await Promise.all([
        this.api.getPendingOwners(),
        this.api.getUsers(),
      ]);
      this.pending.set(pending);
      this.users.set(users);
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load owners.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  private async mutate(uid: string, action: () => Promise<unknown>, message: string) {
    this.busy.set(uid);
    this.notice.set('');
    try {
      await action();
      this.notice.set(message);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Action failed.');
    } finally {
      this.busy.set(null);
    }
  }

  approve(u: UserProfile) {
    return this.mutate(u.uid, () => this.api.approveOwner(u.uid), `${u.displayName} approved.`);
  }

  reject(u: UserProfile) {
    return this.mutate(u.uid, () => this.api.rejectOwner(u.uid), `${u.displayName}'s access was revoked.`);
  }
}
