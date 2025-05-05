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
    this.route.paramMap.subscribe((params: any) => {
      const categoryParam = params.get('name');

      if (categoryParam) {
        const possibleId = parseInt(categoryParam, 10);

        if (!isNaN(possibleId)) {
          this.categoryId = possibleId;
          this.loadCategoryNameAndProducts(possibleId);
        } else {
          this.loadCategoriesByIdentifier(categoryParam);
        }
      } else {
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
    const categoryMapping: { [key: string]: string } = {
      electronic: 'Electrónica',
      clothes: 'Moda',
      kitchen: 'Cocina y electrodomésticos',
      home: 'Hogar y decoración',
      drugs: 'Belleza y cuida personal',
    };

    const possibleName = categoryMapping[identifier] || identifier;

    this.categoriesService.getCategories().subscribe({
      next: (categories: any) => {
        const category = categories.find(
          (cat: any) =>
            cat.nombre.toLowerCase() === possibleName.toLowerCase() ||
            cat.icono?.includes(identifier)
        );

        if (category) {
          this.categoryId = category.id;
          this.loadCategoryNameAndProducts(category.id);
        } else {
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
    this.isLoading = true;
    this.error = null;

    this.categoriesService
      .getCategoryById(categoryId)
      .pipe(
        switchMap((category: any) => {
          this.categoryName = category.nombre;
          this.categoryId = category.id;

          return this.categoriesService.getProductoCategorias().pipe(
            catchError((err: any) => {
              this.handleError('Error loading product categories');
              return of([]);
            })
          );
        }),
        switchMap((productCategories: any) => {
          const productsInCategory = productCategories.filter(
            (pc: any) => pc.categoria_id === this.categoryId
          );

          if (productsInCategory.length === 0) {
            this.products = [];
            this.filteredProducts = [];
            this.displayedProducts = [];
            this.isLoading = false;
            return of([]);
          }

          const productRequests = productsInCategory.map((pc: any) =>
            this.productService.getAPIproduct(pc.producto_id).pipe(
              catchError((err: any) => {
                console.error(`Error loading product ${pc.producto_id}:`, err);
                return of(null);
              })
            )
          );

          return forkJoin(productRequests);
        })
      )
      .subscribe({
        next: (apiProducts: any) => {
          const validProducts = apiProducts.filter((p: any) => p !== null);

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
              error: (err) => {
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
    this.error = message;
    this.isLoading = false;
    console.error(message);
  }

  applyFilters() {
    let filtered = [...this.filteredProducts];

    if (this.searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm)
      );
    }

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

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }

  onSort(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

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
