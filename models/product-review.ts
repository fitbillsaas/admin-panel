import { SQLModel } from "./default";
import { Product } from "./product";
import { User } from "./user";
export interface ProductReviews extends SQLModel {
  product_id: number;
  rating: number;
  review: string;
  user?: User;
  product: Product;
  status: string;
}
