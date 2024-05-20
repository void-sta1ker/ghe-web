import request from "@/utils/axios";
import type {
  ListResponse,
  Product,
  ProductWithFeedback,
  ProductsListParams,
  CategoryField,
  DiscountProps,
} from "@/types";

export async function searchProducts(
  name: string,
): Promise<ListResponse<Product>> {
  const res: ListResponse<Product> = await request({
    method: "get",
    url: `/products/list/search/${name}`,
  });

  return res;
}

export async function getProductsList(
  params?: ProductsListParams,
): Promise<ListResponse<ProductWithFeedback & DiscountProps, CategoryField>> {
  const res: ListResponse<ProductWithFeedback & DiscountProps, CategoryField> =
    await request({
      url: "/products/list",
      method: "get",
      params,
    });

  return res;
}

export async function getProduct(
  id: string,
): Promise<Product & CategoryField & DiscountProps> {
  const res: Product & CategoryField & DiscountProps = await request({
    url: `/products/item/${id}`,
    method: "get",
  });

  return res;
}
