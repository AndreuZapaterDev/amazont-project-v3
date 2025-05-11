import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';
import { CartItem } from '../interfaces/product.interface';
import { ProductService } from '../services/product.service';
import { LoginService } from '../services/login.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductsComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private loginService: LoginService
  ) {}
  // Datos de ejemplo (normalmente vendrían de un servicio)
  cartItems: CartItem[] = [];
  recommendedProducts: any[] = [];

  ngOnInit() {
    // Initialize empty cart items array
    this.cartItems = [];

    // Get user's active cart from API
    const user = this.loginService.getLoggedUser();
    this.productService.getActiveCart(user.id).subscribe({
      next: (data) => {
        this.productService.getProducosCarrito(data.carrito.id).subscribe({
          next: (cartProducts) => {
            // Process each product in the cart
            const productRequests = cartProducts.map((cartProduct: any) => {
              return this.productService.getAPIproduct(cartProduct.producto_id);
            });

            // Wait for all product requests to complete
            forkJoin(productRequests).subscribe({
              next: (products) => {
                // Map products to cart items
                this.cartItems = products.map((product: any, index: number) => {
                  const cartProduct = cartProducts[index];
                  return {
                    id: product.id,
                    name: product.nombre,
                    price: product.precio,
                    quantity: cartProduct.cantidad,
                    category: '', // API doesn't seem to provide this
                    stars: 0, // API doesn't seem to provide this
                    discount: product.descuento,
                    // Add any additional fields you need from the product data
                    description: product.descripcion,
                    stock: product.stock,
                    // If you have an image URL, add it here
                    url: product.url || '',
                  };
                });
              },
              error: (error) => {
                console.error('Error al cargar detalles de productos:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error al cargar los productos del carrito:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
      },
    });

    // Cargar productos recomendados
    // this.loadRecommendedProducts();
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
    // this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
    this.productService.removeFromCart(item.id);
  }

  getDiscountedPrice(item: CartItem): number {
    if (item.discount) {
      const discountedUnitPrice =
        item.price - (item.price * item.discount) / 100;
      return discountedUnitPrice * item.quantity;
    }
    return item.price * item.quantity;
  }

  // Cargar productos recomendados (ejemplo)
  loadRecommendedProducts(): void {
    // this.recommendedProducts = [
    //   {
    //     id: 4,
    //     name: 'Sartén',
    //     url: 'https://cdn.speedsize.com/7ea397ab-9451-4e4a-a8e0-a877fed40d95/https://www.arcos.com/media/catalog/product/7/1/716400_1.png',
    //     price: 25.0,
    //     stars: 4,
    //     category: 'kitchen',
    //     discount: 20,
    //   },
    //   {
    //     id: 5,
    //     name: 'Camisa',
    //     url: 'https://media.wuerth.com/stmedia/modyf/eshop/products/std.lang.all/resolutions/normal/png-546x410px/26501189.png',
    //     price: 30.0,
    //     stars: 5,
    //     category: 'clothes',
    //     discount: 30,
    //   },
    //   {
    //     id: 6,
    //     name: 'Smartphone',
    //     url: 'https://oukitel.com/cdn/shop/files/1___11.png?v=1732246275&width=600',
    //     price: 500.0,
    //     stars: 4,
    //     category: 'electronics',
    //     discount: 40,
    //   },
    //   {
    //     id: 7,
    //     name: 'Camiseta',
    //     url: 'https://timshop.timhortons.ca/cdn/shop/files/retro-logo-tshirt-back-1000px.png?v=1707853862&width=1000',
    //     price: 15.0,
    //     stars: 4,
    //     category: 'clothes',
    //   },
    // ];
  }
}
