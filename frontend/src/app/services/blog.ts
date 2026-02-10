import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/blogs';

  // Get all blogs
  getBlogs(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/api/blogs'); //
}

  // Get a single blog by ID
  getBlogById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}