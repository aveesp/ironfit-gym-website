import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { TrainerCardComponent } from '../../shared/components/trainer-card/trainer-card.component';
import { Trainer } from '../../core/models';

@Component({
  selector: 'app-trainer-profiles',
  standalone: true,
  imports: [CommonModule, RouterLink, TrainerCardComponent],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Expert Coaches</span>
        <h1 class="section-title text-white mt-2 mb-4">Our <span class="gradient-text">Trainers</span></h1>
        <p class="text-gray-400 text-lg max-w-xl mx-auto">Certified professionals with proven track records. Find your perfect coach.</p>
      </div>
    </section>

    <section class="py-16 bg-dark-900 trainers-filter-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        @if (loadError()) {
          <div class="card p-10 text-center">
            <div class="text-4xl mb-3">🔌</div>
            <h2 class="font-display text-xl font-bold text-white uppercase mb-2">Can't load trainers</h2>
            <p class="text-gray-400">{{ loadError() }}</p>
          </div>
        } @else if (loading()) {
          <p class="text-gray-400">Loading trainers...</p>
        } @else {
          <!-- Specialisation pills, derived from the trainers actually listed -->
          <div class="flex flex-wrap gap-3 mb-6">
            @for (spec of specializations(); track spec) {
              <button [class]="activeSpec() === spec ? 'bg-primary text-white' : 'filter-pill-inactive'"
                      (click)="activeSpec.set(spec)"
                      class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">
                {{ spec }}
              </button>
            }
          </div>

          @if (freelanceCount() > 0) {
            <label class="freelance-toggle">
              <input type="checkbox" [checked]="freelanceOnly()"
                     (change)="freelanceOnly.set(!freelanceOnly())">
              Freelance only ({{ freelanceCount() }})
            </label>
          }

          <p class="text-gray-400 text-sm mb-6">
            Showing <strong class="text-white">{{ filtered().length }}</strong>
            {{ filtered().length === 1 ? 'trainer' : 'trainers' }}
          </p>

          @if (filtered().length === 0) {
            <div class="card p-10 text-center">
              <p class="text-gray-400">No trainers match those filters.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (trainer of filtered(); track trainer.id) {
                <app-trainer-card [trainer]="trainer"/>
              }
            </div>
          }
        }
      </div>
    </section>

    <!-- CTA -->
    <section class="trainer-cta-section py-20 w-full">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="font-display text-4xl font-bold uppercase mb-4 trainer-cta-title">Are You a Trainer?</h2>
        <p class="trainer-cta-subtitle text-lg mb-8">Join our platform and connect with thousands of potential clients in your area.</p>
        <a routerLink="/contact" class="btn-primary text-lg px-10 py-4">Join as a Trainer</a>
      </div>
    </section>
  `,
})
export class TrainerProfilesComponent implements OnInit {
  private api = inject(ApiService);

  trainers = signal<Trainer[]>([]);
  loading = signal(true);
  loadError = signal('');

  activeSpec = signal('All');
  freelanceOnly = signal(false);

  /** Derived from the data, so a new specialisation never needs a pill added here. */
  specializations = computed(() =>
    ['All', ...new Set(this.trainers().flatMap(t => t.specializations ?? []))]);

  freelanceCount = computed(() => this.trainers().filter(t => t.freelance).length);

  filtered = computed(() => {
    let list = this.trainers();
    if (this.freelanceOnly()) list = list.filter(t => t.freelance);
    const spec = this.activeSpec();
    if (spec !== 'All') list = list.filter(t => t.specializations?.includes(spec));
    return list;
  });

  async ngOnInit() {
    try {
      this.trainers.set(await firstValueFrom(this.api.getTrainers()));
    } catch {
      this.loadError.set('The trainer directory is temporarily unavailable. Please try again shortly.');
    } finally {
      this.loading.set(false);
    }
  }
}
