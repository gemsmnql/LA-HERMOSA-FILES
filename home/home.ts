import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../services/blog'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private blogService = inject(BlogService);
  private cdr = inject(ChangeDetectorRef);

  images = [
    {img:'assets/images/f6.webp', alt: "Red rose bouquet" }, 
    {img:'assets/images/f2.webp', alt: "Sunflower bouquet" }, 
    {img:'assets/images/f8.webp', alt: "Mixed flower bouquet" }
  ];
  currentImage = 0;
  
  // Real dynamic data
  blogs: any[] = []; 
  isLoadingBlogs = true;

  buoquets = [
    { name: 'Sunflower Bouquet', price: "PHP 1499", image: 'assets/images/f2.webp', alt: "Sunflower bouquet wrapped in black paper" },
    { name: 'Mixed Flowers Bouquet', price: "PHP 1299", image: 'assets/images/f4.webp', alt: "Mixed flower bouquet in pink wrap" },
    { name: 'Red Roses Bouquet', price: "PHP 1799", image: 'assets/images/f6.webp', alt: "Red rose bouquet" },
    { name: 'Roses Bouquet', price: "PHP 1999", image: 'assets/images/f1.webp', alt: "Red roses in blush wrap" }
  ];

  galleryImages = [
    {images: "assets/images/gallery2.jpg", alt:"Large colorful event flower arrangement"}, 
    {images: "assets/images/gallery3.webp", alt:"Stage floral decoration for special event"}, 
    {images: "assets/images/gallery4.webp", alt:"Church wedding flower aisle decoration"}];

  ngOnInit() {
    this.fetchLatestBlogs();
  }

  selectImage(index: number) {
    this.currentImage = index;
  }

  fetchLatestBlogs() {
    this.isLoadingBlogs = true;
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        // We take the first 3 from the database
        this.blogs = data.slice(0, 3);
        this.isLoadingBlogs = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching blogs for home:', err);
        this.isLoadingBlogs = false;
        this.cdr.detectChanges();
      }
    });
  }
}