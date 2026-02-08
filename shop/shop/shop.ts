import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink], // Ensure RouterLink is imported
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  // Your full inventory
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

  filteredProducts: any[] = [];
  selectedCategory: string = 'All';

  ngOnInit() {
    this.filteredProducts = this.allProducts;
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.allProducts;
    } else {
      this.filteredProducts = this.allProducts.filter(p => p.category === category);
    }
  }

  onDropdownChange(event: any) {
  const value = event.target.value;
  this.filterCategory(value);
}
}