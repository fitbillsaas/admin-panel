import { SQLModel } from "./default";

export interface Page extends SQLModel {
  name: string;
  title: string;
  content: string;
  allow_html: boolean;
}
