import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 1. Import ChangeDetectorRef
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog';

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
  private cdr = inject(ChangeDetectorRef); // 2. Inject it here
  private location = inject(Location);

  blog: any = null;
  isLoading = true;

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
        // Use a small timeout if you want to ensure the "loading thingy" is seen here too
        setTimeout(() => {
          this.blog = data;
          this.isLoading = false;
          
          // 3. FORCE the UI to wake up and show the blog content
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

  // Add this function to fix the error
  goBack() {
    this.location.back();
  }
}