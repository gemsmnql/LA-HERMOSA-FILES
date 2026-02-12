import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  
  // Update this to your live Render URL
  private apiUrl = 'https://la-hermosa-files.onrender.com/api/blogs';

  // Get all blogs
  getBlogs(): Observable<any[]> {
    // Using the apiUrl variable here is cleaner
    return this.http.get<any[]>(this.apiUrl); 
  }

  // Get a single blog by ID
  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
