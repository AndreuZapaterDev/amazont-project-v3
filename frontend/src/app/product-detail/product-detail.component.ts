import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product, Review } from '../interfaces/product.interface';
import { ProductsComponent } from '../products/products.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  productId: number = 0;
  product: Product = {
    id: 0,
    name: '',
    price: 0,
    stars: 0,
    url: '',
    category: '',
  };
  
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Inicializa el componente y se suscribe a cambios en la URL
  // para cargar el producto correspondiente cuando cambia el parámetro id de la URL
  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
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
    const product = this.productService.getProduct(this.productId);
    if (product) {
      this.product = product;
      
      // Configura las reseñas y muestra solo las iniciales
      this.reviews = this.product.reviews || [];
      this.visibleReviews = this.reviews.slice(0, this.maxInitialReviews);

      // Configura las imágenes del producto
      this.mainImage = this.product.url;
      this.productImages = [
        this.product.url,
        '/images/test1.jpg',
        '/images/test2.jpg'
      ];

      // Inicializa variables y carga datos adicionales
      this.activeImageIndex = 0;
      this.generateStars();
      this.calculateDiscountedPrice();
      this.loadRelatedProducts();
      
      // Reinicia el estado de la interfaz
      this.quantity = 1;
      this.activeTab = 'description';
      this.showingAllReviews = false;
      window.scrollTo(0, 0);
    }
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
    const allProducts = this.productService.getProducts();
    this.relatedProducts = allProducts.filter(p => 
      p.category === this.product.category && p.id !== this.product.id
    ).slice(0, 4); // maximo 4 productos
  }

  // Navega a otro producto cuando se hace clic en las recomendaciones
  navigateToProduct(product: Product) {
    this.router.navigate(['/home/product', product.id]);
  }

  // Genera la valoración con estrellas
  generateStars() {
    this.numberStars = '⭐'.repeat(this.product.stars);
  }

  // Calcula el precio final después de aplicar el descuento
  calculateDiscountedPrice() {
    if (this.product.discount) {
      this.discountedPrice = this.product.price - (this.product.price * this.product.discount / 100);
    } else {
      this.discountedPrice = this.product.price;
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
      distribution: [0, 0, 0, 0, 0] // Conteo para cada nivel de estrellas
    };
    
    if (stats.total > 0) {
      let sum = 0;
      this.reviews.forEach(review => {
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

}