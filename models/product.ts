import { Category } from "./category";
import { SQLModel } from "./default";
import { ProductGallery } from "./product-gallery";
import { Specification } from "./specification";

export interface Product extends SQLModel {
  slug: string;
  product_name: string;
  product_description: string;
  product_description_html: string;
  status: string;
  product_price: string;
  product_category: number;
  weight_lbs: string;
  weight_ounce: number;
  wholesale_price: string;
  length: string;
  width: string;
  height: string;
  product_rating: number;
  productCategory: Category;
  productGallery: ProductGallery[];
  productSpecifications: Specification[];
  is_featured: string;
}
