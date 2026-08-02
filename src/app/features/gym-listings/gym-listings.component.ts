import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { GymCardComponent } from '../../shared/components/gym-card/gym-card.component';
import { Gym } from '../../core/models';

const PRICE_FLOOR = 0;
const PRICE_CEILING = 10000;

@Component({
  selector: 'app-gym-listings',
  standalone: true,
  imports: [CommonModule, FormsModule, GymCardComponent],
  template: `
    <!-- Hero -->
    <section class="relative pt-32 pb-12 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-2xl">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">Browse</span>
          <h1 class="section-title text-white mt-2 mb-4">Find Your <span class="gradient-text">Perfect Gym</span></h1>
          <p class="text-gray-400 text-lg">Explore {{ totalCount() }} premium gyms with verified reviews and transparent pricing.</p>
        </div>
      </div>
    </section>

    <section class="py-10 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- ── FILTERS (left sidebar) ── -->
          <aside class="lg:w-80 shrink-0">
            <div class="card p-6 gym-filter-panel">
              <div class="flex items-center justify-between mb-5">
                <h2 class="font-display font-bold text-white text-lg uppercase">
                  Filters
                  @if (activeFilterCount() > 0) {
                    <span class="filter-count">{{ activeFilterCount() }}</span>
                  }
                </h2>
                <button (click)="clearFilters()" class="text-primary text-sm hover:text-primary-400 transition-colors">
                  Clear all
                </button>
              </div>

              <div class="gym-filter-stack">
                <label class="admin-field">
                  <span>Search</span>
                  <input [(ngModel)]="searchQuery" (ngModelChange)="search.set($event)"
                         placeholder="Gym name, area or city…" class="input-field">
                </label>

                <label class="admin-field">
                  <span>City</span>
                  <select [ngModel]="city()" (ngModelChange)="city.set($event)" class="input-field">
                    <option value="">All cities</option>
                    @for (c of cities(); track c) { <option [value]="c">{{ c }}</option> }
                  </select>
                </label>

                <div class="admin-field">
                  <span>Max monthly budget: ₹{{ maxPrice() | number }}</span>
                  <input type="range" [min]="floor" [max]="ceiling" step="250" [value]="maxPrice()"
                         (input)="onMaxPrice($event)" class="w-full accent-primary">
                </div>

                <div class="admin-field">
                  <span>Minimum rating</span>
                  <div class="flex items-center gap-1.5">
                    @for (r of [1,2,3,4,5]; track r) {
                      <button type="button" (click)="setRating(r)"
                              [class]="minRating() >= r ? 'text-yellow-400' : 'text-gray-600'"
                              class="text-2xl hover:text-yellow-400 transition-colors leading-none">★</button>
                    }
                  </div>
                </div>

                <div class="admin-field">
                  <span>Availability</span>
                  <div class="flex flex-col gap-2 pt-1">
                    <label class="gym-check">
                      <input type="checkbox" [checked]="openNowOnly()" (change)="openNowOnly.set(!openNowOnly())"> Open now
                    </label>
                    <label class="gym-check">
                      <input type="checkbox" [checked]="featuredOnly()" (change)="featuredOnly.set(!featuredOnly())"> Featured only
                    </label>
                  </div>
                </div>
              </div>

              <!-- chip filters -->
              <button type="button" (click)="showMore.set(!showMore())" class="gym-more-toggle">
                {{ showMore() ? '− Fewer filters' : '+ More filters' }}
                @if (tagCount() + amenityCount() > 0) {
                  <span class="filter-count">{{ tagCount() + amenityCount() }}</span>
                }
              </button>

              @if (showMore()) {
                <div class="pt-5 mt-5 border-t border-dark-600 space-y-5">
                  @if (allTags().length) {
                    <div>
                      <span class="gym-chip-label">Facilities</span>
                      <div class="flex flex-wrap gap-2">
                        @for (tag of allTags(); track tag) {
                          <button type="button" (click)="toggleTag(tag)"
                                  [class]="selectedTags().includes(tag) ? 'gym-chip gym-chip-on' : 'gym-chip'">
                            {{ tag }}
                          </button>
                        }
                      </div>
                    </div>
                  }

                  @if (allAmenities().length) {
                    <div>
                      <span class="gym-chip-label">Amenities</span>
                      <div class="flex flex-wrap gap-2">
                        @for (a of allAmenities(); track a) {
                          <button type="button" (click)="toggleAmenity(a)"
                                  [class]="selectedAmenities().includes(a) ? 'gym-chip gym-chip-on' : 'gym-chip'">
                            {{ a }}
                          </button>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </aside>

          <!-- ── RESULTS (right) ── -->
          <div class="flex-1 min-w-0">
            @if (loadError()) {
              <div class="card p-10 text-center">
                <div class="text-4xl mb-3">🔌</div>
                <h3 class="font-display text-xl font-bold text-white uppercase mb-2">Can't load gyms</h3>
                <p class="text-gray-400">{{ loadError() }}</p>
              </div>
            } @else if (loading()) {
              <p class="text-gray-400">Loading gyms...</p>
            } @else {
              <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p class="text-gray-400">
                  Showing <span class="text-white font-semibold">{{ filteredGyms().length }}</span>
                  of <span class="text-white font-semibold">{{ totalCount() }}</span> gyms
                </p>
                <select [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)"
                        class="input-field w-52 text-sm py-2">
                  <option value="featured">Featured first</option>
                  <option value="rating">Highest rated</option>
                  <option value="reviews">Most reviewed</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>

              @if (filteredGyms().length === 0) {
                <div class="text-center py-20">
                  <div class="text-6xl mb-4">🔍</div>
                  <h3 class="font-display text-2xl text-white mb-2">No gyms found</h3>
                  <p class="text-gray-400 mb-6">Try widening your filters</p>
                  <button (click)="clearFilters()" class="btn-primary">Clear filters</button>
                </div>
              } @else {
                <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  @for (gym of filteredGyms(); track gym.id) {
                    <app-gym-card [gym]="gym"/>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class GymListingsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  floor = PRICE_FLOOR;
  ceiling = PRICE_CEILING;

  allGyms = signal<Gym[]>([]);
  loading = signal(true);
  loadError = signal('');

  /** ngModel needs a plain field; the signal drives the filtering. */
  searchQuery = '';
  search = signal('');
  city = signal('');
  sortBy = signal('featured');
  maxPrice = signal(PRICE_CEILING);
  minRating = signal(0);
  openNowOnly = signal(false);
  featuredOnly = signal(false);
  selectedTags = signal<string[]>([]);
  selectedAmenities = signal<string[]>([]);
  showMore = signal(false);

  totalCount = computed(() => this.allGyms().length);

  // Options come from the gyms actually listed, so a newly added gym's
  // facilities show up here without anyone editing a hardcoded array.
  cities = computed(() => [...new Set(this.allGyms().map(g => g.city).filter(Boolean))].sort());
  allTags = computed(() => [...new Set(this.allGyms().flatMap(g => g.tags ?? []))].sort());
  allAmenities = computed(() => [...new Set(this.allGyms().flatMap(g => g.amenities ?? []))].sort());

  tagCount = computed(() => this.selectedTags().length);
  amenityCount = computed(() => this.selectedAmenities().length);

  activeFilterCount = computed(() => {
    let n = 0;
    if (this.search().trim()) n++;
    if (this.city()) n++;
    if (this.maxPrice() < PRICE_CEILING) n++;
    if (this.minRating() > 0) n++;
    if (this.openNowOnly()) n++;
    if (this.featuredOnly()) n++;
    return n + this.tagCount() + this.amenityCount();
  });

  filteredGyms = computed(() => {
    let list = [...this.allGyms()];

    const q = this.search().trim().toLowerCase();
    if (q) {
      list = list.filter(g =>
        g.name?.toLowerCase().includes(q) ||
        g.city?.toLowerCase().includes(q) ||
        g.location?.toLowerCase().includes(q));
    }
    if (this.city()) list = list.filter(g => g.city === this.city());

    list = list.filter(g => (g.price ?? 0) <= this.maxPrice());

    if (this.minRating() > 0) list = list.filter(g => (g.rating ?? 0) >= this.minRating());
    if (this.openNowOnly()) list = list.filter(g => g.openNow);
    if (this.featuredOnly()) list = list.filter(g => g.featured);

    // Every selected facility/amenity must be present, so stacking them narrows
    // rather than widens the results.
    const tags = this.selectedTags();
    if (tags.length) list = list.filter(g => tags.every(t => g.tags?.includes(t)));

    const amenities = this.selectedAmenities();
    if (amenities.length) list = list.filter(g => amenities.every(a => g.amenities?.includes(a)));

    switch (this.sortBy()) {
      case 'rating':     list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case 'reviews':    list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)); break;
      case 'price_asc':  list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case 'price_desc': list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case 'name':       list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')); break;
      default:           list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  });

  async ngOnInit() {
    try {
      this.allGyms.set(await firstValueFrom(this.api.getGyms()));
    } catch {
      this.loadError.set('The gym directory is temporarily unavailable. Please try again shortly.');
    } finally {
      this.loading.set(false);
    }

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.search.set(params['q']);
      }
    });
  }

  setRating(r: number) {
    // Tapping the active star clears it, which is less fiddly than hunting the reset link.
    this.minRating.set(this.minRating() === r ? 0 : r);
  }

  onMaxPrice(e: Event) {
    this.maxPrice.set(+(e.target as HTMLInputElement).value);
  }

  toggleTag(tag: string) {
    const tags = this.selectedTags();
    this.selectedTags.set(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  }

  toggleAmenity(a: string) {
    const list = this.selectedAmenities();
    this.selectedAmenities.set(list.includes(a) ? list.filter(x => x !== a) : [...list, a]);
  }

  clearFilters() {
    this.searchQuery = '';
    this.search.set('');
    this.city.set('');
    this.maxPrice.set(PRICE_CEILING);
    this.minRating.set(0);
    this.openNowOnly.set(false);
    this.featuredOnly.set(false);
    this.selectedTags.set([]);
    this.selectedAmenities.set([]);
    this.sortBy.set('featured');
  }
}
