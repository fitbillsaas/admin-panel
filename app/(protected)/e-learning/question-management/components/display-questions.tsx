import { DeleteContext } from "@/components/delete-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { QuestionSet } from "@/models/question-options";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function CustomAccordion({
  item,
  onEdit,
}: {
  item: QuestionSet;
  onEdit: any;
}) {
  const { deleteFn, setOptions } = useContext(DeleteContext);
  const router = useRouter();
  async function deleteQuestion(item: QuestionSet) {
    const { error, message } = await API.DeleteById(
      "learning_questions",
      item?.id,
    );
    if (!!error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      return;
    }

    toast({
      ...toastSuccessMessage,
      description: "Question Deleted Successfully",
    });

    router.refresh();
  }
  return (
    <>
      {item?.questions?.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          <p className=" m-5 text-[#28D0B0] font-medium">
            {item?.questions.length}{" "}
            {item?.questions?.length > 1 ? "Questions Added" : "Question Added"}
          </p>
          {item?.questions.map((question: any, index: any) => (
            <AccordionItem
              key={`question-${index}`}
              value={`item-${index + 1}`}
            >
              <Card className="rounded-none m-5">
                <AccordionTrigger className="flex justify-between items-center px-[15px] text-dec hover:no-underline">
                  <span className="text-[16px] font-bold no-underline">
                    {question?.question}
                  </span>
                  <span className="flex items-center ml-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="ml-2 px-[5px] py-[0px] "
                        >
                          <DotsVerticalIcon className="h-4 w-4 " />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              onEdit(question);
                            }}
                          >
                            Edit Questions
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              setOptions({
                                message:
                                  "Are you sure you want to delete this question?",
                                description:
                                  "Are you sure you want to delete this question? This action cannot be reversed.",
                              });
                              deleteFn(() => deleteQuestion(question));
                            }}
                          >
                            Delete Questions
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-[15px] py-[10px] bg-[#E2E8F085]">
                  <RadioGroup name={`question-${index}`}>
                    {question?.options.map((option: any, optionIndex: any) => (
                      <div
                        key={`option-${optionIndex}`}
                        className="flex items-center space-x-2 p-[5px] gap-[15px]"
                      >
                        <RadioGroupItem
                          value={option?.id}
                          id={`radio-${optionIndex}`}
                          checked={option.is_correct}
                        />
                        <Label
                          htmlFor={`radio-${optionIndex}`}
                          className="font-bold"
                        >
                          {option?.option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        // <p className="text-center text-gray-500 py-4">No questions found.</p>
        <p className=" m-5 text-[#28D0B0] font-medium">0 Questions Added</p>
      )}
    </>
  );
}
