import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="pt-32 pb-24 bg-dark-900 page-min">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">My Account</span>
        <h1 class="section-title text-white mt-2 mb-2">
          Welcome back, <span class="gradient-text">{{ auth.displayName() }}</span>
        </h1>
        <p class="text-gray-400 mb-10">Manage your IronFit account and pick up where you left off.</p>

        @if (auth.isPendingOwner()) {
          <div class="status-banner status-banner-pending mb-8">
            <span class="text-2xl">⏳</span>
            <div>
              <strong class="block mb-1">Gym owner request under review</strong>
              <span class="text-sm">An admin is reviewing your account. The owner console unlocks once you're approved.</span>
            </div>
          </div>
        }
        @if (auth.isRejectedOwner()) {
          <div class="status-banner status-banner-rejected mb-8">
            <span class="text-2xl">⛔</span>
            <div>
              <strong class="block mb-1">Gym owner request declined</strong>
              <span class="text-sm">Get in touch with support if you believe this was a mistake.</span>
            </div>
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile -->
          <div class="card p-6">
            <h2 class="font-display text-lg font-bold text-white uppercase mb-5">Profile</h2>
            <dl class="space-y-4 text-sm">
              <div>
                <dt class="text-gray-500 mb-0.5">Name</dt>
                <dd class="text-white font-medium">{{ auth.displayName() }}</dd>
              </div>
              <div>
                <dt class="text-gray-500 mb-0.5">Email</dt>
                <dd class="text-gray-300 break-all">{{ auth.currentUser()?.email }}</dd>
              </div>
              <div>
                <dt class="text-gray-500 mb-1">Account type</dt>
                <dd><span [class]="'role-badge role-badge-' + (auth.role() ?? 'user')">{{ roleLabel() }}</span></dd>
              </div>
              @if (memberSince()) {
                <div>
                  <dt class="text-gray-500 mb-0.5">Member since</dt>
                  <dd class="text-gray-300">{{ memberSince() }}</dd>
                </div>
              }
            </dl>
          </div>

          <!-- Quick links -->
          <div class="card p-6 lg:col-span-2">
            <h2 class="font-display text-lg font-bold text-white uppercase mb-5">Jump back in</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a routerLink="/gyms" class="quick-link">
                <span class="text-2xl">🏋️</span>
                <span class="font-semibold">Find a Gym</span>
                <span class="text-xs opacity-70">Browse verified listings near you</span>
              </a>
              <a routerLink="/trainers" class="quick-link">
                <span class="text-2xl">💪</span>
                <span class="font-semibold">Meet Trainers</span>
                <span class="text-xs opacity-70">Certified coaches for every goal</span>
              </a>
              <a routerLink="/plans" class="quick-link">
                <span class="text-2xl">📋</span>
                <span class="font-semibold">Membership Plans</span>
                <span class="text-xs opacity-70">Compare pricing and perks</span>
              </a>
              <a routerLink="/blog" class="quick-link">
                <span class="text-2xl">📖</span>
                <span class="font-semibold">Fitness Blog</span>
                <span class="text-xs opacity-70">Guides, nutrition and training</span>
              </a>
            </div>

            @if (auth.isApprovedOwner() || auth.isAdmin()) {
              <div class="mt-6 pt-6 border-t border-dark-600 flex flex-wrap gap-3">
                @if (auth.isApprovedOwner()) {
                  <a routerLink="/owner" class="btn-primary text-sm">Open Owner Console</a>
                }
                @if (auth.isAdmin()) {
                  <a routerLink="/admin" class="btn-primary text-sm">Open Admin Console</a>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DashboardComponent implements OnInit {
  auth = inject(FirebaseAuthService);
  profile = signal<UserProfile | null>(null);

  async ngOnInit() {
    this.profile.set(await this.auth.fetchProfile());
  }

  roleLabel() {
    const role = this.auth.role();
    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admin') return 'Administrator';
    if (role === 'owner') return this.auth.isApprovedOwner() ? 'Gym Owner' : 'Gym Owner (pending)';
    return 'Member';
  }

  memberSince() {
    const created = this.profile()?.createdAt;
    if (!created) return '';
    return new Date(created).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
}
