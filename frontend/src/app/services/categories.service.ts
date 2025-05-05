import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  apiPath = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiPath}/api/categorias`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.apiPath}/api/categoria/${id}`);
  }

  getProductoCategorias(): Observable<any> {
    return this.http.get(`${this.apiPath}/api/producto_categorias`);
  }

  getProductosCategoriasId(product_id: number): Observable<any> {
    return this.http.get(
      `${this.apiPath}/api/producto_categoria/${product_id}`
    );
  }
}
