import { Component, inject, signal, OnInit } from '@angular/core';
import { RoleApiService } from '../../../core/services/role-api.service';
import { BlogPost } from '../../../core/models';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  template: `
    <header class="admin-page-head">
      <h1 class="admin-page-title">Blog Management</h1>
      <p class="admin-page-sub">{{ posts().length }} posts in the database.</p>
    </header>

    @if (error()) { <div class="admin-error">{{ error() }}</div> }
    @if (notice()) { <div class="admin-notice">{{ notice() }}</div> }

    @if (loading()) {
      <p class="text-gray-400">Loading posts...</p>
    } @else if (posts().length === 0) {
      <div class="card p-10 text-center">
        <div class="text-4xl mb-3">📝</div>
        <p class="text-gray-400">No blog posts found in the database.</p>
      </div>
    } @else {
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-dark-500">
              <th class="text-left p-4 text-gray-400 font-medium">Post</th>
              <th class="text-left p-4 text-gray-400 font-medium">Category</th>
              <th class="text-left p-4 text-gray-400 font-medium">Date</th>
              <th class="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of posts(); track p.id) {
              <tr class="border-b border-dark-600">
                <td class="p-4">
                  <div class="text-white font-medium">{{ p.title }}</div>
                  <div class="text-gray-500 text-xs">/{{ p.slug }}</div>
                </td>
                <td class="p-4"><span class="status-pill status-pill-active">{{ p.category }}</span></td>
                <td class="p-4 text-gray-300">{{ p.date }}</td>
                <td class="p-4 text-right">
                  <button (click)="remove(p)" [disabled]="busy() === p.id"
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
export class AdminBlogsComponent implements OnInit {
  private api = inject(RoleApiService);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal('');
  notice = signal('');
  busy = signal<string | null>(null);

  async ngOnInit() {
    await this.reload();
  }

  private async reload() {
    this.loading.set(true);
    try {
      this.posts.set(await this.api.getBlogs());
      this.error.set('');
    } catch (e: any) {
      this.error.set(`${e.message ?? 'Could not load posts.'} — is the API running?`);
    } finally {
      this.loading.set(false);
    }
  }

  async remove(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    this.busy.set(post.id);
    try {
      await this.api.deleteBlog(post.id);
      this.notice.set(`"${post.title}" was deleted.`);
      await this.reload();
    } catch (e: any) {
      this.error.set(e.message ?? 'Delete failed.');
    } finally {
      this.busy.set(null);
    }
  }
}
