import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CategoriesService } from '../services/categories.service';
import { Product, Review } from '../interfaces/product.interface';
import { ProductsComponent } from '../products/products.component';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: number = 0;
  product: any = {};

  mainImage: string = '';
  productImages: string[] = [];
  activeImageIndex: number = 0;

  quantity: number = 1;
  numberStars: string = '';
  discountedPrice: number = 0;
  activeTab: string = 'description';
  reviews: Review[] = [];
  relatedProducts: Product[] = [];
  private routeSub!: Subscription;

  visibleReviews: Review[] = [];
  maxInitialReviews: number = 2;
  showingAllReviews: boolean = false;

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Inicializa el componente y se suscribe a cambios en la URL
  // para cargar el producto correspondiente cuando cambia el parámetro id de la URL
  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.productId = Number(idParam);
        this.loadProductDetails();
      }
    });
  }

  // Limpia las suscripciones al destruir el componente para limpiar memoria
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  // Carga todos los detalles del producto y configura el estado inicial de la vista
  loadProductDetails() {
    this.productService.getAPIproduct(this.productId).subscribe({
      next: (data: any) => {
        this.product = data;

        // No need to call getProductImages separately as images now come with the API response
        if (this.product.images && this.product.images.length > 0) {
          // Asigna la primera imagen como principal
          this.mainImage = this.product.images[0].url;
          this.productImages = this.product.images.map((img: any) => img.url);
        } else {
          // Si no hay imágenes, usar imágenes por defecto
          this.mainImage = '/images/default.jpg';
          this.productImages = [
            '/images/default.jpg',
            '/images/test1.jpg',
            '/images/test2.jpg',
          ];
        }

        console.log('Imágenes del producto:', this.productImages);
        console.log('Producto cargado:', this.product);

        // Get reviews from API if available, or use empty array
        this.productService.getProductReviews(this.productId).subscribe({
          next: (reviews: any) => {
            this.reviews = reviews || [];
            this.visibleReviews = this.reviews.slice(0, this.maxInitialReviews);
          },
          error: () => {
            this.reviews = [];
            this.visibleReviews = [];
          },
        });

        this.activeImageIndex = 0;
        this.generateStars();
        this.calculateDiscountedPrice();
        this.loadRelatedProducts();

        this.quantity = 1;
        this.activeTab = 'description';
        this.showingAllReviews = false;
        window.scrollTo(0, 0);
      },
      error: (err: any) => {
        console.error('Error al cargar el producto:', err);
      },
    });
  }

  // Cambia la imagen principal con efecto de transición
  changeMainImage(imageUrl: string, index: number) {
    const imgElement = document.querySelector('.main-image img');
    if (imgElement) {
      // Aplica animación de transición entre imágenes
      imgElement.classList.add('image-fade');
      setTimeout(() => {
        this.mainImage = imageUrl;
        this.activeImageIndex = index;
        setTimeout(() => {
          imgElement.classList.remove('image-fade');
        }, 50);
      }, 300);
    } else {
      this.mainImage = imageUrl;
      this.activeImageIndex = index;
    }
  }

  // Carga productos de la misma categoría para mostrar como recomendaciones (Maximo 4 productos muestra)
  loadRelatedProducts() {
    // Get product categories for this product
    this.categoriesService
      .getProductosCategoriasId(this.productId)
      .pipe(
        switchMap((productCategories: any) => {
          if (!productCategories || productCategories.length === 0) {
            return of([]);
          }

          // Get all products
          return this.productService
            .getAPIproducts()
            .pipe(catchError(() => of([])));
        })
      )
      .subscribe({
        next: (allProducts: any) => {
          if (!allProducts || allProducts.length === 0) {
            this.relatedProducts = [];
            return;
          }

          // Filter by category and exclude current product
          const filtered = allProducts.filter(
            (p: any) => p.id !== this.productId
          );

          // Take up to 4 products
          this.relatedProducts = filtered.slice(0, 4).map((p: any) => ({
            id: p.id,
            name: p.nombre,
            url:
              p.imagen_url ||
              (p.images && p.images.length > 0
                ? p.images[0].url
                : 'assets/placeholder.png'),
            price: p.precio,
            stars: p.calificacion || 0,
            category: p.categoria || '',
            description: p.descripcion || '',
            stock: p.stock || 0,
            discount: p.descuento || 0,
            images: p.images || [],
          }));
        },
        error: () => {
          this.relatedProducts = [];
        },
      });
  }

  // Navega a otro producto cuando se hace clic en las recomendaciones
  navigateToProduct(product: Product) {
    this.router.navigate(['/home/product', product.id]);
  }

  // Genera la valoración con estrellas
  generateStars() {
    const stars = this.product.calificacion || this.product.stars || 0;
    this.numberStars = '⭐'.repeat(stars);
  }

  // Calcula el precio final después de aplicar el descuento
  calculateDiscountedPrice() {
    const price = this.product.precio || this.product.price || 0;
    const discount = this.product.descuento || this.product.discount || 0;

    if (discount) {
      this.discountedPrice = price - (price * discount) / 100;
    } else {
      this.discountedPrice = price;
    }
  }

  // Aumenta la cantidad a comprar
  increaseQuantity() {
    if (this.quantity < 1000) {
      this.quantity++;
    }
  }

  // Disminuye la cantidad a comprar
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Cambia entre las pestañas de información del producto
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  // Convierte valoración numérica en estrellas
  getStarsForRating(rating: number): string {
    return '⭐'.repeat(rating);
  }

  // Calcula estadísticas generales de las reseñas
  get reviewStats() {
    const stats = {
      total: this.reviews.length,
      average: 0,
      distribution: [0, 0, 0, 0, 0], // Conteo para cada nivel de estrellas
    };

    if (stats.total > 0) {
      let sum = 0;
      this.reviews.forEach((review) => {
        sum += review.rating;
        stats.distribution[review.rating - 1]++;
      });
      stats.average = Math.round((sum / stats.total) * 10) / 10;
    }

    return stats;
  }

  // Carga las reseñas del producto
  loadReviews() {
    this.reviews = this.product.reviews || [];
    this.visibleReviews = this.reviews.slice(0, this.maxInitialReviews);
  }

  // Alterna entre mostrar todas las reseñas o solo las iniciales
  showMoreReviews() {
    if (!this.showingAllReviews) {
      this.visibleReviews = this.reviews;
      this.showingAllReviews = true;
    } else {
      this.visibleReviews = this.reviews.slice(0, this.maxInitialReviews);
      this.showingAllReviews = false;
    }
  }

  addToCart() {
    // Aquí puedes implementar la lógica para agregar el producto al carrito
    this.productService.addToCart(this.product, this.quantity);
    console.log(this.productService.getCartItems());
  }
}
