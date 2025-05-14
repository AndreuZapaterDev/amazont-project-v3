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

  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private router: Router
  ) {}

  // Método para obtener el número total de items en el carrito
  get cartItemCount(): number {
    // let cartItems = 0;
    // const user = this.loginService.getLoggedUser();
    // this.productService.getActiveCart(user.id).subscribe({
    //   next: (data: any) => {
    //     this.productService.getProducosCarrito(data.carrito.id).subscribe({
    //       next: (cartProducts: any) => {
    //         cartItems = cartProducts.length;
    //         // console.log('Número de items en el carrito:', cartItems);
    //       },
    //       error: (error: any) => {
    //         console.error('Error fetching cart products:', error);
    //       },
    //     });
    //   },
    //   error: (error: any) => {
    //     console.error('Error fetching cart items:', error);
    //   },
    // });
    // return cartItems;
    return 0;
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
    return loggedUser && loggedUser.rol === 2; // Vendor has role 2, not 1
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
    if (!this.searchTerm?.trim()) {
      this.filteredProducts = []; // Clear results if search is empty
      return;
    }

    // Get all products from your API
    this.productService.getAPIproducts().subscribe({
      next: (products: any) => {
        // Make sure products is an array before filtering
        if (Array.isArray(products)) {
          // Filter products by name containing the search term (case insensitive)
          this.filteredProducts = products
            .filter((product: any) =>
              product.nombre
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase())
            )
            .slice(0, 5); // Limit to 5 results in the dropdown

          console.log('Filtered products:', this.filteredProducts);
        } else {
          console.error('API did not return an array of products', products);
          this.filteredProducts = [];
        }
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
        this.filteredProducts = [];
      },
    });
  }

  // Navigate to product detail page
  goToProductDetail(productId: number) {
    this.router.navigate(['/home/product', productId]);
    this.filteredProducts = []; // Clear results after navigation
    this.searchTerm = ''; // Clear search term
  }

  // View all search results
  viewAllResults() {
    this.router.navigate(['/home/search'], {
      queryParams: { query: this.searchTerm },
    });
    this.filteredProducts = []; // Clear dropdown results
  }
}
