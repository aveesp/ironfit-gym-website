import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MembershipPlan } from '../../../core/models';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div [class]="plan.popular ? 'ring-2 ring-primary scale-105 z-10' : ''"
         class="card relative group hover:-translate-y-1 transition-all duration-300">
      @if (plan.popular) {
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span class="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Most Popular</span>
        </div>
      }

      <div [class]="plan.popular ? 'bg-gradient-to-br from-primary/20 to-dark-700' : 'bg-dark-700'" class="p-8">
        <div class="text-center mb-6">
          <h3 class="font-display text-2xl font-bold text-white uppercase mb-1">{{plan.name}}</h3>
          <p class="text-gray-400 text-sm">{{plan.duration}}</p>
          <div class="mt-4">
            @if (plan.originalPrice) {
              <span class="text-gray-500 line-through text-lg mr-2">{{"$"}}{{plan.originalPrice}}</span>
            }
            <span class="text-5xl font-bold text-white">{{"$"}}{{plan.price}}</span>
            <span class="text-gray-400 text-sm">/month</span>
          </div>
          @if (plan.originalPrice) {
            <span class="badge bg-green-500/20 text-green-400 border border-green-500/30 mt-2">
              Save {{ '$' + (plan.originalPrice! - plan.price) }}/mo
            </span>
          }
        </div>

        <ul class="space-y-3 mb-8">
          @for (feature of plan.features; track feature) {
            <li class="flex items-center gap-3 text-gray-300 text-sm">
              <svg class="w-5 h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{feature}}
            </li>
          }
        </ul>

        <a routerLink="/contact" [class]="plan.popular ? 'btn-primary' : 'btn-secondary'" class="w-full justify-center">
          Join Now
        </a>
      </div>
    </div>
  `,
})
export class PlanCardComponent {
  @Input() plan!: MembershipPlan;
}
