import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isModalOpen = false;
  isLoading = false;
  allBlogs: any[] = [];

  blogData = {
    title: '',
    author: '', 
    imageUrl: '',
    altText: '',
    header1: '',
    content: '',
    imageUrl2: '',
    altText2: '',
    header2: '',
    content2: '',
    isFeatured: false
  };

  ngOnInit() {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/blogs').subscribe({
      next: (data) => {
        this.allBlogs = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.isLoading = false;
      }
    });
  }

  onPostBlog() {
    this.isLoading = true;
    this.http.post('http://localhost:3000/api/blogs', this.blogData).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.resetForm();
        this.fetchBlogs();
        alert('Blog Published!');
      },
      error: (err) => {
        console.error('Publish error:', err);
        alert('Error publishing.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteBlog(id: string) {
    if (confirm('Delete this blog?')) {
      this.http.post(`http://localhost:3000/api/blogs/delete/${id}`, {}).subscribe({
        next: () => {
          this.fetchBlogs();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  resetForm() {
    this.blogData = {
      title: '', author: '', imageUrl: '', altText: '', header1: '', content: '',
      imageUrl2: '', altText2: '', header2: '', content2: '', isFeatured: false
    };
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
