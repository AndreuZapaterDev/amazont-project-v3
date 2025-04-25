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

      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      

      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      

      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.cartItems = this.productService.getCartItems();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/shopping-cart']);
    }
  }

  get f() {
    return this.paymentForm.controls;
  }

  selectPaymentMethod(method: 'card' | 'paypal'): void {
    this.paymentMethod = method;
  }

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

    return total < 50 ? total + 3.99 : total;
  }


  processPayment(): void {
    this.submitted = true;
    
    let isValid = false;
    
    if (this.paymentMethod === 'paypal') {
      const shippingControls = ['fullName', 'address', 'city', 'zipCode', 'phone', 'termsAccepted'];
      isValid = shippingControls.every(control => !this.paymentForm.get(control)?.invalid);
    } else {

      isValid = this.paymentForm.valid;
    }
    
    if (isValid) {
      this.isProcessing = true;
      
      setTimeout(() => {

        this.orderNumber = this.generateOrderNumber();
        this.totalPaid = this.calculateTotal();

        this.paymentSuccess = true;
        this.isProcessing = false;

        this.productService.clearCart();
      }, 2000);
    }
  }

    getItemTotal(item: CartItem): number {
    if (item.discount) {
      const discountedUnitPrice = item.price - (item.price * item.discount / 100);
      return discountedUnitPrice * item.quantity;
    }
    return item.price * item.quantity;
  }

  private generateOrderNumber(): string {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  }
}