import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiPath = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  /**
   * Obtiene el perfil del usuario actual
   */
  getCurrentUserProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/perfil_usuario/${id}`);
  }

  /**
   * Actualiza el perfil de usuario
   */
  updatePerfilUsuario(id: number, profileData: any): Observable<any> {
    return this.http.put(
      `${this.apiPath}/api/perfil_usuario/${id}`,
      profileData
    );
  }

  /**
   * Obtiene todos los métodos de pago del usuario actual
   */
  getMetodosPago(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPath}/api/metodo_pago/${id}`);
  }

  /**
   * Añade un nuevo método de pago
   */
  addMetodoPago(metodoPago: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/metodo_pago`, metodoPago);
  }

  /**
   * Actualiza un método de pago
   */
  updateMetodoPago(id: number, metodoPago: any): Observable<any> {
    return this.http.put(`${this.apiPath}/api/metodo_pago/${id}`, metodoPago);
  }

  /**
   * Elimina un método de pago (lógicamente)
   */
  deleteMetodoPago(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/api/metodo_pago/${id}`);
  }

  /**
   * Obtiene los carritos
   */
  getCarritos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPath}/api/carritos/`);
  }

  /**
   * Obtiene los productos de un carrito finalizado
   */
  getProductosCarritoFinalizado(id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiPath}/api/productos_carrito_by_carrito/${id}`
    );
  }

  /**
   * Detecta el tipo de tarjeta basado en su número
   */
  detectCardType(number: string): string {
    // Eliminar espacios y guiones
    const cardNumber = number.replace(/[\s-]/g, '');

    // Visa comienza con 4
    if (/^4/.test(cardNumber)) return 'visa';

    // Mastercard comienza con 51-55 o 2221-2720
    if (/^5[1-5]/.test(cardNumber) || /^2[2-7][2-9][0-9]/.test(cardNumber))
      return 'mastercard';

    // Amex comienza con 34 o 37
    if (/^3[47]/.test(cardNumber)) return 'amex';

    // Otros tipos se pueden agregar según sea necesario

    return 'unknown';
  }

  /**
   * Formatea el número de tarjeta para mostrar solo los últimos 4 dígitos
   */
  formatCardNumberForDisplay(number: string): string {
    // Eliminar espacios y guiones
    const cardNumber = number.replace(/[\s-]/g, '');

    // Mostrar solo los últimos 4 dígitos
    return cardNumber.slice(-4);
  }

  /**
   * Formatea el número de tarjeta para entrada del usuario (añade espacios cada 4 dígitos)
   */
  formatCardNumber(number: string): string {
    // Eliminar caracteres no numéricos
    let value = number.replace(/\D/g, '');

    if (value.length > 16) {
      value = value.substr(0, 16);
    }

    // Añadir espacios cada 4 dígitos
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substr(i, 4));
    }

    return parts.join(' ');
  }

  /**
   * Evalúa la seguridad de una contraseña
   */
  getPasswordStrength(password: string): { class: string; text: string } {
    if (!password) return { class: '', text: '' };

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
    const length = password.length;

    const strength =
      (hasLowerCase ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChars ? 1 : 0) +
      (length >= 8 ? 1 : 0);

    if (strength >= 4) return { class: 'strong', text: 'Contraseña fuerte' };
    if (strength >= 2) return { class: 'medium', text: 'Contraseña media' };
    return { class: 'weak', text: 'Contraseña débil' };
  }

  /**
   * Cambia la contraseña del usuario
   */
  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http
      .put(`${this.apiPath}/api/usuario/${userId}`, {
        password: newPassword,
        // Incluir otros campos obligatorios del usuario que no deseamos cambiar
        email: this.loginService.getLoggedUser().email,
        rol: this.loginService.getLoggedUser().rol,
        user_profile_id: this.loginService.getLoggedUser().perfil_usuario_id,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al cambiar la contraseña:', error);
          return throwError(() => new Error('Error al cambiar la contraseña'));
        })
      );
  }
}
