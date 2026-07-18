import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-24">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
            </svg>
          </div>
          <h1 class="font-display text-3xl font-bold text-white">Create Account</h1>
          <p class="text-gray-400 mt-2">Join IronFit and start your fitness journey</p>
        </div>

        <div class="card p-8">
          @if (error()) {
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">{{error()}}</div>
          }
          @if (success()) {
            <div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-green-400 text-sm">
              ✓ Account created! Redirecting...
            </div>
          }

          <form (ngSubmit)="register()" #regForm="ngForm" class="space-y-5">
            <div>
              <label class="text-gray-400 text-sm font-medium mb-2 block">Full Name</label>
              <input name="name" [(ngModel)]="name" required placeholder="John Doe" class="input-field">
            </div>
            <div>
              <label class="text-gray-400 text-sm font-medium mb-2 block">Email Address</label>
              <input type="email" name="email" [(ngModel)]="email" required
                     placeholder="john@example.com" class="input-field">
            </div>
            <div>
              <label class="text-gray-400 text-sm font-medium mb-2 block">Password</label>
              <input type="password" name="password" [(ngModel)]="password" required minlength="6"
                     placeholder="Min. 6 characters" class="input-field">
            </div>
            <div>
              <label class="text-gray-400 text-sm font-medium mb-2 block">Confirm Password</label>
              <input type="password" name="confirm" [(ngModel)]="confirm" required
                     placeholder="Repeat password" class="input-field">
              @if (confirm && password !== confirm) {
                <p class="text-red-400 text-xs mt-1">Passwords do not match</p>
              }
            </div>

            <button type="submit" [disabled]="loading() || regForm.invalid || password !== confirm"
                    class="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) { <span>Creating account...</span> } @else { <span>Create Account</span> }
            </button>
          </form>

          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-dark-500"></div><span class="text-gray-500 text-sm">or</span><div class="flex-1 h-px bg-dark-500"></div>
          </div>

          <button (click)="googleSignUp()" [disabled]="loading()"
                  class="w-full flex items-center justify-center gap-3 bg-dark-600 hover:bg-dark-500 border border-dark-400 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors disabled:opacity-50">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p class="text-center text-gray-400 text-sm mt-6">
            Already have an account?
            <a routerLink="/login" class="text-primary hover:text-primary-400 font-semibold ml-1">Sign In</a>
          </p>
        </div>
      </div>
    </section>
  `,
})
export class RegisterComponent {
  private authSvc = inject(FirebaseAuthService);
  private router = inject(Router);

  name = ''; email = ''; password = ''; confirm = '';
  error = signal('');
  success = signal(false);
  loading = signal(false);

  async register() {
    if (this.password !== this.confirm) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authSvc.registerWithEmail(this.email, this.password);
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/']), 1500);
    } catch (e: any) {
      const map: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      this.error.set(map[e.code] ?? 'Registration failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async googleSignUp() {
    this.loading.set(true);
    try {
      await this.authSvc.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set('Google sign-up failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
