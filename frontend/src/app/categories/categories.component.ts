import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Category } from '../interfaces/category.interface';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  // This will be a backup in case the API fails
  fallbackCategories: Category[] = [
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

  categories: Category[] = [];
  visibleCategories: Category[] = [];
  currentIndex = 0;
  itemsToShow = 5;
  currentCategory = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: (response: any) => {
        console.log('Categories fetched successfully:', response);
        // Map the API response to our Category interface format
        this.categories = response.map((item: any) => ({
          id: item.id,
          name: item.nombre,
          category: item.icono?.replace('fi-br-', '') || '',
          icono: item.icono,
        }));
        this.updateVisibleCategories();
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
        // Use fallback categories if API fails
        this.categories = this.fallbackCategories;
        this.updateVisibleCategories();
      },
    });
  }

  updateVisibleCategories() {
    this.visibleCategories = [];
    for (let i = 0; i < this.itemsToShow; i++) {
      if (this.categories.length === 0) return;
      const index = (this.currentIndex + i) % this.categories.length;
      this.visibleCategories.push(this.categories[index]);
    }
  }

  nextCategory() {
    if (this.categories.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.categories.length;
    this.updateVisibleCategories();
  }

  previousCategory() {
    if (this.categories.length === 0) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.categories.length) % this.categories.length;
    this.updateVisibleCategories();
  }

  // Obtiene el icono correspondiente a cada categoría
  getCategoryIcon(categoryCode: string): string {
    // First check if the category has its own icon from the API
    const category = this.categories.find(
      (cat) => cat.category === categoryCode
    );
    if (category && category.icono) {
      return category.icono;
    }

    // Fallback to our hardcoded mapping
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

    return icons[categoryCode] || 'fi fi-br-apps'; // Default icon if not found
  }

  // Verifica si una categoría está actualmente seleccionada/activa
  isCategoryActive(categoryCode: string): boolean {
    return this.currentCategory === categoryCode;
  }
}
