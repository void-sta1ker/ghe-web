import request from "@/utils/axios";
import type {
  AuthResponse,
  CheckPhoneData,
  LoginData,
  RegisterData,
} from "@/types";

export async function login(data: LoginData): Promise<AuthResponse> {
  const res: AuthResponse = await request({
    url: "/auth/login",
    method: "post",
    data,
    params: {
      platform: "web",
    },
  });

  return res;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res: AuthResponse = await request({
    url: "/auth/register",
    method: "post",
    data,
  });

  return res;
}

export async function checkPhone(
  data: CheckPhoneData,
): Promise<{ success: boolean }> {
  const res: { success: boolean } = await request({
    url: "/auth/check-phone",
    method: "post",
    data,
  });

  return res;
}
