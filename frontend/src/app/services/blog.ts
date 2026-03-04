import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  
  // Detect if you are on localhost
  private isLocal = window.location.hostname === 'localhost';

  // API switches between local and live automatically
  private apiUrl = this.isLocal 
    ? 'http://localhost:3000/api/blogs' 
    : 'https://la-hermosa-files.onrender.com/api/blogs';

  /**
   * Fixes image URLs by ensuring they point to the correct server
   * regardless of what is stored in the database.
   */
  private fixImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';

    // 1. Extract just the filename (in case it's a full URL or a path)
    const filename = url.split('/').pop();

    // 2. Select the correct base based on your environment
    const base = this.isLocal 
      ? 'http://localhost:3000' 
      : 'https://la-hermosa-files.onrender.com';

    return `${base}/uploads/${filename}`;
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
    // Note: It's safer to use the specific apiUrl for the delete endpoint
    return this.http.post(`${this.apiUrl}/delete/${id}`, {});
  }
}
