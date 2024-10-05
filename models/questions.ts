import { SQLModel } from "./default";
import { QuestionOption } from "./question-option";

export interface Questions extends SQLModel {
  options: QuestionOption[];
  question: string;
  question_set_id: number;
}
