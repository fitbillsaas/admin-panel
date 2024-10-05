"use client";
import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { setValidationErrors } from "@/lib/validations";
import { LearningQuestionSet } from "@/models/learning-question-set";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
interface QuestionFormType {
  isOpen: boolean;
  item: any | null;
  closeForm: () => void;
  openForm: (item: LearningQuestionSet | null) => void;
}

const QuestionFormContext = createContext<QuestionFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useQuestionForm = () => useContext(QuestionFormContext);

export function QuestionFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<LearningQuestionSet | null>(null);
  const openForm = async (questionData: LearningQuestionSet | null) => {
    setItem(questionData);
    setIsOpen(true);
  };
  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <QuestionFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </QuestionFormContext.Provider>
  );
}
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Please enter a title for the Question Set")
    .min(3, "Title must be between 3 and 100 characters.")
    .max(100, "Title must be between 3 and 100 characters.")
    .refine(
      (value) => value.trim() !== "",
      "Please enter a title for the video.",
    )
    .refine(
      (value) => !/^[^a-zA-Z0-9]+$/.test(value),
      "Title cannot consist solely of special characters. Please enter a valid title.",
    )
    .refine(
      (value) => value === value.trim(),
      "Title should not contain leading or trailing spaces.",
    ),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useQuestionForm();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      title: values?.title,
    };
    if (item) {
      const { error, message, validationErrors } = await API.UpdateById(
        "learning_question_set",
        item.id,
        {
          ...formData,
        },
      );
      if (!!error) {
        if (validationErrors) {
          setValidationErrors(validationErrors, form);
        } else {
          toast({
            ...toastErrorMessage,
            description: message,
          });
        }
        return;
      }
      toast({
        ...toastSuccessMessage,
        description: "Question Set details updated Successfully",
      });
      closeForm();
      router.refresh();
    } else {
      const { error, message, validationErrors } = await API.Create(
        "learning_question_set",
        {
          ...formData,
        },
      );
      if (!!error) {
        if (validationErrors) {
          setValidationErrors(validationErrors, form);
        } else {
          toast({
            ...toastErrorMessage,
            description: message,
          });
        }
        return;
      }

      toast({
        ...toastSuccessMessage,
        description: "Question Set added Successfully",
      });
      closeForm();
      router.refresh();
    }
  }
  return (
    <div className="max-w-[600px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("w-full space-y-4", className)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Question Set" {...field} maxLength={60} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
              variant="default"
            >
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export default function QuestionForm() {
  const { isOpen, item, closeForm } = useQuestionForm();
  const { isMobile } = useScreenDetector();
  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(s) => {
          if (!s) {
            closeForm();
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Question Set</DrawerTitle>
          </DrawerHeader>
          <FormTemplate className="p-3" />
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(s) => {
          if (!s) {
            closeForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item?.id ? "Edit" : "Add"} Question Set</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
