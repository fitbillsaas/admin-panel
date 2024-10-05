import { Category } from "@/models/category";
import { API } from "./fetch";

export async function getProductCategories(): Promise<{
  product_categories: Category[];
}> {
  const { data, error } = await API.GetAll(
    "product_category",
    {
      limit: -1,
      where: {
        active: true,
        status: "Y",
      },
      select: ["id", "category_name"],
      sort: [["category_name", "asc"]],
    },
    {},
    { next: { revalidate: 3600, tags: ["product_category"] } },
  );
  if (error) return { product_categories: [] };
  return data;
}
