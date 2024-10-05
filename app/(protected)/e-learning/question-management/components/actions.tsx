"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { LearningQuestionSet } from "@/models/learning-question-set";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useQuestionForm } from "./question-set-form";

export function Actions({
  item,
  // totalItems,
}: {
  item: LearningQuestionSet;
  // totalItems: number;
}) {
  // const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  const { openForm } = useQuestionForm();

  async function statusUpdate(item: LearningQuestionSet) {
    const payload = {
      active: item?.active == false ? true : false,
    };
    const { error, message, data } = await API.UpdateById(
      "learning_question_set",
      item?.id,
      payload,
    );
    if (error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      return;
    }

    if (!!data) {
      // if (data?.learning_video?.active == false) {
      //   toast({
      //     ...toastErrorMessage,
      //     description: "Deactivated Successfully",
      //   });
      // } else {
      //   toast({
      //     ...toastSuccessMessage,
      //     description: "Activated Successfully",
      //   });
      // }
      if (data) {
        toast({
          ...toastSuccessMessage,
          description: "Question Set status changed Successfully",
        });
      }

      // item.active = data?.product_category?.status;
    }
    // await clearDataCache("galleries");
    router.refresh();
  }

  // async function deleteCategory(item: LearningQuestionSet) {
  //   const { error, message } = await API.DeleteById(
  //     "learning_question_set",
  //     item?.id,
  //   );
  //   if (!!error) {
  //     toast({
  //       ...toastErrorMessage,
  //       description: message,
  //     });
  //     return;
  //   }

  //   toast({
  //     ...toastSuccessMessage,
  //     description: "Question Set Deleted Successfully",
  //   });

  //   if (totalItems > 1) {
  //     router.refresh();
  //   } else {
  //     const params = new URLSearchParams(Array.from(searchParams.entries()));
  //     const page = parseFloat(searchParams.get("page") ?? "0");
  //     params.set("page", page > 1 ? (page - 1).toString() : "1");
  //     router.replace(pathname + "?" + params.toString());
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            router.push(`/e-learning/question-management/view/${item.uid}`);
            toast({
              ...toastSuccessMessage,
              description:
                "You have been redirected to the Question Set page. You can now create questions and set options",
            });
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            openForm(item);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => statusUpdate(item)}>
          {item?.active == false ? "Activate" : "Inactivate"}
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={() => {
            setOptions({
              message: "Are you sure, you want to delete this question set?",
              description:
                "Are you sure you want to delete this question set? This action cannot be reversed.",
            });
            deleteFn(() => deleteCategory(item));
          }}
        >
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
