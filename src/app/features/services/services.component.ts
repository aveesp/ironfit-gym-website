import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Service {
  icon: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  highlights: string[];
  cta: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">What We Offer</span>
        <h1 class="section-title text-white mt-2 mb-4">Our <span class="gradient-text">Services</span></h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">From personal training to corporate wellness — everything you need to reach your fitness goals.</p>
      </div>
    </section>

    <!-- Service cards -->
    <section class="py-20 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          @for (service of services; track service.slug) {
            <div class="card p-8 flex flex-col gap-5 hover:border-primary/40 transition-colors duration-300">
              <div class="flex items-start gap-5">
                <div class="service-icon-wrap">{{service.icon}}</div>
                <div>
                  <h2 class="font-display text-2xl font-bold plan-card-title uppercase">{{service.title}}</h2>
                  <p class="text-primary text-sm font-semibold mt-1">{{service.tagline}}</p>
                </div>
              </div>
              <p class="plan-card-feature leading-relaxed">{{service.description}}</p>
              <ul class="space-y-2">
                @for (h of service.highlights; track h) {
                  <li class="flex items-center gap-3 plan-card-feature text-sm">
                    <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{h}}
                  </li>
                }
              </ul>
              <div class="mt-auto pt-2">
                <a routerLink="/contact" class="btn-primary">{{service.cta}}</a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="trainer-cta-section py-20 w-full">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="font-display text-4xl font-bold trainer-cta-title uppercase mb-4">Ready to Get Started?</h2>
        <p class="trainer-cta-subtitle text-lg mb-8">Talk to our team and find the right service for your goals.</p>
        <a routerLink="/contact" class="btn-primary text-lg px-10 py-4">Contact Us Today</a>
      </div>
    </section>
  `,
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: '🏋️',
      title: 'Personal Training',
      slug: 'personal-training',
      tagline: 'One-on-one coaching tailored to you',
      description: 'Work directly with a certified personal trainer who designs every session around your specific body, goals, and schedule. Whether you\'re a beginner or an athlete, our trainers will push you safely to your potential.',
      highlights: [
        'Customised workout programs',
        'Nutritional guidance & meal planning',
        'Progress tracking & body composition analysis',
        'Flexible scheduling — morning, evening, weekends',
        'In-gym and online sessions available',
      ],
      cta: 'Book a Session',
    },
    {
      icon: '👥',
      title: 'Group Classes',
      slug: 'group-classes',
      tagline: 'Train together, grow together',
      description: 'High-energy group classes that keep you motivated and accountable. From HIIT and Zumba to Yoga and Spin, our schedule has something for every fitness level.',
      highlights: [
        '20+ class formats every week',
        'Classes for all fitness levels',
        'Expert instructors with live coaching',
        'Early morning to late evening slots',
        'Included with Monthly plan and above',
      ],
      cta: 'See Class Schedule',
    },
    {
      icon: '🥗',
      title: 'Nutrition Coaching',
      slug: 'nutrition-coaching',
      tagline: 'Fuel your performance the right way',
      description: 'Fitness is 70% nutrition. Our certified nutritionists help you build sustainable eating habits with personalised meal plans that complement your training and lifestyle.',
      highlights: [
        'Personalised macro & calorie targets',
        'Weekly check-ins and plan adjustments',
        'Supplement advice & guidance',
        'Restaurant & travel eating strategies',
        'Body composition reassessment monthly',
      ],
      cta: 'Get a Nutrition Plan',
    },
    {
      icon: '💻',
      title: 'Online Training',
      slug: 'online-training',
      tagline: 'World-class coaching from anywhere',
      description: 'Can\'t make it to the gym? Our online training service gives you access to IronFit coaches via video, with custom programs delivered to your app and weekly live check-ins.',
      highlights: [
        'Live video sessions with your coach',
        'Custom program delivered to your phone',
        'Weekly progress reviews via app',
        '24/7 chat support with your trainer',
        'Access to workout video library',
      ],
      cta: 'Start Online Training',
    },
    {
      icon: '🤝',
      title: 'Gym Partnerships',
      slug: 'gym-partnerships',
      tagline: 'Partner with us to grow your facility',
      description: 'Are you a gym owner? Join the IronFit partner network to get listed on our platform, access our trainer marketplace, and benefit from our marketing reach of 50K+ active members.',
      highlights: [
        'Featured listing on IronFit platform',
        'Access to verified trainer pool',
        'Booking & payment integration',
        'Dedicated partner support manager',
        'Marketing campaigns & social features',
      ],
      cta: 'Become a Partner',
    },
    {
      icon: '🏢',
      title: 'Corporate Wellness',
      slug: 'corporate-wellness',
      tagline: 'Healthier employees, stronger teams',
      description: 'We bring IronFit to your workplace. Our corporate wellness programmes include on-site classes, group memberships, wellness workshops, and health assessments for your entire team.',
      highlights: [
        'On-site trainer visits & classes',
        'Discounted group membership packages',
        'Wellness workshops (stress, sleep, nutrition)',
        'Dedicated HR wellness dashboard',
        'Quarterly health & fitness reports',
      ],
      cta: 'Enquire for Your Company',
    },
  ];
}
