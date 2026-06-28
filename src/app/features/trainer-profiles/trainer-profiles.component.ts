import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { TrainerCardComponent } from '../../shared/components/trainer-card/trainer-card.component';

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

    <section class="py-16 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Filter pills -->
        <div class="flex flex-wrap gap-3 mb-10">
          @for (spec of specializations; track spec) {
            <button [class]="activeSpec === spec ? 'bg-primary text-white' : 'bg-dark-700 text-gray-400 hover:text-white border border-dark-500'"
                    (click)="activeSpec = spec"
                    class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">
              {{spec}}
            </button>
          }
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (trainer of trainers; track trainer.id) {
            <app-trainer-card [trainer]="trainer"/>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-primary/10 via-dark-800 to-primary/10 border-y border-primary/20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="font-display text-4xl font-bold text-white uppercase mb-4">Are You a Trainer?</h2>
        <p class="text-gray-400 text-lg mb-8">Join our platform and connect with thousands of potential clients in your area.</p>
        <a routerLink="/contact" class="btn-primary text-lg px-10 py-4">Join as a Trainer</a>
      </div>
    </section>
  `,
})
export class TrainerProfilesComponent {
  private data = inject(DataService);
  trainers = this.data.getTrainers();
  activeSpec = 'All';
  specializations = ['All', 'Strength Training', 'Yoga', 'CrossFit', 'Weight Loss', 'Swimming', 'Bodybuilding'];
}
