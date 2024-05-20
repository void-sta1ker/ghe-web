import type { ProductWithFeedback } from "./product";

interface WishlistItem extends ProductWithFeedback {
  isLiked: boolean;
}

export type { WishlistItem };
