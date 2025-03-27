export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stars: number;
  url: string;
  category: string;
  discount?: number;
  description?: string;
  features?: string[];
  reviews?: Review[];
  stock?: number;
  additionalImages?: string[];
}