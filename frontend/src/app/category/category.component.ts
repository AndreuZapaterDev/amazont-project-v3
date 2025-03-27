import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interfaces/product.interface';
import { ProductsComponent } from '../products/products.component';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ProductsComponent, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Detergente',
      url: 'https://www.supercash.es/wp-content/uploads/2020/02/detergente-profesional_cabecera.png',
      price: 10.0,
      stars: 4,
      category: 'home',
      /*       discount: 50, */
    },
    {
      id: 2,
      name: 'Monopoly',
      url: 'https://www.monodejuegos.shop/wp-content/uploads/2020/11/monopoly.png',
      price: 20.0,
      stars: 5,
      category: 'toys',
      /*       discount: 25, */
    },
    {
      id: 3,
      name: 'Balón',
      url: 'https://i1.t4s.cz/products/in9365/adidas-euro24-com-679082-in9365.png',
      price: 15.0,
      stars: 3,
      category: 'sports',
      /*       discount: 10, */
    },
    {
      id: 4,
      name: 'Sartén',
      url: 'https://cdn.speedsize.com/7ea397ab-9451-4e4a-a8e0-a877fed40d95/https://www.arcos.com/media/catalog/product/7/1/716400_1.png',
      price: 25.0,
      stars: 4,
      category: 'kitchen',
      /*       discount: 20, */
    },
    {
      id: 5,
      name: 'Camisa',
      url: 'https://media.wuerth.com/stmedia/modyf/eshop/products/std.lang.all/resolutions/normal/png-546x410px/26501189.png',
      price: 30.0,
      stars: 5,
      category: 'clothes',
      /*       discount: 30, */
    },
    {
      id: 6,
      name: 'Smartphone',
      url: 'https://oukitel.com/cdn/shop/files/1___11.png?v=1732246275&width=600',
      price: 500.0,
      stars: 4,
      category: 'electronic',
      /*       discount: 40, */
    },
    {
      id: 7,
      name: 'Camiseta',
      url: 'https://timshop.timhortons.ca/cdn/shop/files/retro-logo-tshirt-back-1000px.png?v=1707853862&width=1000',
      price: 15.0,
      stars: 4,
      category: 'clothes',
      /*       discount: 0.1, */
    },
    {
      id: 8,
      name: 'Polo',
      url: 'https://www.vilebrequin.com/on/demandware.static/-/Sites-vilebrequin-catalog-master/default/dw32db9fa0/images/PYRE9O00-010/PYRE9O00-010-front-3920x3920.png',
      price: 30.0,
      stars: 5,
      category: 'clothes',
      /*       discount: 0.2, */
    },
  ];

  displayedProducts: Product[] = [];
  filteredProducts: Product[] = []; // Array auxiliar para búsqueda y ordenamiento
  categoryName: string | null = '';
  searchTerm: string = '';
  sortOption: string = 'default';

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.categoryName = params.get('name') || 'clothes';
      this.getCategoryProducts();
    });
  }

  // Aplica búsqueda y ordenamiento
  applyFilters() {
    let filtered = [...this.filteredProducts];

    // Filtrar por búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm)
      );
    }

    // Aplicar ordenamiento
    switch (this.sortOption) {
      case 'price+':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.displayedProducts = filtered;
  }

  // Filtrar productos por categoría
  getCategoryProducts() {
    this.filteredProducts = this.products.filter(
      (product) => product.category === this.categoryName
    );
    this.applyFilters(); // Aplica búsqueda y ordenamiento después de filtrar por categoría
  }

  // Manejar la búsqueda
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  // Manejar el ordenamiento
  onSort(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.applyFilters();
  }

    //método para limpiar la búsqueda
    clearSearch() {
      this.searchTerm = '';
      this.applyFilters();
    }
    
    // Método para resetear todos los filtros
    resetFilters() {
      this.searchTerm = '';
      this.sortOption = 'default';
      this.getCategoryProducts();
      
      // También resetea el select visualmente, es decir del html
      const selectElement = document.getElementById('filters') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = 'default';
      }
    }

    // Obtiene el icono correspondiente a cada categoría
    getCategoryIcon(categoryCode: string | null): string {
      // Mapeo de códigos de categoría a clases de iconos
      const icons: { [key: string]: string } = {
        'electronic': 'fi fi-br-computer',  
        'clothes': 'fi fi-br-tshirt',     
        'books': 'fi fi-br-book',  
        'home': 'fi fi-br-home',           
        'toys': 'fi fi-br-baby',             
        'sports': 'fi fi-br-basketball',     
        'kitchen': 'fi fi-br-utensils',      
        'drugs': 'fi fi-br-medicine',        
        'games': 'fi fi-br-gamepad'         
      };
      
      if (categoryCode && icons[categoryCode]) {
        return icons[categoryCode];
      }
      
      return 'fi fi-br-box'; // Icono predeterminado
    }
}
