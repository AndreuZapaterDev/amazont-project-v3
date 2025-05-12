import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { LoginService } from '../services/login.service';
import { CategoriesService } from '../services/categories.service';

interface ProductStat {
  id: number;
  name: string;
  image: string;
  revenue: number;
  unitsSold: number;
  conversionRate: number;
  rating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css',
})
export class SellerComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Estado UI
  showAddProductForm = false;
  isSubmitting = false;
  activeTab = 'products';
  editingProduct: any = null;
  imagePreviewUrls: string[] = [];
  imageFiles: File[] = [];
  imageError = '';

  // Filtros y búsqueda
  searchTerm = '';
  stockFilter = 'all';
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 12;

  // Datos simulados
  productForm!: FormGroup;
  products: any[] = [];
  categories: any[] = [];

  // Estadísticas de ejemplo
  totalSales = 2580.45;
  totalItemsSold = 42;
  completedOrders = 35;
  productStats: ProductStat[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private loginService: LoginService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.setupMockData();
  }

  // Cargar categorías desde la API
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.calculateTotalPages();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      },
    });
  }

  // Inicializa el formulario de producto
  initializeForm(): void {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      stock: [1, [Validators.required, Validators.min(0)]],
      categoria_id: ['', [Validators.required]],
      inicio: [1],
    });
  }

  // Configurar datos de ejemplo para la demo
  setupMockData(): void {
    // Productos de ejemplo
    this.products = [
      {
        id: 1,
        nombre: 'Smartphone XYZ',
        descripcion: 'Un smartphone de última generación',
        precio: 599.99,
        descuento: 10,
        stock: 25,
        categoria_id: 1,
        imagen_url:
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 2,
        nombre: 'Camiseta Algodón',
        descripcion: 'Camiseta 100% algodón',
        precio: 19.99,
        descuento: 0,
        stock: 100,
        categoria_id: 2,
        imagen_url:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop',
      },
      {
        id: 3,
        nombre: 'Lámpara de Mesa',
        descripcion: 'Lámpara LED para mesa de noche',
        precio: 45.5,
        descuento: 15,
        stock: 8,
        categoria_id: 3,
        imagen_url:
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=500&auto=format&fit=crop',
      },
    ];

    // Estadísticas de ejemplo (ya tienen imágenes reales)
    this.productStats = [
      {
        id: 1,
        name: 'Smartphone XYZ',
        image:
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop',
        revenue: 2599.99,
        unitsSold: 5,
        conversionRate: 15,
        rating: 4,
        reviewCount: 12,
      },
      {
        id: 2,
        name: 'Camiseta Algodón',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop',
        revenue: 359.82,
        unitsSold: 18,
        conversionRate: 22,
        rating: 5,
        reviewCount: 7,
      },
      {
        id: 3,
        name: 'Lámpara de Mesa',
        image:
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200&auto=format&fit=crop',
        revenue: 386.75,
        unitsSold: 10,
        conversionRate: 18,
        rating: 4,
        reviewCount: 6,
      },
    ];

    this.calculateTotalPages();
  }

  // Manejo de imágenes
  onImageSelected(event: any): void {
    const files = event.target.files;

    if (files) {
      // Simular vista previa de imágenes
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.imageFiles.push(file);

        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  // Guardar producto
  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    // Iniciar proceso de guardado
    this.isSubmitting = true;

    // Obtener usuario logueado
    const loggedUser = this.loginService.getLoggedUser();
    if (!loggedUser) {
      console.error('No hay usuario logueado');
      this.isSubmitting = false;
      return;
    }

    // Preparar datos del producto
    // Convert all values to strings as required by the API
    const productData = {
      nombre: this.productForm.value.nombre,
      precio: this.productForm.value.precio.toString(),
      descuento: this.productForm.value.descuento.toString(),
      descripcion: this.productForm.value.descripcion,
      stock: this.productForm.value.stock.toString(),
      inicio: this.productForm.value.inicio.toString(),
    };

    console.log('Datos del producto:', productData);

    // Crear el producto
    this.productService.postProduct(productData).subscribe({
      next: (response) => {
        const productoId = response.producto_id;
        console.log('Producto creado con ID:', productoId);

        // Subir imágenes si existen
        if (this.imageFiles.length > 0) {
          this.uploadProductImages(productoId);
        }

        // Guardar la categoría del producto
        this.saveProductCategory(
          productoId,
          this.productForm.value.categoria_id
        );

        // Asociar el producto con el usuario
        this.saveProductUser(productoId, loggedUser.id);

        // Resetear formulario y actualizar UI
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.isSubmitting = false;
      },
    });
  }

  // Subir imágenes del producto
  private uploadProductImages(productoId: number): void {
    // Subir cada imagen asociada al producto
    this.imageFiles.forEach((file, index) => {
      // En un caso real, aquí subiríamos el archivo al servidor
      // Para simular, usamos la URL de la vista previa
      const imageData = {
        url: this.imagePreviewUrls[index],
        producto_id: productoId.toString(),
      };

      this.productService.postProductImage(imageData).subscribe({
        error: (error) => console.error('Error al subir imagen:', error),
      });
    });
  }

  // Guardar categoría del producto
  private saveProductCategory(productoId: number, categoriaId: any): void {
    const data = {
      producto_id: productoId.toString(),
      categoria_id: categoriaId.toString(),
    };

    this.productService.postProductCategories(data).subscribe({
      error: (error) =>
        console.error('Error al guardar categoría del producto:', error),
    });
  }

  // Asociar producto con usuario
  private saveProductUser(productoId: number, usuarioId: number): void {
    const data = {
      producto_id: productoId.toString(),
      usuario_id: usuarioId.toString(),
    };

    this.productService.postProductUser(data).subscribe({
      error: (error) =>
        console.error('Error al asociar producto con usuario:', error),
    });
  }

  // Editar producto (simulado)
  editProduct(product: any): void {
    this.editingProduct = product;
    this.showAddProductForm = true;

    // Rellenar formulario con datos del producto
    this.productForm.patchValue({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      descuento: product.descuento || 0,
      stock: product.stock,
      categoria_id: product.categoria_id,
    });

    // Simular carga de imágenes
    this.imagePreviewUrls = product.imagen_url ? [product.imagen_url] : [];
  }

  // Eliminar producto (simulado)
  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      // Simular eliminación
      this.products = this.products.filter((p) => p.id !== productId);
      this.calculateTotalPages();
    }
  }

  // Cancelar edición o creación
  cancelEdit(): void {
    this.resetForm();
  }

  // Resetear formulario
  resetForm(): void {
    this.productForm.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      descuento: 0,
      stock: 1,
      categoria_id: '',
    });
    this.editingProduct = null;
    this.showAddProductForm = false;
    this.imagePreviewUrls = [];
    this.imageFiles = [];
    this.imageError = '';
  }

  // Paginación
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(
      this.filteredProducts.length / this.itemsPerPage
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  // Helper para mostrar imagen
  getProductMainImage(product: any): string {
    return product.imagen_url || 'assets/placeholder.png';
  }

  // Getters para filtrado
  get filteredProducts() {
    return this.products.filter((product) => {
      // Filtro de búsqueda
      const matchesSearch = this.searchTerm
        ? product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      // Filtro de stock
      let matchesStock = true;
      switch (this.stockFilter) {
        case 'inStock':
          matchesStock = product.stock > 10;
          break;
        case 'lowStock':
          matchesStock = product.stock > 0 && product.stock <= 10;
          break;
        case 'outOfStock':
          matchesStock = product.stock === 0;
          break;
      }

      return matchesSearch && matchesStock;
    });
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
}
