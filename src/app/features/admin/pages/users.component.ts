import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { RoleApiService } from '../../../core/services/role-api.service';
import { UserProfile, UserRole } from '../../../core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">User Management</h1>
      <p class="admin-page-sub">
        {{ users().length }} accounts.
        @if (!auth.isSuperAdmin()) {
          <span class="text-amber-400">Only a super admin can grant or revoke admin roles.</span>
        }
      </p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    @if (loading()) {
      <p class="text-gray-400">Loading users...</p>
    } @else {
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
                <td class="p-4"><span [class]="'status-pill status-pill-' + u.status">{{ u.status }}</span></td>
                <td class="p-4">
                  @if (u.uid === auth.currentUser()?.uid) {
                    <span [class]="'role-badge role-badge-' + u.role">{{ u.role }}</span>
                    <span class="text-gray-500 text-xs ml-2">(you)</span>
                  } @else if (!canEdit(u)) {
                    <span [class]="'role-badge role-badge-' + u.role">{{ u.role }}</span>
                    <span class="text-gray-500 text-xs ml-2">(super admin only)</span>
                  } @else {
                    <!-- ngModel rather than [value]: a plain value binding is applied
                         before the @if options exist, so the select silently falls
                         back to its first option and every role displayed as "user". -->
                    <select class="input-field py-2 text-sm max-w-[11rem]"
                            [disabled]="busy() === u.uid"
                            [ngModel]="u.role"
                            (ngModelChange)="onRoleChange(u, $event)">
                      <option value="user">user</option>
                      <option value="owner">owner</option>
                      @if (auth.isSuperAdmin()) {
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      }
                    </select>
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
export class AdminUsersComponent implements OnInit {
  auth = inject(FirebaseAuthService);
  private api = inject(RoleApiService);

  users = signal<UserProfile[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  async ngOnInit() {
    await this.reload();
  }

  /**
   * Mirrors the server rule: only a super admin may touch an account that
   * already holds an elevated role. The API enforces this regardless.
   */
  canEdit(u: UserProfile) {
    const elevated = u.role === 'admin' || u.role === 'superadmin';
    return this.auth.isSuperAdmin() || !elevated;
  }

  private async reload() {
    this.loading.set(true);
    try {
      this.users.set(await this.api.getUsers());
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load users.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  async onRoleChange(u: UserProfile, role: UserRole) {
    if (role === u.role) return;
    this.busy.set(u.uid);
    this.notice.set('');
    try {
      await this.api.changeRole(u.uid, role);
      this.notice.set(`${u.displayName} is now a ${role}.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not change role.');
      await this.reload();
    } finally {
      this.busy.set(null);
    }
  }
}
