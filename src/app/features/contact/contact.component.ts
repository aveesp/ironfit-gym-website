import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <span class="text-primary font-semibold uppercase tracking-widest text-sm">Get In Touch</span>
        <h1 class="section-title text-white mt-2 mb-4">Contact <span class="gradient-text">Us</span></h1>
        <p class="text-gray-400 text-lg max-w-xl mx-auto">Have a question, want to list your gym, or become a trainer? We'd love to hear from you.</p>
      </div>
    </section>

    <section class="py-16 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-12">

          <!-- Contact Info -->
          <div class="space-y-8">
            @for (info of contactInfo; track info.title) {
              <div class="card p-6 flex gap-5">
                <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-2xl">{{info.icon}}</div>
                <div>
                  <h3 class="font-semibold text-white mb-1">{{info.title}}</h3>
                  <p class="text-gray-400 text-sm leading-relaxed" [innerHTML]="info.value"></p>
                </div>
              </div>
            }

            <!-- Social -->
            <div class="card p-6">
              <h3 class="font-semibold text-white mb-4">Follow Us</h3>
              <div class="flex gap-3">
                @for (s of socials; track s.name) {
                  <a href="#" [style.background]="s.color" class="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform text-white text-sm font-bold">{{s.abbr}}</a>
                }
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="card p-8">
              <h2 class="font-display text-2xl font-bold text-white uppercase mb-6">Send Us a Message</h2>
              @if (!sent()) {
                <form #contactForm="ngForm" (ngSubmit)="submit(contactForm)" class="space-y-5">
                  <div class="grid md:grid-cols-2 gap-5">
                    <div>
                      <label class="text-gray-400 text-sm font-medium mb-2 block">First Name *</label>
                      <input name="firstName" ngModel required #firstName="ngModel"
                             [class]="firstName.invalid && firstName.touched ? 'border-red-500' : ''"
                             placeholder="John" class="input-field">
                      @if (firstName.invalid && firstName.touched) {
                        <p class="text-red-400 text-xs mt-1">First name is required</p>
                      }
                    </div>
                    <div>
                      <label class="text-gray-400 text-sm font-medium mb-2 block">Last Name *</label>
                      <input name="lastName" ngModel required #lastName="ngModel"
                             [class]="lastName.invalid && lastName.touched ? 'border-red-500' : ''"
                             placeholder="Doe" class="input-field">
                    </div>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm font-medium mb-2 block">Email Address *</label>
                    <input name="email" ngModel required email type="email" #email="ngModel"
                           [class]="email.invalid && email.touched ? 'border-red-500' : ''"
                           placeholder="john@example.com" class="input-field">
                    @if (email.invalid && email.touched) {
                      <p class="text-red-400 text-xs mt-1">Valid email is required</p>
                    }
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm font-medium mb-2 block">Phone Number</label>
                    <input name="phone" ngModel placeholder="+1 (555) 000-0000" class="input-field">
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm font-medium mb-2 block">Subject *</label>
                    <select name="subject" ngModel required class="input-field">
                      <option value="">Select a topic</option>
                      <option>General Inquiry</option>
                      <option>List My Gym</option>
                      <option>Become a Trainer</option>
                      <option>Membership Help</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-gray-400 text-sm font-medium mb-2 block">Message *</label>
                    <textarea name="message" ngModel required #message="ngModel" rows="5"
                              [class]="message.invalid && message.touched ? 'border-red-500' : ''"
                              placeholder="Tell us how we can help..." class="input-field resize-none"></textarea>
                    @if (message.invalid && message.touched) {
                      <p class="text-red-400 text-xs mt-1">Message is required</p>
                    }
                  </div>
                  <div class="flex items-start gap-3">
                    <input type="checkbox" name="privacy" ngModel required id="privacy" class="w-4 h-4 accent-primary mt-1">
                    <label for="privacy" class="text-gray-400 text-sm">I agree to the <span class="text-primary">Privacy Policy</span> and consent to being contacted.</label>
                  </div>
                  <button type="submit" [disabled]="contactForm.invalid"
                          class="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    Send Message
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </form>
              } @else {
                <div class="text-center py-16">
                  <div class="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <h3 class="font-display text-3xl font-bold text-white mb-3">Message Sent!</h3>
                  <p class="text-gray-400 text-lg mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button (click)="sent.set(false)" class="btn-secondary">Send Another Message</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  sent = signal(false);

  contactInfo = [
    { icon: '📍', title: 'Visit Us', value: '123 Fitness Ave, Manhattan<br>New York, NY 10001' },
    { icon: '📞', title: 'Call Us', value: '+1 (800) 555-0100<br>Mon–Fri, 9AM–6PM EST' },
    { icon: '✉️', title: 'Email Us', value: 'hello@ironfit.com<br>support@ironfit.com' },
    { icon: '💬', title: 'Live Chat', value: 'Available on our platform<br>Mon–Sun, 8AM–10PM EST' },
  ];

  socials = [
    { name: 'Instagram', abbr: 'IG', color: '#E1306C' },
    { name: 'Facebook', abbr: 'FB', color: '#1877F2' },
    { name: 'Twitter', abbr: 'TW', color: '#1DA1F2' },
    { name: 'YouTube', abbr: 'YT', color: '#FF0000' },
  ];

  submit(form: NgForm) {
    if (form.valid) {
      this.sent.set(true);
    }
  }
}
