import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MembershipPlan } from '../../../core/models';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- overflow-visible so the -top-4 badge is never clipped -->
    <div [class]="plan.popular ? 'scale-105 z-10' : ''"
         class="relative group hover:-translate-y-1 transition-all duration-300"
         style="overflow:visible">
      @if (plan.popular) {
        <div class="absolute -top-5 left-0 right-0 flex justify-center z-20">
          <span class="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-wide shadow-lg shadow-primary/40 whitespace-nowrap">
            ⭐ Most Popular
          </span>
        </div>
      }

      <div [class]="plan.popular ? 'plan-card-popular border-2 border-primary/40' : 'plan-card-regular border border-dark-500'"
           class="rounded-2xl p-8 h-full flex flex-col" [style.padding-top]="plan.popular ? '2.5rem' : '2rem'">
        <div class="text-center mb-6">
          <h3 class="font-display text-2xl font-bold plan-card-title uppercase mb-1">{{plan.name}}</h3>
          <p class="plan-card-subtitle text-sm">{{plan.duration}}</p>
          <div class="mt-4 flex flex-col items-center">
            @if (plan.originalPrice) {
              <span class="plan-card-original text-lg line-through mb-1">₹{{plan.originalPrice}}</span>
            }
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-4xl font-bold plan-card-price">₹{{plan.price}}</span>
              <span class="plan-card-subtitle text-sm">/month</span>
            </div>
          </div>
          @if (plan.originalPrice) {
            <span class="badge bg-green-500/20 text-green-400 border border-green-500/30 mt-2">
              Save {{ '₹' + (plan.originalPrice! - plan.price) }}/mo
            </span>
          }
        </div>

        <ul class="space-y-3 mb-8 flex-1">
          @for (feature of plan.features; track feature) {
            <li class="flex items-center gap-3 plan-card-feature text-sm">
              <svg class="w-5 h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{feature}}
            </li>
          }
        </ul>

        <a routerLink="/contact" [class]="plan.popular ? 'btn-primary' : 'btn-secondary'" class="w-full justify-center mt-auto">
          Join Now
        </a>
      </div>
    </div>
  `,
})
export class PlanCardComponent {
  @Input() plan!: MembershipPlan;
}
