import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DarkModeComponent } from '../dark-mode/dark-mode.component';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DarkModeComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthdate: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
        gender: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        newsletter: [false],
        terms: [false, Validators.requiredTrue],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Validador para comprobar que las contraseñas coincidan
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ matching: true });
    } else {
      return null;
    }
    return { matching: true };
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // CONTRASEÑA

  // Determina la clase CSS para la barra de fuerza de la contraseña
  getPasswordStrengthClass(): string {
    const password = this.signupForm.get('password')?.value;
    if (!password) return '';

    if (this.isStrongPassword(password)) return 'strong';
    if (this.isMediumPassword(password)) return 'medium';
    return 'weak';
  }

  // Determina el texto descriptivo de la fuerza de la contraseña
  getPasswordStrengthText(): string {
    const password = this.signupForm.get('password')?.value;
    if (!password) return '';

    if (this.isStrongPassword(password)) return 'Contraseña fuerte';
    if (this.isMediumPassword(password)) return 'Contraseña media';
    return 'Contraseña débil';
  }

  // Verifica si la contraseña es fuerte
  private isStrongPassword(password: string): boolean {
    // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    return strongRegex.test(password);
  }

  // Verifica si la contraseña es de fuerza media
  private isMediumPassword(password: string): boolean {
    // Al menos 6 caracteres y debe cumplir al menos 2 de las siguientes:
    // 1 mayúscula, 1 minúscula, 1 número
    const mediumRegex1 = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.{6,})');
    const mediumRegex2 = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.{6,})');
    const mediumRegex3 = new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');

    return (
      mediumRegex1.test(password) ||
      mediumRegex2.test(password) ||
      mediumRegex3.test(password)
    );
  }

  isDarkTheme(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  register() {
    // console.log('Formulario enviado:', this.signupForm.value);
    const perfil_usuario = {
      nombre: this.signupForm.value.firstName,
      apellidos: this.signupForm.value.lastName,
      fecha_nacimiento: this.signupForm.value.birthdate,
      direccion: this.signupForm.value.address,
      telefono: this.signupForm.value.phone,
      genero: this.signupForm.value.gender,
      imagen_usuario: 'test',
    };

    this.loginService.postPerfilUsuario(perfil_usuario).subscribe({
      next: (data) => {
        // console.log('Perfil de usuario creado:', data);
        const idPerfilUsuario = data.perfil_usuario;
        const usuario = {
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          rol: 1,
          user_profile_id: idPerfilUsuario,
          // newsletter: this.signupForm.value.newsletter,
        };
        // console.log('Usuario:', usuario);
        this.loginService.postUsuario(usuario).subscribe({
          next: (data) => {
            console.log('Registro exitoso:', data);
          },
          error: (error) => {
            return;
            console.error('Error al registrar:', error);
          },
        });
      },
      error: (error) => {
        return;
        console.error('Error al crear perfil de usuario:', error);
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    // Detener si el formulario es inválido
    if (this.signupForm.invalid) {
      return;
    }
    console.log('hola');
    this.register();
    console.log('Formulario enviado:', this.signupForm.value);

    // Por ahora, simplemente mostraremos una alerta
    setTimeout(() => {
      alert('¡Registro exitoso! Redirigiendo al inicio de sesión.');
      this.router.navigate(['/login']);
    }, 1000);

    // Llamar a la función register para realizar el registro en el backend
    this.register();
  }
}
