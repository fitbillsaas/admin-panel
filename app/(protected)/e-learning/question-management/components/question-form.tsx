"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import AddOption from "./add-option";
import DisplayQuestions from "./display-questions";

export default function QuestionSetForm({ item }: { item: any }) {
  const [isFormOpen, setQuestionForm] = useState(false);
  const [qstnData, setQstnData] = useState();
  const handleCancel = () => {
    setQuestionForm(false);
  };
  const handleSubmit = () => {
    setQuestionForm(false);
  };
  const handleEdit = (e: any) => {
    setQstnData(e);
    setQuestionForm(true);
  };
  return (
    <Card className="m-3 mt-3">
      <div className="w-full ">
        <div className="main_title flex justify-between gap-2 md:p-[15px] items-center flex-row border border-b-[#E2E8F0] border-x-0 border-t-0 flex-wrap p-[20px]">
          <h3 className="font-bold">{item?.title}</h3>
          {!isFormOpen && (
            <button
              className="flex gap-2 px-[40px] py-[10px] text-white bg-[#28D0B0] rounded-sm"
              onClick={() => {
                setQuestionForm(true);
              }}
            >
              <span className="bg-[#fff] text-[#28D0B0] p-[5px]">
                <FaPlus />
              </span>
              <span>Create a Question</span>
            </button>
          )}
        </div>
        {!isFormOpen && (
          <div>
            <DisplayQuestions item={item} onEdit={handleEdit} />
          </div>
        )}
        {isFormOpen && (
          <div>
            <AddOption
              onCancel={handleCancel}
              question_set_id={item?.id}
              onSubmission={handleSubmit}
              item={qstnData}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
