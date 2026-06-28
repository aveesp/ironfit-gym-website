import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Gym } from '../../../core/models';

@Component({
  selector: 'app-gym-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card group cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-xl">
      <!-- Image -->
      <div class="relative overflow-hidden h-52">
        <img [src]="gym.images[0]" [alt]="gym.name"
             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
        <!-- Tags -->
        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          @if (gym.featured) {
            <span class="badge bg-primary text-white">⭐ Featured</span>
          }
          @if (gym.openNow) {
            <span class="badge bg-green-500/90 text-white">● Open Now</span>
          } @else {
            <span class="badge bg-gray-600/90 text-white">● Closed</span>
          }
        </div>
        <!-- Price -->
        <div class="absolute top-3 right-3">
          <span class="bg-dark-900/90 text-white font-bold text-sm px-3 py-1.5 rounded-lg">{{gym.priceLabel}}</span>
        </div>
        <!-- Rating overlay -->
        <div class="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div class="flex text-yellow-400 text-sm">
            @for (s of stars(gym.rating); track $index) {
              <span>{{s}}</span>
            }
          </div>
          <span class="text-white text-sm font-semibold">{{gym.rating}}</span>
          <span class="text-gray-300 text-xs">({{gym.reviewCount}})</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-display text-xl font-bold text-white group-hover:text-primary transition-colors">{{gym.name}}</h3>
        </div>
        <p class="text-gray-400 text-sm flex items-center gap-1.5 mb-3">
          <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          {{gym.location}}, {{gym.city}}
        </p>
        <p class="text-gray-400 text-sm line-clamp-2 mb-4">{{gym.description}}</p>

        <!-- Facilities -->
        <div class="flex flex-wrap gap-1.5 mb-5">
          @for (tag of gym.tags.slice(0, 3); track tag) {
            <span class="badge bg-dark-600 text-gray-300 text-xs border border-dark-400">{{tag}}</span>
          }
        </div>

        <a [routerLink]="['/gyms', gym.slug]" class="btn-primary w-full justify-center text-sm py-2.5">
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  `,
})
export class GymCardComponent {
  @Input() gym!: Gym;

  stars(rating: number): string[] {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return [...Array(full).fill('★'), ...(half ? ['½'] : []), ...Array(5 - full - (half ? 1 : 0)).fill('☆')];
  }
}
