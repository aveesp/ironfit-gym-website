import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';

interface PortalSection {
  path: string;
  label: string;
  icon: string;
  /** Only super admins see this section. */
  superOnly?: boolean;
  /** False for sections that have no backing data yet. */
  ready?: boolean;
}

/** The 14 portal sections, in the order they appear in the sidebar. */
export const PORTAL_SECTIONS: PortalSection[] = [
  { path: 'dashboard',       label: 'Dashboard',                  icon: '📊', ready: true },
  { path: 'gyms',            label: 'Gym Management',             icon: '🏋️', ready: true },
  { path: 'gym-owners',      label: 'Gym Owner Management',       icon: '🤝', ready: true },
  { path: 'offers',          label: 'Offer Management',           icon: '🎟️' },
  { path: 'membership',      label: 'Membership Management',      icon: '💳' },
  { path: 'nutrition',       label: 'Nutrition Management',       icon: '🥗' },
  { path: 'fitness-content', label: 'Fitness Content Management', icon: '🎬' },
  { path: 'blogs',           label: 'Blog Management',            icon: '📝', ready: true },
  { path: 'users',           label: 'User Management',            icon: '👥', ready: true },
  { path: 'reviews',         label: 'Review Management',          icon: '⭐' },
  { path: 'bookings',        label: 'Booking Management',         icon: '📅', ready: true },
  { path: 'reports',         label: 'Reports & Analytics',        icon: '📈', superOnly: true },
  { path: 'notifications',   label: 'Notification Management',    icon: '🔔' },
  { path: 'cms',             label: 'CMS Management',             icon: '🧩', superOnly: true, ready: true },
];

@Component({
  selector: 'app-admin-portal',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-shell bg-dark-900 page-min">
      <button class="admin-mobile-toggle" (click)="menuOpen.set(!menuOpen())">
        <span>☰</span> Admin Menu
      </button>

      <aside class="admin-sidebar" [class.admin-sidebar-open]="menuOpen()">
        <div class="admin-sidebar-head">
          <div class="admin-portal-title">Admin Portal</div>
          <span [class]="'role-badge role-badge-' + (auth.role() ?? 'admin')">
            {{ auth.isSuperAdmin() ? 'Super Admin' : 'Admin' }}
          </span>
        </div>

        <nav class="admin-nav">
          @for (s of visibleSections(); track s.path) {
            <a [routerLink]="s.path" routerLinkActive="admin-nav-active"
               (click)="menuOpen.set(false)" class="admin-nav-item">
              <span class="admin-nav-icon">{{ s.icon }}</span>
              <span class="admin-nav-label">{{ s.label }}</span>
              @if (!s.ready) { <span class="admin-nav-soon">soon</span> }
            </a>
          }
        </nav>
      </aside>

      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminPortalComponent {
  auth = inject(FirebaseAuthService);
  menuOpen = signal(false);

  visibleSections = computed(() =>
    PORTAL_SECTIONS.filter(s => !s.superOnly || this.auth.isSuperAdmin()));
}
