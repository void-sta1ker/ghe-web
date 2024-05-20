import type { BaseEntity, Product } from ".";

interface Order {
  cart: string;
  user: string;
  total: number;
}

interface Review {
  product: BaseEntity;
  user: string;
  title: string;
  rating: number;
  review: string;
  isRecommended: boolean;
  status: string;
}

interface Purchase {
  id: string;
  created: string;
  total: number;
  products: Array<{
    product: Product;
    quantity: number;
    status: string;
    totalPrice: number;
  }>;
}

interface ReviewData {
  product: string;
  title: string;
  rating: number;
  review: string;
  isRecommended: boolean;
}

interface Address {
  id: string;
  user: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export type { Order, Review, Purchase, ReviewData, Address };
