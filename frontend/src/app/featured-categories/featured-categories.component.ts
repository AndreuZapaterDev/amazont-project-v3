import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../interfaces/category.interface';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [ RouterLink],
  templateUrl: './featured-categories.component.html',
  styleUrl: './featured-categories.component.css'
})
export class FeaturedCategoriesComponent implements OnInit {

  featuredCategories: Category[] = [
    { id: 1, name: 'Electrónica', category: 'electronic' },
    { id: 2, name: 'Ropa', category: 'clothes' },
    { id: 3, name: 'Libros', category: 'books' },
    { id: 4, name: 'Hogar', category: 'home' },
    { id: 5, name: 'Juguetes', category: 'toys' },
    { id: 6, name: 'Deportes', category: 'sports' },
    { id: 7, name: 'Cocina', category: 'kitchen' },
    { id: 8, name: 'Droguería', category: 'drugs' },
  ];
  
  constructor() {}
  
  ngOnInit(): void {}

  // Añade este método en tu featured-categories.component.ts
  getCategoryIcon(categoryCode: string): string {
    // Mapeo de códigos de categoría a clases de iconos
    const icons: { [key: string]: string } = {
      'electronic': 'fi-br-computer',  
      'clothes': 'fi-br-tshirt',     
      'books': 'fi-br-book',  
      'home': 'fi-br-home',           
      'toys': 'fi-br-baby',             
      'sports': 'fi-br-basketball',     
      'kitchen': 'fi-br-utensils',      
      'drugs': 'fi-br-medicine',        
      'games': 'fi-br-gamepad'         
    };
    
    return icons[categoryCode] || 'fi-br-shopping-bag';
  }
}