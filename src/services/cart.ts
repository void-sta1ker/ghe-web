import request from "@/utils/axios";
import type { Cart, CartItemDetails } from "@/types";

export async function createCart(initProducts: CartItemDetails[]): Promise<{
  success: boolean;
  cartId: string;
}> {
  const res: {
    success: boolean;
    cartId: string;
  } = await request({
    url: "/cart",
    method: "post",
    data: {
      products: initProducts,
    },
  });

  return res;
}

export async function addToCart(
  cart: string,
  product: CartItemDetails,
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/cart/${cart}`,
    method: "post",
    data: {
      product,
    },
  });

  return res;
}

export async function removeFromCart(
  cart: string,
  product: string,
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/cart/${cart}/${product}`,
    method: "delete",
  });

  return res;
}

export async function removeCart(cart: string): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/cart/${cart}`,
    method: "delete",
  });

  return res;
}

export async function getCart(): Promise<Cart> {
  const res: Cart = await request({
    url: "/cart",
    method: "get",
  });

  return res;
}

export async function changeQuantity(
  cart: string,
  product: string,
  action: "inc" | "dec",
) {
  const res: { success: boolean } = await request({
    url: `/cart/${cart}/${product}/${action}`,
    method: "put",
  });

  return res;
}
