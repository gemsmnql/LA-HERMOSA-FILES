import { Component, signal, inject, OnInit } from '@angular/core'; // Added inject and OnInit
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // Added Router
import { Header } from './header/header';
import { Footer } from './footer/footer';
// DELETE this line: import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  // REMOVE HttpClientModule from the array below
  imports: [RouterLink, RouterOutlet, Header, RouterLinkActive, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit { // Added implements OnInit
  protected readonly title = signal('la-hermosa');
  
  // Added router injection
  private router = inject(Router);

  ngOnInit() {
    // Added a manual check for direct URL entry security
    const currentPath = window.location.pathname;
    const token = localStorage.getItem('token');

    if (currentPath.includes('/admin/dashboard') && !token) {
      this.router.navigate(['/admin/login']);
    }
  }
}
