"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { LearningQuestionSet } from "@/models/learning-question-set";
import { LearningVideos } from "@/models/learning-videos";
import { BiPlus } from "react-icons/bi";
import { useImageForm } from "./exam-form";
export default function AddButton({
  videos,
  questions,
}: {
  videos: LearningVideos[];
  questions: LearningQuestionSet[];
}) {
  const { openForm } = useImageForm();

  return (
    <Tooltip content="Add Exam">
      <Button
        variant="outline"
        size="icon"
        onClick={() => openForm(null, videos, questions)}
      >
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
