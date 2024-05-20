import request from "@/utils/axios";
import type {
  BaseParams,
  ListResponse,
  Review,
  Purchase,
  ReviewData,
  Address,
} from "@/types";

export async function getPurchases(
  params?: BaseParams,
): Promise<ListResponse<Purchase>> {
  const res: ListResponse<Purchase> = await request({
    url: "/orders/me",
    method: "get",
    params,
  });

  return res;
}

export async function getReviews(
  params?: BaseParams,
): Promise<ListResponse<Review>> {
  const res: ListResponse<Review> = await request({
    url: "/reviews/me",
    method: "get",
    params,
  });

  return res;
}

export async function getProductReviews(
  productId: string,
  params?: BaseParams,
): Promise<ListResponse<Review>> {
  const res: ListResponse<Review> = await request({
    url: `/reviews/${productId}`,
    method: "get",
    params,
  });

  return res;
}

export async function postReview(data: ReviewData) {
  const res: ReviewData = await request({
    url: "/reviews",
    method: "post",
    data,
  });

  return res;
}

export async function getAddresses(
  params?: BaseParams,
): Promise<ListResponse<Address>> {
  const res: ListResponse<Address> = await request({
    url: "/addresses",
    method: "get",
    params,
  });

  return res;
}

export async function createAddress(
  data: Exclude<Address, "id" | "user">,
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: "/addresses",
    method: "post",
    data,
  });

  return res;
}

export async function deleteAddress(id: string): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/addresses/${id}`,
    method: "delete",
  });

  return res;
}

export async function updateAddress(
  id: string,
  data: { isDefault: boolean },
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/addresses/${id}`,
    method: "put",
    data,
  });

  return res;
}
