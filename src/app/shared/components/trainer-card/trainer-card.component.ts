import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Trainer } from '../../../core/models';

@Component({
  selector: 'app-trainer-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card group hover:-translate-y-1 transition-all duration-300 shadow-xl text-center h-full flex flex-col">
      <!-- Photo -->
      <div class="relative">
        <div class="overflow-hidden h-64">
          <img [src]="trainer.photo" [alt]="trainer.name"
               class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
        </div>
        @if (trainer.freelance) {
          <span class="freelance-badge">Freelance</span>
        }
        <!-- Social links overlay -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          @if (trainer.social && trainer.social.instagram) {
            <a href="#" class="w-9 h-9 bg-primary rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          }
        </div>
      </div>

      <!-- Info -->
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-display text-xl font-bold text-white group-hover:text-primary transition-colors">{{trainer.name}}</h3>
        <p class="text-primary text-sm font-medium mt-1 mb-3">{{trainer.title}}</p>

        <div class="flex items-center justify-center gap-1.5 mb-3">
          <span class="text-yellow-400">★</span>
          <span class="text-white font-semibold">{{trainer.rating}}</span>
          <span class="text-gray-400 text-sm">({{trainer.reviewCount}} reviews)</span>
        </div>

        <div class="flex flex-wrap justify-center gap-1.5 mb-4">
          @for (spec of (trainer.specializations || []).slice(0, 2); track spec) {
            <span class="badge bg-dark-600 text-gray-300 text-xs border border-dark-400">{{spec}}</span>
          }
        </div>

        <div class="flex items-center justify-center gap-4 text-sm text-gray-400 mb-4">
          <span class="flex items-center gap-1"><strong class="text-white">{{trainer.experience}}</strong> yrs</span>
          <span class="text-dark-500">|</span>
          <span class="flex items-center gap-1"><strong class="text-white">{{trainer.clients}}+</strong> clients</span>
        </div>

        @if (trainer.monthlyRate) {
          <div class="trainer-rate">
            <span class="trainer-rate-amount">₹{{ trainer.monthlyRate.toLocaleString('en-IN') }}</span>
            <span class="trainer-rate-unit">/month</span>
          </div>
          @if (trainer.gyms && trainer.gyms.length) {
            <p class="trainer-rate-gyms">Trains at {{ gymNames() }}</p>
          }
        }

        <a [routerLink]="['/trainers', trainer.slug]" class="btn-primary w-full justify-center text-sm py-2.5 mt-auto">
          View Profile
        </a>
      </div>
    </div>
  `,
})
export class TrainerCardComponent {
  @Input() trainer!: Trainer;

  gymNames() {
    return (this.trainer.gyms ?? []).map(g => g.name).filter(Boolean).join(', ');
  }
}
