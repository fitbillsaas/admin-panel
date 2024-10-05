import { SQLModel } from "./default";

export interface Testimonial extends SQLModel {
  name: string;
  speciality: string;
  quote: string;
}
