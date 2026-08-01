import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { Nutritionist } from '../../core/models';

@Component({
  selector: 'app-nutritionists',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Hero -->
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Eat Smarter</span>
        <h1 class="section-title text-white mt-2 mb-4">Our <span class="gradient-text">Nutritionists</span></h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Certified nutrition experts who build plans around your body, your goals and your kitchen.
        </p>
      </div>
    </section>

    <section class="py-16 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        @if (loadError()) {
          <div class="card p-10 text-center">
            <div class="text-4xl mb-3">🔌</div>
            <h2 class="font-display text-xl font-bold text-white uppercase mb-2">Can't load nutritionists</h2>
            <p class="text-gray-400">{{ loadError() }}</p>
          </div>
        } @else if (loading()) {
          <p class="text-gray-400">Loading nutritionists...</p>
        } @else if (people().length === 0) {
          <div class="card p-10 text-center">
            <div class="text-4xl mb-3">🥗</div>
            <h2 class="font-display text-xl font-bold text-white uppercase mb-2">No nutritionists listed yet</h2>
            <p class="text-gray-400">Check back soon — we're onboarding experts right now.</p>
          </div>
        } @else {
          <!-- Specialisation filter -->
          <div class="flex flex-wrap gap-3 mb-10">
            @for (s of specialities(); track s) {
              <button (click)="activeSpec.set(s)"
                      [class]="activeSpec() === s ? 'bg-primary text-white' : 'filter-pill-inactive'"
                      class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">
                {{ s }}
              </button>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (n of filtered(); track n.id) {
              <div class="card p-6 flex flex-col">
                <div class="flex items-center gap-4 mb-4">
                  @if (n.photo) {
                    <img [src]="n.photo" [alt]="n.name"
                         class="w-16 h-16 rounded-full object-cover border-2 border-primary/30">
                  } @else {
                    <div class="nutritionist-avatar">{{ initials(n.name) }}</div>
                  }
                  <div class="min-w-0">
                    <h3 class="font-display text-lg font-bold text-white truncate">{{ n.name }}</h3>
                    <p class="text-primary text-sm">{{ n.title || 'Nutritionist' }}</p>
                  </div>
                </div>

                @if (n.bio) {
                  <p class="text-gray-400 text-sm mb-4 line-clamp-3">{{ n.bio }}</p>
                }

                <div class="flex flex-wrap gap-1.5 mb-4">
                  @for (s of n.specializations || []; track s) {
                    <span class="badge bg-dark-600 text-gray-300 text-xs border border-dark-400">{{ s }}</span>
                  }
                </div>

                <dl class="text-sm space-y-1.5 mb-5">
                  @if (n.experience) {
                    <div class="flex justify-between"><dt class="text-gray-500">Experience</dt><dd class="text-gray-300">{{ n.experience }} yrs</dd></div>
                  }
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Consultation</dt>
                    <dd class="text-gray-300">{{ n.consultationFee ? '₹' + n.consultationFee : 'Free' }}</dd>
                  </div>
                  @if (n.consultationModes && n.consultationModes.length) {
                    <div class="flex justify-between"><dt class="text-gray-500">Mode</dt><dd class="text-gray-300">{{ n.consultationModes.join(', ') }}</dd></div>
                  }
                  @if (n.languages && n.languages.length) {
                    <div class="flex justify-between"><dt class="text-gray-500">Speaks</dt><dd class="text-gray-300">{{ n.languages.join(', ') }}</dd></div>
                  }
                </dl>

                <button (click)="openConnect(n)" class="btn-primary w-full justify-center text-sm mt-auto">
                  Connect
                </button>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- Connect form -->
    @if (connectTo(); as target) {
      <div class="connect-backdrop" (click)="closeConnect()">
        <div class="connect-panel" (click)="$event.stopPropagation()">
          <h2 class="font-display text-xl font-bold text-white uppercase mb-1">Connect with {{ target.name }}</h2>
          <p class="text-gray-400 text-sm mb-5">Send your details and they'll get back to you.</p>

          @if (sendError()) {
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">{{ sendError() }}</div>
          }

          @if (sent()) {
            <div class="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm mb-5">
              ✓ Request sent. {{ target.name }} will be in touch shortly.
            </div>
            <button (click)="closeConnect()" class="btn-secondary w-full justify-center">Close</button>
          } @else {
            <form (ngSubmit)="send(target)" #connectForm="ngForm" class="space-y-4">
              <input name="cname" [(ngModel)]="enquiry.name" required placeholder="Your name" class="input-field">
              <input type="email" name="cemail" [(ngModel)]="enquiry.email" required placeholder="Your email" class="input-field">
              <input name="cphone" [(ngModel)]="enquiry.phone" placeholder="Phone (optional)" class="input-field">
              <textarea name="cmessage" [(ngModel)]="enquiry.message" required rows="3"
                        placeholder="What would you like help with?" class="input-field"></textarea>
              <div class="flex gap-3">
                <button type="submit" [disabled]="sending() || connectForm.invalid"
                        class="btn-primary flex-1 justify-center disabled:opacity-50">
                  {{ sending() ? 'Sending…' : 'Send request' }}
                </button>
                <button type="button" (click)="closeConnect()" class="btn-secondary">Cancel</button>
              </div>
            </form>
          }
        </div>
      </div>
    }
  `,
})
export class NutritionistsComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(FirebaseAuthService);

  people = signal<Nutritionist[]>([]);
  loading = signal(true);
  loadError = signal('');

  activeSpec = signal('All');
  specialities = computed(() => ['All', ...new Set(this.people().flatMap(n => n.specializations ?? []))]);
  filtered = computed(() => {
    const spec = this.activeSpec();
    if (spec === 'All') return this.people();
    return this.people().filter(n => n.specializations?.includes(spec));
  });

  connectTo = signal<Nutritionist | null>(null);
  enquiry = { name: '', email: '', phone: '', message: '' };
  sending = signal(false);
  sent = signal(false);
  sendError = signal('');

  async ngOnInit() {
    try {
      this.people.set(await firstValueFrom(this.api.getNutritionists()));
    } catch {
      this.loadError.set('The directory is temporarily unavailable. Please try again shortly.');
    } finally {
      this.loading.set(false);
    }
  }

  initials(name: string) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  openConnect(n: Nutritionist) {
    this.connectTo.set(n);
    this.sent.set(false);
    this.sendError.set('');
    // Prefill from the signed-in account so members don't retype it.
    this.enquiry = {
      name: this.auth.isLoggedIn() ? this.auth.displayName() : '',
      email: this.auth.currentUser()?.email ?? '',
      phone: '',
      message: '',
    };
  }

  closeConnect() {
    this.connectTo.set(null);
  }

  async send(target: Nutritionist) {
    this.sending.set(true);
    this.sendError.set('');
    try {
      await firstValueFrom(this.api.submitInquiry({
        name: this.enquiry.name.trim(),
        email: this.enquiry.email.trim(),
        phone: this.enquiry.phone.trim(),
        interest: 'Nutrition consultation',
        message: this.enquiry.message.trim(),
        nutritionistId: target.id,
        nutritionistName: target.name,
      }));
      this.sent.set(true);
    } catch {
      this.sendError.set('Could not send your request. Please try again.');
    } finally {
      this.sending.set(false);
    }
  }
}
