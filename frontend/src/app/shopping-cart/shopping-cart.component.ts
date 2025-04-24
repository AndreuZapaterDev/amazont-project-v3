import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';
import { ProductService } from '../services/product.service';
import { CartItem } from '../interfaces/product.interface';

// interface CartItem {
//   id: number;
//   name: string;
//   url: string;
//   price: number;
//   category: string;
//   quantity: number;
//   discount?: number;
// }

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductsComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  // Datos de ejemplo (normalmente vendrían de un servicio)
  cartItems: CartItem[] = [];
  recommendedProducts: any[] = [];

  constructor(private productService: ProductService) {}

  getCartItems() {
    this.cartItems = this.productService.getShoppingCart();
  }

  ngOnInit() {
    console.log('Cargando carrito de compras...');
    // Simular carga de datos de carrito (esto vendría de un servicio)
    this.cartItems = [
      {
        id: 1,
        name: 'Detergente',
        url: 'https://www.supercash.es/wp-content/uploads/2020/02/detergente-profesional_cabecera.png',
        price: 10.0,
        category: 'Hogar',
        quantity: 1,
        discount: 20,
      },
      {
        id: 2,
        name: 'Monopoly',
        url: 'https://www.monodejuegos.shop/wp-content/uploads/2020/11/monopoly.png',
        price: 20.0,
        category: 'Juegos',
        quantity: 2,
      },
      {
        id: 3,
        name: 'Balón',
        url: 'https://i1.t4s.cz/products/in9365/adidas-euro24-com-679082-in9365.png',
        price: 15.0,
        category: 'Deportes',
        quantity: 1,
        discount: 10,
      },
    ];
    // Cargar productos recomendados
    this.loadRecommendedProducts();
  }

  // Cálculo de totales
  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalDiscount(): number {
    return this.cartItems.reduce((sum, item) => {
      if (item.discount) {
        const discountAmount =
          ((item.price * item.discount) / 100) * item.quantity;
        return sum + discountAmount;
      }
      return sum;
    }, 0);
  }

  calculateTotal(): number {
    const total = this.subtotal - this.totalDiscount;
    // Añadir gastos de envío si el subtotal es menor a 50€
    return total < 50 ? total + 3.99 : total;
  }

  // Funciones para manejo del carrito
  increaseQuantity(item: CartItem): void {
    if (item.quantity < 10) {
      item.quantity++;
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
  }

  getDiscountedPrice(item: CartItem): number {
    if (item.discount) {
      return item.price - (item.price * item.discount) / 100;
    }
    return item.price;
  }

  // Cargar productos recomendados (ejemplo)
  loadRecommendedProducts(): void {}
}
