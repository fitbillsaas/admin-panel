import { SQLModel } from "./default";

export interface ProductGallery extends SQLModel {
  uid?: string;
  product_id: number;
  product_image: string;
  is_primary: string;
  isDeleted?: boolean;
  isPrimary?: boolean;
  data: any;
}
