import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FirebaseAuthService } from './firebase-auth.service';
import { Gym, Trainer, MembershipPlan, BlogPost } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private authSvc = inject(FirebaseAuthService);
  private base = environment.apiUrl;

  // ── Gyms ──────────────────────────────────────────────────
  getGyms(filters?: { featured?: boolean; city?: string; tag?: string; maxPrice?: number; minRating?: number; openNow?: boolean }): Observable<Gym[]> {
    let params = new HttpParams();
    if (filters?.featured !== undefined) params = params.set('featured', String(filters.featured));
    if (filters?.city) params = params.set('city', filters.city);
    if (filters?.tag) params = params.set('tag', filters.tag);
    if (filters?.maxPrice) params = params.set('maxPrice', filters.maxPrice);
    if (filters?.minRating) params = params.set('minRating', filters.minRating);
    if (filters?.openNow) params = params.set('openNow', String(filters.openNow));
    return this.http.get<Gym[]>(`${this.base}/gyms`, { params });
  }

  getGymBySlug(slug: string): Observable<Gym> {
    return this.http.get<Gym>(`${this.base}/gyms/${slug}`);
  }

  // ── Trainers ──────────────────────────────────────────────
  getTrainers(filters?: { featured?: boolean; specialization?: string }): Observable<Trainer[]> {
    let params = new HttpParams();
    if (filters?.featured !== undefined) params = params.set('featured', String(filters.featured));
    if (filters?.specialization) params = params.set('specialization', filters.specialization);
    return this.http.get<Trainer[]>(`${this.base}/trainers`, { params });
  }

  getTrainerBySlug(slug: string): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.base}/trainers/${slug}`);
  }

  // ── Plans ─────────────────────────────────────────────────
  getPlans(): Observable<MembershipPlan[]> {
    return this.http.get<MembershipPlan[]>(`${this.base}/plans`);
  }

  // ── Blogs ─────────────────────────────────────────────────
  getBlogs(filters?: { category?: string; limit?: number }): Observable<BlogPost[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.limit) params = params.set('limit', filters.limit);
    return this.http.get<BlogPost[]>(`${this.base}/blogs`, { params });
  }

  getBlogBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.base}/blogs/${slug}`);
  }

  // ── Inquiries ─────────────────────────────────────────────
  submitInquiry(data: { name: string; email: string; phone?: string; interest?: string; message: string; gymId?: string; gymName?: string }): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/inquiries`, data);
  }

  // ── Auth header helper ────────────────────────────────────
  private authHeader(): Observable<{ Authorization: string }> {
    return from(this.authSvc.getIdToken()).pipe(
      switchMap(token => of({ Authorization: `Bearer ${token}` }))
    );
  }
}
