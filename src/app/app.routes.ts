import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'IronFit - Find Premium Gyms & Trainers Near You'
  },
  {
    path: 'gyms',
    loadComponent: () => import('./features/gym-listings/gym-listings.component').then(m => m.GymListingsComponent),
    title: 'Find Gyms - IronFit'
  },
  {
    path: 'gyms/:slug',
    loadComponent: () => import('./features/gym-details/gym-details.component').then(m => m.GymDetailsComponent),
    title: 'Gym Details - IronFit'
  },
  {
    path: 'trainers',
    loadComponent: () => import('./features/trainer-profiles/trainer-profiles.component').then(m => m.TrainerProfilesComponent),
    title: 'Expert Trainers - IronFit'
  },
  {
    path: 'trainers/:slug',
    loadComponent: () => import('./features/trainer-detail/trainer-detail.component').then(m => m.TrainerDetailComponent),
    title: 'Trainer Profile - IronFit'
  },
  {
    path: 'plans',
    loadComponent: () => import('./features/membership-plans/membership-plans.component').then(m => m.MembershipPlansComponent),
    title: 'Membership Plans - IronFit'
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/fitness-blog/fitness-blog.component').then(m => m.FitnessBlogComponent),
    title: 'Fitness Blog - IronFit'
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
    title: 'Article - IronFit'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'About Us - IronFit'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - IronFit'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Sign In - IronFit'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Create Account - IronFit'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'My Account - IronFit'
  },
  {
    path: 'owner',
    loadComponent: () => import('./features/owner/owner-console.component').then(m => m.OwnerConsoleComponent),
    canActivate: [roleGuard(['owner', 'admin', 'superadmin'])],
    title: 'Owner Console - IronFit'
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-portal.component').then(m => m.AdminPortalComponent),
    canActivate: [roleGuard(['admin', 'superadmin'])],
    title: 'Admin Portal - IronFit',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // ── Backed by real data ──
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'gyms',
        loadComponent: () => import('./features/admin/pages/gyms.component').then(m => m.AdminGymsComponent),
      },
      {
        path: 'gym-owners',
        loadComponent: () => import('./features/admin/pages/gym-owners.component').then(m => m.AdminGymOwnersComponent),
      },
      {
        path: 'trainers',
        loadComponent: () => import('./features/admin/pages/trainers.component').then(m => m.AdminTrainersComponent),
      },
      {
        path: 'blogs',
        loadComponent: () => import('./features/admin/pages/blogs.component').then(m => m.AdminBlogsComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/pages/users.component').then(m => m.AdminUsersComponent),
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/pages/bookings.component').then(m => m.AdminBookingsComponent),
      },

      // ── Scaffolded: structure in place, no data model yet ──
      {
        path: 'offers',
        loadComponent: () => import('./features/admin/pages/offers.component').then(m => m.AdminOffersComponent),
      },
      {
        path: 'membership',
        loadComponent: () => import('./features/admin/pages/placeholder.component').then(m => m.AdminPlaceholderComponent),
        data: {
          title: 'Membership Management', icon: '💳',
          summary: 'Plans, pricing tiers and active subscriptions.',
          planned: ['Edit the plans shown on /plans', 'View and cancel active memberships', 'Renewal and churn tracking'],
        },
      },
      {
        path: 'nutrition',
        loadComponent: () => import('./features/admin/pages/nutrition.component').then(m => m.AdminNutritionComponent),
      },
      {
        path: 'fitness-content',
        loadComponent: () => import('./features/admin/pages/placeholder.component').then(m => m.AdminPlaceholderComponent),
        data: {
          title: 'Fitness Content Management', icon: '🎬',
          summary: 'Workout programmes, exercise library and videos.',
          planned: ['Exercise library with demo videos', 'Structured workout programmes', 'Difficulty and equipment tagging'],
        },
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/admin/pages/placeholder.component').then(m => m.AdminPlaceholderComponent),
        data: {
          title: 'Review Management', icon: '⭐',
          summary: 'Moderate gym and trainer reviews.',
          planned: ['Approve, hide or remove reviews', 'Flag suspected fake reviews', 'Respond on behalf of a gym'],
        },
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/admin/pages/placeholder.component').then(m => m.AdminPlaceholderComponent),
        data: {
          title: 'Notification Management', icon: '🔔',
          summary: 'Email, push and in-app messaging.',
          planned: ['Broadcast announcements', 'Transactional email templates', 'Per-user notification preferences'],
        },
      },

      // ── Super admin only ──
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/pages/placeholder.component').then(m => m.AdminPlaceholderComponent),
        canActivate: [roleGuard(['superadmin'])],
        data: {
          title: 'Reports & Analytics', icon: '📈',
          summary: 'Revenue, growth and engagement reporting.',
          planned: ['Signup and retention curves', 'Revenue by plan and by gym', 'Exportable CSV reports'],
        },
      },
      {
        path: 'cms',
        loadComponent: () => import('./features/admin/pages/cms.component').then(m => m.AdminCmsComponent),
        canActivate: [roleGuard(['superadmin'])],
      },
    ],
  },
  {
    path: 'nutritionists',
    loadComponent: () => import('./features/nutritionists/nutritionists.component').then(m => m.NutritionistsComponent),
    title: 'Nutritionists - IronFit'
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent),
    title: 'Our Services - IronFit'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    title: 'Privacy Policy - IronFit'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent),
    title: 'Terms of Service - IronFit'
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./features/sitemap/sitemap.component').then(m => m.SitemapComponent),
    title: 'Sitemap - IronFit'
  },
  { path: '**', redirectTo: '' }
];
