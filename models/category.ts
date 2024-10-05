import { SQLModel } from "./default";

export interface Category extends SQLModel {
  category_name: string;
  category_description: string;
  category_image: string;
  status: string;
  sort?: number;
}
