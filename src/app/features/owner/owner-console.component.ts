import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { RoleApiService } from '../../core/services/role-api.service';
import { Gym } from '../../core/models';

@Component({
  selector: 'app-owner-console',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="pt-32 pb-24 bg-dark-900 page-min">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Owner Console</span>
        <h1 class="section-title text-white mt-2 mb-2">My <span class="gradient-text">Gyms</span></h1>
        <p class="text-gray-400 mb-10">Manage the listings registered to your account.</p>

        <!-- Awaiting approval -->
        @if (auth.isPendingOwner()) {
          <div class="card p-10 text-center">
            <div class="text-5xl mb-4">⏳</div>
            <h2 class="font-display text-2xl font-bold text-white uppercase mb-3">Awaiting approval</h2>
            <p class="text-gray-400 max-w-md mx-auto mb-6">
              Your gym owner account is being reviewed by our team. Once an admin approves
              you, you'll be able to add and manage listings from here.
            </p>
            <a routerLink="/dashboard" class="btn-secondary">Back to Dashboard</a>
          </div>
        } @else if (auth.isRejectedOwner()) {
          <div class="card p-10 text-center">
            <div class="text-5xl mb-4">⛔</div>
            <h2 class="font-display text-2xl font-bold text-white uppercase mb-3">Request declined</h2>
            <p class="text-gray-400 max-w-md mx-auto mb-6">
              Your gym owner request was not approved. Contact support if you think this
              was a mistake.
            </p>
            <a routerLink="/contact" class="btn-primary">Contact Support</a>
          </div>
        } @else {
          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
              {{ error() }}
            </div>
          }

          @if (loading()) {
            <p class="text-gray-400">Loading your gyms...</p>
          } @else if (gyms().length === 0) {
            <div class="card p-10 text-center">
              <div class="text-5xl mb-4">🏗️</div>
              <h2 class="font-display text-2xl font-bold text-white uppercase mb-3">No gyms yet</h2>
              <p class="text-gray-400 max-w-md mx-auto mb-6">
                You don't have any listings registered to your account yet. Get in touch
                and our team will help you add your first gym.
              </p>
              <a routerLink="/contact" class="btn-primary">Add a Gym</a>
            </div>
          } @else {
            <p class="text-gray-400 text-sm mb-4">
              Showing <strong class="text-white">{{ gyms().length }}</strong>
              {{ gyms().length === 1 ? 'gym' : 'gyms' }}
              @if (auth.isAdmin()) { <span class="text-primary">(admin view — all gyms)</span> }
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (gym of gyms(); track gym.id) {
                <div class="card overflow-hidden">
                  @if (gym.images && gym.images[0]) {
                    <div class="h-40 overflow-hidden">
                      <img [src]="gym.images[0]" [alt]="gym.name" class="w-full h-full object-cover">
                    </div>
                  }
                  <div class="p-5">
                    <h3 class="font-display text-lg font-bold text-white mb-1">{{ gym.name }}</h3>
                    <p class="text-gray-400 text-sm mb-3">{{ gym.location }}, {{ gym.city }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-primary font-bold">{{ gym.priceLabel }}</span>
                      <a [routerLink]="['/gyms', gym.slug]" class="text-primary text-sm font-medium">View →</a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class OwnerConsoleComponent implements OnInit {
  auth = inject(FirebaseAuthService);
  private api = inject(RoleApiService);

  gyms = signal<Gym[]>([]);
  loading = signal(true);
  error = signal('');

  async ngOnInit() {
    // Pending/rejected owners never reach the API, so skip the call entirely.
    if (!this.auth.isApprovedOwner() && !this.auth.isAdmin()) {
      this.loading.set(false);
      return;
    }
    try {
      this.gyms.set(await this.api.getMyGyms());
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not load your gyms.');
    } finally {
      this.loading.set(false);
    }
  }
}
