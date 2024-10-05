import { SQLModel } from "./default";
import { LearningQuestionSet } from "./learning-question-set";
import { LearningVideos } from "./learning-videos";

export interface LearningModule extends SQLModel {
  title: string;
  question_set: LearningQuestionSet;
  video: LearningVideos;
}
