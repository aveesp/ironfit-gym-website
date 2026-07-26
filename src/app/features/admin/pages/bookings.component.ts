import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RoleApiService } from '../../../core/services/role-api.service';
import { Booking, BookingStatus } from '../../../core/models';

const STATUSES: BookingStatus[] = ['pending', 'contacted', 'converted', 'closed'];

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">Booking Management</h1>
      <p class="admin-page-sub">
        Gym enquiries submitted through the site. {{ bookings().length }} total,
        <span class="text-primary">{{ pendingCount() }} pending</span>.
      </p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    @if (loading()) {
      <p class="text-gray-400">Loading bookings...</p>
    } @else if (bookings().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">📭</div>
        <p class="text-gray-400">No enquiries have been submitted yet.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Enquirer</th>
              <th class="text-left p-4 text-gray-400 font-medium">Gym</th>
              <th class="text-left p-4 text-gray-400 font-medium">Received</th>
              <th class="text-left p-4 text-gray-400 font-medium">Status</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (b of bookings(); track b.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ b.name }}</div>
                  <div class="text-gray-500 text-xs break-all">{{ b.email }}</div>
                  @if (b.phone) { <div class="text-gray-500 text-xs">{{ b.phone }}</div> }
                </td>
                <td class="p-4 text-gray-300">{{ b.gymName || '—' }}</td>
                <td class="p-4 text-gray-300">{{ shortDate(b.createdAt) }}</td>
                <td class="p-4">
                  <select class="input-field py-2 text-sm max-w-[10rem]"
                          [disabled]="busy() === b.id"
                          [value]="b.status"
                          (change)="setStatus(b, $any($event.target).value)">
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
  bookings = signal<Booking[]>([]);
  pendingCount = computed(() => this.bookings().filter(b => b.status === 'pending').length);

  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  async ngOnInit() {
    await this.reload();
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
