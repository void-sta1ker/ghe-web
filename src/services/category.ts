import request from "@/utils/axios";
import { ListResponse, Category } from "@/types";

export async function getCategories(): Promise<ListResponse<Category>> {
  const res: ListResponse<Category> = await request({
    url: "/categories/list",
    method: "get",
  });

  return res;
}

export default null;
