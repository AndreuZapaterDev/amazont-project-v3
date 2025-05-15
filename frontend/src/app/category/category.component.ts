import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interfaces/product.interface';
import { ProductsComponent } from '../products/products.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CategoriesService } from '../services/categories.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ProductsComponent, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categoryName: string = '';
  categoryId: number = 0;
  searchTerm: string = '';
  sortOption: string = 'default';
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    // Inicializa el componente y obtiene los datos de la categoría desde la URL
    this.route.paramMap.subscribe((params: any) => {
      const categoryParam = params.get('name');

      if (categoryParam) {
        const possibleId = parseInt(categoryParam, 10);

        // Si es un ID numérico, carga directamente por ID
        if (!isNaN(possibleId)) {
          this.categoryId = possibleId;
          this.loadCategoryNameAndProducts(possibleId);
        } else {
          // Si es un nombre o identificador, busca la categoría correspondiente
          this.loadCategoriesByIdentifier(categoryParam);
        }
      } else {
        // Si no hay parámetro, carga la primera categoría disponible
        this.categoriesService.getCategories().subscribe({
          next: (categories: any) => {
            if (categories && categories.length > 0) {
              this.categoryId = categories[0].id;
              this.loadCategoryNameAndProducts(this.categoryId);
            } else {
              this.handleError('No categories found');
            }
          },
          error: (err: any) => this.handleError(err),
        });
      }
    });
  }

  loadCategoriesByIdentifier(identifier: string) {
    // Mapeo de identificadores amigables a nombres de categorías
    const categoryMapping: { [key: string]: string } = {
      electronic: 'Electrónica',
      clothes: 'Moda',
      kitchen: 'Cocina y electrodomésticos',
      home: 'Hogar y decoración',
      drugs: 'Belleza y cuida personal',
    };

    const possibleName = categoryMapping[identifier] || identifier;

    // Busca la categoría por nombre o por icono
    this.categoriesService.getCategories().subscribe({
      next: (categories: any) => {
        const category = categories.find(
          (cat: any) =>
            cat.nombre.toLowerCase() === possibleName.toLowerCase() ||
            cat.icono?.includes(identifier)
        );

        if (category) {
          // Si encuentra la categoría, carga sus productos
          this.categoryId = category.id;
          this.loadCategoryNameAndProducts(category.id);
        } else {
          // Si no encuentra la categoría, usa la primera disponible
          if (categories && categories.length > 0) {
            this.categoryId = categories[0].id;
            this.loadCategoryNameAndProducts(this.categoryId);
          } else {
            this.handleError('Category not found');
          }
        }
      },
      error: (err: any) => this.handleError(err),
    });
  }

  loadCategoryNameAndProducts(categoryId: number) {
    // Método principal para cargar los productos de una categoría
    this.isLoading = true;
    this.error = null;

    this.categoriesService
      .getCategoryById(categoryId)
      .pipe(
        switchMap((category: any) => {
          // Guarda el nombre y ID de la categoría
          this.categoryName = category.nombre;
          this.categoryId = category.id;

          // Obtiene la relación entre productos y categorías
          return this.categoriesService.getProductoCategorias().pipe(
            catchError((err: any) => {
              this.handleError('Error loading product categories');
              return of([]);
            })
          );
        }),
        switchMap((productCategories: any) => {
          // Filtra solo los productos de esta categoría
          const productsInCategory = productCategories.filter(
            (pc: any) => pc.categoria_id === this.categoryId
          );

          if (productsInCategory.length === 0) {
            // Si no hay productos en esta categoría
            this.products = [];
            this.filteredProducts = [];
            this.displayedProducts = [];
            this.isLoading = false;
            return of([]);
          }

          // Crea un array de peticiones para obtener cada producto
          const productRequests = productsInCategory.map((pc: any) =>
            this.productService.getAPIproduct(pc.producto_id).pipe(
              catchError((err: any) => {
                console.error(`Error loading product ${pc.producto_id}:`, err);
                return of(null);
              })
            )
          );

          // Ejecuta todas las peticiones en paralelo
          return forkJoin(productRequests);
        })
      )
      .subscribe({
        next: (apiProducts: any) => {
          // Filtra productos nulos (que dieron error)
          const validProducts = apiProducts.filter((p: any) => p !== null);

          // Transforma los datos de la API al formato del componente
          this.products = validProducts.map((apiProduct: any) => ({
            id: apiProduct.id,
            name: apiProduct.nombre,
            url: apiProduct.imagen_url || 'assets/placeholder.png',
            price: apiProduct.precio,
            stars: apiProduct.calificacion || 0,
            category: this.categoryName,
            description: apiProduct.descripcion || '',
            stock: apiProduct.stock || 0,
            discount: apiProduct.descuento || 0,
            images: [],
          }));

          // Carga las imágenes adicionales de cada producto
          const loadImagesPromises = this.products.map((product) =>
            this.productService.getProductImages(product.id).subscribe({
              next: (images: any) => {
                product.images = images || [];
                console.log(
                  `Loaded ${images?.length || 0} images for product ${
                    product.id
                  }`
                );
              },
              error: (err: any) => {
                console.error(
                  `Error loading images for product ${product.id}:`,
                  err
                );
                product.images = [];
              },
            })
          );

          this.filteredProducts = [...this.products];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err: any) => {
          this.handleError('Error loading products');
          this.products = [];
          this.filteredProducts = [];
          this.displayedProducts = [];
          this.isLoading = false;
        },
      });
  }

  handleError(message: string) {
    // Maneja errores y muestra mensajes al usuario
    this.error = message;
    this.isLoading = false;
    console.error(message);
  }

  applyFilters() {
    // Aplica filtros de búsqueda y orden a los productos
    let filtered = [...this.filteredProducts];

    // Filtrado por término de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm)
      );
    }

    // Ordenación según la opción seleccionada
    switch (this.sortOption) {
      case 'price+':
        filtered.sort((a, b) => b.price - a.price); // Mayor a menor precio
        break;
      case 'price-':
        filtered.sort((a, b) => a.price - b.price); // Menor a mayor precio
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name)); // Alfabético
        break;
    }

    this.displayedProducts = filtered;
  }

  // Método para manejar el cambio en el campo de búsqueda
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  // Método para manejar el cambio de orden
  onSort(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.applyFilters();
  }

  // Método para limpiar el campo de búsqueda
  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Método para limpiar los filtros
  resetFilters() {
    this.searchTerm = '';
    this.sortOption = 'default';
    this.loadCategoryNameAndProducts(this.categoryId);

    const selectElement = document.getElementById(
      'filters'
    ) as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = 'default';
    }
  }

  // Método para obtener el icono de la categoría
  getCategoryIcon(categoryCode: string | null): string {
    if (!categoryCode) return 'fi fi-br-box';

    if (this.categoryId) {
      return `fi ${this.getCategoryIconFromId(this.categoryId)}`;
    }

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

    if (categoryCode && icons[categoryCode]) {
      return icons[categoryCode];
    }

    return 'fi fi-br-box';
  }

  // Método para obtener el icono de la categoría a partir de su ID
  getCategoryIconFromId(categoryId: number): string {
    const iconMap: { [key: number]: string } = {
      1: 'fi-br-computer',
      2: 'fi-br-home',
      3: 'fi-br-utensils',
      4: 'fi-br-medicine',
      5: 'fi-br-tshirt',
      6: 'fi-br-restaurant',
      7: 'fi-br-paw',
    };

    return iconMap[categoryId] || 'fi-br-box';
  }
}
