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
  categories: Category[] = [];
  visibleCategories: Category[] = [];
  currentIndex = 0;
  itemsToShow = 5;
  currentCategory = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: (response: any) => {
        // console.log('Categorias cargadas correctamente:', response);
        // Mapeamos la respuesta a nuestro modelo Category
        this.categories = response.map((item: any) => ({
          id: item.id,
          name: item.nombre,
          category: item.icono?.replace('fi-br-', '') || '',
          icono: item.icono,
        }));
        this.updateVisibleCategories();
      },
      error: (error: any) => {
        console.error('Error cargando categorías:', error);
        // En caso de error, cargamos un array vacío
        this.categories = [];
        this.updateVisibleCategories();
      },
    });
  }

  // Actualiza las categorías visibles según el índice actual
  updateVisibleCategories() {
    this.visibleCategories = [];
    for (let i = 0; i < this.itemsToShow; i++) {
      if (this.categories.length === 0) return;
      const index = (this.currentIndex + i) % this.categories.length;
      this.visibleCategories.push(this.categories[index]);
    }
  }

  // Cambia la categoría actual y actualiza las categorías visibles
  nextCategory() {
    if (this.categories.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.categories.length;
    this.updateVisibleCategories();
  }

  // Cambia a la categoría anterior y actualiza las categorías visibles
  previousCategory() {
    if (this.categories.length === 0) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.categories.length) % this.categories.length;
    this.updateVisibleCategories();
  }

  // Obtiene el icono correspondiente a cada categoría
  getCategoryIcon(categoryCode: string): string {
    // Mira si la categoría tiene un icono definido en la respuesta de la API
    const category = this.categories.find(
      (cat) => cat.category === categoryCode
    );
    if (category && category.icono) {
      return category.icono;
    }

    // Si no, asigna un icono por defecto según el código de la categoría
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

    return icons[categoryCode] || 'fi fi-br-apps';
  }

  // Verifica si una categoría está actualmente seleccionada/activa
  isCategoryActive(categoryCode: string): boolean {
    return this.currentCategory === categoryCode;
  }
}
