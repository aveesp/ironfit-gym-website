import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="page-min bg-dark-900 flex items-center justify-center px-4 py-24">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
          <h1 class="font-display text-3xl font-bold text-white">Welcome Back</h1>
          <p class="text-gray-400 mt-2">Sign in to your IronFit account</p>
        </div>

        <div class="card p-8">
          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
              {{error()}}
            </div>
          }

          <form (ngSubmit)="login()" #loginForm="ngForm" class="space-y-5">
            <div>
              <label class="text-gray-400 text-sm font-medium mb-2 block">Email Address</label>
              <input type="email" name="email" [(ngModel)]="email" required
                     placeholder="john@example.com" class="input-field">
            </div>
            <div>
              <label class="text-gray-400 text-sm font-medium mb-2 block">Password</label>
              <input type="password" name="password" [(ngModel)]="password" required
                     placeholder="••••••••" class="input-field">
            </div>

            <button type="submit" [disabled]="loading() || loginForm.invalid"
                    class="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) { <span>Signing in...</span> } @else { <span>Sign In</span> }
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-dark-500"></div>
            <span class="text-gray-500 text-sm">or</span>
            <div class="flex-1 h-px bg-dark-500"></div>
          </div>

          <!-- Google Sign-In -->
          <button (click)="loginWithGoogle()" [disabled]="loading()"
                  class="w-full flex items-center justify-center gap-3 bg-dark-600 hover:bg-dark-500 border border-dark-400 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors disabled:opacity-50">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p class="text-center text-gray-400 text-sm mt-6">
            Don't have an account?
            <a routerLink="/register" class="text-primary hover:text-primary-400 font-semibold ml-1">Sign Up</a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private authSvc = inject(FirebaseAuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  async login() {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authSvc.loginWithEmail(this.email, this.password);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(this.friendlyError(e.code));
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle() {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authSvc.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(this.friendlyError(e.code));
    } finally {
      this.loading.set(false);
    }
  }

  private friendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/invalid-credential': 'Invalid email or password.',
    };
    return map[code] ?? 'Sign in failed. Please try again.';
  }
}
