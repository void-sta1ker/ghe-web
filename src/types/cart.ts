import type { DiscountProps, Product } from "./product";

interface Cart {
  products: CartItem[];
  user: string;
}

interface CartItem {
  product: Product & DiscountProps;
  quantity: number;
  totalPrice: number;
  status: string;
}

interface CartItemDetails {
  product: string;
  quantity: number;
  totalPrice: number;
}

export type { Cart, CartItem, CartItemDetails };
