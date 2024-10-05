import { Cat } from "./cat";
import { SQLModel } from "./default";

export interface Image extends SQLModel {
  name: string;
  thumbnail: string;
  sort?: number;
  category_id: number;
  type: string;
  file_url: string;
  category: Cat;
}
