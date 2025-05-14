export interface Review {
  id: number;
  author: string;
  puntuacion: number;
  review: string;
  fecha: string;
  util: number;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  url?: string;
  price: number;
  stars: number;
  category: string;
  description?: string;
  stock?: number;
  discount?: number;
  reviews?: Review[];
  images?: any[]; // Support for images array
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  stars: number;
  discount?: number; // Made optional to match Product interface
  description: string;
  stock: number;
  url: string;
  producto_carrito_id?: number;
}
