import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.interface';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  url: string;
  category: string;
  discount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private _items: CartItem[] = [];

  constructor() {
    this.loadCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this._items));
    this.cartItems.next(this._items);
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this._items = JSON.parse(savedCart);
      this.cartItems.next(this._items);
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItemIndex = this._items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Si el producto ya existe, actualizar cantidad
      this._items[existingItemIndex].quantity += quantity;
    } else {
      // Si es un producto nuevo, añadirlo al carrito
      this._items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        url: product.url,
        category: product.category,
        discount: product.discount
      });
    }
    
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this._items = this._items.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this._items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  clearCart(): void {
    this._items = [];
    this.saveCart();
  }

  getItems(): CartItem[] {
    return [...this._items];
  }

  getTotalItems(): number {
    return this._items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotalDiscount(): number {
    return this._items.reduce((sum, item) => {
      if (item.discount) {
        return sum + ((item.price * item.discount) / 100) * item.quantity;
      }
      return sum;
    }, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.getTotalDiscount();
    const shipping = subtotal >= 50 ? 0 : 3.99;
    
    return subtotal - discount + shipping;
  }
}