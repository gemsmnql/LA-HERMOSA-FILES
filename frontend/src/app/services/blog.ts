import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  
  // Check if we are on localhost
  private isLocal = window.location.hostname === 'localhost';

  // DYNAMIC API URL: Points to local backend if testing, Render if live
  private apiUrl = this.isLocal 
    ? 'http://localhost:3000/api/blogs' 
    : 'https://la-hermosa-files.onrender.com/api/blogs';

  /**
   * Smart URL Fixer
   */
  private fixImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';

    const filename = url.split('/').pop();

    if (this.isLocal) {
      // When testing locally, always look at the local uploads folder
      return `http://localhost:3000/uploads/${filename}`;
    }

    // When live, ensure we point to Render even if the DB has 'localhost' entries
    if (url.includes('localhost') || !url.startsWith('http')) {
      return `https://la-hermosa-files.onrender.com/uploads/${filename}`;
    }

    return url;
  }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(blogs => blogs.map(blog => ({
        ...blog,
        imageUrl: this.fixImageUrl(blog.imageUrl),
        imageUrl2: this.fixImageUrl(blog.imageUrl2)
      })))
    );
  }

  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(blog => ({
        ...blog,
        imageUrl: this.fixImageUrl(blog.imageUrl),
        imageUrl2: this.fixImageUrl(blog.imageUrl2)
      }))
    );
  }

  createBlog(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateBlog(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete/${id}`, {});
  }
}
