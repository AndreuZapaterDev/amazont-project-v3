import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Category } from '../interfaces/category.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [
    { id: 1, name: 'Electrónica', category: 'electronic' },
    { id: 2, name: 'Ropa', category: 'clothes' },
    { id: 3, name: 'Libros', category: 'books' },
    { id: 4, name: 'Hogar', category: 'home' },
    { id: 5, name: 'Juguetes', category: 'toys' },
    { id: 6, name: 'Deportes', category: 'sports' },
    { id: 7, name: 'Cocina', category: 'kitchen' },
    { id: 8, name: 'Droguería', category: 'drugs' },
    { id: 9, name: 'Juegos', category: 'games' },
  ];

  visibleCategories: Category[] = [];
  currentIndex = 0;
  itemsToShow = 5;
  currentCategory = '';

  constructor() {}

  ngOnInit() {
    this.updateVisibleCategories();
  }

  updateVisibleCategories() {
    this.visibleCategories = [];
    for (let i = 0; i < this.itemsToShow; i++) {
      const index = (this.currentIndex + i) % this.categories.length;
      this.visibleCategories.push(this.categories[index]);
    }
  }

  nextCategory() {
    this.currentIndex = (this.currentIndex + 1) % this.categories.length;
    this.updateVisibleCategories();
  }

  previousCategory() {
    this.currentIndex =
      (this.currentIndex - 1 + this.categories.length) % this.categories.length;
    this.updateVisibleCategories();
  }

  // Obtiene el icono correspondiente a cada categoría
  getCategoryIcon(categoryCode: string): string {
    // Mapeo de códigos de categoría a clases de iconos
    const icons: { [key: string]: string } = {
      electronic: 'fi fi-br-computer',  
      clothes: 'fi fi-br-tshirt',     
      books: 'fi fi-br-book',  
      home: 'fi fi-br-home',           
      toys: 'fi fi-br-baby',             
      sports: 'fi fi-br-basketball',     
      kitchen: 'fi fi-br-utensils',      
      drugs: 'fi fi-br-medicine',        
      games: 'fi fi-br-gamepad',         
    };

    return icons[categoryCode]; // Devuelve la clase del icono para la categoría solicitada
  }

  // Verifica si una categoría está actualmente seleccionada/activa
  isCategoryActive(categoryCode: string): boolean {
    return this.currentCategory === categoryCode;
  }
}
