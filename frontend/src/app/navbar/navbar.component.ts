import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from '../dark-mode/dark-mode.component';
import { LoginService } from '../services/login.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, DarkModeComponent, AlertComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  popup: boolean = false;
  constructor(
    private productService: ProductService,
    private loginService: LoginService
  ) {}

  // Método para obtener el número total de items en el carrito
  get cartItemCount(): number {
    const cartItems = this.productService.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Opcional: bloquear el scroll cuando el menú está abierto
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
    } else {
      this.popup = true;
      console.log('No hay usuario logueado');
    }
  }
}
