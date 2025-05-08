import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiPath = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  /**
   * Obtiene el perfil del usuario actual
   */
  getCurrentUserProfile(): Observable<any> {
    const currentUser = this.loginService.getLoggedUser();
    if (!currentUser || !currentUser.perfil_usuario_id) {
      return throwError(() => new Error('No hay usuario conectado o no tiene perfil asociado'));
    }
    
    return this.getPerfilUsuario(currentUser.perfil_usuario_id);
  }

  /**
   * Obtiene un perfil de usuario por su ID
   */
  getPerfilUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/perfil_usuario/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener el perfil de usuario:', error);
        return throwError(() => new Error('Error al cargar el perfil de usuario'));
      })
    );
  }

  /**
   * Actualiza el perfil de usuario
   */
  updatePerfilUsuario(id: number, profileData: any): Observable<any> {
    return this.http.put(`${this.apiPath}/api/perfil_usuario/${id}`, profileData).pipe(
      catchError(error => {
        console.error('Error al actualizar el perfil de usuario:', error);
        return throwError(() => new Error('Error al actualizar el perfil de usuario'));
      })
    );
  }

  /**
   * Obtiene todos los métodos de pago del usuario actual
   */
  getMetodosPago(): Observable<any[]> {
    const currentUser = this.loginService.getLoggedUser();
    if (!currentUser) {
      return throwError(() => new Error('No hay usuario conectado'));
    }

    return this.http.get<any[]>(`${this.apiPath}/api/metodos_pago`).pipe(
      map(metodos => metodos.filter(metodo => metodo.user_id === currentUser.id)),
      catchError(error => {
        console.error('Error al obtener métodos de pago:', error);
        return throwError(() => new Error('Error al cargar los métodos de pago'));
      })
    );
  }

  /**
   * Obtiene un método de pago específico
   */
  getMetodoPago(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/metodo_pago/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener el método de pago:', error);
        return throwError(() => new Error('Error al cargar el método de pago'));
      })
    );
  }

  /**
   * Añade un nuevo método de pago
   */
  addMetodoPago(metodoPago: any): Observable<any> {
    const currentUser = this.loginService.getLoggedUser();
    if (!currentUser) {
      return throwError(() => new Error('No hay usuario conectado'));
    }

    // Asegurarse que el método de pago esté asociado al usuario actual
    const paymentData = {
      ...metodoPago,
      user_id: currentUser.id
    };

    return this.http.post(`${this.apiPath}/api/metodo_pago`, paymentData).pipe(
      catchError(error => {
        console.error('Error al añadir método de pago:', error);
        return throwError(() => new Error('Error al añadir el método de pago'));
      })
    );
  }

  /**
   * Actualiza un método de pago
   */
  updateMetodoPago(id: number, metodoPago: any): Observable<any> {
    return this.http.put(`${this.apiPath}/api/metodo_pago/${id}`, metodoPago).pipe(
      catchError(error => {
        console.error('Error al actualizar método de pago:', error);
        return throwError(() => new Error('Error al actualizar el método de pago'));
      })
    );
  }

  /**
   * Elimina un método de pago (lógicamente)
   */
  deleteMetodoPago(id: number): Observable<any> {
    return this.http.put(`${this.apiPath}/api/delete/metodo_pago/${id}`, {}).pipe(
      catchError(error => {
        console.error('Error al eliminar método de pago:', error);
        return throwError(() => new Error('Error al eliminar el método de pago'));
      })
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
    if (/^5[1-5]/.test(cardNumber) || /^2[2-7][2-9][0-9]/.test(cardNumber)) return 'mastercard';
    
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
  getPasswordStrength(password: string): { class: string, text: string } {
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
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiPath}/api/usuario/${userId}`, {
      password: newPassword,
      // Incluir otros campos obligatorios del usuario que no deseamos cambiar
      email: this.loginService.getLoggedUser().email,
      rol: this.loginService.getLoggedUser().rol,
      user_profile_id: this.loginService.getLoggedUser().perfil_usuario_id
    }).pipe(
      catchError(error => {
        console.error('Error al cambiar la contraseña:', error);
        return throwError(() => new Error('Error al cambiar la contraseña'));
      })
    );
  }
}