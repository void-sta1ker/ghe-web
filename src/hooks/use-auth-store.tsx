import { useEffect } from "react";
import { create } from "zustand";
import safeLocalStorage from "@/helpers/safe-local-storage";

interface AuthStore {
  isAuth: boolean;
  setIsAuth: (newState: boolean) => void;
}

const useAuthStore = create<AuthStore>()((set) => ({
  isAuth: false,
  setIsAuth: (newState) => set((state) => ({ isAuth: newState })),
}));

export default function useAuth() {
  const { isAuth, setIsAuth } = useAuthStore();

  useEffect(() => {
    const token = safeLocalStorage.getItem("access_token") ?? "";

    const user = JSON.parse(safeLocalStorage.getItem("user") ?? "{}");

    const username = `${user.firstName} ${user.lastName}`;

    const phone = user.phoneNumber;

    const isClientAuth = !!token && !!username && !!phone;

    setIsAuth(isClientAuth);
  }, []);

  return { isAuth, setIsAuth };
}
