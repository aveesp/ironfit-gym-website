import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative pt-32 pb-20 bg-dark-800 overflow-hidden">
      <div class="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 400" class="w-full h-full text-primary" fill="currentColor"><circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-primary font-semibold uppercase tracking-widest text-sm">Our Story</span>
            <h1 class="section-title text-white mt-2 mb-6">We're On a Mission to <span class="gradient-text">Democratize Fitness</span></h1>
            <p class="text-gray-300 text-lg leading-relaxed mb-6">Founded in 2020, IronFit started with a simple idea: finding the right gym shouldn't be harder than the workout itself. We built a platform that connects fitness enthusiasts with the best gyms and trainers in their area.</p>
            <p class="text-gray-400 leading-relaxed mb-8">Today, we're proud to have helped over 50,000 people start or supercharge their fitness journeys, partnering with 500+ premium gyms and 200+ certified trainers across major cities.</p>
            <a routerLink="/contact" class="btn-primary">Get in Touch</a>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600" alt="Gym" class="rounded-2xl object-cover h-64 w-full">
            <img src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=600" alt="Trainer" class="rounded-2xl object-cover h-64 w-full mt-8">
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-20 bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          @for (stat of stats; track stat.label) {
            <div class="text-center">
              <div class="font-display text-6xl font-bold text-white mb-2">{{stat.value}}</div>
              <div class="text-red-200 text-lg">{{stat.label}}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">What We Stand For</span>
          <h2 class="section-title text-white mt-2">Our <span class="gradient-text">Values</span></h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (v of values; track v.title) {
            <div class="card p-8 text-center group hover:-translate-y-1 transition-all duration-300">
              <div class="text-5xl mb-6">{{v.icon}}</div>
              <h3 class="font-display text-2xl font-bold text-white mb-4">{{v.title}}</h3>
              <p class="text-gray-400 leading-relaxed">{{v.desc}}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-20 bg-dark-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-primary font-semibold uppercase tracking-widest text-sm">Leadership</span>
          <h2 class="section-title text-white mt-2">Meet the <span class="gradient-text">Team</span></h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (member of team; track member.name) {
            <div class="card text-center group hover:-translate-y-1 transition-all duration-300">
              <div class="overflow-hidden h-52">
                <img [src]="member.photo" [alt]="member.name" class="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500">
              </div>
              <div class="p-5">
                <h3 class="font-display text-xl font-bold text-white">{{member.name}}</h3>
                <p class="text-primary text-sm mt-1">{{member.role}}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  stats = [
    { value: '500+', label: 'Partner Gyms' },
    { value: '200+', label: 'Expert Trainers' },
    { value: '50K+', label: 'Happy Members' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  values = [
    { icon: '💪', title: 'Excellence', desc: 'We partner only with gyms and trainers who meet our strict quality standards, ensuring every recommendation is world-class.' },
    { icon: '🤝', title: 'Community', desc: 'Fitness is better together. We foster a supportive, inclusive community where everyone belongs — regardless of fitness level.' },
    { icon: '🔬', title: 'Science-Backed', desc: 'Our platform and trainer recommendations are grounded in sports science and evidence-based fitness principles.' },
  ];

  team = [
    { name: 'Alex Rivera', role: 'CEO & Co-Founder', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { name: 'Sarah Chen', role: 'CTO', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
    { name: 'Marcus Blake', role: 'Head of Fitness', photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400' },
    { name: 'Emma Rodriguez', role: 'Head of Growth', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
  ];
}
