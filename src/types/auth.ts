interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface LoginData {
  phoneNumber: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

interface CheckPhoneData {
  token: string;
  phoneNumber: string;
  otp: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export type { AuthResponse, LoginData, RegisterData, CheckPhoneData, User };
