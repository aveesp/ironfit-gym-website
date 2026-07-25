import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FirebaseAuthService } from './firebase-auth.service';
import { Gym, UserProfile, UserRole } from '../models';

/**
 * Authenticated calls to the owner/admin endpoints.
 *
 * Uses fetch + an explicit bearer token rather than HttpClient so the token can
 * be awaited per request; ApiService stays as the anonymous public-data client.
 */
@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private auth = inject(FirebaseAuthService);

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.auth.getIdToken();
    const res = await fetch(`${environment.apiUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({} as any));
      throw new Error(body.error || `Request failed (${res.status})`);
    }
    return res.json();
  }

  // ── Owner ──
  getMyGyms() {
    return this.request<Gym[]>('/owner/gyms');
  }

  // ── Admin ──
  getUsers() {
    return this.request<UserProfile[]>('/admin/users');
  }

  getPendingOwners() {
    return this.request<UserProfile[]>('/admin/owners/pending');
  }

  approveOwner(uid: string) {
    return this.request<UserProfile>(`/admin/users/${uid}/approve`, { method: 'PATCH' });
  }

  rejectOwner(uid: string) {
    return this.request<UserProfile>(`/admin/users/${uid}/reject`, { method: 'PATCH' });
  }

  changeRole(uid: string, role: UserRole) {
    return this.request<UserProfile>(`/admin/users/${uid}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }
}
