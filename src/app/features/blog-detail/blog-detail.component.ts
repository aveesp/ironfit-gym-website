import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { BlogPost } from '../../core/models';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (post) {
      <!-- Hero -->
      <section class="relative pt-20 h-[50vh] overflow-hidden">
        <img [src]="post.image" [alt]="post.title" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-dark-900/20"></div>
        <div class="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-4">
          <span class="badge bg-primary/20 text-primary border border-primary/30 mb-4">{{post.category}}</span>
          <h1 class="font-display text-4xl md:text-5xl font-bold text-white leading-tight">{{post.title}}</h1>
        </div>
      </section>

      <!-- Article -->
      <section class="py-16 bg-dark-900">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-10 pb-6 border-b border-dark-600">
            <div class="flex items-center gap-4">
              <img [src]="post.authorAvatar" [alt]="post.author" class="w-12 h-12 rounded-full object-cover border-2 border-primary/30">
              <div>
                <p class="font-semibold text-white">{{post.author}}</p>
                <p class="text-gray-400 text-sm">{{post.date}} · {{post.readTime}} min read</p>
              </div>
            </div>
            <div class="flex gap-2">
              @for (tag of post.tags; track tag) {
                <span class="badge bg-dark-600 text-gray-400 border border-dark-400 text-xs">{{tag}}</span>
              }
            </div>
          </div>

          <div class="prose prose-invert max-w-none">
            <p class="text-gray-300 text-xl leading-relaxed mb-8 font-light">{{post.excerpt}}</p>
            <div class="space-y-6 text-gray-300 leading-relaxed">
              <p>Whether you're a beginner stepping into a gym for the first time or an experienced athlete looking to optimize your training, understanding the fundamentals is essential for long-term success. This comprehensive guide covers everything you need to know to achieve your fitness goals.</p>
              <h2 class="font-display text-2xl font-bold text-white mt-8 mb-4">The Foundation of Success</h2>
              <p>Every successful fitness journey starts with a clear understanding of your goals. Whether you're aiming to build muscle, lose fat, improve athletic performance, or simply get healthier, your approach should be tailored to your specific objectives.</p>
              <p>Consistency is the single most important factor in achieving fitness results. A moderate program done consistently will always outperform an intense program done sporadically. Focus on building sustainable habits first, then gradually increase intensity and volume.</p>
              <h2 class="font-display text-2xl font-bold text-white mt-8 mb-4">Progressive Overload</h2>
              <p>The principle of progressive overload is the cornerstone of any effective training program. By gradually increasing the demands placed on your body — whether through weight, volume, frequency, or intensity — you force adaptation and growth.</p>
              <p>Track your workouts religiously. If you're not measuring your progress, you're guessing. A simple training log — whether digital or paper — will help you identify patterns, celebrate wins, and course-correct when needed.</p>
              <h2 class="font-display text-2xl font-bold text-white mt-8 mb-4">Recovery & Nutrition</h2>
              <p>Training is only one piece of the puzzle. Recovery — including adequate sleep, nutrition, and stress management — is where the real magic happens. Your muscles don't grow in the gym; they grow while you rest.</p>
              <p>Prioritize protein intake to support muscle repair and growth. Aim for 0.7–1g of protein per pound of bodyweight daily. Focus on whole, minimally processed foods, and stay adequately hydrated throughout the day.</p>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-dark-600">
            <a routerLink="/blog" class="btn-secondary">← Back to Blog</a>
          </div>
        </div>
      </section>

      <!-- Related Posts -->
      <section class="py-16 bg-dark-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="font-display text-2xl font-bold text-white uppercase mb-8">Related Articles</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (related of relatedPosts; track related.id) {
              <article class="card group hover:-translate-y-1 transition-all duration-300">
                <div class="overflow-hidden h-44">
                  <img [src]="related.image" [alt]="related.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-5">
                  <span class="badge bg-primary/10 text-primary border border-primary/20 text-xs mb-2">{{related.category}}</span>
                  <h3 class="font-display text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">{{related.title}}</h3>
                  <a [routerLink]="['/blog', related.slug]" class="text-primary text-sm font-medium">Read More →</a>
                </div>
              </article>
            }
          </div>
        </div>
      </section>
    } @else {
      <div class="min-h-screen flex items-center justify-center pt-20">
        <div class="text-center">
          <h2 class="font-display text-3xl text-white mb-4">Article Not Found</h2>
          <a routerLink="/blog" class="btn-primary">Back to Blog</a>
        </div>
      </div>
    }
  `,
})
export class BlogDetailComponent implements OnInit {
  private data = inject(DataService);
  private route = inject(ActivatedRoute);

  post: BlogPost | undefined;
  relatedPosts: BlogPost[] = [];

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.post = this.data.getBlogBySlug(slug);
    this.relatedPosts = this.data.getBlogs().filter(b => b.slug !== slug).slice(0, 3);
  }
}
