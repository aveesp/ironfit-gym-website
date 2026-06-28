import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { BlogPost } from '../../core/models';

@Component({
  selector: 'app-fitness-blog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="relative pt-32 pb-16 bg-dark-800">
      <div class="absolute inset-0 opacity-10 bg-hero-pattern"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span class="text-primary font-semibold uppercase tracking-widest text-sm">Insights</span>
            <h1 class="section-title text-white mt-2 mb-2">Fitness <span class="gradient-text">Blog</span></h1>
            <p class="text-gray-400">Expert tips, training guides, and nutrition advice.</p>
          </div>
          <div class="relative w-full md:w-72">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input [(ngModel)]="search" (ngModelChange)="filterPosts()" placeholder="Search articles..." class="input-field pl-10">
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-dark-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category pills -->
        <div class="flex flex-wrap gap-3 mb-10">
          @for (cat of categories; track cat) {
            <button [class]="activeCategory() === cat ? 'bg-primary text-white' : 'bg-dark-700 text-gray-400 hover:text-white border border-dark-500'"
                    (click)="activeCategory.set(cat); filterPosts()"
                    class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200">
              {{cat}}
            </button>
          }
        </div>

        @if (filteredPosts().length === 0) {
          <div class="text-center py-20">
            <div class="text-5xl mb-4">📝</div>
            <h3 class="font-display text-2xl text-white mb-2">No articles found</h3>
            <button (click)="clearSearch()" class="btn-primary mt-4">Clear Search</button>
          </div>
        } @else {
          <!-- Featured post -->
          @if (filteredPosts()[0]; as featured) {
            <article class="card mb-10 group lg:flex hover:-translate-y-1 transition-all duration-300">
              <div class="lg:w-1/2 overflow-hidden h-72 lg:h-auto">
                <img [src]="featured.image" [alt]="featured.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>
              <div class="lg:w-1/2 p-8 flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-4">
                  <span class="badge bg-primary/10 text-primary border border-primary/20">{{featured.category}}</span>
                  <span class="text-gray-500 text-sm">{{featured.readTime}} min read</span>
                </div>
                <h2 class="font-display text-3xl font-bold text-white group-hover:text-primary transition-colors mb-3">{{featured.title}}</h2>
                <p class="text-gray-400 leading-relaxed mb-6">{{featured.excerpt}}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img [src]="featured.authorAvatar" [alt]="featured.author" class="w-10 h-10 rounded-full object-cover">
                    <div>
                      <p class="text-white font-medium text-sm">{{featured.author}}</p>
                      <p class="text-gray-500 text-xs">{{featured.date}}</p>
                    </div>
                  </div>
                  <a [routerLink]="['/blog', featured.slug]" class="btn-primary text-sm py-2.5">Read Article →</a>
                </div>
              </div>
            </article>
          }

          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (post of filteredPosts().slice(1); track post.id) {
              <article class="card group hover:-translate-y-1 transition-all duration-300">
                <div class="overflow-hidden h-48">
                  <img [src]="post.image" [alt]="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-6">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="badge bg-primary/10 text-primary border border-primary/20 text-xs">{{post.category}}</span>
                    <span class="text-gray-500 text-xs">{{post.readTime}} min read</span>
                  </div>
                  <h3 class="font-display text-xl font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">{{post.title}}</h3>
                  <p class="text-gray-400 text-sm line-clamp-2 mb-5">{{post.excerpt}}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img [src]="post.authorAvatar" [alt]="post.author" class="w-8 h-8 rounded-full object-cover">
                      <span class="text-gray-400 text-sm">{{post.author}}</span>
                    </div>
                    <a [routerLink]="['/blog', post.slug]" class="text-primary hover:text-primary-400 text-sm font-medium">Read →</a>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class FitnessBlogComponent {
  private data = inject(DataService);
  allPosts: BlogPost[] = this.data.getBlogs();
  filteredPosts = signal<BlogPost[]>(this.allPosts);
  activeCategory = signal('All');
  search = '';
  categories = ['All', 'Strength Training', 'Weight Loss', 'Wellness', 'Nutrition', 'CrossFit', 'Swimming'];

  filterPosts() {
    let posts = this.allPosts;
    if (this.activeCategory() !== 'All') posts = posts.filter(p => p.category === this.activeCategory());
    if (this.search) {
      const q = this.search.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    this.filteredPosts.set(posts);
  }

  clearSearch() {
    this.search = '';
    this.activeCategory.set('All');
    this.filterPosts();
  }
}
