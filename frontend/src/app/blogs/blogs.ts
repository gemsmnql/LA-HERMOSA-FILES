import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../services/blog';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css'
})
export class BlogsComponent implements OnInit {
  private blogService = inject(BlogService); 
  private cdr = inject(ChangeDetectorRef); 
  
  blogPosts: any[] = []; 
  featuredPosts: any[] = [];
  latestPosts: any[] = [];
  isLoading = true; // Start as true

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
  this.isLoading = true;
  this.blogService.getBlogs().subscribe({
    next: (data) => {
      setTimeout(() => {
        this.blogPosts = data || [];
        this.featuredPosts = this.blogPosts.filter(post => post.isFeatured);
        this.latestPosts = this.blogPosts.slice(0, 3);
        
        this.isLoading = false; // This triggers the *ngIf in the sidebar and main grid
        this.cdr.detectChanges();
      }, 2000);
    }
  });
}
}