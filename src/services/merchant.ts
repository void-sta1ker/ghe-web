import request from "@/utils/axios";
import type { MerchantData } from "@/types";

export async function createMerchant(
  data: MerchantData,
): Promise<MerchantData> {
  const res: MerchantData = await request({
    url: "/merchants",
    method: "post",
    data,
  });

  return res;
}

export async function signUpMerchant(
  token: string,
  data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
  },
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: `/merchants/signup/${token}`,
    method: "post",
    data,
  });

  return res;
}
