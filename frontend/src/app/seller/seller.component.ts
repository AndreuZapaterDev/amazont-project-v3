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
  originalImages: any[] = []; // Store original images when editing

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

  failedImages: number[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private loginService: LoginService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.loadUserProducts();
    // Replace mock data with real data
    this.loadMonthlyStats();
  }

  // Cargar categorías desde la API
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
        this.calculateTotalPages();
      },
      error: (error: any) => {
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

  handleImageError(event: any, index: number): void {
    console.error(`Error loading image at index ${index}:`, this.imagePreviewUrls[index]);
    if (!this.failedImages.includes(index)) {
      this.failedImages.push(index);
    }
    
    // Opcionalmente, puedes reemplazar con una imagen placeholder
    event.target.src = 'assets/placeholder.png';
  }

  // Cargar productos del usuario desde la API
  loadUserProducts(): void {
    const loggedUser = this.loginService.getLoggedUser();
    if (!loggedUser) {
      console.error('No hay usuario logueado');
      return;
    }

    this.productService.getProductsFromUser(loggedUser.id).subscribe({
      next: (userProducts: any) => {
        if (userProducts && userProducts.length > 0) {
          this.processUserProducts(userProducts);
        } else {
          this.products = [];
          this.calculateTotalPages();
        }
      },
      error: (error: any) => {
        console.error('Error al cargar productos del usuario:', error);
        this.products = [];
        this.calculateTotalPages();
      },
    });
  }

  // Procesar productos del usuario y obtener detalles
  private processUserProducts(userProducts: any[]): void {
    this.products = [];
    let completedRequests = 0;

    userProducts.forEach((userProduct) => {
      this.productService.getAPIproduct(userProduct.producto_id).subscribe({
        next: (productData: any) => {
          const product = {
            id: productData.id,
            nombre: productData.nombre,
            descripcion: productData.descripcion,
            precio: parseFloat(productData.precio),
            descuento: parseFloat(productData.descuento),
            stock: parseInt(productData.stock),
            categoria_id: null, // Will be set when loading categories
            imagen_url: null, // Will be set when loading images
          };

          // Load product image
          this.productService.getProductImages(product.id).subscribe({
            next: (images: any) => {
              if (images && images.length > 0) {
                product.imagen_url = images[0].url;
              }

              // Load product category
              this.categoriesService
                .getProductosCategoriasId(product.id)
                .subscribe({
                  next: (categories: any) => {
                    if (categories && categories.length > 0) {
                      product.categoria_id = categories[0].categoria_id;
                    }

                    this.products.push(product);
                    completedRequests++;

                    // If all requests are completed, calculate pages
                    if (completedRequests === userProducts.length) {
                      this.calculateTotalPages();
                    }
                  },
                  error: (error) => {
                    console.error(
                      `Error loading category for product ${product.id}:`,
                      error
                    );
                    this.products.push(product);
                    completedRequests++;

                    if (completedRequests === userProducts.length) {
                      this.calculateTotalPages();
                    }
                  },
                });
            },
            error: (error) => {
              console.error(
                `Error loading images for product ${product.id}:`,
                error
              );
              this.products.push(product);
              completedRequests++;

              // Continue with category loading
              this.categoriesService
                .getProductosCategoriasId(product.id)
                .subscribe({
                  next: (categories: any) => {
                    if (categories && categories.length > 0) {
                      product.categoria_id = categories[0].categoria_id;
                    }

                    if (completedRequests === userProducts.length) {
                      this.calculateTotalPages();
                    }
                  },
                  error: (error) => {
                    console.error(
                      `Error loading category for product ${product.id}:`,
                      error
                    );
                    if (completedRequests === userProducts.length) {
                      this.calculateTotalPages();
                    }
                  },
                });
            },
          });
        },
        error: (error: any) => {
          console.error(
            `Error loading product ${userProduct.producto_id}:`,
            error
          );
          completedRequests++;
          if (completedRequests === userProducts.length) {
            this.calculateTotalPages();
          }
        },
      });
    });
  }

  // Load real monthly statistics from the API
  loadMonthlyStats(): void {
    const loggedUser = this.loginService.getLoggedUser();
    if (!loggedUser) {
      console.error('No hay usuario logueado');
      return;
    }

    this.productService.getMonthlyStats(loggedUser.id).subscribe({
      next: (stats: any) => {
        // Update summary statistics
        this.totalSales = stats.monthly_sales || 0;
        this.totalItemsSold = parseInt(stats.total_products_sold) || 0;
        this.completedOrders = stats.finished_carts || 0;

        // Transform product stats to match our interface
        this.productStats = stats.products.map((product: any) => ({
          id: product.product_id,
          name: product.name,
          image: product.image || 'assets/placeholder.png',
          revenue: product.total_sales || 0,
          unitsSold: product.units_sold || 0,
          conversionRate: 0, // Hardcoded as requested
          rating: product.reviews
            ? Math.round(product.reviews.average_rating)
            : 0,
          reviewCount: product.reviews ? product.reviews.count : 0,
        }));
      },
      error: (error: any) => {
        console.error('Error al cargar estadísticas mensuales:', error);
        // Fallback to empty data if API call fails
        this.setupEmptyStats();
      },
    });
  }

  // Fallback method for when API fails
  setupEmptyStats(): void {
    this.totalSales = 0;
    this.totalItemsSold = 0;
    this.completedOrders = 0;
    this.productStats = [];
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

  // Eliminar imagen
  removeImage(index: number): void {
    // Si estamos editando y es una imagen que ya existe en BD
    if (this.editingProduct && index < this.originalImages.length) {
      // Solo marcamos la imagen para eliminación en frontend (se eliminará al guardar)
      this.imagePreviewUrls.splice(index, 1);
      // No eliminamos de originalImages aquí, lo haremos en handleProductImages cuando se guarde
    } else {
      // Si es una imagen nueva (aún no guardada en BD)
      this.imagePreviewUrls.splice(index, 1);
      // Ajustar el índice si estamos en modo edición
      const fileIndex = this.editingProduct
        ? index - this.originalImages.length
        : index;
      if (fileIndex >= 0 && fileIndex < this.imageFiles.length) {
        this.imageFiles.splice(fileIndex, 1);
      }
    }
  }

  // Guardar producto (crear nuevo o actualizar existente)
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
      inicio: this.productForm.value.inicio
        ? this.productForm.value.inicio.toString()
        : '1',
    };

    if (this.editingProduct) {
      // ACTUALIZACIÓN DE PRODUCTO
      this.updateExistingProduct(this.editingProduct.id, productData);
    } else {
      // CREACIÓN DE NUEVO PRODUCTO
      this.createNewProduct(productData, loggedUser.id);
    }
  }

  // Crear un nuevo producto
  private createNewProduct(productData: any, userId: number): void {
    this.productService.postProduct(productData).subscribe({
      next: (response: any) => {
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
        this.saveProductUser(productoId, userId);

        // Resetear formulario y actualizar UI
        this.resetForm();
        this.loadUserProducts(); // Recargar la lista de productos
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('Error al crear producto:', error);
        this.isSubmitting = false;
        alert(
          'Hubo un error al crear el producto. Por favor, inténtalo de nuevo.'
        );
      },
    });
  }

  // Actualizar un producto existente
  private updateExistingProduct(productId: number, productData: any): void {
    this.productService.updateProduct(productId, productData).subscribe({
      next: () => {
        console.log('Producto actualizado con éxito');

        // Gestionar las imágenes
        this.handleProductImages(productId);

        // Actualizar la categoría si ha cambiado
        this.updateProductCategory(
          productId,
          this.productForm.value.categoria_id
        );

        // Recargar datos y resetear formulario
        this.resetForm();
        this.loadUserProducts();
        this.isSubmitting = false;
      },
      error: (error: any) => {
        console.error('Error al actualizar producto:', error);
        this.isSubmitting = false;
        alert(
          'Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.'
        );
      },
    });
  }

  // Gestionar las imágenes del producto durante la actualización
  private handleProductImages(productId: number): void {
    // Primero procesamos las eliminaciones de imágenes originales
    const deletedImages = this.originalImages.filter(
      (originalImage) =>
        !this.imagePreviewUrls.some((url) => url === originalImage.url)
    );

    // Crear un array de promesas para manejar las operaciones de manera más ordenada
    const deletePromises = deletedImages.map(
      (image) =>
        new Promise<void>((resolve, reject) => {
          this.productService.deleteProductImage(image.id).subscribe({
            next: () => {
              console.log(`Imagen ${image.id} eliminada correctamente`);
              resolve();
            },
            error: (error) => {
              console.error(`Error al eliminar imagen ${image.id}:`, error);
              reject(error);
            },
          });
        })
    );

    // Después de que se completen todas las eliminaciones, subimos las nuevas imágenes
    Promise.all(deletePromises)
      .then(() => {
        // Subir las nuevas imágenes (las que son archivos seleccionados)
        if (this.imageFiles.length > 0) {
          this.uploadProductImages(productId);
        }
      })
      .catch((error) => {
        console.error('Error al procesar las imágenes:', error);
      });
  }

  // Actualizar categoría del producto
  private updateProductCategory(
    productId: number,
    newCategoryId: number
  ): void {
    // Obtener la categoría actual
    this.categoriesService.getProductosCategoriasId(productId).subscribe({
      next: (categories: any) => {
        if (categories && categories.length > 0) {
          const currentCategoryId = categories[0].categoria_id;

          // Si la categoría ha cambiado, actualizarla
          if (currentCategoryId != newCategoryId) {
            // Para este caso simple, eliminamos la asociación anterior y creamos una nueva
            const data = {
              producto_id: productId.toString(),
              categoria_id: newCategoryId.toString(),
            };

            this.productService.postProductCategories(data).subscribe({
              error: (error) =>
                console.error('Error al actualizar categoría:', error),
            });
          }
        } else {
          // Si no tiene categoría, crear una nueva asociación
          this.saveProductCategory(productId, newCategoryId);
        }
      },
      error: (error) => {
        console.error('Error al obtener categoría:', error);
        // En caso de error, intentamos crear una nueva asociación
        this.saveProductCategory(productId, newCategoryId);
      },
    });
  }

  // Subir imágenes del producto
    private uploadProductImages(productoId: number): void {
      // Upload each image URL associated with the product
      this.imagePreviewUrls.forEach((url) => {
        // Skip any images that are already in originalImages (they're already in the database)
        if (this.editingProduct && this.originalImages.some(img => img.url === url)) {
          return;
        }
        
        const imageData = {
          url: url,
          producto_id: productoId.toString(),
        };

        this.productService.postProductImage(imageData).subscribe({
          next: (response) => console.log('Imagen subida correctamente', response),
          error: (error) => console.error('Error al guardar URL de imagen:', error),
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
      error: (error: any) =>
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
      error: (error: any) =>
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

    // Limpiar imágenes previas
    this.imagePreviewUrls = [];
    this.imageFiles = [];
    this.originalImages = [];

    // Cargar las imágenes existentes del producto
    this.productService.getProductImages(product.id).subscribe({
      next: (images: any) => {
        if (images && images.length > 0) {
          this.originalImages = images;
          // Mostrar las imágenes existentes en la vista previa
          images.forEach((image: any) => {
            this.imagePreviewUrls.push(image.url);
          });
        }
      },
      error: (error: any) => {
        console.error('Error al cargar imágenes del producto:', error);
      },
    });
  }

  // Eliminar producto - modificado para usar cascada API
  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.isSubmitting = true;

      // Llamar directamente al método deleteProduct ya que la API maneja la cascada
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Producto eliminado correctamente');
          // Eliminar producto de la lista local
          this.products = this.products.filter((p) => p.id !== productId);
          this.calculateTotalPages();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('Error al eliminar el producto:', error);
          this.isSubmitting = false;
          alert(
            'Hubo un error al eliminar el producto. Por favor, inténtalo de nuevo.'
          );
        },
      });
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

  addImageUrl(url: string): void {
    if (!url) {
      this.imageError = 'Por favor, introduce una URL válida';
      return;
    }
    
    if (!url.match(/^(http|https):\/\/.+\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      this.imageError = 'La URL debe ser una imagen válida (JPG, PNG, GIF, WEBP)';
      return;
    }
    
    // Verificar que la imagen existe antes de añadirla
    const img = new Image();
    img.onload = () => {
      this.imageError = '';
      this.imagePreviewUrls.push(url);
    };
    img.onerror = () => {
      this.imageError = 'No se puede cargar la imagen desde esa URL. Verifica que sea accesible.';
    };
    img.src = url;
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
