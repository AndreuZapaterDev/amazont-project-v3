import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartItem } from '../interfaces/product.interface';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-process.component.html',
  styleUrl: './payment-process.component.css'
})
export class PaymentProcessComponent implements OnInit {
  paymentForm: FormGroup;
  cartItems: CartItem[] = [];
  submitted = false;
  isProcessing = false;
  paymentMethod: 'card' | 'paypal' = 'card';
  paymentSuccess = false;
  orderNumber = '';
  totalPaid = 0;

  // Inyección de dependencias usando inject()
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);
  
  constructor() {
    this.paymentForm = this.formBuilder.group({
      // Shipping details
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      
      // Payment details
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      
      // Terms
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Load cart items
    this.cartItems = this.productService.getCartItems();
    
    // Redirect to cart if empty
    if (this.cartItems.length === 0) {
      this.router.navigate(['/shopping-cart']);
    }
  }

  // Getter for form controls
  get f() {
    return this.paymentForm.controls;
  }

  selectPaymentMethod(method: 'card' | 'paypal'): void {
    this.paymentMethod = method;
  }

  // Format card number with spaces (e.g., 1234 5678 9012 3456)
  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    input.value = formattedValue;
    this.paymentForm.get('cardNumber')?.setValue(formattedValue);
  }

  // Format expiry date (MM/YY)
  formatExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      input.value = value;
    }
    
    this.paymentForm.get('expiryDate')?.setValue(input.value);
  }

  // Cart total calculations
  getSubtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalDiscount(): number {
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
    const total = this.getSubtotal() - this.getTotalDiscount();
    // Add shipping if subtotal is less than 50€
    return total < 50 ? total + 3.99 : total;
  }

  // Process payment
  processPayment(): void {
    this.submitted = true;
    
    // Check if form is valid based on payment method
    let isValid = false;
    
    if (this.paymentMethod === 'paypal') {
      // For PayPal we only need shipping details and terms
      const shippingControls = ['fullName', 'address', 'city', 'zipCode', 'phone', 'termsAccepted'];
      isValid = shippingControls.every(control => !this.paymentForm.get(control)?.invalid);
    } else {
      // For card payment we need all fields
      isValid = this.paymentForm.valid;
    }
    
    if (isValid) {
      this.isProcessing = true;
      
      // Simulate API call to process payment
      setTimeout(() => {
        // Generate order details
        this.orderNumber = this.generateOrderNumber();
        this.totalPaid = this.calculateTotal();
        
        // Show success message
        this.paymentSuccess = true;
        this.isProcessing = false;
        
        // Clear cart
        this.productService.clearCart();
      }, 2000);
    }
  }

  // Generate a random order number
  private generateOrderNumber(): string {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  }
}