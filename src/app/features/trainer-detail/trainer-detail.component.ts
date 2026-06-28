import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Trainer } from '../../core/models';

@Component({
  selector: 'app-trainer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (trainer) {
      <!-- Hero -->
      <section class="relative pt-20 min-h-[60vh] bg-dark-800 flex items-end pb-0 overflow-hidden">
        <div class="absolute inset-0">
          <img [src]="trainer.photo" [alt]="trainer.name" class="w-full h-full object-cover object-top opacity-30">
          <div class="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="flex flex-col md:flex-row items-start md:items-end gap-8">
            <img [src]="trainer.photo" [alt]="trainer.name"
                 class="w-40 h-40 rounded-2xl object-cover object-top border-4 border-primary shadow-2xl shrink-0">
            <div>
              <div class="flex flex-wrap gap-2 mb-3">
                @for (spec of trainer.specializations.slice(0,3); track spec) {
                  <span class="badge bg-primary/20 text-primary border border-primary/30">{{spec}}</span>
                }
              </div>
              <h1 class="font-display text-5xl font-bold text-white mb-2">{{trainer.name}}</h1>
              <p class="text-primary text-xl font-medium mb-4">{{trainer.title}}</p>
              <div class="flex flex-wrap items-center gap-6 text-gray-300">
                <span class="flex items-center gap-2"><span class="text-yellow-400 font-bold">★ {{trainer.rating}}</span> ({{trainer.reviewCount}} reviews)</span>
                <span>{{trainer.experience}} Years Experience</span>
                <span>{{trainer.clients}}+ Clients</span>
                @if (trainer.gymName) { <span>📍 {{trainer.gymName}}</span> }
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="py-16 bg-dark-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-3 gap-12">

            <!-- Left -->
            <div class="lg:col-span-2 space-y-12">
              <!-- Bio -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-4">About</h2>
                <p class="text-gray-300 leading-relaxed text-lg">{{trainer.bio}}</p>
              </div>

              <!-- Specializations -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Specializations</h2>
                <div class="grid grid-cols-2 gap-3">
                  @for (spec of trainer.specializations; track spec) {
                    <div class="flex items-center gap-3 bg-dark-700 rounded-xl px-4 py-3 border border-dark-500">
                      <svg class="w-5 h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-gray-300 text-sm">{{spec}}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Certifications -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Certifications</h2>
                <div class="flex flex-wrap gap-3">
                  @for (cert of trainer.certifications; track cert) {
                    <span class="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-4 py-2 text-sm">🏅 {{cert}}</span>
                  }
                </div>
              </div>

              <!-- Reviews -->
              @if (trainer.reviews.length > 0) {
                <div>
                  <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Client Reviews</h2>
                  <div class="space-y-4">
                    @for (review of trainer.reviews; track review.id) {
                      <div class="card p-6">
                        <div class="flex items-start gap-4">
                          <img [src]="review.avatar" [alt]="review.author" class="w-12 h-12 rounded-full object-cover border-2 border-primary/30">
                          <div class="flex-1">
                            <div class="flex items-center justify-between mb-1">
                              <span class="font-semibold text-white">{{review.author}}</span>
                              <span class="text-gray-500 text-sm">{{review.date}}</span>
                            </div>
                            <div class="text-yellow-400 mb-2">★★★★★</div>
                            <p class="text-gray-300">{{review.comment}}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Right sidebar -->
            <div class="space-y-8">
              <!-- Stats -->
              <div class="card p-6">
                <div class="grid grid-cols-2 gap-4">
                  @for (stat of trainerStats(); track stat.label) {
                    <div class="text-center bg-dark-600 rounded-xl p-4">
                      <div class="font-display text-3xl font-bold text-primary">{{stat.value}}</div>
                      <div class="text-gray-400 text-sm mt-1">{{stat.label}}</div>
                    </div>
                  }
                </div>
              </div>

              <!-- Timings -->
              <div class="card p-6">
                <h3 class="font-display text-xl font-bold text-white uppercase mb-4">Availability</h3>
                <div class="space-y-2">
                  @for (t of trainer.timings; track t) {
                    <div class="flex items-center gap-3 text-gray-300 text-sm">
                      <span class="text-primary">🕐</span> {{t}}
                    </div>
                  }
                </div>
              </div>

              <!-- Social -->
              <div class="card p-6">
                <h3 class="font-display text-xl font-bold text-white uppercase mb-4">Follow</h3>
                <div class="flex gap-3">
                  @if (trainer.social.instagram) {
                    <a href="#" class="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                    </a>
                  }
                  @if (trainer.social.youtube) {
                    <a href="#" class="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805z"/></svg>
                    </a>
                  }
                </div>
              </div>

              <!-- Book Consultation -->
              <div class="card p-6 bg-gradient-to-br from-primary/10 to-dark-700">
                <h3 class="font-display text-xl font-bold text-white uppercase mb-2">Book a Session</h3>
                <p class="text-gray-400 text-sm mb-5">Start your transformation with a free 30-min consultation.</p>
                <form (ngSubmit)="bookConsultation()" class="space-y-3">
                  <input [(ngModel)]="booking.name" name="bname" placeholder="Your Name" class="input-field text-sm">
                  <input [(ngModel)]="booking.email" name="bemail" type="email" placeholder="Email" class="input-field text-sm">
                  <input [(ngModel)]="booking.phone" name="bphone" placeholder="Phone" class="input-field text-sm">
                  <button type="submit" class="btn-primary w-full justify-center">Book Consultation</button>
                </form>
                @if (bookingSent()) {
                  <div class="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm text-center">
                    ✓ Booked! {{trainer.name}} will contact you soon.
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    } @else {
      <div class="min-h-screen flex items-center justify-center pt-20">
        <div class="text-center">
          <h2 class="font-display text-3xl text-white mb-4">Trainer Not Found</h2>
          <a routerLink="/trainers" class="btn-primary">Browse Trainers</a>
        </div>
      </div>
    }
  `,
})
export class TrainerDetailComponent implements OnInit {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);

  trainer: Trainer | undefined;
  bookingSent = signal(false);
  booking = { name: '', email: '', phone: '' };

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.trainer = this.data.getTrainerBySlug(slug);
  }

  trainerStats() {
    if (!this.trainer) return [];
    return [
      { value: `${this.trainer.experience}+`, label: 'Years Exp.' },
      { value: `${this.trainer.clients}+`, label: 'Clients' },
      { value: `${this.trainer.rating}`, label: 'Rating' },
      { value: `${this.trainer.certifications.length}`, label: 'Certs' },
    ];
  }

  bookConsultation() {
    this.bookingSent.set(true);
    this.booking = { name: '', email: '', phone: '' };
    setTimeout(() => this.bookingSent.set(false), 5000);
  }
}
