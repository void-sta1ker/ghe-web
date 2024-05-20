export * from "./product";
export * from "./auth";
export * from "./user";
export * from "./cart";
export * from "./wishlist";
export * from "./merchant";
export * from "./category";

type AppLang = "en" | "ru" | "uz";

interface BaseEntity {
  id: number | string;
  name: string;
  // [key: string]: unknown;
}

interface BaseParams {
  page?: number;
  limit?: number;
  search?: string;
}

type ListResponse<T, U = Record<string, unknown>> = {
  count: number;
  results: T[];
} & U;

type valueof<T> = T[keyof T];

interface CategoryField {
  category: (BaseEntity & { description: string; slug?: string }) | null;
}

export type {
  AppLang,
  BaseParams,
  BaseEntity,
  ListResponse,
  CategoryField,
  valueof,
};
