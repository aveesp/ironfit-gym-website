import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Gym } from '../../core/models';

@Component({
  selector: 'app-gym-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    @if (gym) {
      <!-- Hero Gallery -->
      <section class="relative pt-20 bg-dark-900">
        <div class="relative h-[60vh] overflow-hidden">
          <img [src]="gym.images[activeImage()]" [alt]="gym.name"
               class="w-full h-full object-cover transition-all duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent"></div>

          <!-- Gallery thumbs -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            @for (img of gym.images; track $index; let i = $index) {
              <button (click)="activeImage.set(i)"
                      [class]="activeImage() === i ? 'ring-2 ring-primary scale-110' : 'opacity-60 hover:opacity-100'"
                      class="w-16 h-12 rounded-lg overflow-hidden transition-all duration-200">
                <img [src]="img" [alt]="'Photo ' + i" class="w-full h-full object-cover">
              </button>
            }
          </div>

          <!-- Status badge -->
          <div class="absolute top-6 right-6">
            <span [class]="gym.openNow ? 'bg-green-500' : 'bg-gray-600'"
                  class="text-white text-sm font-semibold px-4 py-2 rounded-full">
              {{gym.openNow ? '● Open Now' : '● Closed'}}
            </span>
          </div>
        </div>

        <!-- Gym Info Card -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20">
          <div class="glass rounded-3xl p-8 border border-white/10">
            <div class="flex flex-col lg:flex-row lg:items-start gap-6 justify-between">
              <div class="flex-1">
                <div class="flex flex-wrap gap-2 mb-3">
                  @for (tag of gym.tags; track tag) {
                    <span class="badge bg-primary/10 text-primary border border-primary/20 text-xs">{{tag}}</span>
                  }
                </div>
                <h1 class="font-display text-4xl font-bold text-white mb-2">{{gym.name}}</h1>
                <p class="text-gray-300 flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  {{gym.address}}
                </p>
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2">
                    <div class="flex text-yellow-400">★★★★★</div>
                    <span class="text-white font-bold">{{gym.rating}}</span>
                    <span class="text-gray-400 text-sm">({{gym.reviewCount}} reviews)</span>
                  </div>
                  <span class="text-gray-500">|</span>
                  <span class="text-2xl font-bold text-primary">{{gym.priceLabel}}</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-3">
                <a [href]="'tel:' + gym.phone" class="btn-primary">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Call Now
                </a>
                <a [href]="'https://wa.me/' + gym.whatsapp" target="_blank"
                   class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="py-16 bg-dark-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-3 gap-12">

            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-12">
              <!-- About -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-4">About This Gym</h2>
                <p class="text-gray-300 leading-relaxed text-lg">{{gym.description}}</p>
              </div>

              <!-- Amenities -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Amenities</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  @for (a of gym.amenities; track a) {
                    <div class="flex items-center gap-3 bg-dark-700 rounded-xl px-4 py-3 border border-dark-500">
                      <svg class="w-5 h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-gray-300 text-sm">{{a}}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Facilities -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Facilities</h2>
                <div class="flex flex-wrap gap-3">
                  @for (f of gym.facilities; track f) {
                    <span class="badge bg-primary/10 text-primary border border-primary/20 px-4 py-2 text-sm">🏋️ {{f}}</span>
                  }
                </div>
              </div>

              <!-- Working Hours -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Working Hours</h2>
                <div class="space-y-3">
                  @for (h of gym.hours; track h.day) {
                    <div class="flex items-center justify-between bg-dark-700 rounded-xl px-6 py-4 border border-dark-500">
                      <span class="text-gray-300 font-medium">{{h.day}}</span>
                      <span class="text-primary font-semibold">{{h.open}} – {{h.close}}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Google Map placeholder -->
              <div>
                <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Location</h2>
                <div class="rounded-2xl overflow-hidden bg-dark-700 border border-dark-500 h-64 flex items-center justify-center">
                  <div class="text-center">
                    <svg class="w-12 h-12 text-primary mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-gray-400">{{gym.address}}</p>
                    <a href="https://maps.google.com" target="_blank" class="text-primary hover:text-primary-400 text-sm mt-2 inline-block">Open in Google Maps →</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-8">
              <!-- Plans -->
              <div class="card p-6">
                <h3 class="font-display text-xl font-bold text-white uppercase mb-5">Membership Plans</h3>
                <div class="space-y-3">
                  @for (plan of allPlans; track plan.id) {
                    <div [class]="plan.popular ? 'border-primary bg-primary/5' : 'border-dark-400'"
                         class="border rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p class="font-semibold text-white">{{plan.name}}</p>
                        <p class="text-gray-400 text-sm">{{plan.duration}}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-primary font-bold text-xl">{{"$"}}{{plan.price}}</p>
                        <p class="text-gray-500 text-xs">per month</p>
                      </div>
                    </div>
                  }
                </div>
                <a routerLink="/plans" class="btn-primary w-full justify-center mt-5">View All Plans</a>
              </div>

              <!-- Inquiry Form -->
              <div class="card p-6">
                <h3 class="font-display text-xl font-bold text-white uppercase mb-5">Send Inquiry</h3>
                <form (ngSubmit)="submitInquiry()" class="space-y-4">
                  <input [(ngModel)]="inquiry.name" name="name" placeholder="Your Name" class="input-field text-sm" required>
                  <input [(ngModel)]="inquiry.email" name="email" type="email" placeholder="Email Address" class="input-field text-sm" required>
                  <input [(ngModel)]="inquiry.phone" name="phone" placeholder="Phone Number" class="input-field text-sm">
                  <select [(ngModel)]="inquiry.interest" name="interest" class="input-field text-sm">
                    <option value="">I'm interested in...</option>
                    <option>Monthly Membership</option>
                    <option>Personal Training</option>
                    <option>Free Trial</option>
                    <option>Group Classes</option>
                  </select>
                  <textarea [(ngModel)]="inquiry.message" name="message" rows="3" placeholder="Your message..." class="input-field text-sm resize-none"></textarea>
                  <button type="submit" class="btn-primary w-full justify-center">Send Inquiry</button>
                </form>
                @if (inquirySent()) {
                  <div class="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm text-center">
                    ✓ Inquiry sent! We'll get back to you within 24 hours.
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
          <h2 class="font-display text-3xl text-white mb-4">Gym Not Found</h2>
          <a routerLink="/gyms" class="btn-primary">Browse Gyms</a>
        </div>
      </div>
    }
  `,
})
export class GymDetailsComponent implements OnInit {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);

  gym: Gym | undefined;
  activeImage = signal(0);
  inquirySent = signal(false);
  allPlans = this.data.getPlans();

  inquiry = { name: '', email: '', phone: '', interest: '', message: '' };

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.gym = this.data.getGymBySlug(slug);
  }

  submitInquiry() {
    this.inquirySent.set(true);
    this.inquiry = { name: '', email: '', phone: '', interest: '', message: '' };
    setTimeout(() => this.inquirySent.set(false), 5000);
  }
}
