import { Routes } from '@angular/router';

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
