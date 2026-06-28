import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { PlanCardComponent } from '../../shared/components/plan-card/plan-card.component';

@Component({
  selector: 'app-membership-plans',
  standalone: true,
  imports: [RouterLink, PlanCardComponent],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Pricing</span>
        <h1 class="section-title text-white mt-2 mb-4">Choose Your <span class="gradient-text">Plan</span></h1>
        <p class="text-gray-400 text-lg max-w-xl mx-auto">Flexible options for every goal and budget. No contracts, cancel anytime.</p>
      </div>
    </section>

    <section class="py-20 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          @for (plan of plans; track plan.id) {
            <app-plan-card [plan]="plan"/>
          }
        </div>
      </div>
    </section>

    <!-- Comparison table -->
    <section class="py-20 bg-dark-800">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title text-white text-center mb-12">Plan <span class="gradient-text">Comparison</span></h2>
        <div class="card overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-dark-500">
                <th class="text-left p-5 text-gray-400 font-medium">Feature</th>
                @for (plan of plans; track plan.id) {
                  <th class="p-5 text-center" [class]="plan.popular ? 'text-primary font-bold' : 'text-white font-semibold'">{{plan.name}}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (feature of comparisonFeatures; track feature.name) {
                <tr class="border-b border-dark-600 hover:bg-dark-600/30 transition-colors">
                  <td class="p-5 text-gray-300">{{feature.name}}</td>
                  @for (v of feature.values; track $index) {
                    <td class="p-5 text-center">
                      @if (v === true) {
                        <svg class="w-5 h-5 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      } @else if (v === false) {
                        <svg class="w-5 h-5 text-gray-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                      } @else {
                        <span class="text-gray-300 text-sm">{{v}}</span>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-primary via-red-700 to-primary">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="font-display text-5xl font-bold text-white uppercase mb-4">Start Your Journey Today</h2>
        <p class="text-red-100 text-xl mb-8">First 7 days free. No credit card required.</p>
        <a routerLink="/gyms" class="btn-white text-lg px-10 py-4">Get Started Free</a>
      </div>
    </section>
  `,
})
export class MembershipPlansComponent {
  private data = inject(DataService);
  plans = this.data.getPlans();

  comparisonFeatures = [
    { name: 'Gym Access', values: [true, true, true, true] },
    { name: 'Group Classes', values: [false, true, true, true] },
    { name: 'Locker Room', values: [true, true, true, true] },
    { name: 'Personal Training', values: [false, '1/month', '3/month', 'Unlimited'] },
    { name: 'Nutrition Guide', values: [false, true, true, true] },
    { name: 'Meal Plan', values: [false, false, false, true] },
    { name: 'Guest Passes', values: [false, false, '2/month', '4/month'] },
    { name: 'Spa Discount', values: [false, false, false, '20% off'] },
    { name: 'Priority Booking', values: [false, false, true, true] },
    { name: 'Body Analysis', values: [false, false, true, true] },
  ];
}
