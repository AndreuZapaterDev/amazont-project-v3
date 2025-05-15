import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from '../dark-mode/dark-mode.component';
import { LoginService } from '../services/login.service';
import { AlertComponent } from '../alert/alert.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    DarkModeComponent,
    AlertComponent,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  popup: boolean = false;
  searchTerm: string = '';
  filteredProducts: any[] = [];
  cartItems: number = 0;

  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartItemCount();
  }

  // Método para obtener el número total de items en el carrito
  cartItemCount(): number {
    try {
      const user = this.loginService.getLoggedUser();
      this.productService.getActiveCart(user.id).subscribe({
        next: (data: any) => {
          this.productService.getProducosCarrito(data.carrito.id).subscribe({
            next: (cartProducts: any) => {
              this.cartItems = cartProducts.length;
              console.log('Número de items en el carrito:', this.cartItems);
              return this.cartItems;
            },
            error: (error: any) => {
              console.error('Error obteniendo los productos');
              return 0;
            },
          });
        },
        error: (error: any) => {
          console.error('Error obteniendo los items del carrito');
          return 0;
        },
      });
      return this.cartItems;
    } catch (error) {
      console.error('Error obteniendo los items del carrito');

      return 0;
    }

    // return 0;
    // const cartItems = this.productService.getCartItems();
    // return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (this.isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  getPopup(): boolean {
    return this.popup;
  }

  goToProfile() {
    if (this.loginService.getLoggedUser()) {
      console.log(this.loginService.getLoggedUser());
      this.popup = false;
      this.router.navigate(['/home/profile']);
    } else {
      this.popup = true;
      console.log('No hay usuario logueado');
    }
  }

  isVendor(): boolean {
    const loggedUser = this.loginService.getLoggedUser();
    return loggedUser && loggedUser.rol === 2;
  }

  isLoggedIn(): boolean {
    return !!this.loginService.getLoggedUser();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/home']);
  }

  goToCart() {
    if (this.loginService.getLoggedUser()) {
      this.popup = false;
      this.router.navigate(['/home/cart']);
    } else {
      this.popup = true;
      console.log('No hay usuario logueado');
    }
  }

  searchProducts() {
    // Verifica si hay un término de búsqueda válido
    if (!this.searchTerm?.trim()) {
      this.filteredProducts = [];
      return;
    }

    // Obtiene todos los productos desde la API
    this.productService.getAPIproducts().subscribe({
      next: (products: any) => {
        // Asegura que la respuesta sea un array antes de filtrar
        if (Array.isArray(products)) {
          // Filtra productos por nombre que contengan el término de búsqueda (sin distinguir mayúsculas/minúsculas)
          this.filteredProducts = products
            .filter((product: any) =>
              product.nombre
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase())
            )
            .slice(0, 5); // Limita a 5 resultados en el desplegable

          console.log('Filtered products:', this.filteredProducts);
        } else {
          console.error('API did not return an array of products', products);
          this.filteredProducts = [];
        }
      },
      error: (error: any) => {
        // Maneja errores en la búsqueda
        console.error('Error fetching products:', error);
        this.filteredProducts = [];
      },
    });
  }

  // Navega a la página de detalle del producto
  goToProductDetail(productId: number) {
    // Redirige al usuario a la página del producto seleccionado
    this.router.navigate(['/home/product', productId]);
    this.filteredProducts = []; // Limpia los resultados después de la navegación
    this.searchTerm = ''; // Limpia el término de búsqueda
  }
}
