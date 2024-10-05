"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { useQuestionForm } from "./question-set-form";
export default function AddButton() {
  const { openForm } = useQuestionForm();

  return (
    <Tooltip content="Add Question Set">
      <Button variant="outline" size="icon" onClick={() => openForm(null)}>
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
