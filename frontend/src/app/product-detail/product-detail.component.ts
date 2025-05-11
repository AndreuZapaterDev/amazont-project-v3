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
import { CurrencyPipe } from '@angular/common';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductsComponent, CurrencyPipe],
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
    private router: Router,
    private loginService: LoginService
  ) {}

  // Inicializa el componente y se suscribe a cambios en la URL
  // para cargar el producto correspondiente cuando cambia el parámetro id de la URL
  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params: any) => {
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
        console.log('Producto cargado:', this.product);

        // Cargar imágenes del producto
        this.productService.getProductImages(this.productId).subscribe({
          next: (images: any[]) => {
            console.log('Imágenes del producto:', images);
            // Extrae las URLs de los objetos
            this.productImages = (images || []).map((img) => img.url);
            this.mainImage =
              this.productImages.length > 0
                ? this.productImages[0]
                : 'assets/placeholder.png';
          },
          error: () => {
            this.productImages = [];
            this.mainImage = 'assets/placeholder.png';
          },
        });

        // Cargar reseñas del producto
        this.productService.getProductReviews(this.productId).subscribe({
          next: (reviews: any) => {
            console.log('Reseñas del producto:', reviews);
            this.reviews = reviews || [];
            this.visibleReviews = this.reviews.slice(0, this.maxInitialReviews);
            // Call generateStars after reviews are loaded
            this.generateStars();
          },
          error: () => {
            this.reviews = [];
            this.visibleReviews = [];
            this.generateStars();
          },
        });

        this.activeImageIndex = 0;
        // Remove this call as it will be called after reviews are loaded
        // this.generateStars();
        this.calculateDiscountedPrice();
        this.loadRelatedProducts();
        this.loadCharacteristics();
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

  loadCharacteristics() {
    this.productService.getProductCharacteristics(this.productId).subscribe({
      next: (data: any) => {
        this.product.characteristics = data || [];
        console.log(
          'Características del producto:',
          this.product.characteristics
        );
      },
      error: () => {
        this.product.characteristics = [];
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
    //TODO: Arreglar esta funcion para que seleccione productos de la misma categoria
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
          const relatedProductsData = filtered.slice(0, 4).map((p: any) => ({
            id: p.id,
            name: p.nombre,
            url: p.imagen_url || 'assets/placeholder.png', // Default image URL
            price: p.precio,
            stars: p.calificacion || 0,
            category: p.categoria || '',
            description: p.descripcion || '',
            stock: p.stock || 0,
            discount: p.descuento || 0,
            images: [], // Initialize with empty images array
          }));

          // Set related products initially with default values
          this.relatedProducts = relatedProductsData;

          // Fetch images for each related product
          relatedProductsData.forEach((product: any, index: any) => {
            this.productService.getProductImages(product.id).subscribe({
              next: (images: any[]) => {
                if (images && images.length > 0) {
                  // Update the product with images data
                  this.relatedProducts[index].images = images;
                  // Update the main display URL to the first image
                  this.relatedProducts[index].url = images[0].url;
                }
              },
              error: (err: any) => {
                console.error(
                  `Error loading images for related product ${product.id}:`,
                  err
                );
                // Keep default image URL on error
              },
            });
          });
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

  // Genera la valoración con estrellas basada en el promedio de las puntuaciones de las reseñas
  generateStars() {
    console.log('Running generateStars with reviews:', this.reviews);

    if (this.reviews && this.reviews.length > 0) {
      // Calcular el promedio de puntuación de todas las reseñas
      const totalScore = this.reviews.reduce((sum, review) => {
        console.log('Adding review score:', review.puntuacion);
        return sum + (review.puntuacion || 0);
      }, 0);

      console.log(
        'Total score:',
        totalScore,
        'Number of reviews:',
        this.reviews.length
      );
      const averageRating = Math.floor(totalScore / this.reviews.length);
      console.log('Average rating (floored):', averageRating);

      // Ensure we have at least 1 star if there are reviews with positive ratings
      const starsToShow =
        averageRating > 0 ? averageRating : totalScore > 0 ? 1 : 0;
      this.numberStars = '⭐'.repeat(starsToShow);
      console.log('Generated stars:', this.numberStars);
    } else {
      // Si no hay reseñas, usar la calificación del producto si existe
      const stars = this.product.calificacion || this.product.stars || 0;
      console.log('Using product rating:', stars);
      this.numberStars = '⭐'.repeat(Math.floor(stars));
      console.log('Generated stars from product rating:', this.numberStars);
    }
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
        sum += review.puntuacion;
        stats.distribution[review.puntuacion - 1]++;
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
    const user = this.loginService.getLoggedUser();
    this.productService.getActiveCart(user.id).subscribe({
      next: (cart: any) => {
        this.productService
          .addToCarrito(cart.carrito.id, this.productId, this.quantity)
          .subscribe({
            next: (response: any) => {
              console.log('Producto agregado al carrito:', response);
            },
            error: (err: any) => {
              console.error('Error al agregar el producto al carrito:', err);
            },
          });
      },
      error: (err: any) => {
        this.productService.postCarrito(user.id).subscribe({
          next: (cart: any) => {
            this.productService
              .addToCarrito(cart.carrito_id, this.productId, this.quantity)
              .subscribe({
                next: (response: any) => {
                  console.log('Producto agregado al carrito:', response);
                },
                error: (err: any) => {
                  console.error(
                    'Error al agregar el producto al carrito:',
                    err
                  );
                },
              });
          },
          error: (err: any) => {
            console.error('Error al crear el carrito:', err);
          },
        });
      },
    });
    // Aquí puedes implementar la lógica para agregar el producto al carrito
    // this.productService.addToCart(this.product, this.quantity);
    // console.log(this.productService.getCartItems());
  }
}
