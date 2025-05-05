import { Component, input, OnInit } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  product = input.required<Product | any>();

  numberStars: string = '';
  discountedPrice: number = 0;

  constructor(private router: Router) {}

  getProductImage(): string {
    // Handle different product image formats
    if (this.product().images && this.product().images.length > 0) {
      // API images format
      return this.product().images[0].url;
    } else if (this.product().imagen_url) {
      // Direct imagen_url property
      return this.product().imagen_url;
    } else if (this.product().url) {
      // Fallback to url property
      return this.product().url;
    }
    // Default placeholder image if no image is available
    return 'assets/placeholder.png';
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/home/product', product.id]);
  }

  getStars() {
    // Get star rating from API or local data
    const stars = this.product()?.stars || this.product()?.calificacion || 0;
    this.numberStars = '';
    for (let i = 0; i < stars; i++) {
      this.numberStars += '⭐';
    }
  }

  getDiscount() {
    // Handle different discount formats (descuento from API or discount from local)
    const discount = this.product().descuento || this.product().discount || 0;
    const price = this.product().precio || this.product().price || 0;

    this.discountedPrice =
      Math.round((price - (price * discount) / 100) * 100) / 100;
  }

  // Nuevos métodos
  getCategoryName(categoryCode: string): string {
    // If we have a direct category name from API, use it
    if (
      typeof this.product().category === 'string' &&
      ![
        'electronic',
        'clothes',
        'sports',
        'kitchen',
        'home',
        'toys',
        'books',
        'drugs',
        'games',
      ].includes(this.product().category)
    ) {
      return this.product().category;
    }

    const categories: { [key: string]: string } = {
      electronic: 'Electrónica',
      clothes: 'Ropa',
      sports: 'Deportes',
      kitchen: 'Cocina',
      home: 'Hogar',
      toys: 'Juguetes',
      books: 'Libros',
      drugs: 'Droguería',
      games: 'Juegos',
    };

    return categories[categoryCode] || categoryCode;
  }

  getRatingCount(): number {
    return Math.floor(Math.random() * 100) + 5;
  }

  isNewProduct(): boolean {
    return this.product().id % 3 === 0;
  }

  getProductPrice(): number {
    // Handle different price formats
    return this.product().precio || this.product().price || 0;
  }

  ngOnInit() {
    this.getStars();
    this.getDiscount();
  }
}
