import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
export class App {
  protected readonly title = signal('la-hermosa');
}