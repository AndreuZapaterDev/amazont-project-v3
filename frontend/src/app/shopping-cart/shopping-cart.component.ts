import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';

interface CartItem {
  id: number;
  name: string;
  url: string;
  price: number;
  category: string;
  quantity: number;
  discount?: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductsComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  // Datos de ejemplo (normalmente vendrían de un servicio)
  cartItems: CartItem[] = [];
  recommendedProducts: any[] = [];
  
  ngOnInit() {
    // Simular carga de datos de carrito (esto vendría de un servicio)
    this.cartItems = [
      {
        id: 1,
        name: 'Detergente',
        url: 'https://www.supercash.es/wp-content/uploads/2020/02/detergente-profesional_cabecera.png',
        price: 10.0,
        category: 'Hogar',
        quantity: 1,
        discount: 20
      },
      {
        id: 2,
        name: 'Monopoly',
        url: 'https://www.monodejuegos.shop/wp-content/uploads/2020/11/monopoly.png',
        price: 20.0,
        category: 'Juegos',
        quantity: 2
      },
      {
        id: 3,
        name: 'Balón',
        url: 'https://i1.t4s.cz/products/in9365/adidas-euro24-com-679082-in9365.png',
        price: 15.0,
        category: 'Deportes',
        quantity: 1,
        discount: 10
      }
    ];
    
    // Cargar productos recomendados
    this.loadRecommendedProducts();
  }
  
  // Cálculo de totales
  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => 
      sum + item.price * item.quantity, 0);
  }
  
  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  get totalDiscount(): number {
    return this.cartItems.reduce((sum, item) => {
      if (item.discount) {
        const discountAmount = (item.price * item.discount / 100) * item.quantity;
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
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
  }
  
  getDiscountedPrice(item: CartItem): number {
    if (item.discount) {
      return item.price - (item.price * item.discount / 100);
    }
    return item.price;
  }
  
  // Cargar productos recomendados (ejemplo)
  loadRecommendedProducts(): void {
    this.recommendedProducts = [
      {
        id: 4,
        name: 'Sartén',
        url: 'https://cdn.speedsize.com/7ea397ab-9451-4e4a-a8e0-a877fed40d95/https://www.arcos.com/media/catalog/product/7/1/716400_1.png',
        price: 25.0,
        stars: 4,
        category: 'kitchen',
        discount: 20
      },
      {
        id: 5,
        name: 'Camisa',
        url: 'https://media.wuerth.com/stmedia/modyf/eshop/products/std.lang.all/resolutions/normal/png-546x410px/26501189.png',
        price: 30.0,
        stars: 5,
        category: 'clothes',
        discount: 30
      },
      {
        id: 6,
        name: 'Smartphone',
        url: 'https://oukitel.com/cdn/shop/files/1___11.png?v=1732246275&width=600',
        price: 500.0,
        stars: 4,
        category: 'electronics',
        discount: 40
      },
      {
        id: 7,
        name: 'Camiseta',
        url: 'https://timshop.timhortons.ca/cdn/shop/files/retro-logo-tshirt-back-1000px.png?v=1707853862&width=1000',
        price: 15.0,
        stars: 4,
        category: 'clothes'
      }
    ];
  }
}