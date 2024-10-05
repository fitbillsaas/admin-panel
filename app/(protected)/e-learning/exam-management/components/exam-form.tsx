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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import {
  parseStringWithWhitespace,
  setValidationErrors,
} from "@/lib/validations";
import { LearningModule } from "@/models/learning-module";
import { LearningQuestionSet } from "@/models/learning-question-set";
import { LearningVideos } from "@/models/learning-videos";
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
interface ExamFormType {
  isOpen: boolean;
  item: any | null;
  videos: any | null;
  questions: any | null;
  closeForm: () => void;
  openForm: (
    item: LearningModule | null,
    videos: LearningVideos[] | null,
    questions: LearningQuestionSet[] | null,
  ) => void;
}

const ExamFormContext = createContext<ExamFormType>({
  isOpen: false,
  item: null,
  videos: null,
  questions: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useImageForm = () => useContext(ExamFormContext);

export function ImageFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<LearningModule | null>(null);
  const [videos, setVideos] = useState<LearningVideos[] | null>(null);
  const [questions, setQuestions] = useState<LearningQuestionSet[] | null>(
    null,
  );

  const openForm = async (
    item: LearningModule | null,
    videos: LearningVideos[] | null,
    questions: LearningQuestionSet[] | null,
  ) => {
    setItem(item);
    setVideos(videos);
    setQuestions(questions);
    setIsOpen(true);
  };
  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <ExamFormContext.Provider
      value={{ isOpen, item, videos, questions, closeForm, openForm }}
    >
      {children}
    </ExamFormContext.Provider>
  );
}
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be between 1 and 150 characters.")
    .max(150, "Title must be between 1 and 150 characters.")
    .refine(
      (value) => value.trim() !== "",
      "Please enter a title for the module.",
    )
    .refine(
      (value) => !/^[^a-zA-Z0-9]+$/.test(value),
      "Title cannot consist solely of special characters. Please enter a valid title.",
    )
    .refine(
      (value) => value === value.trim(),
      "Title should not contain leading or trailing spaces.",
    ),
  question_set_id: parseStringWithWhitespace(
    z.string().min(1, "Please select a question set."),
  ),
  video_id: parseStringWithWhitespace(
    z.string().min(1, "Please select a video."),
  ),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm, videos, questions } = useImageForm();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      question_set_id: item?.question_set ? String(item?.question_set?.id) : "",
      video_id: item?.video ? String(item?.video?.id) : "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      title: values?.title,
      question_set_id: Number(values?.question_set_id),
      video_id: Number(values?.video_id),
    };
    if (item) {
      const { error, message, validationErrors } = await API.UpdateById(
        "learning_module",
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
        description: "Exam Updated Succesfully",
      });
      closeForm();
      router.refresh();
    } else {
      const { error, message, validationErrors } = await API.Create(
        "learning_module",
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
        description: "Exam Added Succesfully",
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
                  <Input placeholder="Module Name" {...field} maxLength={150} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video_id"
            render={({ field }) => (
              <FormItem>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="lg:min-w-[180px] 2xl:min-w-[200px]">
                      <SelectValue placeholder="Select Video" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {videos?.map((video: any) => (
                      <SelectItem key={video.id} value={`${video.id}`}>
                        {video.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="question_set_id"
            render={({ field }) => (
              <FormItem>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="lg:min-w-[180px] 2xl:min-w-[200px]">
                      <SelectValue placeholder="Select Question Set" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questions?.map((question: any) => (
                      <SelectItem key={question.id} value={`${question.id}`}>
                        {question.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default function ImageForm() {
  const { isOpen, item, closeForm } = useImageForm();
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
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Exam</DrawerTitle>
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
            <DialogTitle>{item?.id ? "Edit" : "Add"} Exam</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
