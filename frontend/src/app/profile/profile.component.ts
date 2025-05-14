import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services/login.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Estado principal
  activeTab: string = 'info';
  isSubmitting: boolean = false;

  // Datos de usuario
  userProfile: any = {
    id: 0,
    nombre: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: 0,
    imagen_usuario: '',
  };

  profileImage: string = '';
  userEmail: string = '';
  userCreationDate: string = new Date().toISOString();

  // Estados de UI
  showAddPaymentForm: boolean = false;
  showAddAddressForm: boolean = false;
  showPasswordToggles = {
    current: false,
    new: false,
    confirm: false,
  };

  // Filtros
  orderSearchTerm: string = '';
  orderStatusFilter: string = 'all';

  // Datos
  orders: any[] = [];
  paymentMethods: any[] = [];
  addresses: any[] = [];
  connectedDevices: any[] = [];
  recentActivities: any[] = [];
  orderCount: number = 0;
  wishlistCount: number = 0;
  reviewCount: number = 0;

  // Opciones de seguridad
  securityOptions = {
    twoFactorEnabled: false,
    loginAlerts: true,
    keepLoggedIn: true,
  };

  // Formularios
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  paymentForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private loginService: LoginService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
    this.loadPaymentMethods();
    this.loadOrders();
  }

  // Inicialización de formularios
  private initForms(): void {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha_nacimiento: [''],
      genero: [''],
    });

    this.addressForm = this.fb.group({
      addressName: ['', Validators.required],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.checkPasswords }
    );
  }

  // Validador personalizado para comprobar que las contraseñas coincidan
  checkPasswords(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  // Cargar datos del usuario desde el servicio
  private loadUserData(): void {
    // console.log('Usuario', this.loginService.getLoggedUser());
    const currentUser = this.loginService.getLoggedUser();
    this.profileService.getCurrentUserProfile(currentUser.id).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.userProfile.email = currentUser.email;
        console.log('Perfil de usuario', this.userProfile);
        // Establecer la imagen de perfil o usar una por defecto
        this.profileImage =
          this.userProfile.imagen_usuario ||
          '/assets/images/default-avatar.png';

        // Formatear fecha para el formulario si es necesario
        const birthDate = this.userProfile.fecha_nacimiento
          ? new Date(this.userProfile.fecha_nacimiento)
              .toISOString()
              .split('T')[0]
          : '';

        // Actualizar el formulario con los datos del usuario
        this.profileForm.patchValue({
          nombre: this.userProfile.nombre,
          apellidos: this.userProfile.apellidos,
          email: this.userProfile.email,
          telefono: this.userProfile.telefono,
          direccion: this.userProfile.direccion,
          fecha_nacimiento: birthDate,
          genero: this.userProfile.genero?.toString() || '',
        });
      },
      error: (error) => {
        console.error('Error al cargar el perfil del usuario:', error);
      },
    });
  }

  // Cargar métodos de pago del usuario
  loadPaymentMethods(): void {
    const currentUser = this.loginService.getLoggedUser();
    this.profileService.getMetodosPago(currentUser.id).subscribe({
      next: (metodos) => {
        // Transformar los métodos de pago de la API al formato que usamos en la vista
        this.paymentMethods = metodos.map((metodo) => ({
          id: metodo.id,
          type: this.profileService.detectCardType(metodo.tarjeta),
          name: metodo.nombre,
          last4: this.profileService.formatCardNumberForDisplay(metodo.tarjeta),
          expiry: metodo.caducidad,
          isDefault: false, // Podría implementarse en el futuro
        }));

        // Si hay métodos de pago, establecer el primero como predeterminado
        if (this.paymentMethods.length > 0) {
          this.paymentMethods[0].isDefault = true;
        }
      },
      error: (error) => {
        console.error('Error al cargar los métodos de pago:', error);
      },
    });
  }

  // Cargar pedidos del usuario (se usaría un servicio específico, aquí usamos datos de ejemplo temporalmente)
  loadOrders(): void {
    this.profileService.getCarritos().subscribe({
      next: (carritos) => {
        const currentUser = this.loginService.getLoggedUser();

        // Filter carritos by user_id matching currentUser.id and acabado = 1
        this.orders = carritos
          .filter(
            (carrito) =>
              carrito.user_id === currentUser.id && carrito.acabado === 1
          )
          .map((carrito) => ({
            id: carrito.id.toString(),
            date: carrito.fecha_pago || new Date().toISOString(),
            status: carrito.fecha_pago ? 'completed' : 'pending',
            statusText: carrito.fecha_pago ? 'Completado' : 'Pendiente',
            total: carrito.total,
          }));

        // Update order count
        this.orderCount = this.orders.length;
      },
      error: (error) => {
        console.error('Error al cargar los pedidos:', error);
        this.orders = [];
        this.orderCount = 0;
      },
    });

    // this.http.get('http://127.0.0.1:8000/api/pedidos').subscribe({
    //   next: (data: any) => {
    //     // Filtrar pedidos del usuario actual
    //     const currentUser = this.loginService.getLoggedUser();
    //     if (currentUser) {
    //       this.orders = data
    //         .filter((order: any) => order.usuario_id === currentUser.id)
    //         .map((order: any) => ({
    //           id: order.id.toString(),
    //           date: order.fecha,
    //           status: this.mapOrderStatus(order.estado),
    //           statusText: this.getStatusText(order.estado),
    //           total: order.total,
    //         }));
    //       this.orderCount = this.orders.length;
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error al cargar los pedidos:', error);
    //     // Mantener orders vacío en caso de error
    //     this.orders = [];
    //     this.orderCount = 0;
    //   },
    // });
  }

  // Mapea el estado del pedido del backend a los valores que usamos en la UI
  private mapOrderStatus(estado: string): string {
    const statusMap: { [key: string]: string } = {
      pendiente: 'pending',
      enviado: 'shipped',
      entregado: 'completed',
      cancelado: 'cancelled',
    };
    return statusMap[estado.toLowerCase()] || 'pending';
  }

  // Obtiene el texto a mostrar para cada estado
  private getStatusText(estado: string): string {
    const textMap: { [key: string]: string } = {
      pendiente: 'Pendiente',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return textMap[estado.toLowerCase()] || 'Pendiente';
  }

  // GESTIÓN DE PESTAÑAS
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // GESTIÓN DE IMÁGENES
  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;

        // Actualizar la imagen en el perfil
        const profileData = {
          ...this.userProfile,
          imagen_usuario: this.profileImage,
        };

        // Guardar la imagen en el servidor
        this.profileService
          .updatePerfilUsuario(this.userProfile.id, profileData)
          .subscribe({
            next: () => {
              console.log('Imagen de perfil actualizada correctamente');
            },
            error: (error) => {
              console.error('Error al actualizar la imagen de perfil:', error);
            },
          });
      };
      reader.readAsDataURL(file);
    }
  }

  // OPERACIONES CRUD
  updateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;

    // Preparar los datos para enviar al servidor
    const profileData = {
      nombre: this.profileForm.value.nombre,
      apellidos: this.profileForm.value.apellidos,
      direccion: this.profileForm.value.direccion,
      telefono: this.profileForm.value.telefono,
      fecha_nacimiento: this.profileForm.value.fecha_nacimiento,
      genero: parseInt(this.profileForm.value.genero, 10),
      imagen_usuario: this.profileImage,
    };

    // Actualizar el perfil usando el servicio
    this.profileService
      .updatePerfilUsuario(this.userProfile.id, profileData)
      .subscribe({
        next: () => {
          // Actualizar los datos locales
          this.userProfile = {
            ...this.userProfile,
            ...profileData,
          };

          this.userEmail = this.profileForm.value.email;

          alert('Perfil actualizado correctamente');
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error al actualizar el perfil:', error);
          alert('Error al actualizar el perfil. Inténtelo de nuevo.');
          this.isSubmitting = false;
        },
      });
  }

  // MÉTODOS DE PAGO
  formatCardNumber(event: any): void {
    const input = event.target;
    input.value = this.profileService.formatCardNumber(input.value);
    this.paymentForm.patchValue({ cardNumber: input.value });
  }

  getCardIcon(type: string): string {
    const icons: { [key: string]: string } = {
      visa: 'fi fi-brands-visa',
      mastercard: 'fi fi-brands-mastercard',
      amex: 'fi fi-brands-amex',
    };

    return icons[type] || 'fi fi-br-credit-card';
  }

  addPaymentMethod(): void {
    if (this.paymentForm.invalid) return;

    // Get current user id
    const currentUser = this.loginService.getLoggedUser();

    // Preparar los datos para enviar
    const paymentData = {
      user_id: currentUser.id.toString(), // Add user_id as string
      nombre: this.paymentForm.value.cardName,
      tarjeta: this.paymentForm.value.cardNumber.replace(/\s+/g, ''),
      caducidad: this.paymentForm.value.expiryDate,
      cvv: this.paymentForm.value.cvv,
    };

    // Usar el servicio para añadir el método de pago
    this.profileService.addMetodoPago(paymentData).subscribe({
      next: (response) => {
        // Añadir el nuevo método a la lista local
        this.paymentMethods.push({
          id: response.id,
          type: this.profileService.detectCardType(paymentData.tarjeta),
          name: paymentData.nombre,
          last4: this.profileService.formatCardNumberForDisplay(
            paymentData.tarjeta
          ),
          expiry: paymentData.caducidad,
          isDefault: this.paymentMethods.length === 0,
        });

        this.showAddPaymentForm = false;
        this.paymentForm.reset();
      },
      error: (error) => {
        console.error('Error al añadir el método de pago:', error);
        alert('Error al añadir el método de pago. Inténtelo de nuevo.');
      },
    });
  }

  setDefaultPaymentMethod(index: number): void {
    // Actualizar el estado localmente
    this.paymentMethods.forEach((method, i) => {
      method.isDefault = i === index;
    });

    // Esta funcionalidad podría implementarse en el backend si se desea
    // Por ahora solo lo manejamos en la UI
  }

  deletePaymentMethod(index: number): void {
    const methodId = this.paymentMethods[index].id;

    // Usar el servicio para eliminar el método de pago
    this.profileService.deleteMetodoPago(methodId).subscribe({
      next: () => {
        this.paymentMethods.splice(index, 1);
      },
      error: (error) => {
        console.error('Error al eliminar el método de pago:', error);
        alert('Error al eliminar el método de pago. Inténtelo de nuevo.');
      },
    });
  }

  // DIRECCIONES
  addAddress(): void {
    if (this.addressForm.invalid) return;

    // Aquí se implementaría la conexión real a la API para añadir direcciones
    // Por ahora implementamos solo la lógica local

    this.addresses.push({
      id: Date.now(),
      name: this.addressForm.value.addressName,
      fullName: this.addressForm.value.fullName,
      address: this.addressForm.value.address,
      city: this.addressForm.value.city,
      postalCode: this.addressForm.value.postalCode,
      phone: this.addressForm.value.phone,
      isDefault: this.addresses.length === 0,
    });

    this.showAddAddressForm = false;
    this.addressForm.reset();
  }

  setDefaultAddress(index: number): void {
    this.addresses.forEach((address, i) => {
      address.isDefault = i === index;
    });
  }

  editAddress(index: number): void {
    const address = this.addresses[index];

    this.addressForm.patchValue({
      addressName: address.name,
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      phone: address.phone,
    });

    this.addresses.splice(index, 1);
    this.showAddAddressForm = true;
  }

  deleteAddress(index: number): void {
    this.addresses.splice(index, 1);
  }

  // SEGURIDAD
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPasswordToggles[field] = !this.showPasswordToggles[field];
  }

  getPasswordStrength(): { class: string; text: string; value: number } {
    const password = this.passwordForm.get('newPassword')?.value || '';

    // Simple strength evaluation
    let strength = 0;
    let strengthClass = '';
    let strengthText = '';

    if (password.length === 0) {
      strengthClass = '';
      strengthText = '';
      strength = 0;
    } else if (password.length < 6) {
      strengthClass = 'weak';
      strengthText = 'Débil';
      strength = 25;
    } else if (password.length < 10) {
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (hasNumber && hasSpecialChar) {
        strengthClass = 'strong';
        strengthText = 'Fuerte';
        strength = 75;
      } else if (hasNumber || hasSpecialChar) {
        strengthClass = 'medium';
        strengthText = 'Media';
        strength = 50;
      } else {
        strengthClass = 'weak';
        strengthText = 'Débil';
        strength = 25;
      }
    } else {
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);

      const complexity = [
        hasNumber,
        hasSpecialChar,
        hasUpperCase,
        hasLowerCase,
      ].filter(Boolean).length;

      if (complexity >= 4) {
        strengthClass = 'very-strong';
        strengthText = 'Muy fuerte';
        strength = 100;
      } else if (complexity >= 3) {
        strengthClass = 'strong';
        strengthText = 'Fuerte';
        strength = 75;
      } else {
        strengthClass = 'medium';
        strengthText = 'Media';
        strength = 50;
      }
    }

    return { class: strengthClass, text: strengthText, value: strength };
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const currentUser = this.loginService.getLoggedUser();
    if (!currentUser) {
      alert('No hay usuario conectado');
      return;
    }

    // Usar el servicio para cambiar la contraseña
    this.profileService
      .changePassword(
        currentUser.id,
        this.passwordForm.value.currentPassword,
        this.passwordForm.value.newPassword
      )
      .subscribe({
        next: () => {
          alert('Contraseña actualizada correctamente');
          this.passwordForm.reset();
        },
        error: (error) => {
          console.error('Error al cambiar la contraseña:', error);
          alert(
            'Error al cambiar la contraseña. Compruebe que la contraseña actual sea correcta.'
          );
        },
      });
  }

  saveSecurityOptions(): void {
    // Aquí se implementaría la conexión real a la API para guardar opciones de seguridad
    alert('Opciones de seguridad guardadas correctamente');
  }

  getDeviceIcon(deviceType: string): string {
    const icons: { [key: string]: string } = {
      desktop: 'fi fi-br-desktop',
      laptop: 'fi fi-br-laptop',
      mobile: 'fi fi-br-mobile',
      tablet: 'fi fi-br-tablet',
    };

    return icons[deviceType] || 'fi fi-br-computer';
  }

  revokeDevice(index: number): void {
    if (confirm('¿Estás seguro de revocar el acceso de este dispositivo?')) {
      // Aquí se implementaría la conexión real a la API para revocar dispositivos
      this.connectedDevices.splice(index, 1);
    }
  }

  // FILTROS
  get filteredOrders(): any[] {
    return this.orders.filter((order) => {
      const matchesSearch = this.orderSearchTerm
        ? order.id.toLowerCase().includes(this.orderSearchTerm.toLowerCase())
        : true;

      const matchesStatus =
        this.orderStatusFilter !== 'all'
          ? order.status === this.orderStatusFilter
          : true;

      return matchesSearch && matchesStatus;
    });
  }

  clearOrderFilters(): void {
    this.orderSearchTerm = '';
    this.orderStatusFilter = 'all';
  }

  // UTILIDADES
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  // CERRAR SESIÓN
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
