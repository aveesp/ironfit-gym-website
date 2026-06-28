import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { GymCardComponent } from '../../shared/components/gym-card/gym-card.component';
import { TrainerCardComponent } from '../../shared/components/trainer-card/trainer-card.component';
import { PlanCardComponent } from '../../shared/components/plan-card/plan-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, GymCardComponent, TrainerCardComponent, PlanCardComponent],
  template: `
    <!-- ====== HERO ====== -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <!-- BG Image -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920" alt="Gym"
             class="w-full h-full object-cover">
        <div class="hero-overlay absolute inset-0"></div>
        <!-- Red accent line -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div class="max-w-3xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8">
            <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span class="text-primary text-sm font-medium">Premium Fitness Platform</span>
          </div>

          <h1 class="font-display text-6xl md:text-8xl font-bold uppercase leading-none mb-6">
            <span class="text-white block">TRAIN</span>
            <span class="gradient-text block">HARDER.</span>
            <span class="text-white block">LIVE BETTER.</span>
          </h1>

          <p class="text-gray-300 text-xl leading-relaxed mb-8 max-w-xl">
            Discover elite gyms, world-class trainers, and membership plans tailored to your goals. Your transformation starts today.
          </p>

          <!-- Stats row -->
          <div class="flex items-center gap-8 mb-10">
            @for (stat of heroStats; track stat.label) {
              <div>
                <div class="font-display text-3xl font-bold text-primary">{{stat.value}}</div>
                <div class="text-gray-400 text-sm">{{stat.label}}</div>
              </div>
            }
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4 mb-12">
            <a routerLink="/gyms" class="btn-primary text-lg px-8 py-4">
              Find a Gym
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a routerLink="/trainers" class="btn-secondary text-lg px-8 py-4">Meet Trainers</a>
          </div>

          <!-- Search Bar -->
          <div class="bg-dark-800/80 backdrop-blur-sm rounded-2xl p-4 border border-dark-500 max-w-2xl">
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input [(ngModel)]="searchQuery" (keyup.enter)="search()"
                       placeholder="Search gyms, location..."
                       class="input-field pl-10">
              </div>
              <button (click)="search()" class="btn-primary px-6">Search</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2">
        <span class="text-gray-400 text-xs uppercase tracking-widest" style="writing-mode:vertical-rl">Scroll</span>
        <div class="w-px h-16 bg-gradient-to-b from-primary to-transparent"></div>
      </div>
    </section>

    <!-- ====== FEATURES ====== -->
    <section class="py-20 bg-dark-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          @for (feature of features; track feature.title) {
            <div class="glass rounded-2xl p-6 text-center group hover:bg-primary/10 transition-all duration-300">
              <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <span class="text-3xl">{{feature.icon}}</span>
              </div>
              <h3 class="font-display font-bold text-white text-xl mb-1">{{feature.value}}</h3>
              <p class="text-gray-400 text-sm">{{feature.title}}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ====== FEATURED GYMS ====== -->
    <section class="py-24 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span class="text-primary font-semibold uppercase tracking-widest text-sm">Top Picks</span>
            <h2 class="section-title text-white mt-2">Featured <span class="gradient-text">Gyms</span></h2>
            <p class="text-gray-400 mt-3">Hand-picked premium fitness centres near you</p>
          </div>
          <a routerLink="/gyms" class="btn-secondary hidden md:inline-flex">View All Gyms</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (gym of featuredGyms; track gym.id) {
            <app-gym-card [gym]="gym"/>
          }
        </div>

        <div class="text-center mt-10 md:hidden">
          <a routerLink="/gyms" class="btn-secondary">View All Gyms</a>
        </div>
      </div>
    </section>

    <!-- ====== WHY CHOOSE US ====== -->
    <section class="py-24 bg-dark-800 relative overflow-hidden">
      <div class="absolute right-0 top-0 w-1/2 h-full opacity-5">
        <svg viewBox="0 0 400 400" fill="currentColor" class="text-primary w-full h-full">
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-primary font-semibold uppercase tracking-widest text-sm">Why IronFit</span>
            <h2 class="section-title text-white mt-2 mb-6">The Smarter Way to <span class="gradient-text">Get Fit</span></h2>
            <p class="text-gray-400 text-lg leading-relaxed mb-10">
              We're not just a gym directory. We're your complete fitness partner — from discovering the perfect gym to tracking your progress and connecting with world-class trainers.
            </p>
            <div class="space-y-6">
              @for (reason of whyUs; track reason.title) {
                <div class="flex gap-5">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-2xl">{{reason.icon}}</div>
                  <div>
                    <h3 class="font-semibold text-white text-lg mb-1">{{reason.title}}</h3>
                    <p class="text-gray-400">{{reason.desc}}</p>
                  </div>
                </div>
              }
            </div>
            <a routerLink="/about" class="btn-primary mt-10">Learn More About Us</a>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600" alt="Training" class="rounded-2xl object-cover h-72 w-full">
            <img src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=600" alt="Trainer" class="rounded-2xl object-cover h-72 w-full mt-8">
            <img src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600" alt="Yoga" class="rounded-2xl object-cover h-48 w-full -mt-4">
            <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600" alt="Crossfit" class="rounded-2xl object-cover h-48 w-full mt-4">
          </div>
        </div>
      </div>
    </section>

    <!-- ====== FEATURED TRAINERS ====== -->
    <section class="py-24 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span class="text-primary font-semibold uppercase tracking-widest text-sm">Expert Coaches</span>
            <h2 class="section-title text-white mt-2">Meet Our <span class="gradient-text">Trainers</span></h2>
            <p class="text-gray-400 mt-3">Certified professionals dedicated to your results</p>
          </div>
          <a routerLink="/trainers" class="btn-secondary hidden md:inline-flex">All Trainers</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (trainer of featuredTrainers; track trainer.id) {
            <app-trainer-card [trainer]="trainer"/>
          }
        </div>
      </div>
    </section>

    <!-- ====== MEMBERSHIP PLANS ====== -->
    <section class="py-24 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-16">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">Pricing</span>
          <h2 class="section-title text-white mt-2">Simple, Transparent <span class="gradient-text">Plans</span></h2>
          <p class="text-gray-400 mt-3 max-w-lg mx-auto">No hidden fees. Cancel anytime. Choose what works for you.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          @for (plan of plans; track plan.id) {
            <app-plan-card [plan]="plan"/>
          }
        </div>
      </div>
    </section>

    <!-- ====== SUCCESS STORIES ====== -->
    <section class="py-24 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">Testimonials</span>
          <h2 class="section-title text-white mt-2">Real Results, <span class="gradient-text">Real People</span></h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (t of testimonials; track t.name) {
            <div class="card p-8 relative">
              <div class="text-5xl text-primary/20 font-serif absolute top-4 right-6">"</div>
              <div class="flex text-yellow-400 mb-4">★★★★★</div>
              <p class="text-gray-300 leading-relaxed mb-6 italic">"{{t.comment}}"</p>
              <div class="flex items-center gap-4">
                <img [src]="t.avatar" [alt]="t.name" class="w-12 h-12 rounded-full object-cover border-2 border-primary/40">
                <div>
                  <p class="font-semibold text-white">{{t.name}}</p>
                  <p class="text-gray-400 text-sm">{{t.result}}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ====== BLOG ====== -->
    <section class="py-24 bg-dark-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span class="text-primary font-semibold uppercase tracking-widest text-sm">Insights</span>
            <h2 class="section-title text-white mt-2">Latest <span class="gradient-text">Articles</span></h2>
          </div>
          <a routerLink="/blog" class="btn-secondary hidden md:inline-flex">All Articles</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (post of latestBlogs; track post.id) {
            <article class="card group hover:-translate-y-1 transition-all duration-300">
              <div class="overflow-hidden h-48">
                <img [src]="post.image" [alt]="post.title"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>
              <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                  <span class="badge bg-primary/10 text-primary border border-primary/20 text-xs">{{post.category}}</span>
                  <span class="text-gray-500 text-xs">{{post.readTime}} min read</span>
                </div>
                <h3 class="font-display text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">{{post.title}}</h3>
                <p class="text-gray-400 text-sm line-clamp-2 mb-4">{{post.excerpt}}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img [src]="post.authorAvatar" [alt]="post.author" class="w-8 h-8 rounded-full object-cover">
                    <span class="text-gray-400 text-sm">{{post.author}}</span>
                  </div>
                  <a [routerLink]="['/blog', post.slug]" class="text-primary hover:text-primary-400 text-sm font-medium transition-colors">Read →</a>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- ====== FAQ ====== -->
    <section class="py-24 bg-dark-900">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">FAQ</span>
          <h2 class="section-title text-white mt-2">Got <span class="gradient-text">Questions?</span></h2>
        </div>
        <div class="space-y-3">
          @for (faq of faqs; track faq.question; let i = $index) {
            <div class="card border border-dark-500">
              <button (click)="toggleFaq(i)" class="w-full flex items-center justify-between p-6 text-left">
                <span class="font-semibold text-white pr-4">{{faq.question}}</span>
                <svg [class]="openFaq() === i ? 'rotate-180' : ''" class="w-5 h-5 text-primary shrink-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              @if (openFaq() === i) {
                <div class="px-6 pb-6 text-gray-400 leading-relaxed border-t border-dark-500 pt-4">
                  {{faq.answer}}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ====== CTA BANNER ====== -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920" alt="" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-dark-900/85"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-display text-5xl md:text-7xl font-bold text-white uppercase mb-6">
          Ready to <span class="gradient-text">Transform?</span>
        </h2>
        <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">Join thousands of members who've already changed their lives. Your best self is waiting.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/gyms" class="btn-primary text-lg px-10 py-4">Start Today — It's Free</a>
          <a routerLink="/contact" class="btn-white text-lg px-10 py-4">Talk to an Expert</a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  private data = inject(DataService);
  private router = inject(Router);

  searchQuery = '';
  openFaq = signal(-1);

  featuredGyms = this.data.getFeaturedGyms();
  featuredTrainers = this.data.getFeaturedTrainers();
  plans = this.data.getPlans();
  latestBlogs = this.data.getLatestBlogs(3);
  faqs = this.data.getFaqs();

  heroStats = [
    { value: '500+', label: 'Gyms Listed' },
    { value: '200+', label: 'Trainers' },
    { value: '50K+', label: 'Members' },
  ];

  features = [
    { icon: '🏋️', value: '500+', title: 'Premium Gyms' },
    { icon: '💪', value: '200+', title: 'Expert Trainers' },
    { icon: '⭐', value: '4.8', title: 'Avg. Rating' },
    { icon: '🏆', value: '50K+', title: 'Happy Members' },
  ];

  whyUs = [
    { icon: '🔍', title: 'Smart Gym Discovery', desc: 'Advanced filters to find the perfect gym based on your location, budget, and fitness goals.' },
    { icon: '✅', title: 'Verified Reviews', desc: 'Authentic ratings and reviews from real members help you make an informed decision.' },
    { icon: '📱', title: 'Seamless Booking', desc: 'Book trial sessions, PT consultations, and classes directly through our platform.' },
  ];

  testimonials = [
    { name: 'James W.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', comment: 'Found my perfect gym through IronFit in less than 5 minutes. The trainer I booked helped me lose 30lbs in 4 months!', result: 'Lost 30 lbs in 4 months' },
    { name: 'Priya S.', avatar: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=100', comment: 'The women-only filter is amazing. Found a beautiful studio close to home with incredible instructors. Highly recommend!', result: 'Gained strength & confidence' },
    { name: 'Mike T.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', comment: 'As a CrossFit enthusiast, finding a great box used to be hard. IronFit made it so easy. My performance has gone through the roof.', result: 'PR\'d every lift this year' },
  ];

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/gyms'], { queryParams: { q: this.searchQuery } });
    }
  }

  toggleFaq(i: number) {
    this.openFaq.set(this.openFaq() === i ? -1 : i);
  }
}
