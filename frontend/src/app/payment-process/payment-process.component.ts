import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-process.component.html',
  styleUrl: './payment-process.component.css'
})
export class PaymentProcessComponent implements OnInit {
  // Formularios para dirección y pago
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  
  // Estados de proceso
  currentStep: 'shipping' | 'payment' | 'confirmation' = 'shipping';
  orderCompleted = false;
  
  // Datos del carrito
  cartItems: any[] = [];
  orderNumber: string = '';
  currentDate: Date = new Date();
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Inicializar formulario de dirección
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
    
    // Inicializar formulario de pago
    this.paymentForm = this.fb.group({
      paymentMethod: ['credit', [Validators.required]],
      cardHolder: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
    
    // Cargar productos del carrito
    this.cartItems = this.cartService.getItems();
    
    // Si el carrito está vacío, redirigir al carrito
    if (this.cartItems.length === 0) {
      this.router.navigate(['/home/cart']);
    }
    
    // Generar número de pedido aleatorio
    this.orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  // Getters para facilitar el acceso a los controles del formulario
  get sf() {
    return this.shippingForm.controls;
  }
  
  get pf() {
    return this.paymentForm.controls;
  }

  // Cálculos de precio
  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get totalDiscount(): number {
    return this.cartService.getTotalDiscount();
  }

  get shipping(): number {
    return this.subtotal >= 50 ? 0 : 3.99;
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  // Navegación entre pasos
  nextStep() {
    if (this.currentStep === 'shipping') {
      if (this.shippingForm.valid) {
        this.currentStep = 'payment';
        window.scrollTo(0, 0);
      } else {
        this.shippingForm.markAllAsTouched();
      }
    } else if (this.currentStep === 'payment') {
      if (this.paymentForm.valid) {
        this.completeOrder();
        window.scrollTo(0, 0);
      } else {
        this.paymentForm.markAllAsTouched();
      }
    }
  }

  previousStep() {
    if (this.currentStep === 'payment') {
      this.currentStep = 'shipping';
      window.scrollTo(0, 0);
    }
  }

  completeOrder() {
    // Cambiar a pantalla de confirmación
    this.currentStep = 'confirmation';
    this.orderCompleted = true;
    
    // Limpiar el carrito tras completar el pedido
    setTimeout(() => {
      this.cartService.clearCart();
    }, 1000);
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }

  // Método para formatear precios
  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getDiscountedPrice(item: any): number {
    if (item.discount) {
      return item.price - (item.price * item.discount) / 100;
    }
    return item.price;
  }
  
  // Método para formatear fecha
  getFormattedDate(): string {
    return this.currentDate.toLocaleDateString();
  }
  
  // Método para obtener texto del método de pago
  getPaymentMethodText(): string {
    const method = this.pf['paymentMethod'].value;
    if (method === 'credit') return 'Tarjeta de crédito';
    if (method === 'paypal') return 'PayPal';
    if (method === 'bizum') return 'Bizum';
    return 'Desconocido';
  }
}