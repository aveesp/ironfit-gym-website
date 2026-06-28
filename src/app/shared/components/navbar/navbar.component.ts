import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav [class]="scrolled() ? 'bg-dark-800/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'"
         class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
              </svg>
            </div>
            <span class="font-display text-2xl font-bold text-white tracking-wider">IRONFIT</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}" class="nav-link pb-1">Home</a>
            <a routerLink="/gyms" routerLinkActive="text-primary" class="nav-link pb-1">Find Gyms</a>
            <a routerLink="/trainers" routerLinkActive="text-primary" class="nav-link pb-1">Trainers</a>
            <a routerLink="/plans" routerLinkActive="text-primary" class="nav-link pb-1">Membership</a>
            <a routerLink="/blog" routerLinkActive="text-primary" class="nav-link pb-1">Blog</a>
            <a routerLink="/about" routerLinkActive="text-primary" class="nav-link pb-1">About</a>
          </div>

          <!-- CTA -->
          <div class="hidden md:flex items-center gap-4">
            <a routerLink="/contact" class="text-gray-300 hover:text-white font-medium transition-colors">Contact</a>
            <a routerLink="/gyms" class="btn-primary text-sm py-2.5">Join Today</a>
          </div>

          <!-- Mobile menu button -->
          <button (click)="menuOpen.set(!menuOpen())" class="md:hidden text-white p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              @if (!menuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              }
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        @if (menuOpen()) {
          <div class="md:hidden bg-dark-800 rounded-2xl mb-4 p-4 border border-dark-500">
            <div class="flex flex-col gap-2">
              <a routerLink="/" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">Home</a>
              <a routerLink="/gyms" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">Find Gyms</a>
              <a routerLink="/trainers" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">Trainers</a>
              <a routerLink="/plans" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">Membership</a>
              <a routerLink="/blog" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">Blog</a>
              <a routerLink="/about" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">About</a>
              <a routerLink="/contact" (click)="menuOpen.set(false)" class="px-4 py-3 rounded-lg hover:bg-dark-600 text-gray-300 hover:text-white transition-colors">Contact</a>
              <a routerLink="/gyms" (click)="menuOpen.set(false)" class="btn-primary justify-center mt-2">Join Today</a>
            </div>
          </div>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 50); }
}
