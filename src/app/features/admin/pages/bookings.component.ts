import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../../core/services/role-api.service';
import { Booking, BookingStatus, InquiryType } from '../../../core/models';

const STATUSES: BookingStatus[] = ['pending', 'contacted', 'converted', 'closed'];

const TYPE_TABS: { id: InquiryType | 'all'; label: string; icon: string }[] = [
  { id: 'all',          label: 'All',          icon: '📥' },
  { id: 'gym',          label: 'Gym',          icon: '🏋️' },
  { id: 'trainer',      label: 'Trainer',      icon: '💪' },
  { id: 'nutritionist', label: 'Nutrition',    icon: '🥗' },
  { id: 'general',      label: 'General',      icon: '✉️' },
];

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">Booking Management</h1>
      <p class="admin-page-sub">
        Enquiries from gyms, trainers, nutritionists and the contact page.
        {{ bookings().length }} total, <span class="text-primary">{{ pendingCount() }} pending</span>.
      </p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    <div class="admin-tabs">
      @for (t of typeTabs; track t.id) {
        <button (click)="activeType.set(t.id)"
                [class]="activeType() === t.id ? 'admin-tab admin-tab-active' : 'admin-tab'">
          <span>{{ t.icon }}</span> {{ t.label }}
          <span class="filter-count">{{ countOf(t.id) }}</span>
        </button>
      }
    </div>

    @if (loading()) {
      <p class="text-gray-400">Loading bookings...</p>
    } @else if (bookings().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">📭</div>
        <p class="text-gray-400">No enquiries have been submitted yet.</p>
      </div>
    } @else if (filtered().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">🔍</div>
        <p class="text-gray-400">No enquiries of this type.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Enquirer</th>
              <th class="text-left p-4 text-gray-400 font-medium">Type</th>
              <th class="text-left p-4 text-gray-400 font-medium">About</th>
              <th class="text-left p-4 text-gray-400 font-medium">Message</th>
              <th class="text-left p-4 text-gray-400 font-medium">Received</th>
              <th class="text-left p-4 text-gray-400 font-medium">Status</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (b of filtered(); track b.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ b.name }}</div>
                  <div class="text-gray-500 text-xs break-all">{{ b.email }}</div>
                  @if (b.phone) { <div class="text-gray-500 text-xs">{{ b.phone }}</div> }
                </td>
                <td class="p-4">
                  <span [class]="'enquiry-type enquiry-type-' + b.type">{{ typeLabel(b.type) }}</span>
                </td>
                <td class="p-4 text-gray-300">
                  {{ b.subjectName || '—' }}
                  @if (b.interest) { <div class="text-gray-500 text-xs mt-0.5">{{ b.interest }}</div> }
                </td>
                <td class="p-4 text-gray-300 max-w-xs">
                  <div class="line-clamp-2">{{ b.message }}</div>
                </td>
                <td class="p-4 text-gray-300 whitespace-nowrap">
                  {{ shortDate(b.createdAt) }}
                  <div [class]="'notify-pill notify-' + notifyState(b)" [title]="notifyTitle(b)">
                    {{ notifyLabel(b) }}
                  </div>
                </td>
                <td class="p-4">
                  <!-- ngModel rather than [value], for the same reason as the role
                       select: a plain value binding left every row showing "pending". -->
                  <select class="input-field py-2 text-sm max-w-[10rem]"
                          [disabled]="busy() === b.id"
                          [ngModel]="b.status"
                          (ngModelChange)="setStatus(b, $event)">
                    @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
                  </select>
                </td>
                <td class="p-4 text-right">
                  <button (click)="remove(b)" [disabled]="busy() === b.id"
                          class="admin-danger-btn">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminBookingsComponent implements OnInit {
  private api = inject(RoleApiService);

  statuses = STATUSES;
  typeTabs = TYPE_TABS;

  bookings = signal<Booking[]>([]);
  activeType = signal<InquiryType | 'all'>('all');
  pendingCount = computed(() => this.bookings().filter(b => b.status === 'pending').length);

  filtered = computed(() => {
    const t = this.activeType();
    return t === 'all' ? this.bookings() : this.bookings().filter(b => b.type === t);
  });

  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  async ngOnInit() {
    await this.reload();
  }

  countOf(id: InquiryType | 'all') {
    return id === 'all' ? this.bookings().length : this.bookings().filter(b => b.type === id).length;
  }

  typeLabel(type: InquiryType) {
    return TYPE_TABS.find(t => t.id === type)?.label ?? type;
  }

  /**
   * Whether the enquiry actually reached the provider. Worth surfacing: an
   * enquiry that was stored but never forwarded looks identical otherwise,
   * and would sit unanswered.
   */
  notifyState(b: Booking): 'sent' | 'pending' | 'none' | 'failed' {
    switch (b.notifyStatus) {
      case 'sent': return 'sent';
      case 'no-provider-email': return 'none';
      case 'failed': return 'failed';
      case 'mail-not-configured': return 'pending';
      default: return 'pending';
    }
  }

  notifyLabel(b: Booking) {
    return { sent: '✓ emailed', pending: '• not sent', none: '⚠ no email', failed: '✕ failed' }[this.notifyState(b)];
  }

  notifyTitle(b: Booking) {
    return {
      sent: `Forwarded to ${b.providerEmail}`,
      pending: 'Email is not configured on the server',
      none: 'This provider has no contact email on file',
      failed: 'Sending failed — check the server logs',
    }[this.notifyState(b)];
  }

  shortDate(iso: string) {
    return iso ? new Date(iso).toLocaleDateString() : '—';
  }

  private async reload() {
    this.loading.set(true);
    try {
      this.bookings.set(await this.api.getBookings());
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load bookings.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  async setStatus(booking: Booking, status: BookingStatus) {
    if (status === booking.status) return;
    this.busy.set(booking.id);
    try {
      await this.api.updateBookingStatus(booking.id, status);
      this.notice.set(`${booking.name}'s enquiry marked as ${status}.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Could not update status.');
      await this.reload();
    } finally {
      this.busy.set(null);
    }
  }

  async remove(booking: Booking) {
    if (!confirm(`Delete the enquiry from ${booking.name}? This cannot be undone.`)) return;
    this.busy.set(booking.id);
    try {
      await this.api.deleteBooking(booking.id);
      this.notice.set('Enquiry deleted.');
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Delete failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
