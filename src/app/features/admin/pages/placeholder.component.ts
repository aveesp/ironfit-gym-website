import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Shared scaffold for the sections that have no backing data yet.
 *
 * Reads its copy from route data reactively — Angular reuses this component
 * when navigating between two placeholder routes, so a snapshot read in
 * ngOnInit would leave the previous section's title on screen.
 */
@Component({
  selector: 'app-admin-placeholder',
  standalone: true,
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">{{ title() }}</h1>
      <p class="admin-page-sub">{{ summary() }}</p>
    </header>

    <div class="card p-10 text-center">
      <div class="text-5xl mb-4">{{ icon() }}</div>
      <h2 class="font-display text-xl font-bold text-white uppercase mb-3">Not wired up yet</h2>
      <p class="text-gray-400 max-w-lg mx-auto mb-6">
        This section is scaffolded so the portal structure is complete, but it has no
        data model or API behind it yet.
      </p>

      @if (planned().length) {
        <div class="admin-planned">
          <div class="admin-planned-title">Planned for this section</div>
          <ul>
            @for (item of planned(); track item) { <li>{{ item }}</li> }
          </ul>
        </div>
      }
    </div>
  `,
})
export class AdminPlaceholderComponent {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, { initialValue: {} as any });

  title = computed(() => this.data()['title'] ?? 'Section');
  summary = computed(() => this.data()['summary'] ?? '');
  icon = computed(() => this.data()['icon'] ?? '🧩');
  planned = computed<string[]>(() => this.data()['planned'] ?? []);
}
