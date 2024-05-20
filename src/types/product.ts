import type { BaseParams } from ".";

interface Product {
  id: string;
  images: Array<{ imageUrl: string; imageKey: string }>;
  name: string;
  description: string;
  colors: string[];
  price: number;
  brand: { _id: string; name: string; isActive: boolean };
  quantity: number;
}

interface ProductWithFeedback extends Product {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
}

interface ProductsListParams extends BaseParams {
  min?: number;
  max?: number;
  category?: string;
  rating?: number;
  // sortOrder?: string;
  sortBy?: "all" | "most-expensive" | "cheapest";
  inDiscount?: boolean;
  isNew?: boolean;
  generalRecommendation?: boolean;
}

interface DiscountProps {
  isDiscounted: boolean;
  discountedPrice: number;
}

export type { Product, ProductsListParams, ProductWithFeedback, DiscountProps };
