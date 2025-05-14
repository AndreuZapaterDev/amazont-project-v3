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
      // Create a CartItem with proper defaults for any potentially undefined properties
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        category: product.category || '',
        stars: product.stars,
        discount: product.discount || 0, // Default to 0 if undefined
        description: product.description || '',
        stock: product.stock || 0, // Default to 0 if undefined
        url: product.url || '',
      };
      this._shoppingCart.push(cartItem);
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
  getActiveCart(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/carrito_activo/${id}`);
  }

  postCarrito(user_id: number): Observable<any> {
    return this.http.post(`${this.apiPath}/api/carrito`, { user_id });
  }

  addToCarrito(
    carrito_id: number,
    producto_id: number,
    cantidad: number
  ): Observable<any> {
    return this.http.post(`${this.apiPath}/api/producto_carrito`, {
      carrito_id,
      producto_id,
      cantidad,
    });
  }

  finishCarrito(id: number): Observable<any> {
    return this.http.put(`${this.apiPath}/api/acabar_carrito/${id}`, {});
  }

  updateCarrito(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiPath}/api/carrito/${id}`, data);
  }

  getProducosCarrito(id: number): Observable<any> {
    return this.http.get(
      `${this.apiPath}/api/productos_carrito_by_carrito/${id}`
    );
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

  getNumberOfReviews(productId: number): Observable<any> {
    return this.http.get(
      `${this.apiPath}/api/puntuacion_por_producto/${productId}`
    );
  }

  getProductCharacteristics(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/caracteristica/${id}`);
  }

  postProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/producto`, data);
  }

  postProductImage(data: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/imagen`, data);
  }

  postProductCategories(data: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/producto_categoria`, data);
  }

  postProductUser(data: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/producto_usuario`, data);
  }

  deleteProductUser(product_id: number, user_id: number): Observable<any> {
    return this.http.delete(
      `${this.apiPath}/api/producto_usuario/remove/${product_id}/${user_id}`
    );
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiPath}/api/producto/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/api/producto/${id}`);
  }

  deleteProductImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/api/imagen/${id}`);
  }

  getProductsFromUser(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/productos_usuario/user/${id}`);
  }

  getMonthlyStats(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/productos_usuario/stats/${id}`);
  }

  deleteProductosCarrito(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/api/producto_carrito/${id}`);
  }

  updateProductoCarrito(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiPath}/api/producto_carrito/${id}`, data);
  }
}
