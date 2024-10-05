import { SQLModel } from "./default";

export interface LearningQuestionSet extends SQLModel {
  title: string;
  sort?: number;
  uid: string;
}
