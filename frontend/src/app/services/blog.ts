import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  
  // Base URL for the API
  private apiUrl = 'https://la-hermosa-files.onrender.com/api/blogs';

  /**
   * Smart URL Fixer:
   * 1. Detects if the app is running locally or in production.
   * 2. Replaces broken 'localhost' database entries with the correct live URL when in production.
   * 3. Ensures local uploads work when testing on your device.
   */
  private fixImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';

    const isLocalFrontend = window.location.hostname === 'localhost';
    const filename = url.split('/').pop();

    // If you are testing locally (localhost:4200)
    if (isLocalFrontend) {
      // Point to your local backend (change 3000 to your backend port if different)
      return `http://localhost:3000/uploads/${filename}`;
    }

    // If you are on the live site (lahermosa.shop)
    // Force the Render URL if the database has 'localhost' or relative paths
    if (url.includes('localhost') || !url.startsWith('http')) {
      return `https://la-her-mosa-files.onrender.com/uploads/${filename}`;
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
