import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { RoleApiService } from '../../core/services/role-api.service';
import { UserProfile, UserRole } from '../../core/models';

@Component({
  selector: 'app-admin-console',
  standalone: true,
  template: `
    <section class="pt-32 pb-24 bg-dark-900 page-min">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Admin Console</span>
        <h1 class="section-title text-white mt-2 mb-2">Manage <span class="gradient-text">Users</span></h1>
        <p class="text-gray-400 mb-10">Approve gym owners and control who can do what.</p>

        @if (error()) {
          <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">{{ error() }}</div>
        }
        @if (notice()) {
          <div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-green-400 text-sm">{{ notice() }}</div>
        }

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div class="card p-5"><div class="text-3xl font-bold text-white">{{ users().length }}</div><div class="text-gray-400 text-sm mt-1">Total users</div></div>
          <div class="card p-5"><div class="text-3xl font-bold text-white">{{ count('owner') }}</div><div class="text-gray-400 text-sm mt-1">Gym owners</div></div>
          <div class="card p-5"><div class="text-3xl font-bold text-primary">{{ pending().length }}</div><div class="text-gray-400 text-sm mt-1">Pending approval</div></div>
          <div class="card p-5"><div class="text-3xl font-bold text-white">{{ count('admin') }}</div><div class="text-gray-400 text-sm mt-1">Admins</div></div>
        </div>

        <!-- Pending owners -->
        <h2 class="font-display text-xl font-bold text-white uppercase mb-4">Pending gym owners</h2>
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

        <!-- All users -->
        <h2 class="font-display text-xl font-bold text-white uppercase mb-4">All users</h2>
        <div class="card overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-dark-500">
                <th class="text-left p-4 text-gray-400 font-medium">User</th>
                <th class="text-left p-4 text-gray-400 font-medium">Status</th>
                <th class="text-left p-4 text-gray-400 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              @for (u of users(); track u.uid) {
                <tr class="border-b border-dark-600">
                  <td class="p-4">
                    <div class="text-white font-medium">{{ u.displayName }}</div>
                    <div class="text-gray-500 text-xs break-all">{{ u.email }}</div>
                  </td>
                  <td class="p-4">
                    <span [class]="'status-pill status-pill-' + u.status">{{ u.status }}</span>
                  </td>
                  <td class="p-4">
                    @if (u.uid === auth.currentUser()?.uid) {
                      <span [class]="'role-badge role-badge-' + u.role">{{ u.role }}</span>
                      <span class="text-gray-500 text-xs ml-2">(you)</span>
                    } @else {
                      <select class="input-field py-2 text-sm max-w-[10rem]"
                              [disabled]="busy() === u.uid"
                              [value]="u.role"
                              (change)="onRoleChange(u, $any($event.target).value)">
                        <option value="user">user</option>
                        <option value="owner">owner</option>
                        <option value="admin">admin</option>
                      </select>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class AdminConsoleComponent implements OnInit {
  auth = inject(FirebaseAuthService);
  private api = inject(RoleApiService);

  users = signal<UserProfile[]>([]);
  pending = signal<UserProfile[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  /** uid currently being mutated, so only that row's buttons disable. */
  busy = signal<string | null>(null);

  async ngOnInit() {
    await this.reload();
  }

  count(role: UserRole) {
    return this.users().filter(u => u.role === role).length;
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
      this.error.set(e.message ?? 'Could not load users.');
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
    return this.mutate(u.uid, () => this.api.approveOwner(u.uid), `${u.displayName} approved as a gym owner.`);
  }

  reject(u: UserProfile) {
    return this.mutate(u.uid, () => this.api.rejectOwner(u.uid), `${u.displayName}'s owner request was rejected.`);
  }

  onRoleChange(u: UserProfile, role: UserRole) {
    if (role === u.role) return;
    return this.mutate(u.uid, () => this.api.changeRole(u.uid, role), `${u.displayName} is now a ${role}.`);
  }
}
