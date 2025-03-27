import { Injectable } from '@angular/core';
import { Product, Review } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private reviews: { [key: number]: Review[] } = {
    1: [
      {
        id: 1,
        author: 'María García',
        rating: 4,
        comment: 'Muy buen producto, quita las manchas difíciles y deja la ropa con un agradable olor.',
        date: '10 mayo 2024',
        helpful: 5,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 2,
        author: 'Juan Pérez',
        rating: 5,
        comment: 'El mejor detergente que he probado. Lo recomiendo totalmente para familias con niños.',
        date: '2 mayo 2024',
        helpful: 8,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 20,
        author: 'Lucía Fernández',
        rating: 3,
        comment: 'Limpia bien pero el olor es demasiado fuerte para mi gusto. No estoy segura si lo compraría de nuevo.',
        date: '19 abril 2024',
        helpful: 3,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 21,
        author: 'Antonio Sánchez',
        rating: 5,
        comment: 'Estupendo para ropa de bebés. No irrita la piel y deja la ropa super suave y limpia.',
        date: '8 abril 2024',
        helpful: 12,
        avatar: '/images/avatar-male.jpg'
      }
    ],
    2: [
      {
        id: 3,
        author: 'Carlos Rodríguez',
        rating: 5,
        comment: '¡Genial! Hemos pasado tardes muy divertidas con este juego clásico.',
        date: '15 mayo 2024',
        helpful: 12,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 22,
        author: 'Ana Martínez',
        rating: 4,
        comment: 'Un clásico que nunca falla. Mi única queja es que las fichas son un poco pequeñas.',
        date: '11 mayo 2024',
        helpful: 5,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 23,
        author: 'Roberto Gómez',
        rating: 5,
        comment: 'Excelente calidad del tablero y las piezas. Mis hijos lo adoran y lo jugamos cada fin de semana.',
        date: '1 mayo 2024',
        helpful: 7,
        avatar: '/images/avatar-male.jpg'
      }
    ],
    3: [
      {
        id: 4,
        author: 'Elena Martínez',
        rating: 3,
        comment: 'El balón es bonito pero se desinfla un poco rápido. Por lo demás, está bien.',
        date: '20 abril 2024',
        helpful: 3,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 5,
        author: 'Javier López',
        rating: 4,
        comment: 'Buen balón para jugar en el parque con los amigos. Buena relación calidad-precio.',
        date: '12 abril 2024',
        helpful: 7,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 24,
        author: 'Marina Ruiz',
        rating: 5,
        comment: 'Color vibrante y muy buen agarre. Perfecto para entrenamiento y partidos amateur.',
        date: '8 abril 2024',
        helpful: 9,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 25,
        author: 'Pablo Díaz',
        rating: 2,
        comment: 'Perdió presión después de solo tres usos. No es lo que esperaba por ese precio.',
        date: '2 abril 2024',
        helpful: 14,
        avatar: '/images/avatar-male.jpg'
      }
    ],
    4: [
      {
        id: 6,
        author: 'Carmen Rodríguez',
        rating: 5,
        comment: '¡Increíble producto! Excedió todas mis expectativas. La calidad es superior y la comida queda perfecta.',
        date: '15 mayo 2024',
        helpful: 8,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 7,
        author: 'Miguel Sánchez',
        rating: 4,
        comment: 'Muy buen producto por el precio. La calidad es buena aunque podría mejorar en algunos pequeños detalles.',
        date: '2 mayo 2024',
        helpful: 3,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 26,
        author: 'Isabel Navarro',
        rating: 5,
        comment: 'La mejor sartén que he tenido. El antiadherente funciona perfectamente incluso después de varios meses de uso.',
        date: '27 abril 2024',
        helpful: 11,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 27,
        author: 'Fernando Torres',
        rating: 3,
        comment: 'Buena sartén, pero el mango se calienta demasiado. Hay que tener cuidado.',
        date: '15 abril 2024',
        helpful: 6,
        avatar: '/images/avatar-male.jpg'
      }
    ],
    5: [
      {
        id: 8,
        author: 'Laura Fernández',
        rating: 5,
        comment: 'La camisa es preciosa y la tela muy suave. Talla perfecta.',
        date: '8 mayo 2024',
        helpful: 6,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 28,
        author: 'Daniel Moreno',
        rating: 4,
        comment: 'Buena calidad de tela, aunque la entrega tardó un poco más de lo esperado. Por lo demás, satisfecho.',
        date: '3 mayo 2024',
        helpful: 2,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 29,
        author: 'Sara González',
        rating: 5,
        comment: 'Me encanta esta camisa. Se lava bien y no se arruga demasiado. Voy a comprar más colores.',
        date: '29 abril 2024',
        helpful: 7,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 30,
        author: 'Raúl Jiménez',
        rating: 3,
        comment: 'La talla me quedó un poco grande a pesar de seguir la guía de tallas. Por lo demás bien.',
        date: '21 abril 2024',
        helpful: 4,
        avatar: '/images/avatar-male.jpg'
      }
    ],
    6: [
      {
        id: 9,
        author: 'Pedro Gutiérrez',
        rating: 5,
        comment: 'El smartphone tiene una batería que dura muchísimo. La cámara es espectacular.',
        date: '1 mayo 2024',
        helpful: 15,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 10,
        author: 'Sofía Álvarez',
        rating: 4,
        comment: 'Muy buen teléfono, aunque el sistema operativo podría ser más fluido.',
        date: '25 abril 2024',
        helpful: 7,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 31,
        author: 'Alejandro Ramírez',
        rating: 5,
        comment: 'Pantalla increíble, rendimiento brutal y batería para dos días con uso intensivo. Absolutamente recomendado.',
        date: '22 abril 2024',
        helpful: 18,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 32,
        author: 'Cristina Vega',
        rating: 3,
        comment: 'El teléfono es bueno pero se calienta bastante durante los juegos. La cámara sí es espectacular.',
        date: '18 abril 2024',
        helpful: 9,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 33,
        author: 'Manuel Castro',
        rating: 4,
        comment: 'Excelente relación calidad-precio. Un smartphone premium a un precio asequible.',
        date: '10 abril 2024',
        helpful: 12,
        avatar: '/images/avatar-male.jpg'
      }
    ],
    7: [
      {
        id: 11,
        author: 'Andrés Torres',
        rating: 5,
        comment: 'Camiseta de excelente calidad. El diseño es genial y la tela muy cómoda.',
        date: '5 mayo 2024',
        helpful: 4,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 34,
        author: 'Patricia Ramos',
        rating: 4,
        comment: 'Me gusta mucho la camiseta, pero encogió un poco después del primer lavado. Mejor comprar una talla más.',
        date: '30 abril 2024',
        helpful: 8,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 35,
        author: 'Óscar Vargas',
        rating: 5,
        comment: 'Muy buena calidad del algodón. Fresco y cómodo para el verano.',
        date: '25 abril 2024',
        helpful: 6,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 36,
        author: 'Diana Muñoz',
        rating: 3,
        comment: 'El diseño es bonito pero la tela no es tan buena como esperaba por ese precio.',
        date: '18 abril 2024',
        helpful: 5,
        avatar: '/images/avatar-female.jpg'
      }
    ],
    8: [
      {
        id: 12,
        author: 'Isabel Navarro',
        rating: 5,
        comment: 'El polo es elegante y muy cómodo. Perfecto para ocasiones casuales.',
        date: '18 abril 2024',
        helpful: 9,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 13,
        author: 'Roberto Díaz',
        rating: 4,
        comment: 'Buena calidad de tela, aunque el precio es un poco elevado.',
        date: '10 abril 2024',
        helpful: 6,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 37,
        author: 'Mónica Herrera',
        rating: 5,
        comment: 'Muy elegante y de excelente calidad. Lo he usado mucho y sigue como nuevo.',
        date: '7 abril 2024',
        helpful: 7,
        avatar: '/images/avatar-female.jpg'
      },
      {
        id: 38,
        author: 'Sergio Blanco',
        rating: 2,
        comment: 'El color no coincide exactamente con la foto. Además, las costuras empezaron a soltarse después de algunos lavados.',
        date: '2 abril 2024',
        helpful: 10,
        avatar: '/images/avatar-male.jpg'
      },
      {
        id: 39,
        author: 'Lucía Ortega',
        rating: 4,
        comment: 'Material de buena calidad que resiste bien los lavados. El único pero es que la talla es un poco pequeña.',
        date: '29 marzo 2024',
        helpful: 8,
        avatar: '/images/avatar-female.jpg'
      }
    ]
  };

  products: Product[] = [
    {
      id: 1,
      name: 'Detergente',
      url: 'https://www.supercash.es/wp-content/uploads/2020/02/detergente-profesional_cabecera.png',
      price: 10.0,
      stars: 4,
      category: 'home',
      description: 'Detergente concentrado de alta calidad que elimina hasta las manchas más difíciles. Su fórmula avanzada protege los colores y cuida los tejidos mientras proporciona un frescor duradero.',
      features: [
        'Elimina manchas difíciles',
        'Protege los colores',
        'Rinde hasta 30 lavados',
        'Aroma duradero'
      ],
      stock: 100
    },
    {
      id: 2,
      name: 'Monopoly',
      url: 'https://www.monodejuegos.shop/wp-content/uploads/2020/11/monopoly.png',
      price: 20.0,
      stars: 5,
      category: 'toys',
      description: 'El clásico juego de mesa de compraventa de propiedades para toda la familia. Esta edición incluye tablero actualizado y todas las piezas tradicionales para disfrutar de horas de diversión.',
      features: [
        'Para 2-8 jugadores',
        'A partir de 8 años',
        'Incluye tablero, billetes, tarjetas y fichas',
        'Duración aproximada: 1-2 horas'
      ],
      stock: 45
    },
    {
      id: 3,
      name: 'Balón',
      url: 'https://i1.t4s.cz/products/in9365/adidas-euro24-com-679082-in9365.png',
      price: 15.0,
      stars: 3,
      category: 'sports',
      description: 'Balón de fútbol oficial de alta resistencia, diseñado para ofrecer un rendimiento superior en todo tipo de superficies. Su construcción duradera garantiza una larga vida útil.',
      features: [
        'Material resistente al desgaste',
        'Tamaño oficial',
        'Excelente respuesta al rebote',
        'Apto para césped y superficies duras'
      ],
      stock: 80,
      discount: 10
    },
    {
      id: 4,
      name: 'Sartén',
      url: 'https://cdn.speedsize.com/7ea397ab-9451-4e4a-a8e0-a877fed40d95/https://www.arcos.com/media/catalog/product/7/1/716400_1.png',
      price: 25.0,
      stars: 4,
      category: 'kitchen',
      description: 'Sartén antiadherente de alta calidad con tecnología que permite cocinar con poco o ningún aceite. Su base distribuye el calor uniformemente para una cocción perfecta.',
      features: [
        'Antiadherente de triple capa',
        'Apta para todo tipo de cocinas',
        'Mango ergonómico resistente al calor',
        'Libre de PFOA'
      ],
      stock: 60,
      discount: 20
    },
    {
      id: 5,
      name: 'Camisa',
      url: 'https://media.wuerth.com/stmedia/modyf/eshop/products/std.lang.all/resolutions/normal/png-546x410px/26501189.png',
      price: 30.0,
      stars: 5,
      category: 'clothes',
      description: 'Camisa elegante confeccionada con tejido de alta calidad que garantiza comodidad y durabilidad. Su diseño versátil la hace ideal para ocasiones formales e informales.',
      features: [
        '100% algodón',
        'Corte regular',
        'Fácil planchado',
        'Disponible en varios colores'
      ],
      stock: 120,
      discount: 30
    },
    {
      id: 6,
      name: 'Smartphone',
      url: 'https://oukitel.com/cdn/shop/files/1___11.png?v=1732246275&width=600',
      price: 500.0,
      stars: 4,
      category: 'electronic',
      description: 'Smartphone de última generación con cámara de alta resolución, batería de larga duración y pantalla AMOLED brillante. Su potente procesador garantiza un rendimiento fluido en cualquier aplicación.',
      features: [
        'Pantalla 6.7" AMOLED',
        'Cámara 108MP con estabilización óptica',
        'Batería 5000mAh',
        'Carga rápida 65W'
      ],
      stock: 35,
      discount: 40
    },
    {
      id: 7,
      name: 'Camiseta',
      url: 'https://timshop.timhortons.ca/cdn/shop/files/retro-logo-tshirt-back-1000px.png?v=1707853862&width=1000',
      price: 15.0,
      stars: 4,
      category: 'clothes',
      description: 'Camiseta confeccionada en algodón 100% para máxima comodidad. Su diseño clásico y versátil la convierte en una prenda indispensable para cualquier armario.',
      features: [
        'Algodón 100% peinado',
        'Cuello redondo reforzado',
        'Disponible en varios colores',
        'Lavado a máquina'
      ],
      stock: 200
    },
    {
      id: 8,
      name: 'Polo',
      url: 'https://www.vilebrequin.com/on/demandware.static/-/Sites-vilebrequin-catalog-master/default/dw32db9fa0/images/PYRE9O00-010/PYRE9O00-010-front-3920x3920.png',
      price: 30.0,
      stars: 5,
      category: 'clothes',
      description: 'Polo clásico fabricado con algodón piqué de alta calidad. Su corte favorecedor y acabados premium lo convierten en una prenda elegante y duradera.',
      features: [
        'Algodón piqué premium',
        'Cuello y puños acanalados',
        'Botones de alta calidad',
        'Tejido transpirable'
      ],
      stock: 85
    },
  ];
  
  constructor() {
    // Asignar reseñas a los productos
    this.products.forEach(product => {
      product.reviews = this.reviews[product.id] || [];
    });
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
  
  getReviewsForProduct(productId: number): Review[] {
    return this.reviews[productId] || [];
  }
  
  addReview(productId: number, review: Omit<Review, 'id'>): void {
    const newReview = {
      ...review,
      id: this.generateReviewId()
    };
    
    if (!this.reviews[productId]) {
      this.reviews[productId] = [];
    }
    
    this.reviews[productId].push(newReview);
    
    // Actualizar también el array de reviews en el producto
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.reviews = this.reviews[productId];
    }
  }
  
  private generateReviewId(): number {
    let maxId = 0;
    Object.values(this.reviews).forEach(reviewArray => {
      reviewArray.forEach(review => {
        if (review.id > maxId) {
          maxId = review.id;
        }
      });
    });
    return maxId + 1;
  }
}