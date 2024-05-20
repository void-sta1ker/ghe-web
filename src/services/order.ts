import request from "@/utils/axios";

export async function makeOrder(
  cart: string,
  total: number,
): Promise<{ order: { id: string } }> {
  const res: { order: { id: string } } = await request({
    url: "/orders",
    method: "post",
    data: {
      cartId: cart,
      total,
    },
  });

  return res;
}
