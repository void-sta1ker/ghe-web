import request from "@/utils/axios";
import type { DiscountProps, ListResponse, WishlistItem } from "@/types";

export async function toggleWishlistItem(
  product: string,
  isLiked: boolean,
): Promise<{ wishlist: WishlistItem }> {
  const res: { wishlist: WishlistItem } = await request({
    url: "/wishlist",
    method: "post",
    data: {
      product,
      isLiked,
    },
  });

  return res;
}

export async function getWishlist(): Promise<
  ListResponse<WishlistItem & DiscountProps>
> {
  const res: ListResponse<WishlistItem & DiscountProps> = await request({
    url: "/wishlist",
    method: "get",
  });

  return res;
}

export async function clearWishlist() {
  await request({
    url: "/wishlist",
    method: "delete",
  });
}
