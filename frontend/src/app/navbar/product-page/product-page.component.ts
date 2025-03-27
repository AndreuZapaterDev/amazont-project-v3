import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})

export class ProductPageComponent implements OnInit {
  product = {
    name: 'Producto de Ejemplo',
    description: 'Esta es una descripción detallada del producto de ejemplo. Incluye todas las características y beneficios del producto.',
    price: 100.00,
    availability: 'En stock',
    url: 'https://images.unsplash.com/photo-1606813901444-1f7e3f5a6f7b',
    images: [
      'https://images.unsplash.com/photo-1606813901444-1f7e3f5a6f7b',
      'https://images.unsplash.com/photo-1606813901444-1f7e3f5a6f7b',
      'https://images.unsplash.com/photo-1606813901444-1f7e3f5a6f7b'
    ],
    reviews: [
      { author: 'Usuario 1', rating: 5, text: 'Excelente producto. Muy recomendable.' },
      { author: 'Usuario 2', rating: 4, text: 'Muy bueno, pero podría mejorar en algunos aspectos.' }
    ],
    shippingInfo: 'Envío en 1-2 días hábiles.',
    returnPolicy: 'Devoluciones aceptadas dentro de los 30 días.'
  };

  constructor() {}

  ngOnInit(): void {}

  addToCart() {
    console.log('Producto añadido al carrito:', this.product);
  }
}
