import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.css'
})
export class ShopDetail implements OnInit {
  product: any;
  private location = inject(Location);

  // Your master inventory (this should match the list in shop.ts)
  allProducts = [
    { id: 1, name: 'Bouquets Of Roses', price: 'PHP 1500', category: 'Bouquets', description: 'A stunning arrangement of fresh red roses.', image: 'assets/images/f1.png' },
    { id: 2, name: 'Lorem Ipsum', price: 'PHP 1500', category: 'Flowers', description: 'Beautiful seasonal blooms for any occasion.', image: 'assets/images/f2.png' },
    { id: 3, name: 'Tulip Harmony', price: 'PHP 1200', category: 'Arrangements', description: 'Elegant tulips arranged in a minimalist style.', image: 'assets/images/f3.png' },
    { id: 4, name: 'Elegance Box', price: 'PHP 2500', category: 'Bouquets', description: 'A premium box of luxury flowers.', image: 'assets/images/f4.png' },
    { id: 5, name: 'Bouquets Of Roses', price: 'PHP 1500', category: 'Bouquets', description: 'A stunning arrangement of fresh red roses.', image: 'assets/images/f5.png' },
    { id: 6, name: 'Lorem Ipsum', price: 'PHP 1500', category: 'Flowers', description: 'Beautiful seasonal blooms for any occasion.', image: 'assets/images/f6.png' },
    { id: 7, name: 'Tulip Harmony', price: 'PHP 1200', category: 'Arrangements', description: 'Elegant tulips arranged in a minimalist style.', image: 'assets/images/f7.png' },
    { id: 8, name: 'Elegance Box', price: 'PHP 2500', category: 'Bouquets', description: 'A premium box of luxury flowers.', image: 'assets/images/f8.png' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the ID from the URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Find the product that matches that ID
    this.product = this.allProducts.find(p => p.id === id);
  }

  goBack() {
    this.location.back();
  }
}