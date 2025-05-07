import { Injectable } from '@angular/core';
import { CartItem, Product, Review } from '../interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  clearCart(): void {
    this._shoppingCart = [];
    this.saveCart();
  }

  private _shoppingCart: CartItem[] = [];
  apiPath = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private saveCart(): void {
    localStorage.setItem('shoppingCart', JSON.stringify(this._shoppingCart));
  }

  private loadCart(): void {
    const cart = localStorage.getItem('shoppingCart');
    if (cart) {
      this._shoppingCart = JSON.parse(cart);
    }
  }

  addToCart(product: Product, quantity: number): void {
    const existingItem = this._shoppingCart.find(
      (item) => item.id === product.id
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this._shoppingCart.push({ ...product, quantity });
    }
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const index = this._shoppingCart.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this._shoppingCart.splice(index, 1);
    }
    this.saveCart();
  }

  getCartItems(): CartItem[] {
    return this._shoppingCart;
  }

  // API methods
  getShoppingCart(): Observable<any> {
    return this.http.get(`${this.apiPath}/api/usuarios`);
  }

  getAPIproducts(): Observable<any> {
    return this.http.get(`${this.apiPath}/api/productos`);
  }

  getAPIproduct(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/producto/${id}`);
  }

  getProductImages(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/imagen/${id}`);
  }

  // Method to get product reviews from API
  getProductReviews(productId: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/valoracion/${productId}`);
  }

  getProductCharacteristics(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/caracteristica/${id}`);
  }
}
