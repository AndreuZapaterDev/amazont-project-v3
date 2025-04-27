import { Component, input } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  product = input.required<Product | any>();

  numberStars: string = '';
  discountedPrice: number = 0;

  constructor(private router: Router) {}

  getProductImage() {
    return this.product().images[0].url;
  }

  navigateToProduct(product: Product) {
    this.router.navigate(['/home/product', product.id]);
  }

  getStars() {
    this.numberStars = '';
    for (let i = 0; i < this.product()?.stars; i++) {
      this.numberStars += '⭐';
    }
  }

  getDiscount() {
    const discount = this.product().descuento || 0;
    this.discountedPrice =
      Math.round(
        (this.product().precio - (this.product().precio * discount) / 100) * 100
      ) / 100;
  }

  // Nuevos métodos
  getCategoryName(categoryCode: string): string {
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

  ngOnInit() {
    this.getStars();
    this.getDiscount();
  }
}
