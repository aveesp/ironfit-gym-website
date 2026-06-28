import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Legal</span>
        <h1 class="section-title text-white mt-2 mb-4">Terms of <span class="gradient-text">Service</span></h1>
        <p class="text-gray-400">Effective date: June 2025 · By using IronFit, you agree to these terms.</p>
      </div>
    </section>

    <section class="py-16 bg-dark-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="card p-8 md:p-12 space-y-10">
          @for (section of sections; track section.title) {
            <div>
              <h2 class="font-display text-xl font-bold text-white uppercase mb-4 flex items-center gap-3">
                <span class="text-primary text-2xl">{{section.icon}}</span> {{section.title}}
              </h2>
              <div class="text-gray-300 leading-relaxed space-y-3">
                @for (para of section.content; track $index) {
                  <p>{{para}}</p>
                }
              </div>
              @if (section.list) {
                <ul class="mt-3 space-y-2">
                  @for (item of section.list; track item) {
                    <li class="flex items-start gap-2 text-gray-300 text-sm">
                      <span class="text-primary mt-1">▶</span> {{item}}
                    </li>
                  }
                </ul>
              }
            </div>
          }

          <div class="border-t border-dark-500 pt-8 text-center">
            <p class="text-gray-400 mb-4">Have questions about our terms?</p>
            <a routerLink="/contact" class="btn-primary">Contact Support</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TermsOfServiceComponent {
  sections = [
    {
      icon: '📜',
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using the IronFit platform, website, or mobile applications, you agree to be bound by these Terms of Service and our Privacy Policy.',
        'If you do not agree to these terms, please do not use our services. IronFit reserves the right to modify these terms at any time with notice.',
      ],
      list: null
    },
    {
      icon: '👤',
      title: 'User Accounts',
      content: ['You must create an account to access certain features. You are responsible for maintaining account security.'],
      list: [
        'You must be at least 18 years old to create an account',
        'Provide accurate, current, and complete information during registration',
        'Keep your password confidential and notify us of unauthorized use',
        'You are responsible for all activities that occur under your account',
      ]
    },
    {
      icon: '💳',
      title: 'Payments & Refunds',
      content: [
        'Membership fees are charged in advance on a monthly, quarterly, or annual basis. All prices are in Indian Rupees (₹) and include applicable taxes.',
        'Refund requests must be submitted within 7 days of purchase for unused memberships. Processing fees of ₹200 apply to all refunds.',
      ],
      list: null
    },
    {
      icon: '🏋️',
      title: 'Gym & Trainer Services',
      content: [
        'IronFit acts as a marketplace connecting users with independent gyms and personal trainers. We do not directly operate gyms or employ trainers.',
        'Quality, safety, and service standards are the responsibility of individual gym partners. IronFit verifies listings but cannot guarantee experience quality.',
        'Disputes between users and gym/trainer partners should first be resolved directly. IronFit may mediate but is not liable for third-party services.',
      ],
      list: null
    },
    {
      icon: '🚫',
      title: 'Prohibited Conduct',
      content: ['You agree not to engage in any of the following:'],
      list: [
        'Use the platform for any unlawful or fraudulent purpose',
        'Attempt to gain unauthorized access to any part of the platform',
        'Post false, misleading, or defamatory reviews or content',
        'Scrape, copy, or redistribute platform data without permission',
        'Impersonate any person or entity',
        'Spam other users or gym partners',
      ]
    },
    {
      icon: '⚖️',
      title: 'Limitation of Liability',
      content: [
        'To the maximum extent permitted by law, IronFit shall not be liable for any indirect, incidental, special, consequential, or punitive damages.',
        'Our total liability for any claims arising from your use of the platform shall not exceed the amount you paid to IronFit in the 12 months preceding the claim.',
        'IronFit is not liable for personal injury, property damage, or any harm arising from your use of affiliated gyms or trainer services.',
      ],
      list: null
    },
    {
      icon: '📍',
      title: 'Governing Law',
      content: [
        'These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.',
        'We encourage resolving disputes amicably. For unresolved disputes, binding arbitration may be required before litigation.',
      ],
      list: null
    },
  ];
}
