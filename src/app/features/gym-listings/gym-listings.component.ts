import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { GymCardComponent } from '../../shared/components/gym-card/gym-card.component';
import { Gym } from '../../core/models';

@Component({
  selector: 'app-gym-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GymCardComponent],
  template: `
    <!-- Hero Banner -->
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-2xl">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">Browse</span>
          <h1 class="section-title text-white mt-2 mb-4">Find Your <span class="gradient-text">Perfect Gym</span></h1>
          <p class="text-gray-400 text-lg">Explore {{totalCount()}} premium gyms with verified reviews and transparent pricing.</p>
        </div>
      </div>
    </section>

    <section class="py-12 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- Sidebar Filters -->
          <aside class="lg:w-72 shrink-0">
            <div class="card p-6 sticky top-24">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-display font-bold text-white text-xl uppercase">Filters</h3>
                <button (click)="clearFilters()" class="text-primary text-sm hover:text-primary-400 transition-colors">Clear All</button>
              </div>

              <!-- Search -->
              <div class="mb-6">
                <label class="text-gray-400 text-sm font-medium mb-2 block">Search</label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Name or location..."
                         class="input-field pl-9 text-sm">
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-6">
                <label class="text-gray-400 text-sm font-medium mb-2 block">Max Price: ₹{{maxPrice() | number}}/mo</label>
                <input type="range" min="1299" max="8000" step="500" [value]="maxPrice()"
                       (input)="onPriceChange($event)"
                       class="w-full accent-primary">
                <div class="flex justify-between text-gray-500 text-xs mt-1">
                  <span>₹1,299</span><span>₹8,000</span>
                </div>
              </div>

              <!-- Min Rating -->
              <div class="mb-6">
                <label class="text-gray-400 text-sm font-medium mb-3 block">Minimum Rating</label>
                <div class="flex gap-2">
                  @for (r of [1,2,3,4,5]; track r) {
                    <button (click)="minRating.set(r); applyFilters()"
                            [class]="minRating() >= r ? 'text-yellow-400' : 'text-gray-600'"
                            class="text-2xl hover:text-yellow-400 transition-colors">★</button>
                  }
                </div>
              </div>

              <!-- Filters -->
              <div class="mb-6">
                <label class="text-gray-400 text-sm font-medium mb-3 block">Availability</label>
                <label class="flex items-center gap-3 cursor-pointer mb-2">
                  <input type="checkbox" [(ngModel)]="openNowOnly" (ngModelChange)="applyFilters()"
                         class="w-4 h-4 accent-primary rounded">
                  <span class="text-gray-300 text-sm">Open Now</span>
                </label>
              </div>

              <!-- Facility Tags -->
              <div>
                <label class="text-gray-400 text-sm font-medium mb-3 block">Facilities</label>
                <div class="flex flex-wrap gap-2">
                  @for (tag of allTags; track tag) {
                    <button (click)="toggleTag(tag)"
                            [class]="selectedTags().includes(tag) ? 'bg-primary text-white border-primary' : 'bg-dark-600 text-gray-400 border-dark-400 hover:border-primary/50'"
                            class="text-xs border rounded-full px-3 py-1.5 transition-all duration-200">
                      {{tag}}
                    </button>
                  }
                </div>
              </div>
            </div>
          </aside>

          <!-- Main Content -->
          <div class="flex-1">
            <!-- Results header -->
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-400">
                Showing <span class="text-white font-semibold">{{filteredGyms().length}}</span> of <span class="text-white font-semibold">{{totalCount()}}</span> gyms
              </p>
              <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" class="input-field w-44 text-sm py-2">
                <option value="featured">Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            @if (filteredGyms().length === 0) {
              <div class="text-center py-20">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="font-display text-2xl text-white mb-2">No gyms found</h3>
                <p class="text-gray-400 mb-6">Try adjusting your filters</p>
                <button (click)="clearFilters()" class="btn-primary">Clear Filters</button>
              </div>
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (gym of filteredGyms(); track gym.id) {
                  <app-gym-card [gym]="gym"/>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class GymListingsComponent implements OnInit {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);

  searchQuery = '';
  maxPrice = signal(8000);
  minRating = signal(0);
  openNowOnly = false;
  selectedTags = signal<string[]>([]);
  sortBy = 'featured';

  allTags = ['CrossFit', 'Personal Training', 'Cardio', 'Yoga', 'Pilates', 'Swimming', 'HIIT', 'Strength', 'Women Only'];
  allGyms: Gym[] = [];
  filteredGyms = signal<Gym[]>([]);
  totalCount = computed(() => this.allGyms.length);

  ngOnInit() {
    this.allGyms = this.data.getGyms();
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchQuery = params['q'];
      this.applyFilters();
    });
  }

  applyFilters() {
    let result = [...this.allGyms];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(g => g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || g.location.toLowerCase().includes(q));
    }
    result = result.filter(g => g.price <= this.maxPrice());
    if (this.minRating() > 0) result = result.filter(g => g.rating >= this.minRating());
    if (this.openNowOnly) result = result.filter(g => g.openNow);
    if (this.selectedTags().length > 0) result = result.filter(g => this.selectedTags().some(t => g.tags.includes(t)));

    if (this.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (this.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    this.filteredGyms.set(result);
  }

  toggleTag(tag: string) {
    const tags = this.selectedTags();
    this.selectedTags.set(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
    this.applyFilters();
  }

  onPriceChange(e: Event) {
    this.maxPrice.set(+(e.target as HTMLInputElement).value);
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.maxPrice.set(8000);
    this.minRating.set(0);
    this.openNowOnly = false;
    this.selectedTags.set([]);
    this.sortBy = 'featured';
    this.applyFilters();
  }
}
