import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartItem } from '../interfaces/product.interface';
import { forkJoin } from 'rxjs';
import { LoginService } from '../services/login.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payment-process.component.html',
  styleUrl: './payment-process.component.css',
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
  cartId: number = 0; // Store the cart ID for finalizing payment

  // Variables para tarjetas guardadas
  savedPaymentMethods: any[] = [];
  selectedCardId: number | null = null;

  // Inyección de dependencias usando inject()
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private productService = inject(ProductService);
  private loginService = inject(LoginService);
  private profileService = inject(ProfileService);

  constructor() {
    this.paymentForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],

      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/),
        ],
      ],
      cardName: ['', Validators.required],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      saveCard: [false],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    // Cargar las tarjetas guardadas del usuario
    this.loadSavedPaymentMethods();

    // Initialize empty cart items array
    this.cartItems = [];

    // Get user's active cart from API
    const user = this.loginService.getLoggedUser();
    this.productService.getActiveCart(user.id).subscribe({
      next: (data: any) => {
        this.cartId = data.carrito.id; // Store cart ID for later use
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
        this.router.navigate(['/shopping-cart']);
      },
    });
  }

  // Cargar métodos de pago guardados del usuario
  loadSavedPaymentMethods(): void {
    const currentUser = this.loginService.getLoggedUser();
    if (!currentUser) return;

    this.profileService.getMetodosPago(currentUser.id).subscribe({
      next: (metodos) => {
        // Transformar los métodos de pago de la API al formato que usamos en la vista
        this.savedPaymentMethods = metodos.map((metodo) => ({
          id: metodo.id,
          type: this.profileService.detectCardType(metodo.tarjeta),
          name: metodo.nombre,
          last4: this.profileService.formatCardNumberForDisplay(metodo.tarjeta),
          expiry: metodo.caducidad,
        }));
      },
      error: (error) => {
        console.error('Error al cargar los métodos de pago:', error);
      },
    });
  }

  // Seleccionar tarjeta guardada
  selectSavedCard(card: any): void {
    this.selectedCardId = card.id;

    // Desactivar validaciones de campos de tarjeta cuando se selecciona una tarjeta guardada
    const cardControls = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
    cardControls.forEach((control) => {
      const formControl = this.paymentForm.get(control);
      formControl?.clearValidators();
      formControl?.updateValueAndValidity();
    });
  }

  // Usar nueva tarjeta
  useNewCard(): void {
    this.selectedCardId = null;

    // Reactivar validaciones para los campos de tarjeta
    this.paymentForm.get('cardName')?.setValidators(Validators.required);
    this.paymentForm
      .get('cardNumber')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/),
      ]);
    this.paymentForm
      .get('expiryDate')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
      ]);
    this.paymentForm
      .get('cvv')
      ?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);

    // Actualizar validez de los controles
    Object.keys(this.paymentForm.controls).forEach((key) => {
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  // Obtener el icono de la tarjeta según su tipo
  getCardIcon(type: string): string {
    const icons: { [key: string]: string } = {
      visa: 'fi fi-brands-visa',
      mastercard: 'fi fi-brands-mastercard',
      amex: 'fi fi-brands-amex',
    };

    return icons[type] || 'fi fi-br-credit-card';
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
      const shippingControls = [
        'fullName',
        'address',
        'city',
        'zipCode',
        'phone',
        'termsAccepted',
      ];
      isValid = shippingControls.every(
        (control) => !this.paymentForm.get(control)?.invalid
      );
    } else {
      // Si hemos seleccionado una tarjeta guardada, no validamos los campos de tarjeta
      if (this.selectedCardId) {
        const shippingControls = [
          'fullName',
          'address',
          'city',
          'zipCode',
          'phone',
          'termsAccepted',
        ];
        isValid = shippingControls.every(
          (control) => !this.paymentForm.get(control)?.invalid
        );
      } else {
        isValid = this.paymentForm.valid;
      }
    }

    if (isValid) {
      this.isProcessing = true;

      // Finalizar pago
      if (this.cartId) {
        this.productService.finishCarrito(this.cartId).subscribe({
          next: () => {
            // Si el usuario seleccionó una tarjeta guardada, actualizar el carrito con ese método de pago
            if (this.selectedCardId && this.paymentMethod === 'card') {
              this.updateCarritoWithPaymentMethod(this.selectedCardId);
            }
            // Si el usuario está usando una nueva tarjeta y desea guardarla
            else if (this.paymentMethod === 'card' && !this.selectedCardId) {
              const currentUser = this.loginService.getLoggedUser();
              const paymentData = {
                user_id: currentUser.id.toString(),
                nombre: this.paymentForm.value.cardName,
                tarjeta: this.paymentForm.value.cardNumber.replace(/\s+/g, ''),
                caducidad: this.paymentForm.value.expiryDate,
                cvv: this.paymentForm.value.cvv,
              };

              // Crear el método de pago y luego actualizar el carrito con su ID
              this.profileService.addMetodoPago(paymentData).subscribe({
                next: (response) => {
                  console.log('Tarjeta guardada correctamente:', response);

                  // Acceder al ID del método de pago desde la respuesta correcta
                  // La respuesta tiene un objeto anidado llamado "metodo_pago" que contiene el ID
                  if (
                    response &&
                    response.metodo_pago &&
                    response.metodo_pago.id
                  ) {
                    const metodoPagoId = response.metodo_pago.id;
                    this.updateCarritoWithPaymentMethod(metodoPagoId);
                  } else {
                    console.error(
                      'Respuesta del método de pago no contiene un ID válido:',
                      response
                    );
                    this.completePaymentProcess();
                  }
                },
                error: (error) => {
                  console.error('Error al guardar la tarjeta:', error);
                  // Aún así completamos el proceso ya que el carrito se finalizó correctamente
                  this.completePaymentProcess();
                },
              });
            } else {
              // Paypal o cualquier otro caso, simplemente completamos el proceso
              this.completePaymentProcess();
            }
          },
          error: (error) => {
            console.error('Error finalizing cart:', error);
            this.isProcessing = false;
          },
        });
      } else {
        setTimeout(() => {
          this.orderNumber = this.generateOrderNumber();
          this.totalPaid = this.calculateTotal();
          this.paymentSuccess = true;
          this.isProcessing = false;
          this.productService.clearCart();
        }, 2000);
      }
    }
  }

  // Método para actualizar el carrito con el ID del método de pago
  private updateCarritoWithPaymentMethod(paymentMethodId: number): void {
    const paymentMethodData = {
      metodo_pago_id: paymentMethodId.toString(),
    };

    this.productService
      .updateCarrito(this.cartId, paymentMethodData)
      .subscribe({
        next: () => {
          console.log('Método de pago asignado correctamente al carrito');
          this.completePaymentProcess();
        },
        error: (error) => {
          console.error('Error al asignar método de pago al carrito:', error);
          // Aún así completamos el proceso ya que el carrito se finalizó correctamente
          this.completePaymentProcess();
        },
      });
  }

  // Método para completar el proceso de pago (común para todos los casos)
  private completePaymentProcess(): void {
    this.orderNumber = this.generateOrderNumber();
    this.totalPaid = this.calculateTotal();
    this.paymentSuccess = true;
    this.isProcessing = false;
    this.productService.clearCart();
  }

  getItemTotal(item: CartItem): number {
    if (item.discount) {
      const discountedUnitPrice =
        item.price - (item.price * item.discount) / 100;
      return discountedUnitPrice * item.quantity;
    }
    return item.price * item.quantity;
  }

  private generateOrderNumber(): string {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  }
}
