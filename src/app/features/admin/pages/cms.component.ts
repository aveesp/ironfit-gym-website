import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../../core/services/role-api.service';
import { CmsFaqItem, CmsHome, CmsSectionName, CmsSite } from '../../../core/models';

const TABS: { id: CmsSectionName; label: string; icon: string }[] = [
  { id: 'site', label: 'Site & Contact', icon: '🏢' },
  { id: 'home', label: 'Homepage', icon: '🏠' },
  { id: 'faqs', label: 'FAQs', icon: '❓' },
];

@Component({
  selector: 'app-admin-cms',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">CMS Management</h1>
      <p class="admin-page-sub">Edit site copy without touching code. Super admin only.</p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    <div class="admin-tabs">
      @for (t of tabs; track t.id) {
        <button (click)="tab.set(t.id)"
                [class]="tab() === t.id ? 'admin-tab admin-tab-active' : 'admin-tab'">
          <span>{{ t.icon }}</span> {{ t.label }}
        </button>
      }
    </div>

    @if (loading()) {
      <p class="text-gray-400">Loading content...</p>
    } @else {

      <!-- ── Site & contact ── -->
      @if (tab() === 'site') {
        <div class="card p-6">
          <form (ngSubmit)="save('site')" class="admin-form-grid">
            <label class="admin-field">
              <span>Site name</span>
              <input name="siteName" [(ngModel)]="site.siteName" class="input-field">
            </label>
            <label class="admin-field">
              <span>Tagline</span>
              <input name="tagline" [(ngModel)]="site.tagline" class="input-field">
            </label>
            <label class="admin-field">
              <span>Contact email</span>
              <input name="email" [(ngModel)]="site.email" class="input-field">
            </label>
            <label class="admin-field">
              <span>Contact phone</span>
              <input name="phone" [(ngModel)]="site.phone" class="input-field">
            </label>
            <label class="admin-field admin-field-wide">
              <span>Address</span>
              <input name="address" [(ngModel)]="site.address" class="input-field">
            </label>

            <label class="admin-field">
              <span>Instagram URL</span>
              <input name="instagram" [(ngModel)]="site.instagram" class="input-field">
            </label>
            <label class="admin-field">
              <span>Facebook URL</span>
              <input name="facebook" [(ngModel)]="site.facebook" class="input-field">
            </label>
            <label class="admin-field">
              <span>YouTube URL</span>
              <input name="youtube" [(ngModel)]="site.youtube" class="input-field">
            </label>
            <label class="admin-field">
              <span>X / Twitter URL</span>
              <input name="twitter" [(ngModel)]="site.twitter" class="input-field">
            </label>

            <div class="admin-actions">
              <button type="submit" [disabled]="saving() === 'site'"
                      class="btn-primary disabled:opacity-50">
                {{ saving() === 'site' ? 'Saving…' : 'Save site details' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- ── Homepage ── -->
      @if (tab() === 'home') {
        <div class="card p-6">
          <form (ngSubmit)="save('home')" class="admin-form-grid">
            <label class="admin-field admin-field-wide">
              <span>Hero badge</span>
              <input name="heroBadge" [(ngModel)]="home.heroBadge" class="input-field">
            </label>

            <label class="admin-field">
              <span>Headline — line 1</span>
              <input name="heroTitle" [(ngModel)]="home.heroTitle" class="input-field">
            </label>
            <label class="admin-field">
              <span>Headline — highlighted</span>
              <input name="heroHighlight" [(ngModel)]="home.heroHighlight" class="input-field">
              <small>Rendered in the red gradient</small>
            </label>
            <label class="admin-field admin-field-wide">
              <span>Headline — line 2</span>
              <input name="heroTitleEnd" [(ngModel)]="home.heroTitleEnd" class="input-field">
            </label>

            <label class="admin-field admin-field-wide">
              <span>Sub-heading</span>
              <textarea name="heroSubtitle" [(ngModel)]="home.heroSubtitle" rows="2" class="input-field"></textarea>
            </label>

            <label class="admin-field">
              <span>Primary button</span>
              <input name="ctaPrimary" [(ngModel)]="home.ctaPrimary" class="input-field">
            </label>
            <label class="admin-field">
              <span>Secondary button</span>
              <input name="ctaSecondary" [(ngModel)]="home.ctaSecondary" class="input-field">
            </label>

            <div class="admin-field admin-field-wide">
              <span>Hero stats</span>
              <div class="admin-stat-inputs">
                <input name="statGyms" [(ngModel)]="home.statGyms" placeholder="500+" class="input-field">
                <input name="statGymsLabel" [(ngModel)]="home.statGymsLabel" placeholder="Gyms Listed" class="input-field">
                <input name="statTrainers" [(ngModel)]="home.statTrainers" placeholder="200+" class="input-field">
                <input name="statTrainersLabel" [(ngModel)]="home.statTrainersLabel" placeholder="Trainers" class="input-field">
                <input name="statMembers" [(ngModel)]="home.statMembers" placeholder="50K+" class="input-field">
                <input name="statMembersLabel" [(ngModel)]="home.statMembersLabel" placeholder="Members" class="input-field">
              </div>
            </div>

            <div class="admin-actions">
              <button type="submit" [disabled]="saving() === 'home'"
                      class="btn-primary disabled:opacity-50">
                {{ saving() === 'home' ? 'Saving…' : 'Save homepage copy' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- ── FAQs ── -->
      @if (tab() === 'faqs') {
        <div class="card p-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="font-display text-lg font-bold text-white uppercase">
              {{ faqs.length }} {{ faqs.length === 1 ? 'question' : 'questions' }}
            </h2>
            <button type="button" (click)="addFaq()" class="btn-secondary text-sm py-2">+ Add question</button>
          </div>

          @if (faqs.length === 0) {
            <p class="text-gray-400 mb-5">No FAQs yet. Add one to get started.</p>
          }

          <div class="space-y-4 mb-6">
            @for (faq of faqs; track $index) {
              <div class="admin-faq-row">
                <div class="admin-faq-num">{{ $index + 1 }}</div>
                <div class="admin-faq-fields">
                  <input [(ngModel)]="faq.question" [name]="'q' + $index"
                         placeholder="Question" class="input-field">
                  <textarea [(ngModel)]="faq.answer" [name]="'a' + $index" rows="2"
                            placeholder="Answer" class="input-field"></textarea>
                </div>
                <button type="button" (click)="removeFaq($index)" class="admin-danger-btn">Remove</button>
              </div>
            }
          </div>

          <button type="button" (click)="save('faqs')" [disabled]="saving() === 'faqs'"
                  class="btn-primary disabled:opacity-50">
            {{ saving() === 'faqs' ? 'Saving…' : 'Save FAQs' }}
          </button>
        </div>
      }
    }
  `,
})
export class AdminCmsComponent implements OnInit {
  private api = inject(RoleApiService);

  tabs = TABS;
  tab = signal<CmsSectionName>('site');
  loading = signal(true);
  saving = signal<CmsSectionName | null>(null);
  error = signal('');
  notice = signal('');

  // Working copies, so an abandoned edit doesn't mutate what was loaded.
  site!: CmsSite;
  home!: CmsHome;
  faqs: CmsFaqItem[] = [];

  async ngOnInit() {
    await this.reload();
  }

  private async reload() {
    this.loading.set(true);
    try {
      const content = await this.api.getCms();
      this.site = { ...content.site };
      this.home = { ...content.home };
      this.faqs = (content.faqs?.items ?? []).map(i => ({ ...i }));
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load content.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  addFaq() {
    this.faqs = [...this.faqs, { question: '', answer: '' }];
  }

  removeFaq(index: number) {
    this.faqs = this.faqs.filter((_, i) => i !== index);
  }

  async save(section: CmsSectionName) {
    this.saving.set(section);
    this.error.set('');
    this.notice.set('');
    try {
      if (section === 'site') {
        await this.api.updateCmsSection('site', this.site);
      } else if (section === 'home') {
        await this.api.updateCmsSection('home', this.home);
      } else {
        // Drop rows left completely blank rather than saving empty accordions.
        const items = this.faqs.filter(f => f.question.trim() || f.answer.trim());
        await this.api.updateCmsSection('faqs', { items });
        this.faqs = items;
      }
      this.notice.set('Saved.');
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not save.');
    } finally {
      this.saving.set(null);
    }
  }
}
