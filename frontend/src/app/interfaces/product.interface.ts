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
  images?: any[]; // Add support for images array
}

export interface CartItem extends Product {
  quantity: number;
}
