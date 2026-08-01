import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FirebaseAuthService } from './firebase-auth.service';
import {
  AdminStats, Booking, BookingStatus, BlogPost, CmsContent, CmsSectionName,
  Gym, Nutritionist, Offer, UserProfile, UserRole,
} from '../models';

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
    // 204s and empty bodies would blow up res.json().
    return res.status === 204 ? (undefined as T) : res.json();
  }

  // ── Owner ──
  getMyGyms() {
    return this.request<Gym[]>('/owner/gyms');
  }

  // ── Dashboard ──
  getStats() {
    return this.request<AdminStats>('/admin/stats');
  }

  // ── Users & owners ──
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

  // ── Gyms ──
  getGyms() {
    return this.request<Gym[]>('/gyms');
  }

  createGym(gym: Partial<Gym>) {
    return this.request<Gym>('/gyms', {
      method: 'POST',
      body: JSON.stringify(gym),
    });
  }

  deleteGym(id: string) {
    return this.request<{ success: boolean }>(`/gyms/${id}`, { method: 'DELETE' });
  }

  updateGym(id: string, changes: Partial<Gym>) {
    return this.request<{ success: boolean }>(`/gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  }

  // ── Blogs ──
  getBlogs() {
    return this.request<BlogPost[]>('/blogs');
  }

  deleteBlog(id: string) {
    return this.request<{ success: boolean }>(`/blogs/${id}`, { method: 'DELETE' });
  }

  updateBlog(id: string, changes: Partial<BlogPost>) {
    return this.request<{ success: boolean }>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });
  }

  // ── Nutritionists ──
  /** Everything, including deactivated profiles — the admin view. */
  getAllNutritionists() {
    return this.request<Nutritionist[]>('/nutritionists/all');
  }

  createNutritionist(profile: Partial<Nutritionist> & { specializations?: string; certifications?: string; languages?: string }) {
    return this.request<Nutritionist>('/nutritionists', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  toggleNutritionist(id: string) {
    return this.request<{ id: string; active: boolean }>(`/nutritionists/${id}/toggle`, { method: 'PATCH' });
  }

  deleteNutritionist(id: string) {
    return this.request<{ success: boolean }>(`/nutritionists/${id}`, { method: 'DELETE' });
  }

  // ── Offers ──
  /** Everything, including expired and inactive — the admin view. */
  getAllOffers() {
    return this.request<Offer[]>('/offers/all');
  }

  createOffer(offer: Partial<Offer>) {
    return this.request<Offer>('/offers', {
      method: 'POST',
      body: JSON.stringify(offer),
    });
  }

  toggleOffer(id: string) {
    return this.request<{ id: string; active: boolean }>(`/offers/${id}/toggle`, { method: 'PATCH' });
  }

  deleteOffer(id: string) {
    return this.request<{ success: boolean }>(`/offers/${id}`, { method: 'DELETE' });
  }

  // ── CMS ──
  getCms() {
    return this.request<CmsContent>('/cms');
  }

  updateCmsSection<K extends CmsSectionName>(section: K, content: CmsContent[K]) {
    return this.request<CmsContent[K]>(`/cms/${section}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  // ── Bookings (gym enquiries) ──
  getBookings() {
    return this.request<Booking[]>('/inquiries');
  }

  updateBookingStatus(id: string, status: BookingStatus) {
    return this.request<{ success: boolean }>(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  deleteBooking(id: string) {
    return this.request<{ success: boolean }>(`/inquiries/${id}`, { method: 'DELETE' });
  }
}
