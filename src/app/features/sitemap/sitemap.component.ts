import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Navigation</span>
        <h1 class="section-title text-white mt-2 mb-4">Site <span class="gradient-text">Map</span></h1>
        <p class="text-gray-400">A complete overview of all pages on IronFit</p>
      </div>
    </section>

    <section class="py-16 bg-dark-900">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (group of siteGroups; track group.title) {
            <div class="card p-6">
              <div class="flex items-center gap-3 mb-5">
                <span class="text-2xl">{{group.icon}}</span>
                <h2 class="font-display text-lg font-bold text-white uppercase">{{group.title}}</h2>
              </div>
              <ul class="space-y-2">
                @for (link of group.links; track link.label) {
                  <li>
                    <a [routerLink]="link.path"
                       class="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm py-1.5 border-b border-dark-500 last:border-0">
                      <span class="text-primary text-xs">▶</span>
                      <span>{{link.label}}</span>
                      @if (link.badge) {
                        <span class="ml-auto badge bg-primary/10 text-primary text-xs">{{link.badge}}</span>
                      }
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class SitemapComponent {
  siteGroups = [
    {
      icon: '🏠',
      title: 'Main Pages',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Fitness Blog', path: '/blog' },
      ]
    },
    {
      icon: '🏋️',
      title: 'Gyms',
      links: [
        { label: 'Find Gyms', path: '/gyms' },
        { label: 'Iron Beast Gym', path: '/gyms/iron-beast-gym' },
        { label: 'Flex Power Studio', path: '/gyms/flex-power-studio' },
        { label: 'Zenith Wellness Club', path: '/gyms/zenith-wellness-club' },
        { label: 'Urban CrossFit Box', path: '/gyms/urban-crossfit-box' },
        { label: 'Lotus Yoga & Pilates', path: '/gyms/lotus-yoga-pilates' },
        { label: 'AquaFit Center', path: '/gyms/aquafit-center' },
      ]
    },
    {
      icon: '👤',
      title: 'Trainers',
      links: [
        { label: 'All Trainers', path: '/trainers' },
        { label: 'Marcus Johnson', path: '/trainers/marcus-johnson' },
        { label: 'Sofia Martinez', path: '/trainers/sofia-martinez' },
        { label: 'Derek Chen', path: '/trainers/derek-chen' },
        { label: 'Alicia Brooks', path: '/trainers/alicia-brooks' },
        { label: 'Ryan O\'Brien', path: '/trainers/ryan-obrien' },
        { label: 'Priya Patel', path: '/trainers/priya-patel' },
      ]
    },
    {
      icon: '💳',
      title: 'Membership',
      links: [
        { label: 'Membership Plans', path: '/plans', badge: 'Save 40%' },
        { label: 'Day Pass – ₹1,299', path: '/plans' },
        { label: 'Monthly – ₹3,999/mo', path: '/plans' },
        { label: 'Quarterly – ₹3,199/mo', path: '/plans' },
        { label: 'Annual – ₹2,499/mo', path: '/plans', badge: 'Best Value' },
      ]
    },
    {
      icon: '📝',
      title: 'Blog Articles',
      links: [
        { label: 'All Articles', path: '/blog' },
        { label: 'Building Muscle Guide', path: '/blog/ultimate-guide-building-muscle' },
        { label: 'HIIT vs Steady Cardio', path: '/blog/hiit-vs-steady-state-cardio' },
        { label: 'Nutrition for Fat Loss', path: '/blog/nutrition-fat-loss-guide' },
        { label: 'Recovery & Sleep', path: '/blog/recovery-sleep-fitness' },
        { label: 'Home Workout Hacks', path: '/blog/home-workout-hacks' },
        { label: 'Gym Motivation Tips', path: '/blog/gym-motivation-tips' },
      ]
    },
    {
      icon: '⚖️',
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Sitemap', path: '/sitemap' },
      ]
    },
  ];
}
