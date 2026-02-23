import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // 1. Added imports

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css'
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);
  private sanitizer = inject(DomSanitizer); // 2. Inject Sanitizer

  blog: any = null;
  isLoading = true;
  dynamicSchema: SafeHtml | undefined; // 3. Added schema variable

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchBlogDetail(id);
    }
  }

  fetchBlogDetail(id: string) {
    this.isLoading = true;
    this.blogService.getBlogById(id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.blog = data;
          this.isLoading = false;
          
          // 4. Generate the Schema when data arrives
          this.generateBlogSchema(data); 
          
          this.cdr.detectChanges(); 
        }, 500);
      },
      error: (err) => {
        console.error('Error fetching blog detail:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 5. Added the Schema Generator Function
  generateBlogSchema(blog: any) {
    const schemaJson = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.content ? blog.content.substring(0, 160) : '',
      "image": [blog.imageUrl, blog.imageUrl2].filter(img => img),
      "author": {
        "@type": "Person",
        "name": blog.author || "La Hermosa Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "La Hermosa Flower Shop",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lahermosa.shop/assets/images/favlogo.png"
        }
      },
      "datePublished": blog.createdAt || new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://lahermosa.shop/blog-detail/${blog._id}`
      }
    };

    const jsonString = JSON.stringify(schemaJson);
    this.dynamicSchema = this.sanitizer.bypassSecurityTrustHtml(
      `<script type="application/ld+json">${jsonString}</script>`
    );
  }

  goBack() {
    this.location.back();
  }
}
