import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Legal</span>
        <h1 class="section-title text-white mt-2 mb-4">Privacy <span class="gradient-text">Policy</span></h1>
        <p class="text-gray-400">Last updated: June 2025</p>
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
            </div>
          }

          <div class="border-t border-dark-500 pt-8 text-center">
            <p class="text-gray-400 mb-4">Questions about our privacy practices?</p>
            <a routerLink="/contact" class="btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PrivacyPolicyComponent {
  sections = [
    {
      icon: '📋',
      title: 'Information We Collect',
      content: [
        'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
        'This includes your name, email address, phone number, payment information, fitness goals, and any other information you choose to provide.',
        'We also automatically collect certain information when you use our platform, including log data, device information, location data, and cookies.',
      ]
    },
    {
      icon: '🎯',
      title: 'How We Use Your Information',
      content: [
        'We use the information we collect to provide, maintain, and improve our services, process transactions, and send you related information.',
        'We may use your information to send promotional communications, such as newsletters, offers, and updates about IronFit and our partners.',
        'Your data helps us personalize your experience, recommend gyms and trainers, and analyze usage patterns to improve our platform.',
      ]
    },
    {
      icon: '🔒',
      title: 'Data Security',
      content: [
        'We take the security of your personal information seriously and implement industry-standard measures to protect it from unauthorized access, disclosure, or misuse.',
        'All data is encrypted in transit using SSL/TLS and at rest using AES-256 encryption. We conduct regular security audits and penetration testing.',
        'However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
      ]
    },
    {
      icon: '🤝',
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as described in this policy.',
        'We may share your information with gyms and trainers when you make inquiries or bookings, as this is necessary to fulfill our service.',
        'We may also disclose information to comply with legal obligations, enforce our policies, or protect the rights, property, or safety of IronFit and our users.',
      ]
    },
    {
      icon: '⚙️',
      title: 'Your Rights & Choices',
      content: [
        'You have the right to access, update, or delete your personal information at any time through your account settings.',
        'You may opt out of receiving promotional emails by following the unsubscribe instructions included in those emails or by contacting us directly.',
        'Residents of certain jurisdictions (EU, California, etc.) may have additional rights including data portability and the right to object to processing.',
      ]
    },
    {
      icon: '🍪',
      title: 'Cookies Policy',
      content: [
        'We use cookies and similar tracking technologies to enhance your experience, analyze site traffic, and serve targeted advertisements.',
        'You can control cookies through your browser settings. Disabling cookies may limit some features of our platform.',
        'We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted).',
      ]
    },
  ];
}
