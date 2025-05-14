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
      next: (data: any) => {
        this.productService.getProducosCarrito(data.carrito.id).subscribe({
          next: (cartProducts: any) => {
            // Process each product in the cart
            const productRequests = cartProducts.map((cartProduct: any) => {
              return this.productService.getAPIproduct(cartProduct.producto_id);
            });

            // Wait for all product requests to complete
            forkJoin(productRequests).subscribe({
              next: (products: any) => {
                // Create temporary array to hold items while we fetch images
                const tempCartItems: CartItem[] = [];

                // For each product, we'll create a cart item and then fetch its images
                products.forEach((product: any, index: number) => {
                  const cartProduct = cartProducts[index];
                  const cartItem: CartItem = {
                    id: product.id,
                    name: product.nombre,
                    price: product.precio,
                    quantity: cartProduct.cantidad,
                    category: '', // API doesn't seem to provide this
                    stars: 0, // API doesn't seem to provide this
                    discount: product.descuento,
                    description: product.descripcion,
                    stock: product.stock,
                    url: '', // Will be populated with the first image URL
                    producto_carrito_id: cartProduct.id, // Store the relationship ID
                  };

                  tempCartItems.push(cartItem);

                  // Fetch images for this product
                  this.productService.getProductImages(product.id).subscribe({
                    next: (images: any[]) => {
                      if (images && images.length > 0) {
                        // Use the first image URL
                        cartItem.url = images[0].url;
                      }
                    },
                    error: (error) => {
                      console.error(
                        `Error al cargar imágenes para producto ${product.id}:`,
                        error
                      );
                    },
                  });
                });

                // Update cart items with the temp array that will be populated with image URLs
                this.cartItems = tempCartItems;
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
      // First update local UI to be responsive
      item.quantity++;

      // Then update the server
      if (item.producto_carrito_id) {
        const data = { cantidad: item.quantity };
        this.productService
          .updateProductoCarrito(item.producto_carrito_id, data)
          .subscribe({
            next: (response) => {
              console.log('Cantidad actualizada en el servidor:', response);
            },
            error: (error) => {
              console.error('Error al actualizar cantidad:', error);
              // Revert the local change if the server update fails
              item.quantity--;
            },
          });
      }
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      // First update local UI to be responsive
      item.quantity--;

      // Then update the server
      if (item.producto_carrito_id) {
        const data = { cantidad: item.quantity };
        this.productService
          .updateProductoCarrito(item.producto_carrito_id, data)
          .subscribe({
            next: (response) => {
              console.log('Cantidad actualizada en el servidor:', response);
            },
            error: (error) => {
              console.error('Error al actualizar cantidad:', error);
              // Revert the local change if the server update fails
              item.quantity++;
            },
          });
      }
    }
  }

  removeItem(item: CartItem): void {
    if (item.producto_carrito_id) {
      // First remove from UI for responsiveness
      this.cartItems = this.cartItems.filter((i) => i.id !== item.id);

      // Then remove from server
      this.productService
        .deleteProductosCarrito(item.producto_carrito_id)
        .subscribe({
          next: (response) => {
            console.log(
              'Producto eliminado del carrito en el servidor:',
              response
            );
          },
          error: (error) => {
            console.error('Error al eliminar producto del carrito:', error);
            // If there's an error, add the item back to the cart
            this.cartItems.push(item);
          },
        });
    }
  }

  getDiscountedPrice(item: CartItem): number {
    if (item.discount) {
      const discountedUnitPrice =
        item.price - (item.price * item.discount) / 100;
      return discountedUnitPrice * item.quantity;
    }
    return item.price * item.quantity;
  }
}
