import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

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
            <!-- Theme toggle -->
            <button (click)="toggleTheme()" title="Toggle light/dark theme"
                    class="w-9 h-9 rounded-lg bg-light-600 hover:bg-light-500 flex items-center justify-center transition-colors">
              @if (isDark()) {
                <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.106a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06L6.166 6.106z"/>
                </svg>
              } @else {
                <svg class="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
                </svg>
              }
            </button>
            <a routerLink="/contact" class="text-gray-300 hover:text-white font-medium transition-colors">Contact</a>
            @if (authSvc.currentUser()) {
              <button (click)="authSvc.logout()" class="btn-secondary text-sm py-2.5">Sign Out</button>
            } @else {
              <a routerLink="/login" class="text-gray-300 hover:text-white font-medium transition-colors">Sign In</a>
              <a routerLink="/register" class="btn-primary text-sm py-2.5">Join Today</a>
            }
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
  authSvc = inject(FirebaseAuthService);
  scrolled = signal(false);
  menuOpen = signal(false);
  isDark = signal(true);

  constructor() {
    const saved = localStorage.getItem('ironfit-theme');
    const dark = saved ? saved === 'dark' : true;
    this.isDark.set(dark);
    this.applyTheme(dark);
  }

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 50); }

  toggleTheme() {
    const dark = !this.isDark();
    this.isDark.set(dark);
    localStorage.setItem('ironfit-theme', dark ? 'dark' : 'light');
    this.applyTheme(dark);
  }

  private applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.remove('light-theme');
      document.body.style.backgroundColor = '#0a0a0a';
    } else {
      document.documentElement.classList.add('light-theme');
      document.body.style.backgroundColor = '#f1f5f9';
    }
  }
}
