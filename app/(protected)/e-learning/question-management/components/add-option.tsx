"use client";
import { useFieldArray, useForm } from "react-hook-form";

import { Spinner } from "@/components/icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { setValidationErrors } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
const formSchema = z
  .object({
    question: z
      .string()
      .min(1, "Question is required.")
      .max(500, "Question must be between 1 and 500 characters.")
      .refine((value) => value.trim() !== "", "Please enter a question")
      .refine(
        (value) => !/^[^a-zA-Z0-9]+$/.test(value),
        "Question cannot consist solely of special characters. Please enter a valid Question.",
      )
      .refine(
        (value) => value === value.trim(),
        "Question should not contain leading or trailing spaces.",
      ),
    options: z.array(
      z.object({
        option: z
          .string()
          .min(1, "Option is required")
          .max(100, "Value must be between 1 and 100 characters.")
          .refine((value) => value.trim() !== "", "Please enter an option.")
          .refine(
            (value) => !/^[^a-zA-Z0-9]+$/.test(value),
            "Value cannot consist solely of special characters. Please enter a valid option.",
          )
          .refine(
            (value) => value === value.trim(),
            "Value should not contain leading or trailing spaces.",
          ),
        is_correct: z.boolean(),
      }),
    ),
  })
  .refine(({ options }) => options.some((option) => option.is_correct), {
    message: "Please select one correct answer",
    path: ["is_correct"],
  });

export default function AddOption({
  onCancel,
  onSubmission,
  question_set_id,
  item,
}: {
  onCancel: any;
  onSubmission: any;
  question_set_id: number;
  item: any;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: item?.question || "",
      options: item?.options.map((opt: any) => ({
        option: opt.option || "",
        is_correct: opt.is_correct || false,
      })) || [
        { option: "", is_correct: false },
        { option: "", is_correct: false },
        { option: "", is_correct: false },
        { option: "", is_correct: false },
      ],
    },
  });
  const { control, setValue, trigger } = form;
  const { fields } = useFieldArray({
    control,
    name: "options",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      question_set_id: question_set_id,
      question: values?.question,
      options: values?.options,
    };
    if (item) {
      const { error, message, validationErrors } = await API.UpdateById(
        "learning_questions",
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
        description: "Content Updated Successfully",
      });
      router.refresh();
      onSubmission();
    } else {
      const { error, message, validationErrors } = await API.Create(
        "learning_questions",
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
        description: "Question Added Successfully",
      });
      router.refresh();
      onSubmission();
    }
  }

  return (
    <>
      <div className="body_area">
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn("w-full space-y-4")}
            >
              <div className="flex flex-wrap gap-4  bg-[#E2E8F085] p-[15px]">
                <div className="flex-grow mb-4">
                  <div className="mb-1 block">
                    <Label className="text-[#28D0B0]">Create Question</Label>
                  </div>

                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl className="bg-[#fff]">
                          <Textarea
                            placeholder="Create Question"
                            {...field}
                            maxLength={500}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full p-[15px]">
                <RadioGroup
                  onValueChange={(number) => {
                    fields.forEach((item, i) => {
                      item.is_correct = i === Number(number);
                      setValue(`options.${i}.is_correct`, i === Number(number));
                    });
                    trigger();
                  }}
                >
                  {fields.map((option, index) => (
                    <div key={index} className="flex flex-wrap gap-4 mt-3">
                      <div className="flex-grow mb-4">
                        <div className="mb-1 block">
                          <Label>{`Option ${index + 1}`}</Label>
                        </div>
                        <FormField
                          control={control}
                          name={`options.${index}.option`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  maxLength={100}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`options.${index}.is_correct`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center space-x-2 mt-2">
                                  <RadioGroupItem
                                    {...field}
                                    id={`option_${index + 1}`}
                                    checked={option.is_correct}
                                    value={`${index}`}
                                  />
                                  <Label htmlFor={`option_${index + 1}`}>
                                    Correct Answer
                                  </Label>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                {(form.formState.errors as any)["is_correct"] && (
                  <span className="text-red-500">
                    {(form.formState.errors as any)["is_correct"]?.message}
                  </span>
                )}
                <div className="flex gap-[15px] min-[768px]:justify-end flex-wrap">
                  <button
                    disabled={form.formState.isSubmitting}
                    className="bg-[#fff] border border-[#D4DAE2] px-[50px] py-[10px] rounded-sm"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                    className="w-full lg:w-auto bg-[#28D0B0] border border-[#28D0B0] px-[50px] py-[10px] rounded-sm text-[#fff] flex gap-2 items-center"
                  >
                    {form.formState.isSubmitting && (
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    Done
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
