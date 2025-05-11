import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loggedUser: any;

  constructor(private http: HttpClient) {
    // Initialize loggedUser from localStorage if it exists
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
    }
  }
  apiPath = 'http://127.0.0.1:8000';

  postPerfilUsuario(perfilUsuario: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/perfil_usuario`, perfilUsuario);
  }

  postUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiPath}/api/usuario`, usuario);
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiPath}/api/usuarios`);
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/usuarios/${id}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiPath}/api/login`, { email, password });
  }

  setLoggedUser(user: any) {
    this.loggedUser = user;
    // Save user to localStorage
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  getLoggedUser() {
    // If loggedUser is null, try to get it from localStorage
    if (!this.loggedUser) {
      const storedUser = localStorage.getItem('loggedUser');
      if (storedUser) {
        this.loggedUser = JSON.parse(storedUser);
      }
    }
    return this.loggedUser;
  }

  logout() {
    this.loggedUser = null;
    // Remove user from localStorage
    localStorage.removeItem('loggedUser');
  }
}
